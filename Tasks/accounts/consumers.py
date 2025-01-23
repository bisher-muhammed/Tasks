import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from urllib.parse import parse_qs


class TaskConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the user from the token
        self.user = await self.get_user_from_token()
        if self.user and self.user.is_authenticated:
            # Add the user to a group
            self.group_name = f"user_{self.user.id}"
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            # Accept the WebSocket connection
            await self.accept()
        else:
            print("User not authenticated, closing connection.")
            await self.close()

    async def disconnect(self, close_code):
        # Remove the user from the group on disconnect
        if self.user and self.user.is_authenticated:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        # Handle incoming WebSocket messages
        try:
            data = json.loads(text_data)
            print("Received data:", data)
        except json.JSONDecodeError:
            print("Invalid JSON received.")
    
    async def task_update(self, event):
        # Send task updates to the WebSocket client
        await self.send(text_data=json.dumps(event))
    
    @database_sync_to_async
    def get_user_from_token(self):
        # Parse the query string to extract the token
        query_string = parse_qs(self.scope["query_string"].decode())
        token = query_string.get("token", [None])[0]
        if not token:
            return None
        
        try:
            # Decode the token and get the user
            access_token = AccessToken(token)
            user = User.objects.get(id=access_token["user_id"])
            return user
        except (TokenError, User.DoesNotExist):
            return None
