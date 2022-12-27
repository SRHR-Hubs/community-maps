from django.contrib import admin
from . import models

@admin.register(models.BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'inline_name', 'created_by', 'created_at', 'published',)
    list_display_links = ('id', 'inline_name',)

    def get_changeform_initial_data(self, request):
        print(self.get_object())
        return {'created_by': request.user}

    @admin.display(description='Title')
    def inline_name(self, obj):
        # return obj.title or obj.content[:50]
        return obj.content.splitlines()[0][:50] or f'Blog post {self.id}'