from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Tasks
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Includes password confirmation and validation for unique username and email.
    """
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "email", "confirm_password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
        }

    def validate(self, attrs):
        """
        Ensure passwords match during registration.
        """
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return attrs

    def validate_username(self, value):
        """
        Check if the username already exists.
        """
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already in use. Please choose another.")
        return value

    def validate_email(self, value):
        """
        Check if the email is already registered.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def create(self, validated_data):
        """
        Create a new user with hashed password.
        """
        validated_data.pop("confirm_password")  # Remove confirm_password from data
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"]
        )
        user.set_password(validated_data["password"])  # Hash the password
        user.save()
        return user


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for tasks. Handles serialization and validation for the `Tasks` model.
    """
    class Meta:
        model = Tasks
        fields = ["id", "title", "description", "completed", "created_at", "updated_at", "user"]
        read_only_fields = ["id", "created_at", "updated_at","user"]



class MyTokenObtainSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required= True)
    password = serializers.CharField(write_only=True,required = True)


    def validate(self, attrs):
        user = User.objects.filter(email = attrs['email']).first()

        if user is None or not user.check_password(attrs['password']):
            raise serializers.ValidationError("invalid email or password")
        

        attrs['user'] = user
        return attrs
        

