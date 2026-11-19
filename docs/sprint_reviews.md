# HarvestHub - Agile Sprint Reviews & Release Management

**Project Code:** P08  
**Project Name:** HarvestHub - Comprehensive Farm Management & Crop Planning Platform  
**Total Allocated Duration:** 90 Hours (Sprint 0: 6h; Sprints 1, 2, 3: 28h each)  

---

## Sprint 0: Foundation, Architecture & Skeleton (6 Hours)
- **Focus:** Git repository setup, 3NF database schema design, UI wireframes, Django project skeleton, and authentication models.
- **Deliverables:**
  - Git repository structure (`main`, `develop`, `feature/*`) initialized.
  - 3NF relational schema in MySQL 8.0 DDL (`database/schema.sql`).
  - Realistic Indian agricultural dataset generator and CSV fixtures (`database/seed_data.sql`, `database/csv_seed_data/`).
  - Django project (`harvesthub_backend`) with custom user model, roles, and CORS middleware.
  - React application skeleton with Bootstrap 5 theme and navbar.
- **Git Tag:** `v0.1.0`
- **Review Outcome:** Approved. Core data model and authentication framework successfully established.

---

## Sprint 1: Field Mapping & Crop Rotation Scheduling (28 Hours)
- **Focus:** Modules 1 and 2 (Field & Crop Mapping; Planting & Harvesting Scheduling).
- **Deliverables:**
  - `mapping` app: `Farm` and `Field` models, GIS GeoJSON boundary support, soil classifications, and irrigation source tracking.
  - `scheduling` app: `CropType`, `CropPlanting`, and `FieldOperation` models.
  - REST API ViewSets with filtering by soil type and farm estate.
  - React `FieldMappingView`: Cadastral parcel grid cards, soil badges, and parcel registration modal.
  - React `SchedulingView`: Chronological crop rotation tracker, phenological stage progression (Land Prep -> Sowing -> Vegetative -> Flowering -> Maturity -> Harvesting), and field operations calendar.
- **Git Tag:** `v0.2.0`
- **Review Outcome:** Approved. Multi-parcel visualization and seasonal crop rotation workflows demonstrated.

---

## Sprint 2: Input Cost Accounting & Yield Forecasting (28 Hours)
- **Focus:** Modules 3 and 4 (Input & Cost Tracking; Yield Analysis & Forecasting).
- **Deliverables:**
  - `finance` app: `FarmInputCost` and `YieldRecord` models.
  - Cost categorization endpoints (`/api/costs-by-category/`) aggregating fertilizers, seeds, diesel fuel, and labor wages.
  - Yield forecasting analytics (`/api/yield-forecast/`) analyzing target vs actual output and mandi price realization.
  - React `CostTrackingView`: Granular expense ledger, cost per category summaries, and expense logger.
  - React `YieldAnalysisView`: Harvest output ledger, quality grade variance (`Grade A`, `Grade B`, `Grade C`), and commercial revenue tracker.
- **Git Tag:** `v0.3.0`
- **Review Outcome:** Approved. Fiscal cost control and yield realization analysis verified with seed data.

---

## Sprint 3: Fleet Management, Spares, Telematics, Testing & Release (28 Hours)
- **Focus:** Modules 5, 6, 7 and 8 (Equipment Registry; Maintenance; Utilization Telematics; Spare Parts); automated test suite, end-to-end integration, and documentation.
- **Deliverables:**
  - `equipment` app: `EquipmentCategory`, `Equipment`, `Supplier`, `SparePart`, `MaintenanceRecord`, `MaintenancePartsUsed`, `EquipmentUtilizationLog`, `SparePartOrder`.
  - React `EquipmentRegistryView`: Machinery fleet asset cards, meter run-time, and active/idle status controls.
  - React `MaintenanceTrackerView`: Routine servicing, breakdown repair tickets, technician labor outlays, and parts consumed line items.
  - React `UtilizationOptimizationView`: Active operating hours vs idle engine time, diesel burn rate (L/hr), and agronomic optimization recommendations.
  - React `SparePartsInventoryView`: Consumable catalog, low-stock alerts (< minimum reorder level), and automated purchase order dispatch.
  - Django test suite (`python manage.py test`) passing with 100% success rate across all modules.
  - Complete technical documentation in `docs/` (`requirements.md`, `wireframes.md`, `api_docs.md`, `test_report.md`).
- **Git Tag:** `v1.0.0`
- **Review Outcome:** Release Approved. All 8 epics delivered, tested, and demo-ready.
