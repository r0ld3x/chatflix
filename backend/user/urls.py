from django.urls import path

from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CustomTokenVerifyView,
    GetNotActivatedUser,
    LogoutView,
    UpdateUser,
)

urlpatterns = [
    path("jwt/create/", CustomTokenObtainPairView.as_view()),
    path("jwt/refresh/", CustomTokenRefreshView.as_view()),
    path("jwt/verify/", CustomTokenVerifyView.as_view()),
    path("jwt/logout/", LogoutView.as_view()),
    path("user/", UpdateUser.as_view()),
    path("activate/", GetNotActivatedUser.as_view()),
]
