from django.urls import path

from room import views
from room.views import create_room, get_room_information

urlpatterns = [
    # path("", ChatRoomAPIView.as_view(), name="room"),
    path("create", create_room),
    path("information/", get_room_information, name="get_room_information"),
    path("join_room/<str:unique_identifier>/", views.join_room, name="join_room"),
    path("generate_link/<str:username>/", views.create_join_link, name="generate_link"),
]
