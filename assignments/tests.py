from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase
from .models import Assignment


# Create your tests here.
User=get_user_model()


class AssignmentAPITestCase(APITestCase):
    # Create two independent users for our tests
    def setUp(self):
        self.student_a=User.objects.create_user(
            username="student_a",
            password="passowrd123",
            )
        self.student_b=User.objects.create_user(
            username="student_b",
            password="password234",

        )
   # Give Student A an assignment.
        self.assignment_a=Assignment.objects.create(
            title="Math Assignment",
            description="Complete chapter 3",
            due_date="2024-06-30",
            priority="high",
            status="pending",
            owner=self.student_a,
       
        )
 # Give Student B a different assignment.
        self.assignment_b = Assignment.objects.create(
            title="Physics Assignment",
            description="Complete chapter 2",
            due_date="2026-11-20",
            priority="medium",
            status="pending",
            owner=self.student_b,
        )

        self.list_url=reverse("assignments-list")

    def test_user_sees_only_their_assignments(self):
        self.client.force_authenticate(
            user=self.student_a
        )

        response=self.client.get(self.list_url)
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        returned_ids=[
            item["id"] for item in response.data
        ]

        self.assertIn(
            self.assignment_a.id,
            returned_ids,
        )
    def test_user_cannot_retrieve_another_users_assignment(self):
            self.client.force_authenticate(
                user=self.student_a
            )

            url=reverse(
                "assignments-detail",

                kwargs={"pk":self.assignment_b.id}
            )

            response=self.client.get(url)
            self.assertEqual(
                response.status_code,
                status.HTTP_404_NOT_FOUND,
            )
    def test_assignment_owner_is_set_by_server(self):
        self.client.force_authenticate(
            user=self.student_a
        )
        response=self.client.post(
            self.list_url,
            {
                "title":"new Assignment",
                "description":"created by a test",
                "due_date":"2027-07-15",
                "priority":"medium",
                "status":"pending",
                "owner":self.student_b.id,  # Attempt to set owner to student_b
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )
        created_assignment=Assignment.objects.get(
            id=response.data['id']
        )
        self.assertEqual(
            created_assignment.owner,
            self.student_a,
        )
    
    def test_user_can_update_their_own_assignment(self):
        self.client.force_authenticate(
            user=self.student_a
        )

        url = reverse(
            "assignments-detail",
            kwargs={"pk": self.assignment_a.id},
        )

        response = self.client.patch(
            url,
            {"status": "completed"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assignment_a.refresh_from_db()

        self.assertEqual(
            self.assignment_a.status,
            "completed",
        )

    def test_user_cannot_delete_another_users_assignment(self):
        self.client.force_authenticate(
            user=self.student_a
        )

        url = reverse(
            "assignments-detail",
            kwargs={"pk": self.assignment_b.id},
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        self.assertTrue(
            Assignment.objects.filter(
                id=self.assignment_b.id
            ).exists()
        )
