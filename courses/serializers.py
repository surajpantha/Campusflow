from rest_framework import serializers
from .models import Course, Enrollment

class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "teacher",
            "created_at",
            "is_active",
        ]

        read_only_fields = ["id", "teacher", "created_at"]



class EnrollmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "course",
            "enrolled_at",
        ]
        read_only_fields = ["id", "student", "enrolled_at"]
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