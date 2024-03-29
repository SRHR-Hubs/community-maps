# Generated by Django 4.1.4 on 2023-01-08 22:20

from django.db import migrations, models
import mdeditor.fields


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blogpost',
            name='content',
            field=mdeditor.fields.MDTextField(blank=True),
        ),
        migrations.AlterField(
            model_name='blogpost',
            name='slug',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='page',
            name='content',
            field=mdeditor.fields.MDTextField(blank=True),
        ),
        migrations.AlterField(
            model_name='page',
            name='slug',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
