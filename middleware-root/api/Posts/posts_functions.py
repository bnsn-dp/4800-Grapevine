from django.http import JsonResponse
from django.db import connection

def getPostID(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM Posts')
        row = cursor.fetchone()
        rowCount = row[0] + 1
        formatted_string = f"P{str(rowCount).zfill(15)}"
    return JsonResponse({'genString': formatted_string})
