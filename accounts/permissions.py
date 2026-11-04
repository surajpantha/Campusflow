from rest_framework.permissions import BasePermission
from .models import User


class IsStudent(BasePermission):
    message = "Only students can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == User.Role.STUDENT
        )


class IsTeacher(BasePermission):
    message = "Only teachers can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == User.Role.TEACHER
        )