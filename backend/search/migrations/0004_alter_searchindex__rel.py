# Generated by Django 4.1.4 on 2023-06-18 01:44

from django.db import migrations, models
import django.db.models.deletion
import search.models


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0003_alter_searchindex_options_searchindex_index_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='searchindex',
            name='_rel',
            field=models.ForeignKey(default=search.models.MeilisearchConfig.get_solo, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='indexes', to='search.meilisearchconfig'),
        ),
    ]
