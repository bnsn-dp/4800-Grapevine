from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', UserViewset, basename='users')
router.register('posts', PostViewset, basename='posts')
router.register('createdposts', CreatedPostsViewset, basename='createdposts')
router.register('message', MessageViewset, basename='message')
router.register('chatroom', ChatRoomViewset, basename='chatroom')

urlpatterns = [
    path('api/getuserid/', getUserID, name='getuserid'),
    path('api/login/', login_user, name='login'),
    path('api/getpostid/', getPostID, name='getpostid'),
    path('api/getcreatedpostid/', getCreatedPostID, name='getcreatedpostid'),
    path('api/get_user_posts/', get_user_posts, name='getuserposts'),
    path('api/getchatroomid/', getChatroomID, name='getChatroomID'),
    path('api/get_user_chatrooms/', get_user_chatrooms, name='get_user_chatrooms'),
    path('api/getmessageid/', getMessageID, name='getmessageid'),
    path('api/get_messages/', get_messages, name='get_messages'),

              ] + router.urls
