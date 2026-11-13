

# Create your models here.
from django.db import models
from django.conf import settings


class Course(models.Model):
    title = models.CharField(max_length=200)

    description = models.TextField(blank=True)


# This line of code defines a Many-to-One relationship in Django, indicating that multiple items in the current model (e.g., a Course) can belong to a single User (the teacher).
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="taught_courses",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title



class Enrollment(models.Model):

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="course_enrollments",
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )

    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "course"],
                name="unique_student_course_enrollment",
            )
        ]

    def __str__(self):
        return f"{self.student.username} - {self.course.title}"



class CourseMaterial(models.Model):
    course=models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="materials",
    )

    title=models.CharField(max_length=200)
    description=models.TextField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    is_published=models.BooleanField(default=True)

    class Meta:
        ordering=["-created_at"]

    def __str__(self):
        return f"{self.title}--{self.course.title}"