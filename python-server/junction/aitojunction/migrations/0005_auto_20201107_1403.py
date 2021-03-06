# Generated by Django 3.0.8 on 2020-11-07 14:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aitojunction', '0004_cuisine'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='congestion',
            field=models.CharField(choices=[('red', 'red'), ('yellow', 'yellow'), ('green', 'green')], default='green', max_length=16),
        ),
        migrations.AddField(
            model_name='place',
            name='distance',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='place',
            name='sockets',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='place',
            name='wifi',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='place',
            name='workspace',
            field=models.BooleanField(default=False),
        ),
    ]
