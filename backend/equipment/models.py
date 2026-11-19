from django.db import models
from django.conf import settings

class EquipmentCategory(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=80, unique=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'equipment_categories'
        ordering = ['category_id']

    def __str__(self):
        return self.category_name


class Supplier(models.Model):
    supplier_id = models.AutoField(primary_key=True)
    company_name = models.CharField(max_length=120)
    contact_person = models.CharField(max_length=80)
    phone = models.CharField(max_length=25)
    email = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=60)
    state = models.CharField(max_length=60)
    gst_number = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'suppliers'
        ordering = ['supplier_id']

    def __str__(self):
        return f"{self.company_name} ({self.city})"


class Equipment(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('In Maintenance', 'In Maintenance'),
        ('Idle', 'Idle'),
        ('Decommissioned', 'Decommissioned'),
    ]

    equipment_id = models.AutoField(primary_key=True)
    farm = models.ForeignKey('mapping.Farm', on_delete=models.CASCADE, related_name='equipment_fleet')
    category = models.ForeignKey(EquipmentCategory, on_delete=models.RESTRICT, related_name='equipment_items')
    name = models.CharField(max_length=100)
    make_and_model = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=80, unique=True)
    purchase_date = models.DateField()
    purchase_cost_inr = models.DecimalField(max_digits=12, decimal_places=2)
    current_meter_hours = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Active')
    last_serviced_date = models.DateField(null=True, blank=True)
    next_service_due_hours = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'equipment'
        ordering = ['equipment_id']

    def __str__(self):
        return f"{self.name} ({self.serial_number})"


class SparePart(models.Model):
    part_id = models.AutoField(primary_key=True)
    part_number = models.CharField(max_length=60, unique=True)
    name = models.CharField(max_length=120)
    category = models.CharField(max_length=60)
    equipment_category = models.ForeignKey(EquipmentCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='spare_parts')
    unit_price_inr = models.DecimalField(max_digits=10, decimal_places=2)
    current_stock = models.IntegerField(default=0)
    minimum_reorder_level = models.IntegerField(default=5)
    unit_of_measure = models.CharField(max_length=20, default='Units')
    supplier = models.ForeignKey(Supplier, on_delete=models.RESTRICT, related_name='supplied_parts')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'spare_parts'
        ordering = ['part_id']

    def __str__(self):
        return f"{self.part_number} - {self.name} (Stock: {self.current_stock})"


class MaintenanceRecord(models.Model):
    TYPE_CHOICES = [
        ('Preventive Service', 'Preventive Service'),
        ('Breakdown Repair', 'Breakdown Repair'),
        ('Overhaul', 'Overhaul'),
        ('Inspection', 'Inspection'),
    ]

    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Deferred', 'Deferred'),
    ]

    maintenance_id = models.AutoField(primary_key=True)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='maintenance_records')
    maintenance_type = models.CharField(max_length=40, choices=TYPE_CHOICES, default='Preventive Service')
    title = models.CharField(max_length=140)
    description = models.TextField()
    scheduled_date = models.DateField()
    completion_date = models.DateField(null=True, blank=True)
    meter_hours_at_service = models.DecimalField(max_digits=10, decimal_places=2)
    labor_cost_inr = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    parts_cost_inr = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_cost_inr = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Scheduled')
    technician_name = models.CharField(max_length=100)
    next_service_due_hours = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    next_service_due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'maintenance_records'
        ordering = ['-scheduled_date']

    def __str__(self):
        return f"{self.title} - {self.equipment.name} ({self.status})"


class MaintenancePartsUsed(models.Model):
    usage_id = models.AutoField(primary_key=True)
    maintenance = models.ForeignKey(MaintenanceRecord, on_delete=models.CASCADE, related_name='parts_used')
    part = models.ForeignKey(SparePart, on_delete=models.RESTRICT, related_name='usage_instances')
    quantity_used = models.IntegerField()
    unit_price_inr = models.DecimalField(max_digits=10, decimal_places=2)
    total_cost_inr = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'maintenance_parts_used'
        ordering = ['usage_id']


class EquipmentUtilizationLog(models.Model):
    log_id = models.AutoField(primary_key=True)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='utilization_logs')
    operation = models.ForeignKey('scheduling.FieldOperation', on_delete=models.SET_NULL, null=True, blank=True, related_name='equipment_logs')
    operator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, related_name='operated_logs')
    log_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    operating_hours = models.DecimalField(max_digits=6, decimal_places=2)
    idle_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    fuel_consumed_litres = models.DecimalField(max_digits=8, decimal_places=2)
    work_area_acres = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    task_description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'equipment_utilization_logs'
        ordering = ['-log_date']


class SparePartOrder(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    order_id = models.AutoField(primary_key=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.RESTRICT, related_name='spare_orders')
    part = models.ForeignKey(SparePart, on_delete=models.RESTRICT, related_name='orders')
    order_date = models.DateField()
    quantity = models.IntegerField()
    unit_price_inr = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount_inr = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Pending')
    received_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'spare_part_orders'
        ordering = ['-order_date']
