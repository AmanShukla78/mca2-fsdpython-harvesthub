from django.contrib import admin
from .models import FarmInputCost, YieldRecord

@admin.register(FarmInputCost)
class FarmInputCostAdmin(admin.ModelAdmin):
    list_display = ('cost_id', 'input_type', 'item_name', 'quantity', 'unit', 'unit_cost_inr', 'total_cost_inr', 'expense_date', 'planting')
    list_filter = ('input_type', 'expense_date')
    search_fields = ('item_name', 'receipt_number')

@admin.register(YieldRecord)
class YieldRecordAdmin(admin.ModelAdmin):
    list_display = ('yield_id', 'planting', 'harvest_date', 'gross_yield_kg', 'net_yield_kg', 'quality_grade', 'market_price_per_kg_inr', 'total_revenue_inr', 'buyer_name')
    list_filter = ('quality_grade', 'harvest_date')
    search_fields = ('buyer_name', 'storage_location')
