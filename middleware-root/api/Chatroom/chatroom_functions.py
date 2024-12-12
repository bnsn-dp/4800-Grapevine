from django.http import JsonResponse
from rest_framework.decorators import api_view
from ..models import *
from ..serializers import *
from rest_framework.response import Response
from django.db import connection

def getChatroomID(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM ChatRoom')
        row = cursor.fetchone()
        rowCount = row[0] + 1
        formatted_string = f"CR{str(rowCount).zfill(14)}"
    return JsonResponse({'genString': formatted_string})

@api_view(['GET'])
def get_user_chatrooms(request):
    user_id = request.query_params.get('user_id', None)
    if user_id is None:
        return Response({"error": "user_id parameter is required"}, status=400)

    chatrooms = Chatroom.objects.filter(user1=user_id) | Chatroom.objects.filter(user2=user_id)
    serializer = ChatRoomSerializer(chatrooms, many=True)
    return Response(serializer.data)