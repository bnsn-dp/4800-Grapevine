from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from .models import *
from .serializers import *
from rest_framework.response import Response

def home(request):
    return HttpResponse("This is the homepage")

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