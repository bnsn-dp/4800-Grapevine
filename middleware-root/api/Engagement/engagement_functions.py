from django.http import HttpResponse, JsonResponse
from .engagement_model import Engagement
from django.db import connection
import json
from django.views.decorators.csrf import csrf_exempt

def getEngagementID(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM Engagement')
        row = cursor.fetchone()
        rowCount = row[0] + 1
        formatted_string = f"E{str(rowCount).zfill(15)}"
    return JsonResponse({'genString': formatted_string})

@csrf_exempt
def remove_engagement(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("userid")
            post_id = data.get("postid")

            # Update the engagement entry
            engagement = Engagement.objects.filter(userid=user_id, postid=post_id).first()
            if engagement:
                engagement.engagementtype = "None"
                engagement.save()
                return JsonResponse({"status": "success", "message": "Engagement updated to None"})
            else:
                return JsonResponse({"status": "error", "message": "Engagement entry not found"}, status=404)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

@csrf_exempt
def add_engagement(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            engagement_id = data.get("engagementid")
            user_id = data.get("userid")
            post_id = data.get("postid")

            # Check if an engagement entry exists for the user and post
            engagement = Engagement.objects.filter(userid=user_id, postid=post_id).first()
            if engagement:
                # Update existing entry
                engagement.engagementtype = "Liked"
                engagement.save()
            else:
                # Create a new engagement entry
                Engagement.objects.create(
                    engageid=engagement_id,
                    userid=user_id,
                    postid=post_id,
                    engagementtype="Liked"
                )

            return JsonResponse({"status": "success", "message": "Engagement added/updated successfully"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

@csrf_exempt
def get_post_likes(request):
    if request.method == "POST":
        data = json.loads(request.body)
        post_id = data.get("postid")
        try:
            # Filter engagements by postid with engagementtype = "Liked"
            likes = Engagement.objects.filter(postid=post_id, engagementtype="Liked")
            like_count = likes.count()
            return JsonResponse({"status": "success", "likes": like_count})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

@csrf_exempt
def get_engagement(request):
    data = json.loads(request.body)
    user_id = data.get('userid')
    post_id = data.get('postid')

    if not user_id or not post_id:
        return JsonResponse({'error': 'User ID and Post ID are required'}, status=400)

    try:
        engagement = Engagement.objects.filter(userid=user_id, postid=post_id).first()
        if engagement:
            return JsonResponse({
                'engagement': {
                    'engagementid': engagement.engageid,
                    'userid': engagement.userid,
                    'postid': engagement.postid,
                    'engagementtype': engagement.engagementtype,
                }
            }, status=200)
        else:
            return JsonResponse({'engagement': None}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)