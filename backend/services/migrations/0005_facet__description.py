# Generated by Django 4.1.4 on 2022-12-28 03:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0004_facet_translation_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='facet',
            name='_description',
            field=models.CharField(default=None, max_length=31),
            preserve_default=False,
        ),
    ]
