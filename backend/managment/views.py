from operator import truediv
from typing import dataclass_transform

from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import re
from django.core import serializers
from django.core.serializers.base import SerializationError
from django.core.serializers.json import Serializer
from django.db.models.fields.related import resolve_relation
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import is_valid_path
from django.utils.formats import sanitize_separators
from django.utils.text import add_truncation_text
from rest_framework import generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from itertools import chain
from .models import Block, Board, Comment, StatusTask, Task, User, UserBoard, UserRole
from .permissions import (
    IsAdminOrReadOnly,
    IsOwnerCommentOrRole,
    IsOwnerOrReadOnly,
    IsUserOrReadOnly,
    IsUserOrUserRoleCanEditDelete,
    IsUserRelateToBlockOrReadOnly,
    IsUserRelateToBoardOrReadOnly,
    IsUserRelateToTaskOrReadOnly,
    IsUserRoleCanCRUDStatusTask,
    IsUserRoleCanCRUDUserRole,
)
from .serializers import (
    BlockSerializer,
    BoardSerializer,
    CommentSerializer,
    ExtUserSerializer,
    StatusTaskSerializer,
    TaskSerializer,
    UpdateUserSerializer,
    UserBoardSerializer,
    UserRoleSerializer,
    UserSerializer,
)


