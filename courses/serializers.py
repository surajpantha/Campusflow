from rest_framework import serializers
from .models import Course, Enrollment, CourseMaterial

class CourseSerializer(serializers.ModelSerializer):
    teacher_username=serializers.CharField(
        source="teacher.username",
        read_only=True,
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "teacher",
            "teacher_username",
            "created_at",
            "is_active",
        ]

        read_only_fields = ["id", "teacher", "created_at","teacher_username"]



class EnrollmentSerializer(serializers.ModelSerializer):
    course_details=CourseSerializer(
        source="course",
        read_only=True,
    )

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "course",
            "course_details",
            "enrolled_at",
        ]
        read_only_fields = ["id", "student", "enrolled_at","course_details"]
        validators = []

    def validate_course(self, value):
        request = self.context["request"]

        if not value.is_active:
            raise serializers.ValidationError(
                "This course is not available for enrollment."
            )

        already_enrolled = Enrollment.objects.filter(
            student=request.user,
            course=value
        ).exists()

        if already_enrolled:
            raise serializers.ValidationError(
                "You are already enrolled in this course."
            )

        return value


class CourseMaterialSerializer(serializers.ModelSerializer):
    course_title=serializers.CharField(
        source="course.title",
        read_only=True,
    )

    class Meta:
        model=CourseMaterial
        fields=[
            "id",
            "course",
            "course_title",
            "title",
            "description",
            "created_at",
            "updated_at",
            "is_published",
        ]
        read_only_fields = [
            "id",
            "course",
            "course_title",
            "created_at",
            "updated_at",
        ]