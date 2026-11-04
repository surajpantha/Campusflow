from django.urls import path
from .views import RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt.views import TokenBlacklistView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path(
    "logout/",
    TokenBlacklistView.as_view(),
    name="token_blacklist",
),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]