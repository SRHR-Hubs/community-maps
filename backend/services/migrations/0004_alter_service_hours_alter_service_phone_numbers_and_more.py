# Generated by Django 4.1.4 on 2022-12-27 01:31

from django.db import migrations, models
import functools


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0003_alter_service_hours_alter_service_phone_numbers_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='service',
            name='hours',
            field=models.JSONField(default=functools.partial(dict, *({'Friday': None, 'Monday': None, 'Saturday': None, 'Sunday': None, 'Thursday': None, 'Tuesday': None, 'Wednesday': None, 'extra': None},), **{})),
        ),
        migrations.AlterField(
            model_name='service',
            name='phone_numbers',
            field=models.JSONField(default=functools.partial(dict, *({'primary': None},), **{})),
        ),
        migrations.AlterField(
            model_name='service',
            name='socials',
            field=models.JSONField(default=functools.partial(dict, *({'twitter': None},), **{})),
        ),
    ]
