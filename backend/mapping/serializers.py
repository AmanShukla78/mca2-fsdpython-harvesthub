from rest_framework import serializers
from .models import Farm, Field
from core.serializers import UserSerializer

class FarmSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    fields_count = serializers.IntegerField(source='fields.count', read_only=True)

    class Meta:
        model = Farm
        fields = ['farm_id', 'farm_name', 'owner', 'owner_name', 'total_acres', 'location_address', 'city', 'state', 'pin_code', 'latitude', 'longitude', 'fields_count', 'created_at']


class FieldSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source='farm.farm_name', read_only=True)
    active_crop = serializers.SerializerMethodField()

    class Meta:
        model = Field
        fields = ['field_id', 'farm', 'farm_name', 'field_name', 'boundary_geojson', 'area_acres', 'soil_type', 'irrigation_source', 'status', 'active_crop', 'created_at']

    def get_active_crop(self, obj):
        active_planting = obj.plantings.filter(status__in=['Planned', 'In Progress']).first()
        if active_planting:
            return {
                'planting_id': active_planting.planting_id,
                'crop_name': active_planting.crop.crop_name,
                'season': active_planting.season,
                'current_stage': active_planting.current_stage
            }
        return None
