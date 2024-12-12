from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from django.db.models import Q

from ..Users.user_model import Users
from ..serializers import *
from rest_framework.response import Response
from django.db import connection
from django.contrib.auth.models import User

def getFriends(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM Friends')
        row = cursor.fetchone()
        rowCount = row[0] + 1
        formatted_string = f"F{str(rowCount).zfill(15)}"
    return JsonResponse({'genString': formatted_string})

# Add a friend to the user's friend list
@api_view(['POST'])
def add_friend(request):
    user_id = request.data.get('user')
    friendee_id = request.data.get('friendee')
    fid = request.data.get('fid')  # Get the provided fid from the request

    if not user_id or not friendee_id or not fid:
        return Response({'error': 'User, Friendee, and FID are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        friendee = Users.objects.get(id=friendee_id)

        # Check if they are already friends
        if Friends.objects.filter(friender=user_id, friendee=friendee).exists():
            return Response({'message': 'Already friends'}, status=status.HTTP_200_OK)

        # Check if the given fid already exists
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1 FROM Friends WHERE fid = %s', [fid])
            fid_exists = cursor.fetchone() is not None

        # If the fid exists, find the next available fid
        if fid_exists:
            with connection.cursor() as cursor:
                cursor.execute('SELECT fid FROM Friends ORDER BY fid')
                existing_fids = [row[0] for row in cursor.fetchall()]

            def get_next_fid():
                prefix = "F"
                max_length = 16
                for i in range(1, len(existing_fids) + 2):
                    new_fid = f"{prefix}{str(i).zfill(max_length - len(prefix))}"
                    if new_fid not in existing_fids:
                        return new_fid

            fid = get_next_fid()  # Update fid with the next available value

        # Add the friend
        friend = Friends.objects.create(fid=fid, friender=user_id, friendee=friendee.id)
        friend.save()
        return Response({'message': 'Friend added successfully'}, status=status.HTTP_201_CREATED)

    except Users.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_friends_list(request):
    user_id = request.GET.get('userid', None)  # Use request.GET instead of request.query_params
    if not user_id:
        return Response({'error': 'User ID is required'}, status=400)

    try:
        # Fetch friends where user is either the friender or the friendee
        friends = Friends.objects.filter(friender=user_id) | Friends.objects.filter(friendee=user_id)

        # Prepare the response with the friend's first name and last name
        friends_data = [{
            'id': Users.objects.get(id=friend.friendee).id if friend.friender == user_id else Users.objects.get(id=friend.friender).id,
            'username': Users.objects.get(id=friend.friendee).username if friend.friender == user_id else Users.objects.get(id=friend.friender).username,
            'first_name': Users.objects.get(id=friend.friendee).firstname if friend.friender == user_id else Users.objects.get(id=friend.friender).firstname,
            'last_name': Users.objects.get(id=friend.friendee).lastname if friend.friender == user_id else Users.objects.get(id=friend.friender).lastname
        } for friend in friends]

        return Response(friends_data, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def remove_friend(request):
    # Retrieve the user ID and friendee ID from the request body
    user_id = request.data.get('user', None)
    friendee_id = request.data.get('friendee', None)

    if not user_id or not friendee_id:
        return Response({'error': 'User ID and Friendee ID are required'}, status=400)

    try:
        # Check if a friendship exists between the user and the friendee
        friendship = Friends.objects.filter(
            Q(friender=user_id, friendee=friendee_id) | Q(friender=friendee_id, friendee=user_id)
        )

        if friendship.exists():
            # If friendship exists, delete it
            friendship.delete()
            return Response({'status': 'success', 'message': 'Friendship removed successfully'}, status=200)
        else:
            return Response({'status': 'error', 'message': 'Friendship does not exist'}, status=404)

    except Exception as e:
        # Return a 500 error in case of exceptions
        return Response({'error': str(e)}, status=500)

# Check if the user is already a friend
@api_view(['GET'])
def check_friendship_status(request):
    user_id = request.query_params.get('userid')
    friendee_id = request.query_params.get('friendee')

    if not user_id or not friendee_id:
        return Response({'error': 'User and Friendee IDs are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Users.objects.get(id=user_id)
        friendee = Users.objects.get(id=friendee_id)

        if user == friendee:
            return Response({'status': 'friend'}, status=status.HTTP_200_OK)
        elif Friends.objects.filter(friender=user, friendee=friendee).exists():
            return Response({'status': 'friend'}, status=status.HTTP_200_OK)
        elif Friends.objects.filter(friender=friendee, friendee=user).exists():
            return Response({'status': 'friend'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'not_friends'}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
