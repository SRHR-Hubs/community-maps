import json
from django.contrib import admin
from django.utils import timezone
from django.db import models as m
from . import models

from flat_json_widget.widgets import FlatJsonWidget

@admin.register(models.Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'updated_at', 'published',)
    list_display_links = ('id', 'name',)

    actions = ('publish_selected', 'unpublish_selected',)

    prepopulated_fields = {
        "slug": ("name",),
    }

    formfield_overrides = {
        m.JSONField: {'widget': FlatJsonWidget},
    }

    def get_changeform_initial_data(self, request):
        return {
            "updated_at": timezone.now(),
        }

    @admin.action(description='Publish selected services')
    def publish_selected(self, request, queryset):
        queryset.update(published=True)

    @admin.action(description='Unpublish selected services')
    def unpublish_selected(self, request, queryset):
        queryset.update(published=False)