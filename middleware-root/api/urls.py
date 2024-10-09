from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', UserViewset, basename='users')
router.register('posts', PostViewset, basename='posts')
router.register('createdposts', CreatedPostsViewset, basename='createdposts')

urlpatterns = [
    path('api/getuserid/', getUserID, name='getuserid'),
    path('api/login/', login_user, name='login'),
    path('api/getpostid/', getPostID, name='getpostid'),
    path('api/getcreatedpostid/', getCreatedPostID, name='getcreatedpostid'),
    path('api/get_user_posts/', get_user_posts, name='getuserposts'),
              ] + router.urls
