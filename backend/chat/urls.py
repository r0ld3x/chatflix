from django.urls import path

from .views import ChatAPIView, ChatMessageAPIView

urlpatterns = [
    path("", ChatAPIView.as_view(), name="chat"),
    path("messages/", ChatMessageAPIView.as_view(), name="messages"),
]
