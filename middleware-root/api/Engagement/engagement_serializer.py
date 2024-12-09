from rest_framework import serializers
from api.Engagement.engagement_model import Engagement
class EngagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Engagement
        fields = ('engageid', 'postid', 'userid', 'engagementtype')