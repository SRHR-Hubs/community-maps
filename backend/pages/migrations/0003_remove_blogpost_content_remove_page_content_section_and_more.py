# Generated by Django 4.1.4 on 2023-01-30 23:12

from django.db import migrations, models
import django.db.models.deletion
import mdeditor.fields


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('pages', '0002_alter_blogpost_content_alter_blogpost_slug_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blogpost',
            name='content',
        ),
        migrations.RemoveField(
            model_name='page',
            name='content',
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('section_id', models.CharField(max_length=200)),
                ('object_id', models.PositiveIntegerField()),
                ('text', mdeditor.fields.MDTextField()),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
            ],
        ),
        migrations.AddIndex(
            model_name='section',
            index=models.Index(fields=['content_type', 'object_id'], name='pages_secti_content_56a698_idx'),
        ),
    ]
