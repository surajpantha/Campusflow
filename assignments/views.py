
from rest_framework import viewsets,permissions
from .models import Assignment
from .serializers import AssignmentSerializer
from accounts.permissions import IsStudent


# Create your views here.
class AssignmentViewSet(viewsets.ModelViewSet):

    serializer_class=AssignmentSerializer
    permission_classes=[IsStudent]

    def get_queryset(self):
        return Assignment.objects.filter(
            owner=self.request.user
            )


    def perform_create(self,serializer):
      
        serializer.save(owner=self.request.user)