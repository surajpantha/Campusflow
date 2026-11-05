from django.contrib import admin
from django import forms
from django.contrib.auth import get_user_model

from .models import Course, Enrollment

User = get_user_model()


class CourseAdminForm(forms.ModelForm):

    class Meta:
        model = Course
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["teacher"].queryset = User.objects.filter(
            role=User.Role.TEACHER
        )

    def clean_teacher(self):
        teacher = self.cleaned_data["teacher"]

        if teacher.role != User.Role.TEACHER:
            raise forms.ValidationError(
                "Only users with the Teacher role can be assigned to a course."
            )

        return teacher


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    form = CourseAdminForm

    list_display = ("title", "teacher", "is_active", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("title", "teacher__username")


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "course", "enrolled_at")
    list_filter = ("enrolled_at",)
    search_fields = ("student__username", "course__title")