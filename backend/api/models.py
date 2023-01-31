from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class GenericTranslation(models.Model):
    translation_id = models.CharField(max_length=200)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    # TODO: could be extended to include language and whatnot
    language = models.CharField(max_length=12, default="en")


    class Meta:
        abstract = True
        indexes = (
            models.Index(fields=['content_type', 'object_id']),
        )

        constraints = (
            models.UniqueConstraint(
                name='unique_per_object_and_language',
                fields=('content_type', 'object_id', 'content_object', 'language')
            ),
        )