from django.contrib import admin
from .models import *
from .user_model import Users
# Register your models here.
admin.site.register(Users)