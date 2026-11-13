from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet,
    EnrollmentViewSet,
    AvailableCourseViewSet,
    CourseAccessViewSet,
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
urlpatterns = router.urls