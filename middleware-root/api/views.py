from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets, permissions
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
            password = body.get('password')
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON'}, status=400)

        # Step 1: Check if user exists and is active
        try:
            user = User.objects.get(username=username)
            print(f"User found: {user.username}, is_active: {user.is_active}")

            if not user.is_active:
                return JsonResponse({'message': 'Account is inactive'}, status=403)

        except User.DoesNotExist:
            print("User does not exist")
            return JsonResponse({'message': 'User does not exist Invalid username or password', 'status': 'error'}, status=401)

        # Step 2: Check if password is correct using check_password()
        if user.check_password(password):
            print("Password is correct")
            # Optionally, you can return success here if check_password works, bypassing authenticate()
            return JsonResponse({'message': 'Login successful', 'status': 'success'})
        else:
            print("Password is incorrect")
            return JsonResponse({'message': 'Password is incorrect Invalid username or password', 'status': 'error'}, status=401)

        # Step 3: If using authenticate (this will also re-check the password)
        user = authenticate(username=username, password=password)
        if user is not None:
            return JsonResponse({'message': 'Login successful', 'status': 'success'})
        else:
            return JsonResponse({'message': 'Invalid username or password', 'status': 'error'}, status=401)

    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)

def home(request):
    return HttpResponse("This is the homepage")

class UserViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Users.objects.all()
    serializer_class = UserSerializer

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
    queryset = Users.objects.all()
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