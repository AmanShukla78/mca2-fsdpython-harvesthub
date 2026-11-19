from django.db import models
from django.contrib.auth.models import AbstractUser

class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_code = models.CharField(max_length=30, unique=True)
    role_name = models.CharField(max_length=60)
    description = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'roles'
        ordering = ['role_id']

    def __str__(self):
        return f"{self.role_name} ({self.role_code})"


class User(AbstractUser):
    user_id = models.AutoField(primary_key=True)
    phone_number = models.CharField(max_length=25, blank=True, default='')
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    class Meta:
        db_table = 'users'
        ordering = ['user_id']

    def __str__(self):
        return f"{self.username} - {self.get_full_name() or self.username}"
