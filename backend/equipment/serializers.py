from rest_framework import serializers
from .models import (
    EquipmentCategory, Equipment, Supplier, SparePart,
    MaintenanceRecord, MaintenancePartsUsed,
    EquipmentUtilizationLog, SparePartOrder
)

class EquipmentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentCategory
        fields = '__all__'


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'


class SparePartSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.company_name', read_only=True)
    category_name = serializers.CharField(source='equipment_category.category_name', read_only=True)
    is_low_stock = serializers.SerializerMethodField()

    class Meta:
        model = SparePart
        fields = [
            'part_id', 'part_number', 'name', 'category', 'equipment_category', 'category_name',
            'unit_price_inr', 'current_stock', 'minimum_reorder_level', 'unit_of_measure',
            'supplier', 'supplier_name', 'is_low_stock', 'created_at'
        ]

    def get_is_low_stock(self, obj):
        return obj.current_stock <= obj.minimum_reorder_level


class EquipmentSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source='farm.farm_name', read_only=True)
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    total_maintenance_cost = serializers.SerializerMethodField()

    class Meta:
        model = Equipment
        fields = [
            'equipment_id', 'farm', 'farm_name', 'category', 'category_name',
            'name', 'make_and_model', 'serial_number', 'purchase_date',
            'purchase_cost_inr', 'current_meter_hours', 'status',
            'last_serviced_date', 'next_service_due_hours', 'total_maintenance_cost',
            'created_at'
        ]

    def get_total_maintenance_cost(self, obj):
        from django.db.models import Sum
        val = obj.maintenance_records.aggregate(Sum('total_cost_inr'))['total_cost_inr__sum']
        return float(val) if val else 0.0


class MaintenancePartsUsedSerializer(serializers.ModelSerializer):
    part_name = serializers.CharField(source='part.name', read_only=True)
    part_number = serializers.CharField(source='part.part_number', read_only=True)

    class Meta:
        model = MaintenancePartsUsed
        fields = ['usage_id', 'maintenance', 'part', 'part_name', 'part_number', 'quantity_used', 'unit_price_inr', 'total_cost_inr']


class MaintenanceRecordSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    parts_used = MaintenancePartsUsedSerializer(many=True, read_only=True)

    class Meta:
        model = MaintenanceRecord
        fields = [
            'maintenance_id', 'equipment', 'equipment_name', 'maintenance_type', 'title',
            'description', 'scheduled_date', 'completion_date', 'meter_hours_at_service',
            'labor_cost_inr', 'parts_cost_inr', 'total_cost_inr', 'status',
            'technician_name', 'next_service_due_hours', 'next_service_due_date',
            'parts_used', 'created_at'
        ]


class EquipmentUtilizationLogSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    operator_name = serializers.CharField(source='operator.get_full_name', read_only=True)
    fuel_efficiency_litres_per_hour = serializers.SerializerMethodField()

    class Meta:
        model = EquipmentUtilizationLog
        fields = [
            'log_id', 'equipment', 'equipment_name', 'operation', 'operator',
            'operator_name', 'log_date', 'start_time', 'end_time',
            'operating_hours', 'idle_hours', 'fuel_consumed_litres',
            'work_area_acres', 'fuel_efficiency_litres_per_hour', 'task_description', 'created_at'
        ]

    def get_fuel_efficiency_litres_per_hour(self, obj):
        if obj.operating_hours and float(obj.operating_hours) > 0:
            return round(float(obj.fuel_consumed_litres) / float(obj.operating_hours), 2)
        return 0.0


class SparePartOrderSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.company_name', read_only=True)
    part_name = serializers.CharField(source='part.name', read_only=True)
    part_number = serializers.CharField(source='part.part_number', read_only=True)

    class Meta:
        model = SparePartOrder
        fields = [
            'order_id', 'supplier', 'supplier_name', 'part', 'part_name',
            'part_number', 'order_date', 'quantity', 'unit_price_inr',
            'total_amount_inr', 'delivery_status', 'received_date', 'created_at'
        ]
