import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Tasks.settings")
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack 
from accounts.routing import websocket_urlpatterns

application = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": application,
        "websocket": AuthMiddlewareStack(  
            URLRouter(websocket_urlpatterns)
        ),
    }
)