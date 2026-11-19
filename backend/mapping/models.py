from django.db import models
from django.conf import settings

class Farm(models.Model):
    farm_id = models.AutoField(primary_key=True)
    farm_name = models.CharField(max_length=120)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='farms')
    total_acres = models.DecimalField(max_digits=10, decimal_places=2)
    location_address = models.CharField(max_length=255)
    city = models.CharField(max_length=60)
    state = models.CharField(max_length=60)
    pin_code = models.CharField(max_length=10)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'farms'
        ordering = ['farm_id']

    def __str__(self):
        return f"{self.farm_name} ({self.city}, {self.state})"


class Field(models.Model):
    SOIL_CHOICES = [
        ('Black Cotton', 'Black Cotton'),
        ('Alluvial', 'Alluvial'),
        ('Red Soil', 'Red Soil'),
        ('Laterite', 'Laterite'),
        ('Clay Loam', 'Clay Loam'),
        ('Sandy Loam', 'Sandy Loam'),
    ]

    IRRIGATION_CHOICES = [
        ('Borewell', 'Borewell'),
        ('Canal', 'Canal'),
        ('Drip Irrigation', 'Drip Irrigation'),
        ('Rainfed', 'Rainfed'),
        ('Sprinkler', 'Sprinkler'),
        ('River Lift', 'River Lift'),
    ]

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Fallow', 'Fallow'),
        ('Under Preparation', 'Under Preparation'),
        ('Planted', 'Planted'),
        ('Harvested', 'Harvested'),
    ]

    field_id = models.AutoField(primary_key=True)
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='fields')
    field_name = models.CharField(max_length=80)
    boundary_geojson = models.JSONField(null=True, blank=True)
    area_acres = models.DecimalField(max_digits=8, decimal_places=2)
    soil_type = models.CharField(max_length=50, choices=SOIL_CHOICES, default='Alluvial')
    irrigation_source = models.CharField(max_length=50, choices=IRRIGATION_CHOICES, default='Borewell')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'fields'
        ordering = ['field_id']

    def __str__(self):
        return f"{self.field_name} - {self.farm.farm_name} ({self.area_acres} Acres)"
