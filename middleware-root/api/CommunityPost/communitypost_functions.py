from django.http import JsonResponse
from .communitypost_model import CommunityPost
from ..Members.members_model import Members
from ..Users.user_model import Users
from ..CommunityPost.communitypost_model import CommunityPost
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
import random
import string
import json

def getCommunityPostID():
    with connection.cursor() as cursor:
        # Fetch the total count of rows in the CommunityPost table
        cursor.execute('SELECT COUNT(*) FROM CommunityPost')
        row = cursor.fetchone()
        rowCount = row[0]

        # Find the first available ID
        for i in range(1, rowCount + 2):  # +2 ensures we check one beyond rowCount
            formatted_string = f"COP{str(i).zfill(13)}"
            cursor.execute('SELECT 1 FROM CommunityPost WHERE CPID = %s', [formatted_string])
            if cursor.fetchone() is None:  # If the ID doesn't exist, it's available
                return formatted_string

    # This point is reached only if all IDs from 1 to rowCount are taken
    # Increment rowCount and generate a new ID
    rowCount += 1
    formatted_string = f"COP{str(rowCount).zfill(13)}"
    return formatted_string

@csrf_exempt
def addCommunityPost(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Extract the required inputs
            communityid = data.get('communityid')
            postid = data.get('postid')
            userid = data.get('userid')

            # Validate inputs
            if not communityid or not postid or not userid:
                return JsonResponse({"error": "Missing required fields."}, status=400)

            # Generate a new CommunityPostID
            community_post_id = getCommunityPostID()

            # Insert the new community post into the database
            with connection.cursor() as cursor:
                cursor.execute(
                    '''
                    INSERT INTO CommunityPost (CPID, CommunityID, PostID, UserID)
                    VALUES (%s, %s, %s, %s)
                    ''',
                    [community_post_id, communityid, postid, userid]
                )

            return JsonResponse({"success": "Community post created successfully."}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)