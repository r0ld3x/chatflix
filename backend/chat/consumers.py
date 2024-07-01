import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from chat.serializers import UserSerializer
from room.models import Message


@database_sync_to_async
def create_message(sender, content, chat_room):
    return Message.objects.create(sender=sender, content=content, chat_room=chat_room)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.username = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        user = self.scope.get("user")
        if user.is_anonymous:
            return await self.close()
        await self.accept()
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        new_message = await create_message(
            self.scope.get("user"), message, self.scope.get("chat")
        )
        user = UserSerializer(self.scope.get("user"))
        data = {
            "status": "success",
            "message_id": new_message.id,
            "message": new_message.content,
            "created": new_message.created.isoformat(),
            "user": user.data,
        }
        # await self.send(
        #     text_data=json.dumps(
        #         data,
        #         sort_keys=True,
        #         default=str,
        #     )
        # )
        data.update(
            {
                "type": "chat.message",
            }
        )
        await self.channel_layer.group_send(
            self.room_group_name,
            data,
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    async def chat_join(self, event):
        await self.send(
            {
                "msg_type": "chat_join",
                "room": event["room_id"],
                "username": event["username"],
                "message": event["message"],
            },
        )

    # async def send_message(self, event):
    #     message = event["message"]
    #     # await self.send(text_data=json.dumps({"message": message}))
    #     await self.channel_layer.group_send(
    #         self.room_group_name,
    #         {
    #             "status": "success",
    #             "message_id": new_message.id,
    #             "message": new_message.content,
    #             "created": new_message.created,
    #             "user": user.data,
    #         },
    #     )
