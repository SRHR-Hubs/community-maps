from django.contrib import admin
from nonrelated_inlines.admin import NonrelatedStackedInline
from django.utils import timezone
from . import models

class SectionInline(NonrelatedStackedInline):
    model = models.I18nSection
    extra = 0

    def get_form_queryset(self, obj):
        return self.model.objects.filter(translation_id__contains=obj.slug)

    def save_new_instance(self, parent, instance):
        instance.save()
class PageAdminBase(admin.ModelAdmin):
    list_display = ('slug', 'created_by', 'created_at',
                    'updated_at', 'published',)
    list_display_links = ('slug',)

    actions = ('publish_selected', 'unpublish_selected',)

    inlines = (SectionInline,)

    # TODO:
    # it will have to be the admin's
    # responsibility to ensure this is
    # unique
    prepopulated_fields = {
        'slug': ('title',),
    }


    def get_changeform_initial_data(self, request):
        return {
            'created_by': request.user,
            'updated_at': timezone.now(),
        }

    @admin.action(description='Publish selected')
    def publish_selected(self, request, queryset):
        queryset.update(published=True)

    @admin.action(description='Unpublish selected')
    def unpublish_selected(self, request, queryset):
        queryset.update(published=False)


@admin.register(models.BlogPost)
class BlogPostAdmin(PageAdminBase):
    pass


@admin.register(models.Page)
class PageAdmin(PageAdminBase):
    pass

@admin.register(models.I18nSection)
class I18nAdmin(admin.ModelAdmin):
    list_display = ('translation_id', 'language', 'text')

    search_fields = ('translation_id', 'text')
