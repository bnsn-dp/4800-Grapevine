from rest_framework import serializers
from .communities_model import Communities
class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Communities
        fields = ('communityid', 'communityname', 'communitydescription', 'ownerid', 'communitykey')