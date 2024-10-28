from rest_framework import serializers
from .models import *
from .user_model import Users
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'username', 'userpassword', 'status', 'email', 'firstname', 'lastname', 'bio')

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = ('postid', 'postdescription', 'imagelink')

class CreatedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Createdposts
        fields = ('userid', 'postid', 'ucpid')

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('mid', 'description', 'sender', 'crid')

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatroom
        fields = ('crid', 'user1', 'user2')

class FriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friends
        fields = ('fid', 'friender', 'friendee')