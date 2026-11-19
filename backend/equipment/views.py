from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import models
from django.db.models import Sum, Avg, Count, F
from .models import (
    EquipmentCategory, Equipment, Supplier, SparePart,
    MaintenanceRecord, MaintenancePartsUsed,
    EquipmentUtilizationLog, SparePartOrder
)
from .serializers import (
    EquipmentCategorySerializer, EquipmentSerializer,
    SupplierSerializer, SparePartSerializer,
    MaintenanceRecordSerializer, MaintenancePartsUsedSerializer,
    EquipmentUtilizationLogSerializer, SparePartOrderSerializer
)

class EquipmentCategoryViewSet(viewsets.ModelViewSet):
    queryset = EquipmentCategory.objects.all()
    serializer_class = EquipmentCategorySerializer


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class SparePartViewSet(viewsets.ModelViewSet):
    queryset = SparePart.objects.all().select_related('supplier', 'equipment_category')
    serializer_class = SparePartSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all().select_related('farm', 'category').prefetch_related('maintenance_records')
    serializer_class = EquipmentSerializer


class MaintenanceRecordViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRecord.objects.all().select_related('equipment').prefetch_related('parts_used__part')
    serializer_class = MaintenanceRecordSerializer


class MaintenancePartsUsedViewSet(viewsets.ModelViewSet):
    queryset = MaintenancePartsUsed.objects.all().select_related('maintenance', 'part')
    serializer_class = MaintenancePartsUsedSerializer


class EquipmentUtilizationLogViewSet(viewsets.ModelViewSet):
    queryset = EquipmentUtilizationLog.objects.all().select_related('equipment', 'operator', 'operation')
    serializer_class = EquipmentUtilizationLogSerializer


class SparePartOrderViewSet(viewsets.ModelViewSet):
    queryset = SparePartOrder.objects.all().select_related('supplier', 'part')
    serializer_class = SparePartOrderSerializer


class FleetAnalyticsView(APIView):
    def get(self, request):
        total_machines = Equipment.objects.count()
        active_machines = Equipment.objects.filter(status='Active').count()
        maintenance_machines = Equipment.objects.filter(status='In Maintenance').count()
        idle_machines = Equipment.objects.filter(status='Idle').count()

        utilization_aggs = EquipmentUtilizationLog.objects.aggregate(
            total_op_hours=Sum('operating_hours'),
            total_idle_hours=Sum('idle_hours'),
            total_fuel_litres=Sum('fuel_consumed_litres'),
            total_work_acres=Sum('work_area_acres')
        )

        op_hours = float(utilization_aggs['total_op_hours'] or 0)
        idle_hours = float(utilization_aggs['total_idle_hours'] or 0)
        fuel_litres = float(utilization_aggs['total_fuel_litres'] or 0)
        acres = float(utilization_aggs['total_work_acres'] or 0)

        total_hours = op_hours + idle_hours
        utilization_rate = round((op_hours / total_hours * 100), 2) if total_hours > 0 else 0.0
        fuel_efficiency = round((fuel_litres / op_hours), 2) if op_hours > 0 else 0.0

        low_stock_parts_count = SparePart.objects.filter(current_stock__lte=models.F('minimum_reorder_level')).count() if hasattr(models, 'F') else 0

        # Machine utilization ranking
        machine_ranking = EquipmentUtilizationLog.objects.values('equipment__name').annotate(
            hours=Sum('operating_hours'),
            fuel=Sum('fuel_consumed_litres')
        ).order_by('-hours')[:6]

        return Response({
            'total_machines': total_machines,
            'active_machines': active_machines,
            'maintenance_machines': maintenance_machines,
            'idle_machines': idle_machines,
            'total_operating_hours': op_hours,
            'total_idle_hours': idle_hours,
            'total_fuel_consumed_litres': fuel_litres,
            'total_acres_worked': acres,
            'fleet_utilization_rate_pct': utilization_rate,
            'avg_fuel_consumption_litres_per_hr': fuel_efficiency,
            'machine_ranking': list(machine_ranking)
        })
