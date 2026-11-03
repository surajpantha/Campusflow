
from rest_framework import viewsets,permissions
from .models import Assignment
from .serializers import AssignmentSerializer


# Create your views here.
class AssignmentViewSet(viewsets.ModelViewSet):

    serializer_class=AssignmentSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        return Assignment.objects.filter(
            owner=self.request.user
            )


    def perform_create(self,serializer):
        print("perform_create called")
        serializer.save(owner=self.request.user)