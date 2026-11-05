from rest_framework.routers import DefaultRouter
from .views import CourseViewSet,EnrollmentViewSet,AvailableCourseViewSet

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
urlpatterns = router.urls