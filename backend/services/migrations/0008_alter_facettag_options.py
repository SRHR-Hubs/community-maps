# Generated by Django 4.1.4 on 2022-12-28 05:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0007_alter_facet_options_alter_facettag_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='facettag',
            options={'ordering': ('id',), 'verbose_name': 'Tag'},
        ),
    ]
