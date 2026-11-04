from django.db import models
from django.contrib.auth.models import AbstractUser,UserManager

# Create your models here.
class CampusFlowUserManager(UserManager):
    def create_user(self,username,email=None,password=None,**extra_fields):

        if not email:
            raise ValueError("Users must provide an email address")

        if extra_fields.get("is_staff") is True:
            raise ValueError("Regular users cannot be staff")

        if extra_fields.get("is_superuser") is True:
            raise ValueError("Regular users cannot be superusers.")

        return super().create_user(
            username=username,
            email=email,
            password=password,
            **extra_fields
        )




class User(AbstractUser):

    class Role(models.TextChoices):
        STUDENT = "student", "Student"
        TEACHER = "teacher", "Teacher"

    email = models.EmailField(unique=True)

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.STUDENT
    )

    objects = CampusFlowUserManager()
