from django.urls import path
from .views import *
from api.Users.user_view import UserViewset
from api.Users.user_functions import *
from rest_framework.routers import DefaultRouter
from api.Engagement.engagement_view import EngagementViewset
from api.Engagement.engagement_functions import *
from api.Communities.communities_functions import *
from api.Communities.communities_view import *
from api.Members.members_view import *
from api.Members.members_functions import *
from api.CommunityPost.communitypost_view import CommunityPostViewset
from api.CommunityPost.communitypost_functions import addCommunityPost
router = DefaultRouter()
router.register('users', UserViewset, basename='users')
router.register('posts', PostViewset, basename='posts')
router.register('createdposts', CreatedPostsViewset, basename='createdposts')
router.register('message', MessageViewset, basename='message')
router.register('chatroom', ChatRoomViewset, basename='chatroom')
router.register('friends', FriendsViewset, basename='friends')
router.register('engagement', EngagementViewset, basename='engagement')
router.register('communities', CommunitiesViewset, basename='communities')
router.register('members', MembersViewset, basename='members')
router.register('communitypost', CommunityPostViewset, basename='communitypost')


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
    path('api/get_engagement/', get_engagement, name='get_engagement'),
    path('api/getcommunitiesid/', getCommunitiesID, name='getcommunitiesid'),
                  path('api/getmemberid/', getMemberID, name='getmemberid'),
                  path('api/getcommkey/', getCommKey, name='getcommkey'),
                  path('api/create_community/', create_community, name='create_community'),
                  path('api/add_member/', add_member, name='add_member'),
                  path('api/get_communities/', get_communities, name='get_communities'),
                  path('api/search_communities/', search_communities, name='search_communities'),
                  path('api/get_user/<str:user_id>/', get_user, name='get_user'),
                  path('api/community-details/<str:community_key>/', get_community_details,
                       name='get_community_details'),
                  path('api/get_community_members/<str:community_id>/', get_community_members,
                       name='get_community_members'),
                  path('api/get_community_posts/', get_community_posts,
                       name='get_community_posts'),
                  path('api/is_member/', is_member,
                       name='is_member'),
                  path('api/addCommunityPost/', addCommunityPost,
                       name='addCommunityPost'),
                  path('api/remove_member/', remove_member,
                       name='remove_member'),

              ] + router.urls
