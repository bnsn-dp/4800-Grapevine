from django.http import JsonResponse
from django.db import connection

def getCreatedPostID(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM CreatedPosts')
        row = cursor.fetchone()
        rowCount = row[0] + 1
        formatted_string = f"UCP{str(rowCount).zfill(13)}"
    return JsonResponse({'genString': formatted_string})