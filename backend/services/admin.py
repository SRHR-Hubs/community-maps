from django.contrib import admin
from django.forms import widgets
from django.utils import timezone
from django.db import models as m
from django.template.loader import render_to_string
from nonrelated_inlines.admin import NonrelatedTabularInline
from . import models
from pages.models import I18nSection

from flat_json_widget.widgets import FlatJsonWidget
from jsoneditor.forms import JSONEditor
from django_admin_geomap import ModelAdmin as GeoModelAdmin

# TODO move and get to work lol


class CustomJSONEditor(JSONEditor):
    class Media:
        css = {"all": ("templates/json_editor.css",)}


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

    classes = ('collapse',)

    formfield_overrides = {
        m.JSONField: {'widget': CustomJSONEditor},
        # m.JSONField: {'widget': widgets.TextInput},
    }


class LocationInline(admin.StackedInline):
    # TODO: possible to add button to attempt to auto_calculate lat/long?
    model = models.Location


@admin.register(models.Service)
class ServiceAdmin(GeoModelAdmin):
    fields = (
        ('published',),
        ('name', 'slug',),
        ('website', 'email',),
        ('blurb',),
        ('is_virtual',),
        ('description',),
        ('phone_numbers',),
        ('socials',),
        ('hours',),
        ('extra',),
    )

    list_display = ('id', 'name', 'updated_at', 'is_virtual', 'published',)
    list_display_links = ('id', 'name',)
    list_per_page = 10

    actions = ('publish_selected', 'unpublish_selected',)

    inlines = (LocationInline, FacetTagInline,)

    geomap_field_longitude = "location__longitude"
    geomap_field_latitude = "location__latitude"
    geomap_default_latitude = "43.7"
    geomap_default_longitude = "-79.4"
    geomap_default_zoom = "10"
    geomap_height = "600px"

    search_fields = ('name',)

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

        # from search import client
        # client.index('services').update_documents([obj.to_document()])

        return super().response_change(request, obj)


class FacetTranslationInline(NonrelatedTabularInline):
    model = I18nSection
    extra = 1

    fields = ('language', 'translation_id', 'text')

    formfield_overrides = {
        m.TextField: {
            'widget': widgets.TextInput,
        }
    }

    def get_form_queryset(self, obj):
        prefix = f'tags.{obj.translation_id}'
        return self.model.objects.filter(translation_id__startswith=prefix)

    def save_new_instance(self, parent, instance):
        instance.save()


@admin.register(models.Facet)
class FacetAdmin(admin.ModelAdmin):
    search_fields = ('translation_id',)
    readonly_fields = ('distribution',)

    inlines = (FacetTranslationInline,)

    def get_readonly_fields(self, request, obj):
        # don't show distribution on create
        # (prevents crash)
        if obj:
            return ('distribution',)
        return ()

    @admin.display(description="Value distribution")
    def distribution(self, obj):
        # TODO: I would love to have a list of all
        # services with each key-value pair.
        # suitable Subquery:
        # Service.objects.filter(facettag__facet__translation_id="<>", facettag__value__eq="<>")

        qs = models.FacetTag.objects.filter(facet=obj)

        result = qs.values('value')\
            .annotate(value_count=m.Count('value'))\
            .values_list('value', 'value_count')

        src = dict(result.all())
        return render_to_string("as_table.html", {'src': src})

    # formfield_overrides = {
    #     m.JSONField: {'widget': FlatJsonWidget},
    # }
