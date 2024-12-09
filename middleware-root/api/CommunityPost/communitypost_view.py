from rest_framework import viewsets, permissions, status
from .communitypost_model import CommunityPost
from .communitypost_serializer import CommunityPostSerializer
from rest_framework.response import Response

class CommunityPostViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = CommunityPost.objects.all()
    serializer_class = CommunityPostSerializer

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