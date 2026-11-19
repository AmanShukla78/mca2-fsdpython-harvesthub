from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count, F
from .models import FarmInputCost, YieldRecord
from .serializers import FarmInputCostSerializer, YieldRecordSerializer

class FarmInputCostViewSet(viewsets.ModelViewSet):
    queryset = FarmInputCost.objects.all().select_related('planting', 'planting__crop', 'planting__field', 'supplier', 'recorded_by')
    serializer_class = FarmInputCostSerializer


class YieldRecordViewSet(viewsets.ModelViewSet):
    queryset = YieldRecord.objects.all().select_related('planting', 'planting__crop', 'planting__field', 'planting__field__farm')
    serializer_class = YieldRecordSerializer


class CostBreakdownView(APIView):
    def get(self, request):
        by_category = FarmInputCost.objects.values('input_type').annotate(
            total_amount=Sum('total_cost_inr'),
            count=Count('cost_id')
        ).order_by('-total_amount')

        total_expenses = FarmInputCost.objects.aggregate(Sum('total_cost_inr'))['total_cost_inr__sum'] or 0

        return Response({
            'total_expenses_inr': float(total_expenses),
            'by_category': list(by_category)
        })


class YieldForecastingView(APIView):
    def get(self, request):
        records = YieldRecord.objects.select_related('planting__crop', 'planting__field').all()
        
        total_yield_kg = records.aggregate(Sum('net_yield_kg'))['net_yield_kg__sum'] or 0
        total_revenue_inr = records.aggregate(Sum('total_revenue_inr'))['total_revenue_inr__sum'] or 0
        avg_market_price = records.aggregate(Avg('market_price_per_kg_inr'))['market_price_per_kg_inr__avg'] or 0

        grade_breakdown = records.values('quality_grade').annotate(
            total_kg=Sum('net_yield_kg'),
            revenue=Sum('total_revenue_inr')
        ).order_by('quality_grade')

        crop_comparison = records.values('planting__crop__crop_name').annotate(
            actual_kg=Sum('net_yield_kg'),
            revenue=Sum('total_revenue_inr')
        ).order_by('-revenue')

        return Response({
            'total_yield_kg': float(total_yield_kg),
            'total_revenue_inr': float(total_revenue_inr),
            'avg_market_price_per_kg': round(float(avg_market_price), 2),
            'grade_breakdown': list(grade_breakdown),
            'crop_comparison': list(crop_comparison)
        })
