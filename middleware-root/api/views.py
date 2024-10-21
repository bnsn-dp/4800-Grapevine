from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from django.db.models import Q

from .models import *
from .serializers import *
from rest_framework.response import Response
from django.db import connection
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

# Create your views here.

def getUserID(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM Users')
        row = cursor.fetchone()
        rowCount = row[0] + 1
        formatted_string = f"U{str(rowCount).zfill(15)}"
    return JsonResponse({'genString': formatted_string})


def getMessageID(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM Message')
        row = cursor.fetchone()
        rowCount = row[0] + 1
        formatted_string = f"M{str(rowCount).zfill(15)}"
    return JsonResponse({'genString': formatted_string})


def getPostID(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM Posts')
        row = cursor.fetchone()
        rowCount = row[0] + 1
        formatted_string = f"P{str(rowCount).zfill(15)}"
    return JsonResponse({'genString': formatted_string})

def getCreatedPostID(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM CreatedPosts')
        row = cursor.fetchone()
        rowCount = row[0] + 1
        formatted_string = f"UCP{str(rowCount).zfill(13)}"
    return JsonResponse({'genString': formatted_string})

def getChatroomID(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT COUNT(*) FROM ChatRoom')
        row = cursor.fetchone()
        rowCount = row[0] + 1
        formatted_string = f"CR{str(rowCount).zfill(14)}"
    return JsonResponse({'genString': formatted_string})

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
    fid = request.data.get('fid')
    user_id = request.data.get('user')
    friendee_id = request.data.get('friendee')

    if not user_id or not friendee_id:
        return Response({'error': 'User and Friendee IDs are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        friendee = Users.objects.get(id=friendee_id)

        # Check if they are already friends
        if Friends.objects.filter(friender=user_id, friendee=friendee).exists():
            return Response({'message': 'Already friends'}, status=status.HTTP_200_OK)

        # Add the friend
        friend = Friends.objects.create(fid=fid, friender=user_id, friendee=friendee.id)
        friend.save()
        return Response({'message': 'Friend added successfully'}, status=status.HTTP_201_CREATED)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


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

        if Friends.objects.filter(friender=user, friendee=friendee).exists():
            return Response({'status': 'friend'}, status=status.HTTP_200_OK)
        elif Friends.objects.filter(friender=friendee, friendee=user).exists():
            return Response({'status': 'friend'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'not_friends'}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

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

@api_view(['GET'])
def get_user_chatrooms(request):
    user_id = request.query_params.get('user_id', None)
    if user_id is None:
        return Response({"error": "user_id parameter is required"}, status=400)

    chatrooms = Chatroom.objects.filter(user1=user_id) | Chatroom.objects.filter(user2=user_id)
    serializer = ChatRoomSerializer(chatrooms, many=True)
    return Response(serializer.data)


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

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        # Check if Content-Type is application/json
        if request.headers.get('Content-Type') != 'application/json':
            return JsonResponse({'message': 'Bad request: Expected JSON'}, status=400)

        # Parse the incoming request body
        try:
            body = json.loads(request.body)
            username = body.get('username')
            password = body.get('userpassword')
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

        # Step 1: Check if user exists and is active
        try:
            user = Users.objects.get(username=username)
            print(f"User found: {user.username}")

        except Users.DoesNotExist:
            print("User does not exist")
            return JsonResponse({'message': 'User does not exist Invalid username or password', 'status': 'error'}, status=401)
        #
        # # Step 2: Check if password is correct using check_password()
        # if user.check_password(password):
        #     print("Password is correct")
        #     # Optionally, you can return success here if check_password works, bypassing authenticate()
        #     return JsonResponse({'message': 'Login successful', 'status': 'success'})
        # else:
        #     print("Password is incorrect")
        #     return JsonResponse({'message': 'Password is incorrect Invalid username or password', 'status': 'error'}, status=401)

        # Step 3: If using authenticate (this will also re-check the password)
        if user.username == username and user.userpassword == password:
            if user is not None:
                return JsonResponse({'message': 'Login successful', 'status': 'success', 'first_name': user.firstname,
                                      'last_name': user.lastname, 'username': user.username})
            else:
                return JsonResponse({'message': 'Invalid username or password', 'status': 'error'}, status=401)

    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)


@csrf_exempt
def get_user_posts(request):
    if request.method == 'POST':
        logs = []  # Initialize a list to store logs
        try:
            data = json.loads(request.body)
            user_id = data.get('userid')

            # Log the user ID being used for querying
            log_message = f"Received user_id: {user_id}"
            logs.append(log_message)

            # Step 1: Fetch all entries in CreatedPosts that match the given user_id (user's posts)
            created_posts = Createdposts.objects.filter(userid=user_id)
            # Log the created_posts entries
            log_message = f"Found Created_posts entries: {created_posts}"
            logs.append(log_message)

            # Step 2: Fetch the user's friends (where user is either the friender or the friendee)
            friends = Friends.objects.filter(friender=user_id) | Friends.objects.filter(friendee=user_id)
            log_message = f"Found Friends entries: {friends}"
            logs.append(log_message)

            # Step 3: Collect all friend user IDs
            friend_user_ids = set()  # Using a set to avoid duplicates
            for friend in friends:
                if friend.friender == user_id:
                    friend_user_ids.add(friend.friendee)  # Add friendee if the user is the friender
                else:
                    friend_user_ids.add(friend.friender)  # Add friender if the user is the friendee

            # Step 4: Fetch all posts from the user's friends
            for id in friend_user_ids:
                friends_posts = Createdposts.objects.filter(userid=id)
                created_posts = created_posts.union(friends_posts)

            all_posts = created_posts

            # Initialize an empty list to hold post details
            posts_data = []

            # Loop through each post and fetch the corresponding post details
            for created_post in all_posts:
                try:
                    # Fetch the post corresponding to the postid in Createdposts
                    post = Posts.objects.get(postid=created_post.postid)
                    log_message = f"Found post: {post}"
                    logs.append(log_message)

                    posts_data.append({
                        'username': created_post.userid.username,  # Get the username of the user
                        'imagelink': post.imagelink,
                        'description': post.postdescription,
                        'datetime': post.posttime,  # Assuming you have a datetime field in Posts
                    })

                except Posts.DoesNotExist:
                    log_message = f"Post with postid {created_post.postid} does not exist."
                    logs.append(log_message)
                    continue  # Skip if the post does not exist

            # Sort the posts by datetime in descending order (newest first)
            sorted_posts = sorted(posts_data, key=lambda x: x['datetime'], reverse=True)

            # Log the sorted posts
            log_message = f"Sorted posts: {sorted_posts}"
            logs.append(log_message)

            return JsonResponse({'posts': sorted_posts, 'logs': logs}, safe=False)

        except Exception as e:
            log_message = f"Error: {str(e)}"
            logs.append(log_message)
            return JsonResponse({'error': str(e), 'logs': logs}, status=400)

def home(request):
    return HttpResponse("This is the homepage")

class UserViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Users.objects.all()
    serializer_class = UserSerializer

    def list(self, request):
        username = request.query_params.get('username', None)  # Get the 'username' query parameter
        if username:
            queryset = self.queryset.filter(username=username)  # Filter by username if provided
        else:
            queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None):
        user = self.queryset.get(pk=pk)
        serializer = self.serializer_class(user)
        return Response(serializer.data)

    def update(self, request, pk=None):
        user = self.queryset.get(pk=pk)
        serializer = self.serializer_class(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        user = self.queryset.get(pk=pk)
        user.delete()
        return Response(status=204)

class PostViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Posts.objects.all()
    serializer_class = PostSerializer

    def list(self, request):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None):
        # Ensure we are looking for postid, not just pk
        try:
            post = self.queryset.get(postid=pk)
            serializer = self.serializer_class(post)
            return Response(serializer.data)
        except Posts.DoesNotExist:
            return Response({'error': 'Post with the given ID does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        user = self.queryset.get(pk=pk)
        serializer = self.serializer_class(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)


    def destroy(self, request, pk=None):
        user = self.queryset.get(pk=pk)
        user.delete()
        return Response(status=204)

class FriendsViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Friends.objects.all()
    serializer_class = FriendsSerializer

    def list(self, request):
        # Get the friender ID from the query parameters
        friender_id = request.query_params.get('friender', None)

        if friender_id:
            # Filter by the friender field
            queryset = self.queryset.filter(friender=friender_id)
        else:
            # If no friender is provided, return all records (can be customized)
            queryset = self.queryset

        # Serialize and return the filtered queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None):
        # Ensure we are looking for postid, not just pk
        try:
            friend = self.queryset.get(fid=pk)
            serializer = self.serializer_class(friend)
            return Response(serializer.data)
        except Friends.DoesNotExist:
            return Response({'error': 'Post with the given ID does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        user = self.queryset.get(pk=pk)
        serializer = self.serializer_class(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)


    def destroy(self, request, pk=None):
        user = self.queryset.get(pk=pk)
        user.delete()
        return Response(status=204)


class CreatedPostsViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Createdposts.objects.all()
    serializer_class = CreatedPostSerializer

    def list(self, request):
        userid = request.query_params.get('userid', None)  # Get the 'username' query parameter
        if userid:
            queryset = self.queryset.filter(userid=userid)  # Filter by username if provided
        else:
            queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None):
        user = self.queryset.get(pk=pk)
        serializer = self.serializer_class(user)
        return Response(serializer.data)

    def update(self, request, pk=None):
        user = self.queryset.get(pk=pk)
        serializer = self.serializer_class(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        user = self.queryset.get(pk=pk)
        user.delete()
        return Response(status=204)

class MessageViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def list(self, request):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None):
        message = self.queryset.get(pk=pk)
        serializer = self.serializer_class(message)
        return Response(serializer.data)

    def update(self, request, pk=None):
        message = self.queryset.get(pk=pk)
        serializer = self.serializer_class(message, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        message = self.queryset.get(pk=pk)
        message.delete()
        return Response(status=204)

class ChatRoomViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Chatroom.objects.all()
    serializer_class = ChatRoomSerializer

    def list(self, request):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None):
        chatroom = self.queryset.get(pk=pk)
        serializer = self.serializer_class(chatroom)
        return Response(serializer.data)

    def update(self, request, pk=None):
        chatroom = self.queryset.get(pk=pk)
        serializer = self.serializer_class(chatroom, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        chatroom = self.queryset.get(pk=pk)
        chatroom.delete()
        return Response(status=204)