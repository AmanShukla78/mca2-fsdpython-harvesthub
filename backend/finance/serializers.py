from rest_framework import serializers
from .models import FarmInputCost, YieldRecord

class FarmInputCostSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='planting.crop.crop_name', read_only=True)
    field_name = serializers.CharField(source='planting.field.field_name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.company_name', read_only=True)
    recorded_by_name = serializers.CharField(source='recorded_by.get_full_name', read_only=True)

    class Meta:
        model = FarmInputCost
        fields = [
            'cost_id', 'planting', 'crop_name', 'field_name', 'operation', 'input_type',
            'item_name', 'quantity', 'unit', 'unit_cost_inr', 'total_cost_inr',
            'expense_date', 'receipt_number', 'supplier', 'supplier_name',
            'recorded_by', 'recorded_by_name', 'created_at'
        ]


class YieldRecordSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='planting.crop.crop_name', read_only=True)
    field_name = serializers.CharField(source='planting.field.field_name', read_only=True)
    farm_name = serializers.CharField(source='planting.field.farm.farm_name', read_only=True)
    target_yield_kg = serializers.DecimalField(source='planting.target_yield_kg', max_digits=12, decimal_places=2, read_only=True)
    season = serializers.CharField(source='planting.season', read_only=True)

    class Meta:
        model = YieldRecord
        fields = [
            'yield_id', 'planting', 'crop_name', 'field_name', 'farm_name', 'season',
            'target_yield_kg', 'harvest_date', 'gross_yield_kg', 'net_yield_kg',
            'quality_grade', 'market_price_per_kg_inr', 'total_revenue_inr',
            'storage_location', 'buyer_name', 'created_at'
        ]
