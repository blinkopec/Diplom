import datetime

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField(default=False)
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(null=True)


class Block(models.Model):
    id = models.AutoField(primary_key=True)
    id_board = models.ForeignKey(
        'Board', related_name='board', on_delete=models.CASCADE, db_column='id_board'
    )
    name = models.CharField(max_length=30)
    position = models.IntegerField(blank=True, null=True)


class Board(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    id_user = models.ForeignKey(
        'User', related_name='comments', on_delete=models.CASCADE, db_column='id_user'
    )
    text = models.CharField(max_length=50)
    description = models.CharField(max_length=300, blank=True, null=True)
    id_task = models.ForeignKey(
        "Task", related_name='comments', on_delete=models.CASCADE
    )


class StatusTask(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    # id_board = models.ForeignKey(
    #     Board, related_name='status_tasks', on_delete=models.CASCADE
    # )


class Task(models.Model):
    id = models.AutoField(primary_key=True) 
    id_block = models.ForeignKey(
        'Block', related_name='tasks', on_delete=models.CASCADE
    )
    id_status_task = models.ForeignKey(
        'StatusTask', related_name='tasks', on_delete=models.CASCADE
    )
    text = models.CharField(max_length=50)
    description = models.CharField(max_length=300, blank=True, null=True)
    date = models.DateField(default=datetime.date.today(), null=True)
    position = models.IntegerField( null=True)


class UserRole(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    id_board = models.ForeignKey(
        'Board', related_name='roles', on_delete=models.CASCADE
    )

    add_members = models.BooleanField(default=True)
    delete_members = models.BooleanField(default=False)
    edit_members = models.BooleanField(default=False)

    commenting = models.BooleanField(default=True)
    deleting_all_comment = models.BooleanField(default=False)
    deleting_ur_comment = models.BooleanField(default=True)
    editing_ur_comment = models.BooleanField(default=True)

    creating_task = models.BooleanField(default=True)
    deleting_task = models.BooleanField(default=True)
    editing_task = models.BooleanField(default=True)

    editing_board = models.BooleanField(default=True)
    deleting_board = models.BooleanField(default=True)

    creating_block = models.BooleanField(default=True)
    editing_block = models.BooleanField(default=True)
    deleting_block = models.BooleanField(default=True)

    creating_status_task = models.BooleanField(default=True)
    editing_status_task = models.BooleanField(default=True)
    deleting_status_task = models.BooleanField(default=True)

    creating_role = models.BooleanField(default=False)
    editing_role = models.BooleanField(default=False)
    deleting_role = models.BooleanField(default=False)


class UserBoard(models.Model):
    id = models.AutoField(primary_key=True)
    id_user = models.ForeignKey(User, related_name='boards', on_delete=models.CASCADE)
    id_board = models.ForeignKey(Board, related_name='users', on_delete=models.CASCADE)
    id_user_role = models.ForeignKey(
        UserRole, related_name='roles', on_delete=models.CASCADE
    )
    is_admin = models.BooleanField(default=False, null=True)
