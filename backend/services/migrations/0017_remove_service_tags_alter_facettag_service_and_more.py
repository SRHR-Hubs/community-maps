# Generated by Django 4.1.4 on 2023-06-18 01:44

from math import e
from django.db import migrations, models
import django.db.models.deletion
import django_jsonform.models.fields


def rewrite_json_field(field):
    def _inner(apps, schema_editor):
        Service = apps.get_model("services", "Service")
        for service in Service.objects.all():
            fld = getattr(service, field)
            if type(fld) is not dict:
                continue
            new_fld = [
                {'key': k, 'value': v} for k, v in fld.items()
            ]

            days_of_week = {x: i for i, x in enumerate([
                'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                'Friday', 'Saturday', 'Sunday'
            ])}

            new_fld.sort(key=lambda item: days_of_week.get(
                item['key'], 7
            ))

            setattr(service, field, new_fld)
            # service = hours
            service.save(update_fields=[field])
    return _inner


def rewrite_json_field_reverse(field):
    def _inner(apps, schema_editor):
        Service = apps.get_model("services", "Service")
        for service in Service.objects.all():
            fld = getattr(service, field)
            old_fld = {
                item['key']: item['value']
                for item in fld
            }
            setattr(service, field, old_fld)
            service.save(update_fields=[field])
    return _inner


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0016_alter_location_options_delete_facettranslation'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='service',
            name='tags',
        ),
        migrations.AlterField(
            model_name='facettag',
            name='service',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, related_name='tags', to='services.service'),
        ),
        migrations.AlterField(
            model_name='service',
            name='hours',
            field=django_jsonform.models.fields.JSONField(blank=True),
        ),
        migrations.AlterField(
            model_name='service',
            name='phone_numbers',
            field=django_jsonform.models.fields.JSONField(blank=True),
        ),
        migrations.AlterField(
            model_name='service',
            name='socials',
            field=django_jsonform.models.fields.JSONField(blank=True),
        ),

        *[migrations.RunPython(rewrite_json_field(field), rewrite_json_field_reverse(field))
          for field in ['phone_numbers', 'socials', 'hours']]
    ]
