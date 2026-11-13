from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    CourseViewSet,
    EnrollmentViewSet,
    AvailableCourseViewSet,
    CourseAccessViewSet,
    CourseMaterialViewSet
)

router = DefaultRouter()

router.register(
    r'courses',
    CourseViewSet,
    basename='courses'
)
router.register(
    r'enrollments',
    EnrollmentViewSet,
    basename='enrollments'
)
router.register(
    r'available-courses',
    AvailableCourseViewSet,
    basename='available-courses'
)
router.register(
    r"course-access",
    CourseAccessViewSet,
    basename="course-access",
)
urlpatterns = router.urls + [
    path(
        "courses/<int:course_pk>/materials/",
        CourseMaterialViewSet.as_view({
            "get": "list",
            "post": "create",
        }),
        name="course-material-list",
    ),

    path(
        "courses/<int:course_pk>/materials/<int:pk>/",
        CourseMaterialViewSet.as_view({
            "get": "retrieve",
            "patch": "partial_update",
            "put": "update",
            "delete": "destroy",
        }),
        name="course-material-detail",
    ),
]
