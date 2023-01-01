from django.contrib import admin
from django.forms import widgets
from django.utils import timezone
from django.db import models as m
from django.template.loader import render_to_string
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

    def response_change(self, request, obj):
        # update search index after save.
        # post_save and signals don't work, see:
        # https://igorsobreira.com/2011/02/12/change-object-after-saving-all-inlines-in-django-admin.html

        from search import client
        client.index('services').update_documents([obj.to_document()])

        return super().response_change(request, obj)


@admin.register(models.Facet)
class FacetAdmin(admin.ModelAdmin):
    search_fields = ('translation_id',)
    readonly_fields = ('distribution',)

    def get_readonly_fields(self, request, obj):
        # don't show distribution on create
        # (prevents crash)
        if obj:
            return ('distribution',)
        return ()

    @admin.display(description="Value distribution")
    def distribution(self, obj):
        qs = models.FacetTag.objects.filter(facet=obj)

        result = qs.values('value')\
            .annotate(value_count=m.Count('value'))\
            .values_list('value', 'value_count')

        src = dict(result.all())
        return render_to_string("as_table.html", {'src': src})

    # formfield_overrides = {
    #     m.JSONField: {'widget': FlatJsonWidget},
    # }
