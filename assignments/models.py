from django.db import models
from django.conf import settings 
# Create your models here.


class Assignment(models.Model):
    PRIORITY_CHOICES=[
        ("low","Low"),
        ("medium","Medium"),
        ("high","High"),
    ]

    STATUS_CHOICES=[
        ("pending","Pending"),
        ("completed","Completed")
    ]


    title=models.CharField(max_length=100)
    description=models.TextField(blank=True)
    due_date=models.DateField()
    priority=models.CharField(max_length=10,choices=PRIORITY_CHOICES,default="medium")
    status=models.CharField(max_length=10,choices=STATUS_CHOICES,default="pending")
    created_at=models.DateTimeField(auto_now_add=True)
    owner=models.ForeignKey(
                            settings.AUTH_USER_MODEL,
                            on_delete=models.CASCADE,
                            related_name="assignments",
                            )
    def __str__(self):
        return self.title   
    