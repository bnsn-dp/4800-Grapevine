from django.http import JsonResponse
from .communities_model import Communities
from ..Members.members_model import Members
from ..Users.user_model import Users
from ..CommunityPost.communitypost_model import CommunityPost
from ..models import Posts
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
import random
import string
import json

def getCommunitiesID(request):
    with connection.cursor() as cursor:
        # Fetch the total count of rows in the Communities table
        cursor.execute('SELECT COUNT(*) FROM Communities')
        row = cursor.fetchone()
        rowCount = row[0]

        # Find the first available ID
        for i in range(1, rowCount + 2):  # +2 ensures we check one beyond rowCount
            formatted_string = f"CO{str(i).zfill(14)}"
            cursor.execute('SELECT 1 FROM Communities WHERE CommunityID = %s', [formatted_string])
            if cursor.fetchone() is None:  # If the ID doesn't exist, it's available
                return JsonResponse({'genString': formatted_string})

    # This point is reached only if all IDs from 1 to rowCount are taken
    # Increment rowCount and generate a new ID
    rowCount += 1
    formatted_string = f"CO{str(rowCount).zfill(14)}"
    return JsonResponse({'genString': formatted_string})

@csrf_exempt
def create_community(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            community_id = data['communityid']
            name = data['name']
            description = data.get('description', '')
            user_id = data['user']
            community_key = data['communitykey']

            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO Communities (CommunityID, CommunityName, CommunityDescription, OwnerID, CommunityKey)
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    [community_id, name, description, user_id, community_key]
                )
            return JsonResponse({"message": "Community created successfully"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def getCommKey(request):
    """
    Generate a 32-character random string consisting of A-Z, a-z, and 0-9 for the CommunityKey.
    """
    # Define the pool of characters to choose from
    characters = string.ascii_letters + string.digits  # A-Z, a-z, 0-9

    # Generate a 32-character random string
    commKey = ''.join(random.choices(characters, k=32))

    # Return the string as JSON
    return JsonResponse({'commKey': commKey})

@csrf_exempt
def get_communities(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            userid = data.get("userid")

            if not userid:
                return JsonResponse({"error": "User ID is required"}, status=400)

            # Filter Member entries by the given userID
            member_entries = Members.objects.filter(userid=userid)

            # Collect all CommunityIDs from the Member entries
            community_ids = [entry.communityid for entry in member_entries]

            # Fetch all communities that match the community IDs
            communities = Communities.objects.filter(communityid__in=community_ids).values(
                "communityid", "communityname", "communitydescription", "communitykey", "ownerid"
            )

            # Return the communities to the frontend
            return JsonResponse(list(communities), safe=False, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def search_communities(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            search_term = data.get("searchTerm", "").strip()

            if not search_term:
                return JsonResponse({"error": "Search term is required"}, status=400)

            # Exact match for communitykey
            exact_match = Communities.objects.filter(communitykey__iexact=search_term).values(
                "communityid", "communityname", "communitydescription", "communitykey", "ownerid"
            )

            if exact_match.exists():
                return JsonResponse(list(exact_match), safe=False, status=200)

            # Partial match for communityname
            partial_matches = Communities.objects.filter(communityname__icontains=search_term).values(
                "communityid", "communityname", "communitydescription", "communitykey", "ownerid"
            )

            return JsonResponse(list(partial_matches), safe=False, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def get_community_details(request, community_key):
    try:
        # Query the community based on the provided key
        community = Communities.objects.get(communitykey=community_key)
        # Prepare the community details to be sent in the response
        community_data = {
            "communityid": community.communityid,
            "communityname": community.communityname,
            "communitykey": community.communitykey,
            "communitydescription": community.communitydescription,
            "ownerid": community.ownerid  # Assuming a foreign key to the user model
        }
        return JsonResponse(community_data, status=200)
    except Communities.DoesNotExist:
        return JsonResponse({"error": "Community not found"}, status=404)

@csrf_exempt
def get_community_members(request, community_id):
    try:
        # Find all members with the matching community ID
        members = Members.objects.filter(communityid=community_id)

        # Collect user IDs from the members
        user_ids = members.values_list('userid', flat=True)

        # Query the Users table for details of the collected user IDs
        users = Users.objects.filter(id__in=user_ids)

        # Get user details for each found user
        member_data = [
            {
                "username": user.username,
                "first_name": user.firstname,
                "last_name": user.lastname,
            }
            for user in users
        ]

        # Sort members alphabetically by username
        sorted_members = sorted(member_data, key=lambda x: x['username'])

        return JsonResponse(sorted_members, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_community_posts(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            community_id = data.get("communityid")

            # Validate the community ID
            community = Communities.objects.filter(communityid=community_id).first()
            if not community:
                return JsonResponse({"error": "Community not found"}, status=404)

            # Fetch all community posts for the given community_id
            community_posts = (
                CommunityPost.objects.filter(communityid=community_id)
            )

            posts_data = []

            for post_entry in community_posts:
                # Fetch related post details
                post = Posts.objects.filter(postid=post_entry.postid).first()
                if not post:
                    continue

                # Fetch related user details
                user = Users.objects.filter(id=post_entry.userid).first()
                if not user:
                    continue

                posts_data.append({
                    "username": user.username,
                    "postid": post.postid,
                    "imagelink": post.imagelink,
                    "description": post.postdescription,
                    "datetime": post.posttime,
                    "community_name": community.communityname,
                })

            sorted_posts = sorted(posts_data, key=lambda x: x['datetime'], reverse=True)

            return JsonResponse(sorted_posts, safe=False, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
