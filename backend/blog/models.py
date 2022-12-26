from django.db import models
from django.apps import apps
from mdeditor.fields import MDTextField
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class BlogPost(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    created_by = models.ForeignKey(User, related_name='posts', null=True, on_delete=models.SET_NULL)
    published = models.BooleanField(default=False)

    content = MDTextField()