from django.db import models
from mdeditor.fields import MDTextField

from operator import itemgetter
from functools import partial
from . import schemas

def default(schema):
    return partial(dict, schema['default'])

# Create your models here.
class Service(models.Model):
    # administrative fields
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField()
    published = models.BooleanField(default=False)

    # critical functionality for frontend
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    address = models.CharField(max_length=255, blank=True, null=True, default=None)
    # TODO: geodata

    # text content
    blurb = models.CharField(max_length=255, blank=True)
    description = MDTextField(blank=True)

    # complex/formatted content
    phone_numbers = models.JSONField(default=default(schemas.phone_numbers))
    socials = models.JSONField(default=default(schemas.socials))
    hours = models.JSONField(default=default(schemas.hours))
    
    # extra, 'floppy' attributes

    # private
    _contact = models.CharField(max_length=255)
