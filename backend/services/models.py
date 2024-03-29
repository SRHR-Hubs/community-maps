from django.db import models
from mdeditor.fields import MDTextField

from functools import partial
from search import searchable_fields
from . import schemas


def default(schema):
    return partial(dict, schema['default'])


def load_schema(schema):
    return {
        **dict(schema.items()),
        'default': default(schema),
    }


class Service(models.Model):
    # administrative fields
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)

    # critical functionality for frontend
    # TODO: slug is not unique
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    address = models.TextField(blank=True, null=True, default=None)
    website = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    # TODO: geodata

    # text content
    blurb = models.CharField(max_length=255, blank=True)
    description = MDTextField(blank=True)

    # complex/formatted content
    phone_numbers = models.JSONField(
        blank=True, **load_schema(schemas.phone_numbers))
    socials = models.JSONField(
        blank=True, **load_schema(schemas.socials))
    hours = models.JSONField(
        blank=True, **load_schema(schemas.hours))

    # extra, 'floppy' attributes
    extra = models.JSONField(blank=True, default=default(schemas.extra))

    # private
    _contact = models.CharField(max_length=255, blank=True)

    tags = models.ManyToManyField(
        'Facet',
        through='FacetTag',
        through_fields=('service', 'facet'),
    )

    def to_document(self):
        formatted_tags = [{
            'id': tag.id,
            tag.facet.translation_id: tag.value
        } for tag in self.facettag_set.all()]

        fields = {
            field: getattr(self, field)
            for field in searchable_fields
        }

        return {
            'id': self.id,
            **fields,
            'tags': formatted_tags
        }

    def __str__(self):
        return f'<Service: {self.name[:10]}>'

    @classmethod
    def sentinel(cls):
        return cls.objects.get_or_create(**schemas.blank_service)

    class Meta:
        ordering = ('id',)


class Facet(models.Model):
    translation_id = models.CharField(max_length=31, unique=True)
    _description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f'{self.translation_id}'

    class Meta:
        ordering = ('id',)


class FacetTag(models.Model):
    # TODO: do these on_delete behaviours make sense?
    service = models.ForeignKey(
        Service, on_delete=models.CASCADE)
        # Service, on_delete=models.SET(Service.sentinel))
    facet = models.ForeignKey(Facet, on_delete=models.CASCADE)
    value = models.TextField()
    extra = models.JSONField(blank=True, default=default(schemas.extra))

    class Meta:
        ordering = ('id',)
        verbose_name = 'Tag'
        constraints = [
            models.UniqueConstraint(
                name='unique_tag',
                fields=['service', 'facet', 'value']
            )
        ]

    def __str__(self):
        return f'<{self.facet}={self.value}>'
