# HarvestHub - Software Requirements Specification (SRS)
**Project Code:** P08  
**Domain:** Agriculture  
**Target Audience:** Farm Managers, Field Workers, Agricultural Consultants / Agronomists, and Agri-Business Administrators  
**Technology Stack:** Python 3.11+, Django 4.2+ LTS, Django REST Framework, React 18 with Vite, MySQL 8.0 Database  

---

## 1. Executive Summary & Objectives
HarvestHub is a comprehensive, enterprise-ready digital agriculture platform engineered to streamline multi-parcel farm management, precision crop rotation planning, machinery fleet telematics, input expenditure accounting, and yield forecasting.

### Key Objectives
1. **Cadastral & Agronomic Mapping:** Provide interactive GIS and soil strata mapping across multi-estate parcels.
2. **Dynamic Crop Rotation Scheduling:** Facilitate chronological planning of phenological stages from land prep to harvest.
3. **Fiscal Input Accounting:** Granularly record and optimize variable costs (fertilizers, pesticides, diesel, labor) per acre.
4. **Predictive Yield Forecasting:** Compare expected agronomic forecasts with empirical harvest output and mandi realization.
5. **Fleet & Telematics Tracking:** Maintain machinery health, scheduled service intervals, meter run-time, and fuel consumption.
6. **Supply Chain & Spare Parts:** Manage safety stocks, prevent machinery downtime, and automate purchase orders.

---

## 2. Module Epics & Agile User Stories

### Epic 1: Field and Crop Mapping
- **P08-US01 (Parcel Registry):** As a Farm Manager, I want to create, inspect, and update farm land parcels with soil classification and irrigation source so that crops are planted in suitable agronomic conditions.
  - *Acceptance Criteria:* User can add a parcel with name, acreage, soil type (`Black Cotton`, `Alluvial`, `Red Soil`, `Clay Loam`, `Sandy Loam`), and irrigation type (`Drip`, `Canal`, `Borewell`). GeoJSON boundary polygon can be attached.
- **P08-US02 (Crop Allocation):** As a Farm Manager, I want to map an active crop cycle to a parcel to visually monitor cultivation status (`Planted`, `Fallow`, `Under Preparation`).

### Epic 2: Planting and Harvesting Scheduling
- **P08-US03 (Crop Rotation Planning):** As a Farm Manager, I want to schedule multi-season crop cycles (`Kharif`, `Rabi`, `Zaid`) with expected sowing and harvesting dates.
- **P08-US04 (Field Operations Tracker):** As a Field Worker, I want to view and mark field tasks (`Ploughing`, `Sowing`, `Fertilizer Application`, `Spraying`, `Irrigation`, `Harvesting`) as Completed.

### Epic 3: Input and Cost Tracking
- **P08-US05 (Expense Ledger):** As a Farm Manager, I want to record expenses for seeds, chemicals, diesel, labor, and machinery rental against a specific crop cycle.
  - *Acceptance Criteria:* Total cost is automatically computed as `quantity * unit_cost`. Ledger can be filtered by input category.

### Epic 4: Yield Analysis and Forecasting
- **P08-US06 (Harvest Output Logging):** As a Farm Manager, I want to record net harvest weight (kg), quality grade (`Grade A`, `Grade B`, `Grade C`), and mandi sale rates in INR to analyze revenue variance against target forecasts.

### Epic 5: Equipment Registry & Inventory
- **P08-US07 (Fleet Asset Registry):** As an Equipment Supervisor, I want to register tractors, harvesters, and sprayers with serial numbers, operating meter hours, and operating status (`Active`, `In Maintenance`, `Idle`).

### Epic 6: Maintenance Scheduling & Tracking
- **P08-US08 (Maintenance Tickets):** As a Workshop Mechanic, I want to log preventive services, breakdown repairs, and overhaul jobs with labor and parts costs.

### Epic 7: Utilization Analysis and Optimization
- **P08-US09 (Telemetry & Fuel Efficiency):** As a Farm Manager, I want to analyze tractor operating hours vs idle hours and fuel consumption rate (L/hr) to identify efficiency bottlenecks.

### Epic 8: Spare Parts and Supply Management
- **P08-US10 (Inventory Replenishment):** As an Inventory Clerk, I want to receive low-stock alerts when parts fall below reorder thresholds and dispatch replenishment purchase orders.

---

## 3. Non-Functional Requirements
1. **Performance:** API responses served within < 200ms under 100 concurrent requests.
2. **Reliability & 3NF Integrity:** Strict foreign key referential integrity with cascading deletes only on child line items.
3. **Security:** Passwords hashed with PBKDF2 SHA-256; role-based access control (RBAC).
4. **Usability:** Responsive UI adhering to mobile and desktop resolutions (1366x768 minimum).
