# Generated by Django 5.0.3 on 2024-04-25 12:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managment', '0006_alter_user_managers_alter_user_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_superuser',
            field=models.BooleanField(default=False),
        ),
    ]