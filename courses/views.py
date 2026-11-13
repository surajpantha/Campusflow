from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, mixins
from .models import Course, Enrollment, CourseMaterial
from .serializers import (
    CourseSerializer,
    EnrollmentSerializer,
    CourseMaterialSerializer,
)
from accounts.permissions import IsTeacher, IsStudent
from django.db.models import Q
from .permissions import CourseMaterialPermission
from django.shortcuts import get_object_or_404

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class=CourseSerializer
    permission_classes=[IsAuthenticated,IsTeacher]

    def get_queryset(self):
        return Course.objects.filter(
            teacher=self.request.user
        )
    def perform_create(self, serializer):
        return serializer.save(teacher=self.request.user)

class EnrollmentViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        return Enrollment.objects.filter(
            student=self.request.user
        ).select_related("course")

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class AvailableCourseViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class=CourseSerializer
    permission_classes=[IsAuthenticated,IsStudent]

    def get_queryset(self):
        return Course.objects.filter(is_active=True)


class CourseAccessViewSet(
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class=CourseSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user


        return Course.objects.filter(
            Q(teacher=user)|
            Q(enrollments__student=user)
        ).select_related("teacher").distinct()


class CourseMaterialViewSet(
     mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class=CourseMaterialSerializer
    permission_classes=[IsAuthenticated,CourseMaterialPermission]

    def get_course(self):
        user=self.request.user


        if user.role=="teacher":
            courses=Course.objects.filter(teacher=user)
        elif user.role=="student":
            courses=Course.objects.filter(
                enrollments__student=user
            )
        else:
            courses=Course.objects.none()

        return get_object_or_404(
            courses,
            pk=self.kwargs["course_pk"],
        )

    def get_queryset(self):
        course=self.get_course()

        materials=CourseMaterial.objects.filter(
            course=course
        ).select_related("course","course__teacher")

        if self.request.user.role=="student":
            materials=materials.filter(is_published=True)

            return materials

    def perform_create(self, serializer):
        course=self.get_course()
        serializer.save(course=course)