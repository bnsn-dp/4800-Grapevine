from django.urls import path
from .views import *
from api.Users.user_view import UserViewset
from api.Users.user_functions import *
from rest_framework.routers import DefaultRouter
from api.Engagement.engagement_view import EngagementViewset
from api.Engagement.engagement_functions import *

router = DefaultRouter()
router.register('users', UserViewset, basename='users')
router.register('posts', PostViewset, basename='posts')
router.register('createdposts', CreatedPostsViewset, basename='createdposts')
router.register('message', MessageViewset, basename='message')
router.register('chatroom', ChatRoomViewset, basename='chatroom')
router.register('friends', FriendsViewset, basename='friends')
router.register('engagement', EngagementViewset, basename='engagement')

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
    path('api/getfriends/', getFriends, name='getfriends'),
    path('api/add_friend/', add_friend, name='add_friend'),
    path('api/check_friendship_status/', check_friendship_status, name='check_friendship_status'),
    path('api/get_friends_list/', get_friends_list, name='get_friends_list'),
    path('api/remove_friend/', remove_friend, name='remove_friend'),
    path('api/getengagementid/', getEngagementID, name='getengagementid'),
    path('api/remove_engagement/', remove_engagement, name='remove_engagement'),
    path('api/add_engagement/', add_engagement, name='add_engagement'),
    path('api/get_post_likes/', get_post_likes, name='get_post_likes'),
              ] + router.urls
