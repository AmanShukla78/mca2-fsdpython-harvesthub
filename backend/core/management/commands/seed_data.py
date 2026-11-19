import os
import csv
import json
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth import get_user_model
from core.models import Role
from mapping.models import Farm, Field
from scheduling.models import CropType, CropPlanting, FieldOperation
from finance.models import FarmInputCost, YieldRecord
from equipment.models import (
    EquipmentCategory, Equipment, Supplier, SparePart,
    MaintenanceRecord, MaintenancePartsUsed,
    EquipmentUtilizationLog, SparePartOrder
)

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds HarvestHub database with realistic agricultural sample data and test edge cases'

    def handle(self, *args, **options):
        csv_dir = os.path.join(settings.BASE_DIR.parent, 'database', 'csv_seed_data')
        self.stdout.write(self.style.NOTICE(f"Loading seed data from {csv_dir}..."))

        def read_csv(filename):
            path = os.path.join(csv_dir, filename)
            if not os.path.exists(path):
                return []
            with open(path, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                return list(reader)

        # 1. Roles
        roles_data = read_csv('roles.csv')
        for r in roles_data:
            Role.objects.update_or_create(
                role_id=int(r['role_id']),
                defaults={
                    'role_code': r['role_code'],
                    'role_name': r['role_name'],
                    'description': r['description'] or None
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(roles_data)} roles."))

        # 2. Users
        users_data = read_csv('users.csv')
        for u in users_data:
            role_obj = Role.objects.get(role_id=int(u['role_id']))
            user, created = User.objects.update_or_create(
                user_id=int(u['user_id']),
                defaults={
                    'username': u['username'],
                    'email': u['email'],
                    'first_name': u['first_name'],
                    'last_name': u['last_name'],
                    'phone_number': u['phone_number'],
                    'role': role_obj,
                    'is_active': u['is_active'] in ['1', 'True', True],
                    'is_staff': role_obj.role_code == 'ADMIN',
                    'is_superuser': role_obj.role_code == 'ADMIN'
                }
            )
            # Set default test password for all seed users
            user.set_password('HarvestHub@2026')
            user.save()
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(users_data)} users."))

        # 3. Farms
        farms_data = read_csv('farms.csv')
        for f in farms_data:
            Farm.objects.update_or_create(
                farm_id=int(f['farm_id']),
                defaults={
                    'farm_name': f['farm_name'],
                    'owner_id': int(f['owner_id']),
                    'total_acres': Decimal(f['total_acres']),
                    'location_address': f['location_address'],
                    'city': f['city'],
                    'state': f['state'],
                    'pin_code': f['pin_code'],
                    'latitude': Decimal(f['latitude']) if f['latitude'] else None,
                    'longitude': Decimal(f['longitude']) if f['longitude'] else None
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(farms_data)} farms."))

        # 4. Fields
        fields_data = read_csv('fields.csv')
        for fd in fields_data:
            geojson = None
            if fd['boundary_geojson']:
                try:
                    geojson = json.loads(fd['boundary_geojson'])
                except Exception:
                    geojson = None
            Field.objects.update_or_create(
                field_id=int(fd['field_id']),
                defaults={
                    'farm_id': int(fd['farm_id']),
                    'field_name': fd['field_name'],
                    'boundary_geojson': geojson,
                    'area_acres': Decimal(fd['area_acres']),
                    'soil_type': fd['soil_type'],
                    'irrigation_source': fd['irrigation_source'],
                    'status': fd['status']
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(fields_data)} fields."))

        # 5. Crop Types
        crops_data = read_csv('crop_types.csv')
        for c in crops_data:
            CropType.objects.update_or_create(
                crop_id=int(c['crop_id']),
                defaults={
                    'crop_name': c['crop_name'],
                    'botanical_name': c['botanical_name'] or None,
                    'crop_category': c['crop_category'],
                    'standard_growth_days': int(c['standard_growth_days']),
                    'ideal_soil_type': c['ideal_soil_type'],
                    'expected_yield_per_acre_kg': Decimal(c['expected_yield_per_acre_kg'])
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(crops_data)} crop types."))

        # 6. Equipment Categories
        eq_cats = read_csv('equipment_categories.csv')
        for ec in eq_cats:
            EquipmentCategory.objects.update_or_create(
                category_id=int(ec['category_id']),
                defaults={
                    'category_name': ec['category_name'],
                    'description': ec['description'] or None
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(eq_cats)} equipment categories."))

        # 7. Suppliers
        suppliers_data = read_csv('suppliers.csv')
        for s in suppliers_data:
            Supplier.objects.update_or_create(
                supplier_id=int(s['supplier_id']),
                defaults={
                    'company_name': s['company_name'],
                    'contact_person': s['contact_person'],
                    'phone': s['phone'],
                    'email': s['email'],
                    'address': s['address'],
                    'city': s['city'],
                    'state': s['state'],
                    'gst_number': s['gst_number']
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(suppliers_data)} suppliers."))

        # 8. Equipment Registry
        eq_data = read_csv('equipment.csv')
        for eq in eq_data:
            Equipment.objects.update_or_create(
                equipment_id=int(eq['equipment_id']),
                defaults={
                    'farm_id': int(eq['farm_id']),
                    'category_id': int(eq['category_id']),
                    'name': eq['name'],
                    'make_and_model': eq['make_and_model'],
                    'serial_number': eq['serial_number'],
                    'purchase_date': eq['purchase_date'],
                    'purchase_cost_inr': Decimal(eq['purchase_cost_inr']),
                    'current_meter_hours': Decimal(eq['current_meter_hours']),
                    'status': eq['status'],
                    'last_serviced_date': eq['last_serviced_date'] or None,
                    'next_service_due_hours': Decimal(eq['next_service_due_hours']) if eq['next_service_due_hours'] else None
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(eq_data)} equipment assets."))

        # 9. Spare Parts
        spare_data = read_csv('spare_parts.csv')
        for sp in spare_data:
            SparePart.objects.update_or_create(
                part_id=int(sp['part_id']),
                defaults={
                    'part_number': sp['part_number'],
                    'name': sp['name'],
                    'category': sp['category'],
                    'equipment_category_id': int(sp['equipment_category_id']) if sp['equipment_category_id'] else None,
                    'unit_price_inr': Decimal(sp['unit_price_inr']),
                    'current_stock': int(sp['current_stock']),
                    'minimum_reorder_level': int(sp['minimum_reorder_level']),
                    'unit_of_measure': sp['unit_of_measure'],
                    'supplier_id': int(sp['supplier_id'])
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(spare_data)} spare parts."))

        # 10. Crop Plantings
        plant_data = read_csv('crop_plantings.csv')
        for pl in plant_data:
            CropPlanting.objects.update_or_create(
                planting_id=int(pl['planting_id']),
                defaults={
                    'field_id': int(pl['field_id']),
                    'crop_id': int(pl['crop_id']),
                    'season': pl['season'],
                    'sowing_date': pl['sowing_date'],
                    'expected_harvest_date': pl['expected_harvest_date'],
                    'actual_harvest_date': pl['actual_harvest_date'] or None,
                    'target_yield_kg': Decimal(pl['target_yield_kg']),
                    'actual_yield_kg': Decimal(pl['actual_yield_kg']) if pl['actual_yield_kg'] else None,
                    'current_stage': pl['current_stage'],
                    'status': pl['status'],
                    'notes': pl['notes'] or None
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(plant_data)} crop plantings."))

        # 11. Field Operations
        op_data = read_csv('field_operations.csv')
        for op in op_data:
            FieldOperation.objects.update_or_create(
                operation_id=int(op['operation_id']),
                defaults={
                    'planting_id': int(op['planting_id']),
                    'operation_type': op['operation_type'],
                    'scheduled_date': op['scheduled_date'],
                    'completion_date': op['completion_date'] or None,
                    'status': op['status'],
                    'assigned_to_id': int(op['assigned_to_user_id']) if op['assigned_to_user_id'] else None,
                    'equipment_id': int(op['equipment_id']) if op['equipment_id'] else None,
                    'notes': op['notes'] or None
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(op_data)} field operations."))

        # 12. Farm Inputs & Costs
        cost_data = read_csv('farm_inputs_costs.csv')
        for c in cost_data:
            FarmInputCost.objects.update_or_create(
                cost_id=int(c['cost_id']),
                defaults={
                    'planting_id': int(c['planting_id']),
                    'operation_id': int(c['operation_id']) if c['operation_id'] else None,
                    'input_type': c['input_type'],
                    'item_name': c['item_name'],
                    'quantity': Decimal(c['quantity']),
                    'unit': c['unit'],
                    'unit_cost_inr': Decimal(c['unit_cost_inr']),
                    'total_cost_inr': Decimal(c['total_cost_inr']),
                    'expense_date': c['expense_date'],
                    'receipt_number': c['receipt_number'] or None,
                    'supplier_id': int(c['supplier_id']) if c['supplier_id'] else None,
                    'recorded_by_id': int(c['recorded_by_user_id'])
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(cost_data)} farm input cost records."))

        # 13. Yield Records
        yield_data = read_csv('yield_records.csv')
        for y in yield_data:
            YieldRecord.objects.update_or_create(
                yield_id=int(y['yield_id']),
                defaults={
                    'planting_id': int(y['planting_id']),
                    'harvest_date': y['harvest_date'],
                    'gross_yield_kg': Decimal(y['gross_yield_kg']),
                    'net_yield_kg': Decimal(y['net_yield_kg']),
                    'quality_grade': y['quality_grade'],
                    'market_price_per_kg_inr': Decimal(y['market_price_per_kg_inr']),
                    'total_revenue_inr': Decimal(y['total_revenue_inr']),
                    'storage_location': y['storage_location'],
                    'buyer_name': y['buyer_name']
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(yield_data)} yield records."))

        # 14. Maintenance Records
        maint_data = read_csv('maintenance_records.csv')
        for m in maint_data:
            MaintenanceRecord.objects.update_or_create(
                maintenance_id=int(m['maintenance_id']),
                defaults={
                    'equipment_id': int(m['equipment_id']),
                    'maintenance_type': m['maintenance_type'],
                    'title': m['title'],
                    'description': m['description'],
                    'scheduled_date': m['scheduled_date'],
                    'completion_date': m['completion_date'] or None,
                    'meter_hours_at_service': Decimal(m['meter_hours_at_service']),
                    'labor_cost_inr': Decimal(m['labor_cost_inr']),
                    'parts_cost_inr': Decimal(m['parts_cost_inr']),
                    'total_cost_inr': Decimal(m['total_cost_inr']),
                    'status': m['status'],
                    'technician_name': m['technician_name'],
                    'next_service_due_hours': Decimal(m['next_service_due_hours']) if m['next_service_due_hours'] else None,
                    'next_service_due_date': m['next_service_due_date'] or None
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(maint_data)} maintenance records."))

        # 15. Maintenance Parts Used
        mpu_data = read_csv('maintenance_parts_used.csv')
        for u in mpu_data:
            MaintenancePartsUsed.objects.update_or_create(
                usage_id=int(u['usage_id']),
                defaults={
                    'maintenance_id': int(u['maintenance_id']),
                    'part_id': int(u['part_id']),
                    'quantity_used': int(u['quantity_used']),
                    'unit_price_inr': Decimal(u['unit_price_inr']),
                    'total_cost_inr': Decimal(u['total_cost_inr'])
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(mpu_data)} maintenance parts used records."))

        # 16. Equipment Utilization Logs
        util_data = read_csv('equipment_utilization_logs.csv')
        for ut in util_data:
            EquipmentUtilizationLog.objects.update_or_create(
                log_id=int(ut['log_id']),
                defaults={
                    'equipment_id': int(ut['equipment_id']),
                    'operation_id': int(ut['operation_id']) if ut['operation_id'] else None,
                    'operator_id': int(ut['operator_user_id']),
                    'log_date': ut['log_date'],
                    'start_time': ut['start_time'],
                    'end_time': ut['end_time'],
                    'operating_hours': Decimal(ut['operating_hours']),
                    'idle_hours': Decimal(ut['idle_hours']),
                    'fuel_consumed_litres': Decimal(ut['fuel_consumed_litres']),
                    'work_area_acres': Decimal(ut['work_area_acres']),
                    'task_description': ut['task_description']
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(util_data)} equipment utilization logs."))

        # 17. Spare Part Orders
        spo_data = read_csv('spare_part_orders.csv')
        for spo in spo_data:
            SparePartOrder.objects.update_or_create(
                order_id=int(spo['order_id']),
                defaults={
                    'supplier_id': int(spo['supplier_id']),
                    'part_id': int(spo['part_id']),
                    'order_date': spo['order_date'],
                    'quantity': int(spo['quantity']),
                    'unit_price_inr': Decimal(spo['unit_price_inr']),
                    'total_amount_inr': Decimal(spo['total_amount_inr']),
                    'delivery_status': spo['delivery_status'],
                    'received_date': spo['received_date'] or None
                }
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(spo_data)} spare part orders."))

        self.stdout.write(self.style.SUCCESS("All master and transaction seed data successfully imported into HarvestHub!"))
