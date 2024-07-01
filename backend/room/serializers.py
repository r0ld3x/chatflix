from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import ChatRoom, JoinRoom, Message

User = get_user_model()


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["username", "full_name", "profile_pic"]

    def get_profile_pic(self, chat_room):
        request = self.context.get("request")
        if not chat_room.profile_pic:
            return None
        photo_url = chat_room.profile_pic.url
        return request.build_absolute_uri(photo_url)

    def get_full_name(self, obj):
        return obj.get_full_name()


class ChatRoomListSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    total_users = serializers.SerializerMethodField()
    profile_pic = serializers.SerializerMethodField()

    def get_profile_pic(self, chat_room):
        request = self.context.get("request")
        if not chat_room.profile_pic:
            return None
        photo_url = chat_room.profile_pic.url
        return request.build_absolute_uri(photo_url)

    class Meta:
        model = ChatRoom
        fields = [
            "name",
            "creator",
            "total_users",
            "created_at",
            "updated_at",
            "username",
            "profile_pic",
            "bio",
        ]

    def get_total_users(self, obj):
        return obj.participants.count()


class ChatRoomDetailSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source="profile_pic", read_only=True)
    lastMessage = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()

    def get_lastMessage(self, obj):
        last_message = (
            Message.objects.filter(chat_room=obj).order_by("-timestamp").first()
        )
        if last_message:
            return last_message.content
        return None

    def get_time(self, obj):
        last_message = (
            Message.objects.filter(chat_room=obj).order_by("-timestamp").first()
        )
        if last_message:
            return last_message.timestamp
        return None

    def get_profile_pic(self, chat_room):
        request = self.context.get("request")
        if not chat_room.profile_pic:
            return None
        photo_url = chat_room.profile_pic.url
        return request.build_absolute_uri(photo_url)

    class Meta:
        model = ChatRoom
        fields = ["name", "avatar", "lastMessage", "username", "time"]


class ChatRoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ["name", "username", "bio", "profile_pic", "is_public"]


class ChatRoomUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ["name", "username", "bio", "profile_pic", "is_public"]


class ChatRoomMemberAddSerializer(serializers.ModelSerializer):
    member_id = (
        serializers.IntegerField()
    )  # Assuming you'll provide the user's ID to add as a member

    class Meta:
        model = ChatRoom
        fields = ["member_id"]


class ChatRoomMemberRemoveSerializer(serializers.ModelSerializer):
    member_id = (
        serializers.IntegerField()
    )  # Assuming you'll provide the user's ID to remove as a member

    class Meta:
        model = ChatRoom
        fields = ["member_id"]


class JoinRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinRoom
        fields = ["id", "unique_identifier", "chat_room", "user", "created_at"]
