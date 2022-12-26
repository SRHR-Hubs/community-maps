from django.contrib import admin
from django.db import models as m
# from mdeditor.fields import MDTextField
from mdeditor.widgets import MDEditorWidget

from . import models

# Register your models here.

@admin.register(models.BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    def get_changeform_initial_data(self, request):
        return {'created_by': request.user}
    formfield_overrides = {
        # m.TextField: MDEditorWidget
    }