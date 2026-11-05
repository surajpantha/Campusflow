
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

from courses.models import Course, Enrollment

User = get_user_model()


class CourseAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

        # Create users
        self.teacher = User.objects.create_user(
            username="teacher1",
            email="teacher1@example.com",
            password="TestPass123!",
            role=User.Role.TEACHER,
        )

        self.other_teacher = User.objects.create_user(
            username="teacher2",
            email="teacher2@example.com",
            password="TestPass123!",
            role=User.Role.TEACHER,
        )

        self.student = User.objects.create_user(
            username="student1",
            email="student1@example.com",
            password="TestPass123!",
        )

        self.other_student = User.objects.create_user(
            username="student2",
            email="student2@example.com",
            password="TestPass123!",
        )

        # Create courses
        self.course = Course.objects.create(
            title="Django Backend",
            teacher=self.teacher,
        )

        self.other_course = Course.objects.create(
            title="React Development",
            teacher=self.other_teacher,
        )

        self.inactive_course = Course.objects.create(
            title="Inactive Course",
            teacher=self.teacher,
            is_active=False,
        )

        self.url = reverse("courses-list")
        self.available_url = reverse("available-courses-list")
        self.enrollment_url = reverse("enrollments-list")

    def test_teacher_can_create_course(self):
        self.client.force_authenticate(user=self.teacher)

        response = self.client.post(
            self.url,
            {
                "title": "Python Programming",
                "description": "Learn Python",
            },
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        course = Course.objects.get(title="Python Programming")
        self.assertEqual(course.teacher, self.teacher)

    def test_student_cannot_create_course(self):
        self.client.force_authenticate(user=self.student)

        response = self.client.post(
            self.url,
            {"title": "Unauthorized Course"},
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_teacher_cannot_access_another_teachers_course(self):
        self.client.force_authenticate(user=self.teacher)

        response = self.client.get(
            reverse("courses-detail", args=[self.other_course.id])
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_student_can_view_active_courses(self):
        self.client.force_authenticate(user=self.student)

        response = self.client.get(self.available_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        returned_ids = [item["id"] for item in response.data["results"]] if isinstance(response.data, dict) else [item["id"] for item in response.data]

        self.assertIn(self.course.id, returned_ids)
        self.assertNotIn(self.inactive_course.id, returned_ids)

    def test_teacher_cannot_access_student_course_catalogue(self):
        self.client.force_authenticate(user=self.teacher)

        response = self.client.get(self.available_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class EnrollmentAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.student = User.objects.create_user(
            username="student1",
            email="student1@example.com",
            password="TestPass123!",
        )

        self.other_student = User.objects.create_user(
            username="student2",
            email="student2@example.com",
            password="TestPass123!",
        )

        self.teacher = User.objects.create_user(
            username="teacher1",
            email="teacher1@example.com",
            password="TestPass123!",
            role=User.Role.TEACHER,
        )

        self.course = Course.objects.create(
            title="Django Backend",
            teacher=self.teacher,
        )

        self.other_enrollment = Enrollment.objects.create(
            student=self.other_student,
            course=self.course,
        )

        self.url = reverse("enrollments-list")

    def test_student_can_enroll(self):
        self.client.force_authenticate(user=self.student)

        response = self.client.post(
            self.url,
            {"course": self.course.id},
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        enrollment = Enrollment.objects.get(student=self.student)
        self.assertEqual(enrollment.course, self.course)

    def test_student_cannot_enroll_twice(self):
        self.client.force_authenticate(user=self.student)

        Enrollment.objects.create(
            student=self.student,
            course=self.course,
        )

        response = self.client.post(
            self.url,
            {"course": self.course.id},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_student_cannot_enroll_in_inactive_course(self):
        inactive = Course.objects.create(
            title="Inactive Course",
            teacher=self.teacher,
            is_active=False,
        )

        self.client.force_authenticate(user=self.student)

        response = self.client.post(
            self.url,
            {"course": inactive.id},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_teacher_cannot_enroll(self):
        self.client.force_authenticate(user=self.teacher)

        response = self.client.post(
            self.url,
            {"course": self.course.id},
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_cannot_access_another_students_enrollment(self):
        self.client.force_authenticate(user=self.student)

        response = self.client.get(
            reverse("enrollments-detail", args=[self.other_enrollment.id])
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
