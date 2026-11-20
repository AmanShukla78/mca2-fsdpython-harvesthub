from django.contrib import admin
from .models import CropType, CropPlanting, FieldOperation

@admin.register(CropType)
class CropTypeAdmin(admin.ModelAdmin):
    list_display = ('crop_id', 'crop_name', 'crop_category', 'standard_growth_days', 'expected_yield_per_acre_kg')
    list_filter = ('crop_category',)
    search_fields = ('crop_name', 'botanical_name')

@admin.register(CropPlanting)
class CropPlantingAdmin(admin.ModelAdmin):
    list_display = ('planting_id', 'crop', 'field', 'season', 'sowing_date', 'expected_harvest_date', 'current_stage', 'status')
    list_filter = ('season', 'current_stage', 'status')
    search_fields = ('crop__crop_name', 'field__field_name')

@admin.register(FieldOperation)
class FieldOperationAdmin(admin.ModelAdmin):
    list_display = ('operation_id', 'operation_type', 'planting', 'scheduled_date', 'status', 'assigned_to', 'equipment')
    list_filter = ('operation_type', 'status')
    search_fields = ('operation_type', 'notes')
