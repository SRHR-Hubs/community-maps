import json
from django.contrib import admin
from django.forms import widgets
from django.utils import timezone
from django.db import models as m
from . import models

from flat_json_widget.widgets import FlatJsonWidget


class FacetTagInline(admin.StackedInline):
    # TODO: custom template
    # to accommodate with weird rendering
    # of FlatJson Widget
    model = models.FacetTag
    extra = 1

    autocomplete_fields = ('facet', )

    fieldsets = (
        (None, {'fields': (
            # keeps them in the same row
            ('facet', 'value'),
            ('extra',)
        )}),
    )
    formfield_overrides = {
        # m.JSONField: {'widget': FlatJsonWidget},
        m.JSONField: {'widget': widgets.TextInput},
    }
@admin.register(models.Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'updated_at', 'published',)
    list_display_links = ('id', 'name',)

    actions = ('publish_selected', 'unpublish_selected',)

    inlines = (FacetTagInline,)

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


@admin.register(models.Facet)
class FacetAdmin(admin.ModelAdmin):
    search_fields = ('translation_id',)

    # formfield_overrides = {
    #     m.JSONField: {'widget': FlatJsonWidget},
    # }
