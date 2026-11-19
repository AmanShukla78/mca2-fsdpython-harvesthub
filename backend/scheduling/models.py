from django.db import models
from django.conf import settings

class CropType(models.Model):
    CATEGORY_CHOICES = [
        ('Kharif', 'Kharif'),
        ('Rabi', 'Rabi'),
        ('Zaid', 'Zaid'),
        ('Cash Crop', 'Cash Crop'),
        ('Horticulture', 'Horticulture'),
    ]

    crop_id = models.AutoField(primary_key=True)
    crop_name = models.CharField(max_length=80, unique=True)
    botanical_name = models.CharField(max_length=120, null=True, blank=True)
    crop_category = models.CharField(max_length=40, choices=CATEGORY_CHOICES)
    standard_growth_days = models.IntegerField()
    ideal_soil_type = models.CharField(max_length=100)
    expected_yield_per_acre_kg = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'crop_types'
        ordering = ['crop_id']

    def __str__(self):
        return f"{self.crop_name} ({self.crop_category})"


class CropPlanting(models.Model):
    STAGE_CHOICES = [
        ('Land Preparation', 'Land Preparation'),
        ('Sowing', 'Sowing'),
        ('Vegetative', 'Vegetative'),
        ('Flowering', 'Flowering'),
        ('Maturity', 'Maturity'),
        ('Harvesting', 'Harvesting'),
        ('Completed', 'Completed'),
        ('Terminated', 'Terminated'),
    ]

    STATUS_CHOICES = [
        ('Planned', 'Planned'),
        ('In Progress', 'In Progress'),
        ('Harvested', 'Harvested'),
        ('Archived', 'Archived'),
    ]

    planting_id = models.AutoField(primary_key=True)
    field = models.ForeignKey('mapping.Field', on_delete=models.RESTRICT, related_name='plantings')
    crop = models.ForeignKey(CropType, on_delete=models.RESTRICT, related_name='plantings')
    season = models.CharField(max_length=30)
    sowing_date = models.DateField()
    expected_harvest_date = models.DateField()
    actual_harvest_date = models.DateField(null=True, blank=True)
    target_yield_kg = models.DecimalField(max_digits=12, decimal_places=2)
    actual_yield_kg = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    current_stage = models.CharField(max_length=40, choices=STAGE_CHOICES, default='Land Preparation')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Planned')
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'crop_plantings'
        ordering = ['-sowing_date']

    def __str__(self):
        return f"{self.crop.crop_name} @ {self.field.field_name} ({self.season})"


class FieldOperation(models.Model):
    OPERATION_CHOICES = [
        ('Ploughing', 'Ploughing'),
        ('Harrowing', 'Harrowing'),
        ('Sowing', 'Sowing'),
        ('Fertilizer Application', 'Fertilizer Application'),
        ('Pesticide Spray', 'Pesticide Spray'),
        ('Weeding', 'Weeding'),
        ('Irrigation', 'Irrigation'),
        ('Harvesting', 'Harvesting'),
        ('Post-Harvest Baling', 'Post-Harvest Baling'),
    ]

    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
        ('Delayed', 'Delayed'),
    ]

    operation_id = models.AutoField(primary_key=True)
    planting = models.ForeignKey(CropPlanting, on_delete=models.CASCADE, related_name='operations')
    operation_type = models.CharField(max_length=40, choices=OPERATION_CHOICES)
    scheduled_date = models.DateField()
    completion_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Scheduled')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_operations')
    equipment = models.ForeignKey('equipment.Equipment', on_delete=models.SET_NULL, null=True, blank=True, related_name='operations')
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'field_operations'
        ordering = ['-scheduled_date']

    def __str__(self):
        return f"{self.operation_type} - {self.planting.crop.crop_name} on {self.scheduled_date} ({self.status})"
