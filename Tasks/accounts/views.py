from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from django.utils import timezone
from django.db.models import Count
from rest_framework.exceptions import NotFound

from .models import Tasks
from .serializers import (
    UserSerializer,
    TaskSerializer,
    LoginSerializer,
    MyTokenObtainSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]  # Allow public access for registration

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]  # Allow public access for login

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Generate tokens using MyTokenObtainSerializer
        token = MyTokenObtainSerializer.get_token(user)
        return Response(
            {
                "access": str(token.access_token),
                "refresh": str(token),
                "username": user.username,
                "email": user.email,
            },
            status=status.HTTP_200_OK,
        )


class TaskListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save(user=request.user)
        return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)

    def get(self, request):
        tasks = Tasks.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tasks.objects.filter(user=self.request.user)


class TaskStatisticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_tasks = Tasks.objects.filter(user=request.user)

        # Calculate statistics
        total_tasks = user_tasks.count()
        completed_tasks = user_tasks.filter(completed=True).count()
        pending_tasks = total_tasks - completed_tasks
        tasks_last_7_days = user_tasks.filter(
            created_at__gte=timezone.now() - timezone.timedelta(days=7)
        ).count()

        # Group tasks by day
        tasks_by_day = (
            user_tasks.extra({"created_at__date": "date(created_at)"})
            .values("created_at__date")
            .annotate(count=Count("id"))
            .order_by("created_at__date")
        )
        tasks_by_day_data = {
            str(day["created_at__date"]): day["count"] for day in tasks_by_day
        }

        return Response(
            {
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "pending_tasks": pending_tasks,
                "tasks_last_7_days": tasks_last_7_days,
                "tasks_by_day": tasks_by_day_data,
            }
        )
