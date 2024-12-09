from rest_framework import viewsets, permissions, status
from .user_model import Users
from .user_serializer import UserSerializer
from rest_framework.response import Response

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

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)  # Extract partial argument
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)  # Allow partial updates
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

    def destroy(self, request, pk=None):
        user = self.queryset.get(pk=pk)
        user.delete()
        return Response(status=204)