# User
class UserAPIView(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsUserOrReadOnly]

    # настройка отображения для админа и для обычных, себя юзер должен видеть в полной мере
    def retrieve(self, request, pk):
        user = request.user
        usr = self.queryset.get(id=pk)

        #! if необычный
        if user.id == usr.id:
            serializer = UserSerializer(usr)
            return Response(serializer.data)

        if user.is_superuser:
            serializer = UserSerializer(usr)
            return Response(serializer.data)

        serializer = ExtUserSerializer(usr)
        return Response(serializer.data)

    def list(self, request):
        serializer = ExtUserSerializer(self.queryset, many=True)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        user = request.user
        usr = self.queryset.get(id=pk)
        if user.id != usr.id and user.is_superuser == False:
            return Response("access denied", status=status.HTTP_403_FORBIDDEN)

        if user.is_superuser:
            serializer = UserSerializer(usr, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = UpdateUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # чтобы пользователь не мог сделать себя админом
    def update(self, request, pk=None):
        user = request.user
        usr = self.queryset.get(id=pk)
        if user.id != usr.id and user.is_superuser == False:
            return Response("access denied", status=status.HTTP_403_FORBIDDEN)

        if user.is_superuser:
            serializer = UserSerializer(usr, data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer = UpdateUserSerializer(user, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)

        if request.user.is_superuser == False:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=True, methods=['get'],
     url_path='get_by_name/(?P<board_pk>[^/.]+)') 
    def get_by_name(self, request, pk=None, board_pk=None):
        instance = self.queryset.filter(first_name=pk )
        instance2 = self.queryset.filter(last_name=pk)
        instance3 = self.queryset.filter(username=pk)
        user_boards = UserBoard.objects.filter(id_board=board_pk).values_list('id_user')
        users = self.queryset.filter(id__in=user_boards)

        instance = instance.difference(users)
        instance2 = instance2.difference(users)
        instance3 = instance3.difference(users)

        result = list(chain(instance, instance2, instance3))            
        # result = result.difference(users)

        serializer = ExtUserSerializer(result, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

# StatusTask
class StatusTaskAPIView(ModelViewSet):
    queryset = StatusTask.objects.all()
    serializer_class = StatusTaskSerializer
    permission_classes = [IsUserRoleCanCRUDStatusTask]

    # def list(self, request):
    #     boards_id = UserBoard.objects.filter(id_user=request.user.id).values_list(
    #         'id_board'
    #     )
    #     result = self.queryset.filter(id_board__in=boards_id)
    #     serializer = self.get_serializer(data=result, many=True)
    #     serializer.is_valid()
    #     return Response(serializer.data, status.HTTP_200_OK)

    # # вывод только тех досок, в которых есть пользователь
    # def retrieve(self, request, pk=None):
    #     instance = self.get_object()

    #     check_id_board = UserBoard.objects.filter(
    #         id_board=instance.id_board, id_user=request.user.id
    #     ).first()

    #     if not check_id_board:
    #         return Response('access denied', status.HTTP_403_FORBIDDEN)

    #     serializer = self.get_serializer(instance)
    #     return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def get_by_id_board(self, request, pk=None):
        check_pk = UserBoard.objects.filter(id_board=pk, id_user=request.user.id)
        if not check_pk:
            return Response('access denied', status.HTTP_403_FORBIDDEN)

        instance = self.queryset.filter(id_board=pk)
        serializer = self.get_serializer(data=instance, many=True)
        serializer.is_valid()
        return Response(serializer.data)


# UserRole
class UserRoleAPIView(ModelViewSet):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsUserRoleCanCRUDUserRole]

   
    # получение роли пользователя по id task 
    @action(detail=True, methods=['get'])
    def get_by_id_task(self,request,pk=None):
        task = Task.objects.get(id=pk)
        if not task:
            return Response('not found', status.HTTP_401_BAD_REQUEST)
        user_board = UserBoard.objects.get(id_board=task.id_block.id_board.id, id_user=request.user.id)
        if not user_board:
            return Resposne('access denied', status.HTTP_403_FORBIDDEN)
        instance = self.queryset.get(id=user_board.id_user_role.id)
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status.HTTP_200_OK)

    # получение ролей определенной доски, в которой состоит пользователь
    @action(detail=True, methods=['get'])
    def get_by_id_board(self, request, pk=None):
        check_pk = UserBoard.objects.filter(id_board=pk, id_user=request.user.id)
        if not check_pk:
            return Response('access denied', status.HTTP_403_FORBIDDEN)
        result = self.queryset.filter(id_board=pk)

        serializer = UserRoleSerializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    # получение ролей по id task
    @action(detail=True, methods=['get'])
    def get_by_id_task_no_user(self, request, pk=None):
        task = Task.objects.get(id=pk)
        if not task:
            return Response('not found', status.HTTP_401_BAD_REQUEST)
        
        result = self.queryset.filter(id_board=task.id_block.id_board.id)

        serializer = UserRoleSerializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)


    # получение по id block
    @action(detail=True, methods=['get'])
    def get_by_id_block(self, request, pk=None):
        instance = Block.objects.get(id=pk)
        user_board = UserBoard.objects.get(id_board=instance.id_board.id, id_user=request.user.id)
        if not user_board:
            return Response('acces denied', status.HTTP_403_FORBIDDEN)

        result = self.queryset.get(id=user_board.id_user_role.id)
        serializer = self.get_serializer(result)
        # serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def get_by_id_board_user(self, request, pk=None):
        check_pk = UserBoard.objects.filter(id_board=pk, id_user=request.user.id).first()
        if not check_pk:
            return Response('access denied', status.HTTP_403_FORBIDDEN)
        result = self.queryset.filter(pk=check_pk.id_user_role.id).first()
        serializer = self.get_serializer(result)
        return Response(serializer.data, status.HTTP_200_OK)

    def list(self, request):
        boards_id = UserBoard.objects.filter(id_user=request.user.id).values_list(
            'id_board'
        )
        result = self.queryset.filter(id_board__in=boards_id)
        serializer = UserRoleSerializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    # вывод только тех досок, в которых есть пользователь
    def retrieve(self, request, pk):
        instance = self.get_object()

        check_id_board = UserBoard.objects.filter(
            id_board=instance.id_board, id_user=request.user.id
        ).first()

        if not check_id_board:
            return Response('access denied', status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)


