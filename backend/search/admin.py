from sre_constants import FAILURE
from django.contrib import admin, messages
from solo.admin import SingletonModelAdmin
from . import models
from django.db import models as m
# from flat_json_widget.widgets import FlatJsonWidget
from jsoneditor.forms import JSONEditor as FlatJsonWidget
import meilisearch
from search import client


class SearchIndexInline(admin.StackedInline):
    model = models.SearchIndex
    extra = 0

    formfield_overrides = {
        m.JSONField: {'widget': FlatJsonWidget},
    }


@admin.register(models.MeilisearchConfig)
class MeilisearchConfigAdmin(SingletonModelAdmin):
    inlines = (SearchIndexInline,)

    formfield_overrides = {
        m.JSONField: {'widget': FlatJsonWidget},
    }

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        indexes = obj.indexes.all()
        try:
            for index in indexes:
                client.index(index).update_settings(index.config)
        except meilisearch.errors.MeiliSearchApiError as e:
            self.message_user(
                request, f'Updating Meilisearch indexes failed with error {e}',
                messages.FAILURE)
            return

        str_indexes = ", ".join(str(index) for index in indexes)
        self.message_user(
            request, f'Updated Meilisearch indexes {str_indexes} updated successfully.',
            messages.SUCCESS
        )
