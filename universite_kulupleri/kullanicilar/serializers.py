# universite_kulupleri/kullanicilar/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Uyelik

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name", "password"]

    def create(self, validated_data):
        user = User(
            username=validated_data.get("username"),
            email=(validated_data.get("email") or "").lower().strip(),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]

class UyelikSerializer(serializers.ModelSerializer):
    kulup_adi = serializers.CharField(source="kulup.ad", read_only=True)

    class Meta:
        model = Uyelik
        fields = ["id", "kulup", "kulup_adi", "joined_at"]
        read_only_fields = ["id", "kulup_adi", "joined_at"]
