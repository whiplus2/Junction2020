# Generated by Django 3.0.8 on 2020-11-07 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aitojunction', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='aito_id',
            field=models.CharField(default='1', max_length=255),
        ),
    ]