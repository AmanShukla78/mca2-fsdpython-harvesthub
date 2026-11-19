from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views import RoleViewSet, UserViewSet, LoginView, CurrentUserView
from core.dashboard_view import DashboardSummaryView
from mapping.views import FarmViewSet, FieldViewSet
from scheduling.views import CropTypeViewSet, CropPlantingViewSet, FieldOperationViewSet
from finance.views import FarmInputCostViewSet, YieldRecordViewSet, CostBreakdownView, YieldForecastingView
from equipment.views import (
    EquipmentCategoryViewSet, SupplierViewSet, SparePartViewSet,
    EquipmentViewSet, MaintenanceRecordViewSet, MaintenancePartsUsedViewSet,
    EquipmentUtilizationLogViewSet, SparePartOrderViewSet, FleetAnalyticsView
)

router = DefaultRouter()

# Core
router.register(r'roles', RoleViewSet, basename='roles')
router.register(r'users', UserViewSet, basename='users')

# Module 1: Field and Crop Mapping
router.register(r'farms', FarmViewSet, basename='farms')
router.register(r'fields', FieldViewSet, basename='fields')

# Module 2: Planting and Harvesting Scheduling
router.register(r'crop-types', CropTypeViewSet, basename='crop-types')
router.register(r'crop-plantings', CropPlantingViewSet, basename='crop-plantings')
router.register(r'field-operations', FieldOperationViewSet, basename='field-operations')

# Module 3 & 4: Input Costs and Yield Analysis
router.register(r'farm-inputs-costs', FarmInputCostViewSet, basename='farm-inputs-costs')
router.register(r'yield-records', YieldRecordViewSet, basename='yield-records')

# Module 5, 6, 7 & 8: Fleet, Maintenance, Utilization, Spares
router.register(r'equipment-categories', EquipmentCategoryViewSet, basename='equipment-categories')
router.register(r'suppliers', SupplierViewSet, basename='suppliers')
router.register(r'spare-parts', SparePartViewSet, basename='spare-parts')
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'maintenance-records', MaintenanceRecordViewSet, basename='maintenance-records')
router.register(r'maintenance-parts-used', MaintenancePartsUsedViewSet, basename='maintenance-parts-used')
router.register(r'equipment-utilization-logs', EquipmentUtilizationLogViewSet, basename='equipment-utilization-logs')
router.register(r'spare-part-orders', SparePartOrderViewSet, basename='spare-part-orders')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth endpoints
    path('api/auth/login/', LoginView.as_view(), name='api-login'),
    path('api/auth/me/', CurrentUserView.as_view(), name='api-current-user'),
    
    # Analytics & Summary endpoints
    path('api/dashboard-summary/', DashboardSummaryView.as_view(), name='api-dashboard-summary'),
    path('api/costs-by-category/', CostBreakdownView.as_view(), name='api-costs-by-category'),
    path('api/yield-forecast/', YieldForecastingView.as_view(), name='api-yield-forecast'),
    path('api/fleet-analytics/', FleetAnalyticsView.as_view(), name='api-fleet-analytics'),
    
    # Router endpoints
    path('api/', include(router.urls)),
]
