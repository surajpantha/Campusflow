from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, mixins
from .models import Course, Enrollment
from .serializers import CourseSerializer, EnrollmentSerializer
from accounts.permissions import IsTeacher, IsStudent
from django.db.models import Q

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