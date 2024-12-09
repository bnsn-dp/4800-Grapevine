from rest_framework import serializers
from api.models import *
from .user_model import Users
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'username', 'userpassword', 'status', 'email', 'firstname', 'lastname', 'bio')