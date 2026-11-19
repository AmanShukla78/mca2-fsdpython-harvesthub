from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from core.models import Role, User
from mapping.models import Farm, Field
from scheduling.models import CropType, CropPlanting, FieldOperation
from finance.models import FarmInputCost, YieldRecord
from equipment.models import Equipment, SparePart, MaintenanceRecord

class HarvestHubAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create test role & user
        self.role = Role.objects.create(role_code='FARM_MANAGER', role_name='Farm Manager')
        self.user = User.objects.create_user(
            username='test_manager',
            email='manager@testfarm.in',
            password='TestPassword123!',
            first_name='Test',
            last_name='Manager',
            role=self.role
        )
        self.farm = Farm.objects.create(
            farm_name='Test Agri Estate',
            owner=self.user,
            total_acres=100.0,
            location_address='Plot 1, Test Highway',
            city='Pune',
            state='Maharashtra',
            pin_code='411001'
        )
        self.field = Field.objects.create(
            farm=self.farm,
            field_name='Test Parcel A',
            area_acres=25.0,
            soil_type='Black Cotton',
            irrigation_source='Drip Irrigation',
            status='Active'
        )
        self.crop = CropType.objects.create(
            crop_name='Test Cotton',
            crop_category='Kharif',
            standard_growth_days=150,
            ideal_soil_type='Black Cotton',
            expected_yield_per_acre_kg=1200.0
        )
        self.planting = CropPlanting.objects.create(
            field=self.field,
            crop=self.crop,
            season='Kharif 2025',
            sowing_date='2025-06-15',
            expected_harvest_date='2025-11-15',
            target_yield_kg=30000.0,
            current_stage='Vegetative',
            status='In Progress'
        )

    def test_dashboard_summary_kpis(self):
        """Assures dashboard summary returns valid KPIs"""
        response = self.client.get(reverse('api-dashboard-summary'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn('kpis', data)
        self.assertEqual(data['kpis']['total_farms'], 1)
        self.assertEqual(data['kpis']['total_fields'], 1)
        self.assertEqual(data['kpis']['active_plantings'], 1)

    def test_field_listing_and_filtering(self):
        """Tests field mapping API endpoint"""
        response = self.client.get(reverse('fields-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Handle paginated or non-paginated response
        results = response.data['results'] if 'results' in response.data else response.data
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0]['field_name'], 'Test Parcel A')

    def test_crop_planting_creation(self):
        """Tests scheduling a new crop planting"""
        payload = {
            'field': self.field.field_id,
            'crop': self.crop.crop_id,
            'season': 'Rabi 2025-26',
            'sowing_date': '2025-11-01',
            'expected_harvest_date': '2026-03-15',
            'target_yield_kg': 28000.0,
            'current_stage': 'Land Preparation',
            'status': 'Planned'
        }
        response = self.client.post(reverse('crop-plantings-list'), payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CropPlanting.objects.count(), 2)

    def test_cost_breakdown_endpoint(self):
        """Tests cost analytics endpoint"""
        FarmInputCost.objects.create(
            planting=self.planting,
            input_type='Fertilizer',
            item_name='Urea Neem Coated',
            quantity=10,
            unit='Bags',
            unit_cost_inr=266.50,
            total_cost_inr=2665.00,
            expense_date='2025-07-01',
            recorded_by=self.user
        )
        response = self.client.get(reverse('api-costs-by-category'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(response.data['total_expenses_inr'], 2665.00)

    def test_yield_forecasting_endpoint(self):
        """Tests yield and harvest analytics"""
        YieldRecord.objects.create(
            planting=self.planting,
            harvest_date='2025-11-20',
            gross_yield_kg=29500.0,
            net_yield_kg=28800.0,
            quality_grade='Grade A (Export/Premium)',
            market_price_per_kg_inr=65.00,
            total_revenue_inr=1872000.00,
            storage_location='Central Silo 1',
            buyer_name='Agri Corp Direct'
        )
        response = self.client.get(reverse('api-yield-forecast'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_yield_kg'], 28800.0)
        self.assertEqual(response.data['total_revenue_inr'], 1872000.00)
