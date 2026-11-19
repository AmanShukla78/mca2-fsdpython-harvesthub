from rest_framework import viewsets
from .models import Farm, Field
from .serializers import FarmSerializer, FieldSerializer

class FarmViewSet(viewsets.ModelViewSet):
    queryset = Farm.objects.all().select_related('owner')
    serializer_class = FarmSerializer


class FieldViewSet(viewsets.ModelViewSet):
    queryset = Field.objects.all().select_related('farm').prefetch_related('plantings__crop')
    serializer_class = FieldSerializer
    filterset_fields = ['farm', 'status', 'soil_type']
