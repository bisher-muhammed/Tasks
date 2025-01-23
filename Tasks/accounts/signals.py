from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializers import TaskSerializer
from .models import Tasks


@receiver(post_save, sender=Tasks)
def task_saved(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    data = TaskSerializer(instance).data
    action = "create" if created else "update"

    print(f"Attempting to send update to group for user_{instance.user.id}")

    async_to_sync(channel_layer.group_send)(
        f"user_{instance.user.id}",
        {
            "type": "task_update",
            "content": {"action": action, "task": data},
        },
    )


@receiver(post_delete, sender=Tasks)
def task_deleted(sender, instance, **kwargs):
    channel_layer = get_channel_layer()

    print(f"Sending delete update to group for user_{instance.user.id}")

    async_to_sync(channel_layer.group_send)(
        f"user_{instance.user.id}",
        {
            "type": "task_update",
            "content": {"action": "delete", "task": {"id": instance.id}},
        },
    )
