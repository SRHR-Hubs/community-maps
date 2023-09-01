# Generated by Django 4.1.4 on 2023-09-01 00:51

from django.db import migrations


def populate_meili(apps, schema_editor):
    cls = apps.get_model("services", "Service")
    from search import client
    from django.utils.text import Truncator

    published_services = cls.objects.filter(published=True)

    settings = client.index('services').get_settings()

    searchable_fields = settings.get('searchableAttributes', [])
    if searchable_fields == ['*']:
        raise NotImplemented

    documents = []

    for service in published_services:
        flat_tags = [{
            'id': tag.id,
            tag.facet.translation_id: tag.value
        } for tag in service.tags.all()]

        fields = {
            field: getattr(service, field)
            for field in searchable_fields
        }

        documents.append({
            'id': service.id,
            **fields,
            'tags': flat_tags
        })

    client.refresh('services', documents)

    subset_with_location = cls.objects.filter(
        published=True, location__isnull=False)

    documents = [{
        "slug": service.slug,
        "name": service.name,
        "blurb": Truncator(service.description).chars(60),
        "_geo": {
            "lat": service.location.latitude,
            "lng": service.location.longitude
        }} for service in subset_with_location]

    client.refresh('geodata', documents, primary_key='slug')


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0017_remove_service_tags_alter_facettag_service_and_more'),
    ]

    operations = [
        migrations.RunPython(populate_meili)
    ]
