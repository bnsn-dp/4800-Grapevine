from rest_framework import serializers
from .communitypost_model import CommunityPost
class CommunityPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityPost
        fields = ('userid', 'communityid', 'postid', 'cpid')