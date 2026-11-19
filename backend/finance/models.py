from django.db import models
from django.conf import settings

class FarmInputCost(models.Model):
    INPUT_CHOICES = [
        ('Seed', 'Seed'),
        ('Fertilizer', 'Fertilizer'),
        ('Pesticide', 'Pesticide'),
        ('Fuel', 'Fuel'),
        ('Labor', 'Labor'),
        ('Water/Irrigation', 'Water/Irrigation'),
        ('Machinery Rental', 'Machinery Rental'),
        ('Other', 'Other'),
    ]

    cost_id = models.AutoField(primary_key=True)
    planting = models.ForeignKey('scheduling.CropPlanting', on_delete=models.CASCADE, related_name='input_costs')
    operation = models.ForeignKey('scheduling.FieldOperation', on_delete=models.SET_NULL, null=True, blank=True, related_name='costs')
    input_type = models.CharField(max_length=40, choices=INPUT_CHOICES)
    item_name = models.CharField(max_length=100)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=30)
    unit_cost_inr = models.DecimalField(max_digits=10, decimal_places=2)
    total_cost_inr = models.DecimalField(max_digits=12, decimal_places=2)
    expense_date = models.DateField()
    receipt_number = models.CharField(max_length=60, null=True, blank=True)
    supplier = models.ForeignKey('equipment.Supplier', on_delete=models.SET_NULL, null=True, blank=True, related_name='input_sales')
    recorded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, related_name='recorded_expenses')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'farm_inputs_costs'
        ordering = ['-expense_date']

    def __str__(self):
        return f"{self.item_name} (₹{self.total_cost_inr}) - {self.planting.crop.crop_name}"


class YieldRecord(models.Model):
    GRADE_CHOICES = [
        ('Grade A (Export/Premium)', 'Grade A (Export/Premium)'),
        ('Grade B (Standard Market)', 'Grade B (Standard Market)'),
        ('Grade C (Processing/Fair)', 'Grade C (Processing/Fair)'),
    ]

    yield_id = models.AutoField(primary_key=True)
    planting = models.ForeignKey('scheduling.CropPlanting', on_delete=models.CASCADE, related_name='yield_records')
    harvest_date = models.DateField()
    gross_yield_kg = models.DecimalField(max_digits=12, decimal_places=2)
    net_yield_kg = models.DecimalField(max_digits=12, decimal_places=2)
    quality_grade = models.CharField(max_length=50, choices=GRADE_CHOICES)
    market_price_per_kg_inr = models.DecimalField(max_digits=8, decimal_places=2)
    total_revenue_inr = models.DecimalField(max_digits=14, decimal_places=2)
    storage_location = models.CharField(max_length=120)
    buyer_name = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'yield_records'
        ordering = ['-harvest_date']

    def __str__(self):
        return f"Yield #{self.yield_id}: {self.net_yield_kg}kg @ ₹{self.market_price_per_kg_inr}/kg (₹{self.total_revenue_inr})"
