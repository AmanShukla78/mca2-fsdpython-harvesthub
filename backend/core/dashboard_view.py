from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count, F
from mapping.models import Farm, Field
from scheduling.models import CropPlanting, FieldOperation
from finance.models import FarmInputCost, YieldRecord
from equipment.models import Equipment, MaintenanceRecord, SparePart, EquipmentUtilizationLog

class DashboardSummaryView(APIView):
    def get(self, request):
        total_farms = Farm.objects.count()
        total_farm_acres = Farm.objects.aggregate(Sum('total_acres'))['total_acres__sum'] or 0
        
        total_fields = Field.objects.count()
        planted_fields = Field.objects.filter(status='Planted').count()
        
        active_plantings = CropPlanting.objects.filter(status__in=['Planned', 'In Progress']).count()
        harvested_plantings = CropPlanting.objects.filter(status='Harvested').count()
        
        pending_operations = FieldOperation.objects.filter(status__in=['Scheduled', 'In Progress']).count()
        completed_operations = FieldOperation.objects.filter(status='Completed').count()
        
        total_expenses = FarmInputCost.objects.aggregate(Sum('total_cost_inr'))['total_cost_inr__sum'] or 0
        total_revenue = YieldRecord.objects.aggregate(Sum('total_revenue_inr'))['total_revenue_inr__sum'] or 0
        net_profit = float(total_revenue) - float(total_expenses)
        
        total_equipment = Equipment.objects.count()
        active_equipment = Equipment.objects.filter(status='Active').count()
        maintenance_equipment = Equipment.objects.filter(status='In Maintenance').count()
        
        utilization_aggs = EquipmentUtilizationLog.objects.aggregate(
            total_hours=Sum('operating_hours'),
            total_fuel=Sum('fuel_consumed_litres')
        )
        total_fleet_hours = utilization_aggs['total_hours'] or 0
        total_fuel_litres = utilization_aggs['total_fuel'] or 0
        
        low_stock_parts = SparePart.objects.filter(current_stock__lte=F('minimum_reorder_level')).count()
        pending_maintenance = MaintenanceRecord.objects.filter(status__in=['Scheduled', 'In Progress']).count()
        
        # Recent operations
        recent_operations = list(FieldOperation.objects.select_related('planting__crop', 'planting__field').order_by('-scheduled_date')[:5].values(
            'operation_id', 'operation_type', 'scheduled_date', 'status',
            'planting__crop__crop_name', 'planting__field__field_name'
        ))

        # Recent alerts
        alerts = []
        if low_stock_parts > 0:
            alerts.append({
                'type': 'warning',
                'title': 'Low Spare Parts Inventory',
                'message': f'{low_stock_parts} spare parts are at or below reorder threshold.'
            })
        if maintenance_equipment > 0:
            alerts.append({
                'type': 'info',
                'title': 'Machinery Under Maintenance',
                'message': f'{maintenance_equipment} equipment units undergoing service/repair.'
            })
        if pending_operations > 0:
            alerts.append({
                'type': 'primary',
                'title': 'Active Farm Tasks',
                'message': f'{pending_operations} seasonal field operations scheduled or in progress.'
            })

        return Response({
            'kpis': {
                'total_farms': total_farms,
                'total_acres': float(total_farm_acres),
                'total_fields': total_fields,
                'planted_fields': planted_fields,
                'active_plantings': active_plantings,
                'harvested_plantings': harvested_plantings,
                'pending_operations': pending_operations,
                'completed_operations': completed_operations,
                'total_expenses_inr': float(total_expenses),
                'total_revenue_inr': float(total_revenue),
                'net_profit_inr': round(net_profit, 2),
                'profit_margin_pct': round((net_profit / float(total_revenue) * 100), 2) if float(total_revenue) > 0 else 0.0,
                'total_equipment': total_equipment,
                'active_equipment': active_equipment,
                'maintenance_equipment': maintenance_equipment,
                'total_fleet_hours': float(total_fleet_hours),
                'total_fuel_litres': float(total_fuel_litres),
                'low_stock_parts': low_stock_parts,
                'pending_maintenance': pending_maintenance,
            },
            'recent_operations': recent_operations,
            'alerts': alerts
        })
