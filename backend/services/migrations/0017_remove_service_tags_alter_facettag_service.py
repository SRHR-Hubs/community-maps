# Generated by Django 4.1.4 on 2023-07-19 01:35

from django.db import migrations, models
import django.db.models.deletion


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
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tags', to='services.service'),
        ),
    ]
