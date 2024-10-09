from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets, permissions, status
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

            # Fetch all entries in CreatedPosts that match the given user_id
            created_posts = Createdposts.objects.filter(userid=user_id)

            # Log the created_posts entries
            log_message = f"Found created_posts entries: {created_posts}"
            logs.append(log_message)

            if not created_posts.exists():
                log_message = "No created posts found for the user."
                logs.append(log_message)
                return JsonResponse({'error': 'No created posts found for the user', 'logs': logs}, status=404)

            # Initialize an empty list to hold post details
            posts_data = []

            # Loop through each created post and fetch the corresponding post details
            for created_post in created_posts:
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
