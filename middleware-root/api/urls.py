from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', UserViewset, basename='users')
router.register('posts', PostViewset, basename='posts')

urlpatterns = [
    path('api/getuserid/', getUserID, name='getuserid'),
    path('api/login/', login_user, name='login'),
              ] + router.urls