# UserBoard
class UserBoardAPIView(ModelViewSet):
    queryset = UserBoard.objects.all()
    serializer_class = UserBoardSerializer
    permission_classes = [IsUserOrUserRoleCanEditDelete]

    # вывод только тех досок, в которых есть пользователь
    def retrieve(self, request, pk=None):
        instance = self.get_object()
        check_in_board = self.queryset.filter(
            id_board=instance.id_board, id_user=request.user.id
        )

        if not check_in_board:
            return Response('acces denied', status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # вывод только пользователей, которые состоят в твоих досках и твои доски
    def list(self, request):
        boards = self.queryset.filter(id_user=request.user.id).values_list('id_board')
        result = self.queryset.filter(id_board__in=boards)

        serializer = UserBoardSerializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    # получение user_boards по id_board, показывает доски те, в которых состоит пользователь и его доски
    @action(detail=True, methods=['get'])
    def get_by_id_board(self, request, pk=None):
        check_pk = self.queryset.filter(id_board=pk, id_user=request.user.id)
        if not check_pk:
            return Response('access denied', status.HTTP_403_FORBIDDEN)
        user_boards = self.queryset.filter(id_board=pk)
        serializer = UserBoardSerializer(data=user_boards, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    
   # получение user_board пользователя по доске
    @action(detail=True, methods=['get'])
    def get_user_board_of_user(self, request, pk=None):
        user_board = self.queryset.get(id_board=pk, id_user=request.user.id)
        if not user_board:
            return Response('access denied', status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(user_board)
        return Response(serializer.data, status.HTTP_200_OK)

    

    @action(detail=True, methods=['get'])
    def get_by_id_task(self,request, pk=None):
        task = Task.objects.get(id=pk)
        if not task:
            return Response('not found', status.HTTP_401_BAD_REQUEST)
        user_boards = self.queryset.filter(id_board=task.id_block.id_board.id)
        serializer = UserBoardSerializer(data=user_boards, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    # получение по id block
    @action(detail=True, methods=['get'])
    def get_by_id_block(self, request, pk=None):
        block = Block.objects.get(id=pk)
        instance = self.queryset.get(id_board=block.id_board.id, id_user=request.user.id )
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status.HTTP_200_OK)

    # получение по id user role
    @action(detail=True, methods=['get'])
    def get_by_id_role(self, request, pk=None):
        user_role = UserRole.objects.get(id=pk)
        instance = self.queryset.filter(id_board=user_role.id_board.id, id_user_role=user_role.id).first()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status.HTTP_200_OK)

# Board
class BoardAPIView(ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [IsUserRelateToBoardOrReadOnly]

    @action(detail=False, methods=['get'])
    def get_users_boards(self, request):
        boards = UserBoard.objects.filter(id_user=request.user.id, is_admin=True).values_list(
            'id_board'
        )
        result = self.queryset.filter(id__in=boards).order_by('-id')

        serializer = self.get_serializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def get_user_in_boards(self, request):
        boards = UserBoard.objects.filter(id_user=request.user.id, is_admin=False).values_list(
            'id_board'
        )
        result = self.queryset.filter(id__in=boards).order_by('-id')

        serializer = self.get_serializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        instance = self.get_object()

        check_id_board = UserBoard.objects.filter(
            id_board=instance.id, id_user=request.user.id
        ).first()

        if not check_id_board:
            return Response('access denied', status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request):
        boards = UserBoard.objects.filter(id_user=request.user.id).values_list(
            'id_board'
        )
        result = self.queryset.filter(id__in=boards)

        serializer = self.get_serializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    # При создании доски приписывает юзера к доске, как владельца
    def create(self, request):
        board_serializer = self.get_serializer(data=request.data)
        if board_serializer.is_valid():
            board_serializer.save()

            id_board = self.queryset.latest("id").id

            user_role_data = {
                "name": 'admin_role',
                "id_board": id_board,
                "delete_members": True,
                "edit_members": True,
                "editing_role": True,
                "deleting_role": True,
                "creating_role": True,
            }
            userrole_serializer = UserRoleSerializer(data=user_role_data)
            if userrole_serializer.is_valid():
                userrole_serializer.save()
            else:
                return Response(
                    userrole_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )
            id_user_role = UserRole.objects.latest('id').id
            user_board_data = {
                "id_user": request.user.id,
                "id_board": id_board,
                "id_user_role": id_user_role,
                "is_admin": True,
            }
            userboard_serializer = UserBoardSerializer(data=user_board_data)
            if userboard_serializer.is_valid():
                userboard_serializer.save()
                return Response(board_serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    userboard_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(board_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Выводит только те доски, в которых есть юзер
    # def get_queryset(self):
    #     user = self.request.user
    #     return self.queryset.filter(
    #         id__in=UserBoard.objects.all()
    #         .filter(id_user=user.id)
    #         .values_list("id_board", flat=True)
    #     )


# Comment
class CommentAPIView(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerCommentOrRole]

    def retrieve(self, request, pk=None):
        instance = self.get_object()

        check_id_board = UserBoard.objects.filter(
            id_board=instance.id_task.id_block.id_board.id, id_user=request.user.id
        ).first()

        print(check_id_board.is_admin)

        if not check_id_board:
            return Response('access denied', status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request):
        boards = UserBoard.objects.filter(id_user=request.user.id).values_list(
            'id_board'
        )
        blocks = Block.objects.filter(id_board__in=boards).values_list('id')
        tasks = Task.objects.filter(id_block__in=blocks).values_list('id')
        result = self.queryset.filter(id_task__in=tasks)

        serializer = self.get_serializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def get_by_id_user(self, request, pk=None):
        result = self.queryset.filter(id_user=pk)
        serializer = self.get_serializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def get_by_id_task(self, request, pk=None):
        instance = Task.objects.get(id=pk)
        check_pk = UserBoard.objects.filter(
            id_board=instance.id_block.id_board.id, id_user=request.user.id
        )
        if not check_pk:
            return Response('access denied', status.HTTP_403_FORBIDDEN)
        result = self.queryset.filter(id_task=pk)
        serializer = self.get_serializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)


# Block
class BlockAPIView(ModelViewSet):
    queryset = Block.objects.all()
    serializer_class = BlockSerializer
    permission_classes = [IsUserRelateToBlockOrReadOnly]

    def retrieve(self, request, pk=None):
        instance = self.get_object()

        check_id_board = UserBoard.objects.filter(
            id_board=instance.id_board, id_user=request.user.id
        ).first()

        if not check_id_board:
            return Response('access denied', status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request):
        boards = UserBoard.objects.filter(id_user=request.user.id).values_list(
            'id_board'
        )
        result = self.queryset.filter(id_board__in=boards)

        serializer = self.get_serializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    @action (detail=True, methods=['get'])
    def get_by_id_board(self, request, pk=None):
        result = self.queryset.filter(id_board=pk).order_by('-position')
        serializer = self.get_serializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

# Task
class TaskAPIView(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsUserRelateToTaskOrReadOnly]

    def retrieve(self, request, pk=None):
        instance = self.get_object()

        check_id_board = UserBoard.objects.filter(
            id_board=instance.id_block.id_board, id_user=request.user.id
        ).first()

        if not check_id_board:
            return Response('access denied', status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request):
        boards = UserBoard.objects.filter(id_user=request.user.id).values_list(
            'id_board'
        )
        blocks = Block.objects.filter(id_board__in=boards).values_list('id')
        result = self.queryset.filter(id_block__in=blocks).order_by('position')

        serializer = self.get_serializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)

    # get last task of block
    @action(detail=True, methods=['get'])
    def get_last_task(self, request, pk=None):
        instance = self.queryset.filter(id_block=pk).order_by('position').last()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def get_by_id_block(self, request, pk=None):
        instance = Block.objects.get(id=pk)
        check_pk = UserBoard.objects.filter(
            id_board=instance.id_board, id_user=request.user.id
        )
        if not check_pk:
            return Response('access denied', status.HTTP_403_FORBIDDEN)
        result = self.queryset.filter(id_block=pk).order_by('position')
        serializer = self.get_serializer(data=result, many=True)
        serializer.is_valid()
        return Response(serializer.data, status.HTTP_200_OK)
