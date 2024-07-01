import random
import string

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.settings import AUTH_USER_MODEL

User = get_user_model()


class ChatRoom(models.Model):
    PUBLIC = "public"
    PRIVATE = "private"
    ROOM_TYPE_CHOICES = [
        (PUBLIC, "Public"),
        (PRIVATE, "Private"),
    ]

    name = models.CharField(max_length=25, null=False, blank=False)
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_rooms"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    username = models.CharField(max_length=20, unique=True)
    bio = models.TextField(null=True, blank=True, max_length=140)
    profile_pic = models.ImageField(upload_to="profile_pics/", null=True, blank=True)
    room_type = models.CharField(
        max_length=10, choices=ROOM_TYPE_CHOICES, default=PUBLIC
    )
    max_participants = models.IntegerField(null=True, blank=True)
    participants = models.ManyToManyField(User, related_name="chat_rooms", blank=True)
    admins = models.ManyToManyField(User, related_name="admin_rooms", blank=True)

    def is_public(self):
        return self.room_type == "public"

    def is_private(self):
        return self.room_type == "private"

    def is_participant(self, user):
        return user in self.participants.all()

    def is_creator(self, user):
        return self.creator == user

    def is_admin(self, user):
        return user in self.admins.all()

    def add_participant(self, user):
        if not self.is_full() and not self.is_participant(user):
            self.participants.add(user)

    def add_admin(self, user):
        if user not in self.admins.all():
            self.admins.add(user)

    def remove_admin(self, user):
        if user in self.admins.all() and not self.is_creator(user):
            self.admins.remove(user)

    def set_room_type(self, room_type):
        if room_type in [self.PUBLIC, self.PRIVATE]:
            self.room_type = room_type
            self.save()

    def remove_participant(self, user):
        self.participants.remove(user)

    def is_joined(self, user):
        return user in self.participants.all()

    def is_full(self):
        return (
            self.max_participants and self.participants.count() >= self.max_participants
        )

    def is_empty(self):
        return self.participants.count() == 0

    def get_participants_count(self):
        return self.participants.count()

    def get_participants(self):
        return self.participants.all()

    def __str__(self):
        return f"{self.name}"


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    chat_room = models.ForeignKey(
        ChatRoom, on_delete=models.CASCADE, related_name="messages"
    )
    content = models.TextField()
    created = models.DateTimeField(
        auto_now_add=True,
    )
    is_read = models.BooleanField(default=False)
    likes_count = models.IntegerField(default=0)
    edited_at = models.DateTimeField(null=True, blank=True)
    attachment = models.FileField(
        upload_to="message_attachments/", null=True, blank=True
    )
    reply_to = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="replies"
    )

    def __str__(self):
        return f"{self.chat_room.name} - {self.sender.username}"


class Like(models.Model):
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.chat_room.name} - {self.sender.username}"


@receiver(post_save, sender=Like)
def update_likes_count(sender, instance, **kwargs):
    """
    A signal receiver which updates the likes_count of the associated message
    whenever a new Like instance is created.
    """
    instance.message.likes_count = Like.objects.filter(message=instance.message).count()
    instance.message.save()


def generate_unique_key(length=10):
    characters = string.ascii_letters + string.digits
    key = "".join(random.choice(characters) for _ in range(length))
    return key


class JoinRoom(models.Model):

    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    unique_identifier = models.CharField(
        max_length=10, null=True, blank=True, unique=True
    )

    def save(self, *args, **kwargs):
        if not self.unique_identifier:
            self.unique_identifier = generate_unique_key()

        while JoinRoom.objects.filter(
            unique_identifier=self.unique_identifier
        ).exists():
            self.unique_identifier = generate_unique_key()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.chat_room.name}"
