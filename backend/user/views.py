from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from djoser.serializers import utils
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from user.models import User
from user.serializers import UpdateUserSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            refresh = response.data.get("refresh")
            access = response.data.get("access")
            response.set_cookie(
                key="refresh",
                value=refresh or "",
                max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
            )

            response.set_cookie(
                key="access",
                value=access or "",
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
            )

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")
        if refresh_token:
            request.data["refresh"] = refresh_token

        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access = response.data.get("access")
            response.set_cookie(
                key="access",
                value=access or "",
                # max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                # httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                # samesite=settings.AUTH_COOKIE_SAMESITE,
                # path=settings.AUTH_COOKIE_PATH,
                # secure=settings.AUTH_COOKIE_SECURE,
            )
        return response


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request: Request, *args, **kwargs) -> Response:
        access = request.COOKIES.get("access")
        if access:
            request.data["token"] = access

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    def post(self, request: Request, *args, **kwargs) -> Response:
        response = Response()
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response


class UpdateUser(APIView):

    def get(self, request: Request) -> Response:
        return_data = {
            "id": request.user.id,
            "email": request.user.email,
            "image": (request.user.profile_pic.url if request.user.profile_pic else ""),
            "name": request.user.get_full_name(),
            "username": request.user.get_username(),
        }
        return Response(return_data, status=200)

    def post(self, request: Request) -> Response:
        if request.user.is_authenticated:
            user = request.user
        else:
            return Response("You are not authenticated", status=400)
        serializer = UpdateUserSerializer(data=request.data, instance=user)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response({"id": user.id, "email": user.email})


class GetNotActivatedUser(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request: Request) -> Response:
        uid = request.query_params["uid"]
        token = request.query_params["token"]
        try:
            uid = utils.decode_uid(uid)
            user = User.objects.get(pk=uid, is_active=False)
        except User.DoesNotExist:
            return Response("User does not exist", status=400)
        if user and default_token_generator.check_token(user, token):
            return_data = {
                "id": user.id,
                "email": user.email,
                "image": (user.profile_pic.url if user.profile_pic else ""),
                "name": user.get_full_name(),
                "username": user.get_username(),
                "is_active": user.is_active,
            }
            return Response(return_data, status=200)
        else:
            return Response("Invalid Data", status=400)
