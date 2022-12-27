from django.contrib import admin
from django.utils import timezone
from django.db import models as m
from . import models

from flat_json_widget.widgets import FlatJsonWidget
@admin.register(models.Service)
class ServiceAdmin(admin.ModelAdmin):
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