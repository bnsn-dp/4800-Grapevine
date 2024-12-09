from rest_framework import serializers
from .members_model import Members
class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Members
        fields = ('userid', 'communityid', 'memberid')