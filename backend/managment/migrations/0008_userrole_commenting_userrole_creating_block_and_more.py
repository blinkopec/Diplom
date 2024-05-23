# Generated by Django 5.0.3 on 2024-04-26 05:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managment', '0007_alter_user_is_staff_alter_user_is_superuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='userrole',
            name='commenting',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='userrole',
            name='creating_block',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='userrole',
            name='creating_role',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='userrole',
            name='creating_status_task',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='userrole',
            name='creating_task',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='userrole',
            name='deleting_block',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='userrole',
            name='deleting_board',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='userrole',
            name='deleting_role',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='userrole',
            name='deleting_status_task',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='userrole',
            name='deleting_task',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='userrole',
            name='editing_block',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='userrole',
            name='editing_role',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='userrole',
            name='editing_status_task',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='userrole',
            name='editing_task',
            field=models.BooleanField(default=True),
        ),
    ]