# Generated by Django 5.0.3 on 2024-05-31 06:07

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managment', '0018_statustask_image_alter_task_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='statustask',
            name='image',
        ),
        migrations.AlterField(
            model_name='task',
            name='date',
            field=models.DateField(default=datetime.date(2024, 5, 31)),
        ),
    ]
