from django.http import JsonResponse
from .members_model import Members
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime

def get_current_date():
    """
    Returns the current date as a string in the format 'YYYY-MM-DD'.
    """
    return datetime.now().strftime('%Y-%m-%d')

def getMemberID(request):
    with connection.cursor() as cursor:
        # Fetch the total count of rows in the Communities table
        cursor.execute('SELECT COUNT(*) FROM Members')
        row = cursor.fetchone()
        rowCount = row[0]

        # Find the first available ID
        for i in range(1, rowCount + 2):  # +2 ensures we check one beyond rowCount
            formatted_string = f"ME{str(i).zfill(14)}"
            cursor.execute('SELECT 1 FROM Members WHERE MemberID = %s', [formatted_string])
            if cursor.fetchone() is None:  # If the ID doesn't exist, it's available
                return JsonResponse({'genString': formatted_string})

    # This point is reached only if all IDs from 1 to rowCount are taken
    # Increment rowCount and generate a new ID
    rowCount += 1
    formatted_string = f"ME{str(rowCount).zfill(14)}"
    return JsonResponse({'genString': formatted_string})

@csrf_exempt
def add_member(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            member_id = data['memberid']
            user_id = data['userid']
            community_id = data['communityid']
            date = get_current_date()

            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO Members (MemberID, UserID, CommunityID, JoinDate)
                    VALUES (%s, %s, %s, %s)
                    """,
                    [member_id, user_id, community_id, date]
                )
            return JsonResponse({"message": "Member added successfully"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def is_member(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("userid")
            community_id = data.get("communityid")

            if not user_id or not community_id:
                return JsonResponse({"error": "Missing userid or communityid"}, status=400)

            # Check if the user is a member of the community
            is_member = Members.objects.filter(userid=user_id, communityid=community_id).exists()

            return JsonResponse({"isMember": is_member}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def remove_member(request):
    if request.method == "POST":
        try:
            # Parse the input data
            data = json.loads(request.body)
            user_id = data.get("userid")
            community_id = data.get("communityid")

            if not user_id or not community_id:
                return JsonResponse({"error": "Missing userid or communityid"}, status=400)

            # Check for a matching entry in the Members table
            member = Members.objects.filter(userid=user_id, communityid=community_id).first()

            if member:
                # Delete the member entry
                member.delete()
                return JsonResponse({"success": "Member removed successfully"}, status=200)
            else:
                return JsonResponse({"error": "No matching member found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)