from rest_framework import serializers
from .models import CropType, CropPlanting, FieldOperation

class CropTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropType
        fields = '__all__'


class FieldOperationSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    crop_name = serializers.CharField(source='planting.crop.crop_name', read_only=True)
    field_name = serializers.CharField(source='planting.field.field_name', read_only=True)

    class Meta:
        model = FieldOperation
        fields = [
            'operation_id', 'planting', 'crop_name', 'field_name', 'operation_type',
            'scheduled_date', 'completion_date', 'status', 'assigned_to', 'assigned_to_name',
            'equipment', 'equipment_name', 'notes', 'created_at'
        ]


class CropPlantingSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.crop_name', read_only=True)
    crop_category = serializers.CharField(source='crop.crop_category', read_only=True)
    field_name = serializers.CharField(source='field.field_name', read_only=True)
    farm_name = serializers.CharField(source='field.farm.farm_name', read_only=True)
    operations_count = serializers.IntegerField(source='operations.count', read_only=True)
    total_costs = serializers.SerializerMethodField()

    class Meta:
        model = CropPlanting
        fields = [
            'planting_id', 'field', 'field_name', 'farm_name', 'crop', 'crop_name', 'crop_category',
            'season', 'sowing_date', 'expected_harvest_date', 'actual_harvest_date',
            'target_yield_kg', 'actual_yield_kg', 'current_stage', 'status', 'notes',
            'operations_count', 'total_costs', 'created_at'
        ]

    def get_total_costs(self, obj):
        from django.db.models import Sum
        total = obj.input_costs.aggregate(Sum('total_cost_inr'))['total_cost_inr__sum']
        return float(total) if total else 0.0
