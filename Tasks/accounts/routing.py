from django.urls import re_path
from .consumers import TaskConsumer  # Make sure TaskConsumer is correctly imported

websocket_urlpatterns = [
    re_path(r'ws/tasks/$', TaskConsumer.as_asgi(),name='ws_tasks'),  # Ensure TaskConsumer is correctly wrapped with as_asgi()
]
