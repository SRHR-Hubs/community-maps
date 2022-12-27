from django.contrib import admin
from . import models

@admin.register(models.BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    def get_changeform_initial_data(self, request):
        print(self.get_object())
        return {'created_by': request.user}