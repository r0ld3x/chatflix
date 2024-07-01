import secrets
import string

from djoser.serializers import UserCreateSerializer, settings
from rest_framework import serializers

from user.models import User


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class UserFetchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class UserCreatePasswordRetypeSerializer(UserCreateSerializer):
    default_error_messages = {
        "password_mismatch": settings.CONSTANTS.messages.PASSWORD_MISMATCH_ERROR
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["re_password"] = serializers.CharField(
            style={"input_type": "password"}
        )

    def validate(self, attrs):
        self.fields.pop("re_password", None)
        re_password = attrs.pop("re_password")
        attrs = super().validate(attrs)
        username_length = 12
        username_chars = string.ascii_letters + string.digits
        attrs["username"] = "".join(
            secrets.choice(username_chars) for _ in range(username_length)
        )
        if attrs["password"] == re_password:
            return attrs
        else:
            self.fail("password_mismatch")
