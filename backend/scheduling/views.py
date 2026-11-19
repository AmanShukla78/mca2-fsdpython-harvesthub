from rest_framework import viewsets
from .models import CropType, CropPlanting, FieldOperation
from .serializers import CropTypeSerializer, CropPlantingSerializer, FieldOperationSerializer

class CropTypeViewSet(viewsets.ModelViewSet):
    queryset = CropType.objects.all()
    serializer_class = CropTypeSerializer


class CropPlantingViewSet(viewsets.ModelViewSet):
    queryset = CropPlanting.objects.all().select_related('field', 'field__farm', 'crop').prefetch_related('operations', 'input_costs')
    serializer_class = CropPlantingSerializer


class FieldOperationViewSet(viewsets.ModelViewSet):
    queryset = FieldOperation.objects.all().select_related('planting', 'planting__crop', 'planting__field', 'assigned_to', 'equipment')
    serializer_class = FieldOperationSerializer
