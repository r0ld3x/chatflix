import random
import string

from django.urls import reverse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from room.models import ChatRoom, JoinRoom

from .serializers import (ChatRoomCreateSerializer, ChatRoomDetailSerializer,
                          ChatRoomListSerializer)


class ChatRoomAPIView(APIView):

    def get(self, request):
        username = request.query_params.get("username")
        if not username:

            joined_chat_rooms = request.user.chat_rooms.all()
            if not joined_chat_rooms.exists():
                return Response(
                    {"message": "No joined chat rooms found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            serializer = ChatRoomDetailSerializer(joined_chat_rooms, many=True)

            return Response(serializer.data)
        try:
            chat_room = ChatRoom.objects.get(username=username)
            serializer = ChatRoomListSerializer(chat_room)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ChatRoom.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        serializer = ChatRoomCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data["creator"] = request.user
            chat_room = serializer.save()
            chat_room.chat_rooms.add(request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        username: str = request.data.get("username")
        if not username:
            return Response(
                {"error": "Username not provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            chat_room = ChatRoom.objects.get(username=username.strip())
            if not chat_room.chat_rooms.filter(id=request.user.id).exists():
                chat_room.chat_rooms.add(request.user)
            return Response(status=status.HTTP_200_OK)
        except ChatRoom.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        username = request.data.get("username")
        if not username:
            return Response(
                {"error": "Username not provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            chat_room = ChatRoom.objects.get(username=username.strip())
            # Check if the user is the creator of the chat room
            if chat_room.creator != request.user:
                return Response(
                    {"error": "You are not authorized to delete this chat room"},
                    status=status.HTTP_403_FORBIDDEN,
                )
            chat_room.chat_rooms.clear()  # Remove all users from the chat room
            chat_room.delete()  # Delete the chat room
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ChatRoom.DoesNotExist:
            return Response(
                {"error": "Chat room not found."}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception:
            return Response(
                {"error": "An error occurred while processing your request."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@api_view(["POST"])
def create_room(request):
    serializer = ChatRoomCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.validated_data["creator"] = request.user
        chat_room = serializer.save()
        chat_room.participants.add(request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_room_information(request):
    username = request.query_params.get("username")
    if not username:
        return Response(
            {"error": "Username not provided"}, status=status.HTTP_400_BAD_REQUEST
        )
    if len(username) > 20:
        return Response(
            {"error": "Username cannot be longer than 20 characters."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        chat_room = ChatRoom.objects.get(username=username)
        serializer = ChatRoomListSerializer(chat_room, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ChatRoom.DoesNotExist:
        return Response(
            {"error": "No chat room found with the provided username."},
            status=status.HTTP_404_NOT_FOUND,
        )


@api_view(["GET"])
def join_room(request, unique_identifier, *args, **kwargs):
    get_info = request.query_params.get("get_info")
    data = JoinRoom.objects.filter(unique_identifier=unique_identifier)
    if not data.exists():
        return Response(
            {"error": "Invalid unique identifier."}, status=status.HTTP_400_BAD_REQUEST
        )

    join_room_ = data.first()
    if join_room_.chat_room.is_joined(request.user):
        return Response(
            {"error": "You are already a member of this chat room."}, status=409
        )
    if get_info:
        seral = ChatRoomListSerializer(
            join_room_.chat_room, context={"request": request}
        )
        return Response(seral.data)
    chat_room: ChatRoom = join_room_.chat_room
    # chat_room.remove_participant(request.user)
    chat_room.add_participant(request.user)
    # chat_room.save()

    return Response(
        {"message": "Joined successfully", "username": chat_room.username},
        status=200,
    )


# create join link


@api_view(["GET"])
def create_join_link(request, username, *args, **kwargs):
    chat_room = ChatRoom.objects.get(username=username)
    if not chat_room:
        return Response(
            {"error": "You are already a member of this chat room."}, status=403
        )
    is_creator = chat_room.is_creator(request.user)
    is_admin = chat_room.is_admin(request.user)
    if not is_creator and not is_admin:
        return Response(
            {"error": "Only the creator or an admin can create a join link."},
            status=403,
        )
    is_exist = JoinRoom.objects.filter(chat_room=chat_room)
    if not is_exist.exists():
        unique_identifier = "".join(
            random.choice(string.ascii_letters + string.digits) for _ in range(10)
        )
        join_room = JoinRoom.objects.create(chat_room=chat_room, unique_identifier=unique_identifier)
        if not join_room:
            return Response({"error": "This operation has failed."}, status=401)
    else:
        join_room = is_exist.first()
    join_url = reverse("join_room", args=[join_room.unique_identifier])
    join_link = request.build_absolute_uri(join_url)
    return Response({"join_link": join_link, "identifier": join_room.unique_identifier}, status=200)
