import mimetypes
import os

from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

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
from rest_framework.parsers import (
    JSONParser,
    MultiPartParser,
    FormParser,
)

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
    parser_classes=[
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

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

class CourseMaterialDownloadView(APIView):
    permission_classes=[
        IsAuthenticated,
        CourseMaterialPermission,
    ]

    def get(self,request,course_pk,pk):
        material=get_object_or_404(
            CourseMaterial.objects.select_related("course"),
            pk=pk,
            course_id=course_pk,
        )

        # Run the object level authorization checks.
        self.check_object_permissions(request,material)

        # A material may exist without an attached file.
        if not material.file:
            raise NotFound("this material does not have an attached file")

        # Open the file through django's configured storage backend

        file_handle=material.file.open("rb")

        # Determine the response MIME type from the filename.
        content_type,_=mimetypes.guess_type(material.file.name)

        # stream the file as a download.
        return FileResponse(
            file_handle,
            as_attachment=True,
            filename=os.path.basename(material.file.name),
            content_type=content_type or "application/octet-stream",
        )