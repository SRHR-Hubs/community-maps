# Generated by Django 4.1.4 on 2022-12-26 00:26

from django.db import migrations
import mdeditor.fields


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpost',
            name='content',
            field=mdeditor.fields.MDTextField(default=''),
            preserve_default=False,
        ),
    ]
