# users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    employee_id = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.username
