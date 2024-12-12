from django.http import JsonResponse
from rest_framework.decorators import api_view
from ..models import *
from ..serializers import *
from django.db import connection

def getMessageID(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM Message')
        row = cursor.fetchone()
        rowCount = row[0] + 1
        formatted_string = f"M{str(rowCount).zfill(15)}"
    return JsonResponse({'genString': formatted_string})

@api_view(['GET'])
def get_messages(request):
    crid = request.query_params.get('crid', None)  # Get chat room ID (crid) from the query parameters
    if not crid:
        return JsonResponse({'error': 'Chat room ID (crid) is required'}, status=400)

    try:
        # Fetch messages for the given chat room ID and sort by sent attribute (ascending order)
        messages = Message.objects.filter(crid=crid).order_by('sent')

        # Serialize only the necessary fields: sender, description, and sent
        serialized_messages = []
        for message in messages:
            serialized_messages.append({
                'sender': message.sender,  # Assuming sender is a ForeignKey to the User model
                'description': message.description,
                'sent': message.sent.isoformat(),  # Serialize sent as ISO format
            })

        # Return the list of serialized messages as a JSON response
        return JsonResponse(serialized_messages, safe=False, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)