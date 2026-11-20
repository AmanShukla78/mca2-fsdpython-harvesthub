from django.contrib import admin
from .models import Farm, Field

@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ('farm_id', 'farm_name', 'owner', 'total_acres', 'city', 'state', 'created_at')
    search_fields = ('farm_name', 'city', 'state')
    list_filter = ('state', 'city')

@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ('field_id', 'field_name', 'farm', 'area_acres', 'soil_type', 'irrigation_source', 'status')
    list_filter = ('soil_type', 'irrigation_source', 'status', 'farm')
    search_fields = ('field_name', 'farm__farm_name')
