from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Role, User

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('role_id', 'role_code', 'role_name', 'created_at')
    search_fields = ('role_code', 'role_name')

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Agricultural Role & Contact', {'fields': ('role', 'phone_number')}),
    )
