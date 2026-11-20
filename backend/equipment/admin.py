from django.contrib import admin
from .models import (
    EquipmentCategory, Equipment, Supplier, SparePart,
    MaintenanceRecord, MaintenancePartsUsed,
    EquipmentUtilizationLog, SparePartOrder
)

@admin.register(EquipmentCategory)
class EquipmentCategoryAdmin(admin.ModelAdmin):
    list_display = ('category_id', 'category_name', 'description')

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('supplier_id', 'company_name', 'contact_person', 'phone', 'city', 'state', 'gst_number')
    search_fields = ('company_name', 'gst_number', 'city')

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('equipment_id', 'name', 'category', 'farm', 'serial_number', 'current_meter_hours', 'status', 'purchase_cost_inr')
    list_filter = ('status', 'category')
    search_fields = ('name', 'serial_number')

@admin.register(SparePart)
class SparePartAdmin(admin.ModelAdmin):
    list_display = ('part_id', 'part_number', 'name', 'category', 'current_stock', 'minimum_reorder_level', 'unit_price_inr', 'supplier')
    list_filter = ('category',)
    search_fields = ('part_number', 'name')

@admin.register(MaintenanceRecord)
class MaintenanceRecordAdmin(admin.ModelAdmin):
    list_display = ('maintenance_id', 'equipment', 'maintenance_type', 'title', 'scheduled_date', 'total_cost_inr', 'status', 'technician_name')
    list_filter = ('maintenance_type', 'status')
    search_fields = ('title', 'technician_name')

@admin.register(MaintenancePartsUsed)
class MaintenancePartsUsedAdmin(admin.ModelAdmin):
    list_display = ('usage_id', 'maintenance', 'part', 'quantity_used', 'total_cost_inr')

@admin.register(EquipmentUtilizationLog)
class EquipmentUtilizationLogAdmin(admin.ModelAdmin):
    list_display = ('log_id', 'equipment', 'operator', 'log_date', 'operating_hours', 'idle_hours', 'fuel_consumed_litres', 'work_area_acres')
    list_filter = ('log_date',)

@admin.register(SparePartOrder)
class SparePartOrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'supplier', 'part', 'order_date', 'quantity', 'total_amount_inr', 'delivery_status')
    list_filter = ('delivery_status',)
