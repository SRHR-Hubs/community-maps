# Generated by Django 4.1.4 on 2023-01-30 23:53

from django.db import migrations, models
import uuid

made_so_far = set()

def make_uuid():
    while True:
        proposed = uuid.uuid4().hex[:31]
        if proposed in made_so_far: continue
        made_so_far.add(proposed)
        return proposed

class Migration(migrations.Migration):

    dependencies = [
        ('services', '0021_facettranslation_language'),
    ]

    operations = [
        migrations.AddField(
            model_name='facet',
            name='translation_id',
            field=models.CharField(default=make_uuid, max_length=31, null=True),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='FacetTranslation',
        ),
    ]
