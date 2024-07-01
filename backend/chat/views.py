from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from chat.pagination import MyCustomPagination
from room.models import ChatRoom

from .serializers import ChatRoomDetailSerializer, MessageSerializer


class ChatMessageAPIView(ListAPIView):
    pagination_class = MyCustomPagination
    serializer_class = MessageSerializer

    def get_queryset(self):
        # Get the 'username' parameter from the request to find the chat room
        chat_room_username = self.request.query_params.get("username")
        if not chat_room_username:
            raise NotFound("Chat room 'username' parameter is required.")

        try:
            chat_room = ChatRoom.objects.get(username=chat_room_username)
        except ChatRoom.DoesNotExist:
            raise NotFound(f"Chat room '{chat_room_username}' not found.")
        user = self.request.user
        if user not in chat_room.participants.all():
            raise PermissionDenied("You must join this chat room to view messages.")

        return chat_room.messages.order_by("-created")


class ChatAPIView(APIView):

    def get(self, request):
        joined_chat_rooms = request.user.chat_rooms.all()
        if not joined_chat_rooms.exists():
            return Response(
                {"message": "No joined chat rooms found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = ChatRoomDetailSerializer(
            joined_chat_rooms, many=True, context={"request": request}
        )

        return Response(serializer.data)

    # def post(self, request, *args, **kwargs):
    #     serializer = ChatRoomCreateSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.validated_data["creator"] = request.user
    #         chat_room = serializer.save()
    #         chat_room.joined_users.add(request.user)
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request, *args, **kwargs):
    #     username: str = request.data.get("username")
    #     if not username:
    #         return Response(
    #             {"error": "Username not provided"}, status=status.HTTP_400_BAD_REQUEST
    #         )

    #     try:
    #         chat_room = ChatRoom.objects.get(username=username.strip())
    #         if not chat_room.joined_users.filter(id=request.user.id).exists():
    #             chat_room.joined_users.add(request.user)
    #         return Response(status=status.HTTP_200_OK)
    #     except ChatRoom.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)

    # def delete(self, request, *args, **kwargs):
    #     username = request.data.get("username")
    #     if not username:
    #         return Response(
    #             {"error": "Username not provided"}, status=status.HTTP_400_BAD_REQUEST
    #         )

    #     try:
    #         chat_room = ChatRoom.objects.get(username=username.strip())
    #         # Check if the user is the creator of the chat room
    #         if chat_room.creator != request.user:
    #             return Response(
    #                 {"error": "You are not authorized to delete this chat room"},
    #                 status=status.HTTP_403_FORBIDDEN,
    #             )
    #         chat_room.joined_users.clear()  # Remove all users from the chat room
    #         chat_room.delete()  # Delete the chat room
    #         return Response(status=status.HTTP_204_NO_CONTENT)
    #     except ChatRoom.DoesNotExist:
    #         return Response(
    #             {"error": "Chat room not found."}, status=status.HTTP_404_NOT_FOUND
    #         )
    #     except Exception:
    #         return Response(
    #             {"error": "An error occurred while processing your request."},
    #             status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         )
