# Generated by Django 4.1.4 on 2022-12-28 03:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0006_alter_facet__description'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='facet',
            options={'ordering': ('id',)},
        ),
        migrations.AlterModelOptions(
            name='facettag',
            options={'ordering': ('id',)},
        ),
        migrations.AlterModelOptions(
            name='service',
            options={'ordering': ('id',)},
        ),
    ]
