import re
import urllib.parse

from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.http import parse_cookie
from rest_framework_simplejwt.authentication import JWTAuthentication


def extract_chat_segment(url):
    """
    Extract the segment between /ws/chat/ and the next / from a given URL.

    :param url: The URL string to be parsed
    :return: The extracted segment or None if not found
    """
    # Regex pattern to capture the segment between /ws/chat/ and the next /
    pattern = r"/ws/chat/(.+?)/"

    # Search for the pattern in the URL
    match = re.search(pattern, url)

    # If a match is found, return the captured segment
    if match:
        return match.group(1)

    # If no match is found, return None
    return None


User = get_user_model()


@database_sync_to_async
def get_user(access, username):
    try:
        jwt = JWTAuthentication()
        validated_token = jwt.get_validated_token(access)
        data = jwt.get_user(validated_token)
        chat = data.chat_rooms.filter(username=username)
        if not chat:
            return AnonymousUser()
        chat = chat.first()
        return data, chat
    except Exception:
        return AnonymousUser()


class QueryAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):

        if "headers" not in scope:
            raise ValueError(
                "CookieMiddleware was passed a scope that did not have a headers key "
                + "(make sure it is only passed HTTP or WebSocket connections)"
            )
        for name, value in scope.get("headers", []):
            if name == b"cookie":
                cookies = parse_cookie(value.decode("latin1"))
                break
        else:
            cookies = {}
        query_string = scope.get("query_string", None)
        if query_string:
            query_params = urllib.parse.parse_qs(query_string.decode("utf-8"))
            token = query_params.get("token", [None])[0]
            cookies = {"access": token}
        else:
            cookies = {}

        access = cookies.get("access")
        if access:
            # room_name = scope["url_route"]["kwargs"]["room_name"]
            path = scope.get("path")
            if not path:
                return await self.inner(scope, receive, send)
            username = extract_chat_segment(path)
            if not username:
                return await self.inner(scope, receive, send)
            __ = await get_user(access, username)
            if isinstance(__, AnonymousUser):
                return await self.inner(scope, receive, send)
            user, chat = __
            if not user:
                return await self.inner(scope, receive, send)
            scope["user"] = user
            scope["chat"] = chat
        return await self.inner(scope, receive, send)
