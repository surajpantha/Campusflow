from rest_framework.permissions import BasePermission,SAFE_METHODS

class CourseMaterialPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        role=request.user.role

        if request.method in SAFE_METHODS:
            return role in ["teacher","student"]

        return role=="teacher"

    def has_object_permission(self, request, view, obj):
        user=request.user


        # the owning teacher can access their material
        if obj.course.teacher_id==user.pk:
            return True

        # students can onlt read published materials 
        # from courses in which they are enrolled.
        if request.method in SAFE_METHODS and user.role=="student":
            return (obj.is_published
                    and obj.course.enrollments.filter(student=user).exists()
                    )
        return False
                      