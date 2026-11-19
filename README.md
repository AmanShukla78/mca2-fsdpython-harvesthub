# 🌾 HarvestHub - Comprehensive Farm Management & Crop Planning Platform

**Project Code:** P08  
**Domain:** Agriculture  
**Technology Stack:** Python 3.11+, Django 4.2+ LTS, Django REST Framework, React 18 (Vite), Bootstrap 5, MySQL 8.0 Community Server  
**Primary Users:** Farm Manager, Field Worker, Agronomist, System Administrator  
**Total Duration:** 90 Hours (Agile Sprints 0 to 3)  
**Git Repository Name:** `mca2-fsdpython-harvesthub`  

---

## 📌 Project Overview
**HarvestHub** is an enterprise-grade digital agriculture platform designed for multi-estate agricultural operations. It unifies precision field and soil mapping, dynamic crop rotation planning, input cost tracking, empirical yield forecasting, fleet machinery telematics, maintenance workshop management, and spare parts inventory replenishment.

---

## 🚀 Key Modules (All 8 Core Epics Covered)

1. **Module 1: Field and Crop Mapping**
   - Cadastral parcel registry with acreage, GIS GeoJSON boundary polygon coordinates.
   - Soil strata profiling (`Black Cotton`, `Alluvial`, `Red Soil`, `Clay Loam`, `Sandy Loam`, `Laterite`).
   - Irrigation source tracking (`Canal`, `Drip Irrigation`, `Borewell`, `Sprinkler`, `River Lift`).
   - Real-time cultivation status (`Planted`, `Active`, `Under Preparation`, `Fallow`).

2. **Module 2: Planting and Harvesting Scheduling**
   - Multi-season crop rotation cycles (`Kharif`, `Rabi`, `Zaid`, `Cash Crops`).
   - Phenological stage progression tracking (`Land Preparation` ➔ `Sowing` ➔ `Vegetative` ➔ `Flowering` ➔ `Maturity` ➔ `Harvesting` ➔ `Completed`).
   - Chronological field operations calendar with tractor and worker assignment.

3. **Module 3: Input and Cost Tracking**
   - Granular input expenditure ledger (Certified Seeds, Fertilizers, Pesticides, Diesel Fuel, Labor wages, Machinery rental).
   - Cost aggregation by category and per-acre financial efficiency metrics in Indian Rupees (₹ INR).

4. **Module 4: Yield Analysis and Forecasting**
   - Target agronomic forecasted yield vs actual empirical harvest output in kg and metric tonnes.
   - Commercial quality grading (`Grade A Export/Premium`, `Grade B Standard Market`, `Grade C Processing/Fair`).
   - Mandi market price realization and gross revenue calculation.

5. **Module 5: Equipment Registry and Inventory**
   - Heavy machinery registry (Tractors 45HP-75HP, Self-propelled Combine Harvesters, Boom Sprayers, Tillage Implements, Irrigation Pumps).
   - Serial numbers, purchase capitalization, and operating status (`Active`, `In Maintenance`, `Idle`, `Decommissioned`).

6. **Module 6: Maintenance Scheduling and Tracking**
   - Preventive service intervals (e.g. 250-hr and 500-hr oil/filter changes) and breakdown repair ticketing.
   - Workshop technician tracking, labor outlays, and replacement parts line-item logging.

7. **Module 7: Utilization Analysis and Optimization**
   - Shift-level telemetry: Active operating engine hours vs unproductive idle run-time.
   - Diesel burn efficiency rate (Litres per operating hour) and work coverage (Acres per hour).
   - Algorithmic fleet optimization recommendations to reduce fuel costs and equipment downtime.

8. **Module 8: Spare Parts and Supply Management**
   - Maintenance inventory catalog (filters, belts, rotavator blades, cutter bars, hydraulic fluids).
   - Automated low-stock warning indicators when stock falls below safety reorder levels.
   - Purchase order dispatch directly linked to registered GST-compliant agricultural suppliers.

---

## 🗂️ Project Directory Layout

```
mca2-fsdpython-harvesthub/
│
├── backend/                                # Python / Django REST API Service
│   ├── harvesthub_backend/                 # Project configuration & settings
│   │   ├── settings.py                     # Multi-database support (MySQL & SQLite fallback)
│   │   ├── urls.py                         # REST API master routing
│   │   └── wsgi.py
│   ├── core/                               # Auth, Custom User, Roles, Dashboard APIs
│   │   ├── cors_middleware.py              # Zero-dependency CORS support
│   │   ├── dashboard_view.py               # Consolidated executive KPIs
│   │   ├── models.py                       # User & Role models
│   │   ├── management/commands/seed_data.py# Automatic database seeder command
│   │   └── tests.py                        # Automated test suite
│   ├── mapping/                            # Module 1: Farms, Fields, GIS Boundaries
│   ├── scheduling/                         # Module 2: Crop Types, Plantings, Operations
│   ├── finance/                            # Modules 3 & 4: Input Costs & Yield Records
│   ├── equipment/                          # Modules 5, 6, 7 & 8: Machinery, Maintenance, Telematics, Spares
│   ├── requirements.txt                    # Backend dependencies
│   └── manage.py                           # Django CLI
│
├── frontend/                               # React 18 Application (Vite + Bootstrap 5)
│   ├── src/
│   │   ├── components/                     # Reusable UI components (Navbar, Stats)
│   │   ├── views/                          # Dedicated views for Dashboard & all 8 modules
│   │   │   ├── DashboardView.jsx
│   │   │   ├── FieldMappingView.jsx        # Module 1
│   │   │   ├── SchedulingView.jsx          # Module 2
│   │   │   ├── CostTrackingView.jsx        # Module 3
│   │   │   ├── YieldAnalysisView.jsx       # Module 4
│   │   │   ├── EquipmentRegistryView.jsx   # Module 5
│   │   │   ├── MaintenanceTrackerView.jsx  # Module 6
│   │   │   ├── UtilizationOptimizationView.jsx # Module 7
│   │   │   └── SparePartsInventoryView.jsx # Module 8
│   │   ├── services/api.js                 # API client with live backend probe & offline fallback
│   │   ├── App.jsx                         # Main application state & view router
│   │   ├── index.css                       # Agricultural theme & responsive styles
│   │   └── main.jsx                        # React entry point
│   ├── index.html                          # Vite HTML template with Bootstrap 5
│   ├── preview.html                        # Zero-setup standalone browser preview (Chrome/Edge)
│   ├── vite.config.js                      # Vite development configuration
│   └── package.json                        # Frontend dependencies & scripts
│
├── database/                               # Database Schemas & Data Dumps
│   ├── schema.sql                          # MySQL 8.0 DDL (InnoDB, utf8mb4, 3NF normalized)
│   ├── seed_data.sql                       # Indian context SQL insert script (2024-2026 dates)
│   ├── generate_seed_data.py               # Python dataset generation pipeline
│   ├── er_diagram.md                       # Relational schema & Mermaid ER diagram
│   └── csv_seed_data/                      # CSV format sample data for all 17 entities
│       ├── roles.csv, users.csv, farms.csv, fields.csv, crop_types.csv...
│
├── docs/                                   # Project Documentation & Agile Artifacts
│   ├── requirements.md                     # Software Requirements Specification (SRS)
│   ├── wireframes.md                       # Screen wireframes & layout specifications
│   ├── api_docs.md                         # Complete REST API reference
│   ├── test_report.md                      # Automated test results & edge-case validation
│   └── sprint_reviews.md                   # Agile Sprint 0 to Sprint 3 reviews & DoD checklist
│
├── .env.example                            # Configuration template
├── .gitignore                              # Git exclusion rules
└── README.md                               # Project documentation
```

---

## 🛠️ Step-by-Step Setup & How to Run

### Option 1: Quick Zero-Setup Instant Run (SQLite Fallback)
The backend is configured to run out-of-the-box using SQLite so you can test immediately without setting up a MySQL server:

1. **Activate Backend:**
   ```bash
   cd backend
   python manage.py migrate
   python manage.py seed_data
   python manage.py runserver 8000
   ```
   *The API will be live at `http://127.0.0.1:8000/api/`*

2. **Run Tests:**
   ```bash
   python manage.py test
   ```

3. **Launch Frontend:**
   - **Method A (Vite Dev Server):**
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
     *Open `http://localhost:5173` in Google Chrome or Microsoft Edge.*
   - **Method B (Instant Standalone Browser Preview - Zero Node.js Install):**
     Directly double-click or open `frontend/preview.html` in your browser!

---

### Option 2: Full Production Setup with MySQL 8.0 Community Server

1. **Create MySQL Database & Import Schema:**
   Open MySQL Workbench or your MySQL 8.0 CLI:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed_data.sql
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `backend/.env`:
   ```ini
   DB_ENGINE=mysql
   DB_NAME=harvesthub_db
   DB_USER=root
   DB_PASSWORD=YourMySQLPassword
   DB_HOST=127.0.0.1
   DB_PORT=3306
   ```

3. **Run Backend with MySQL:**
   ```bash
   cd backend
   python manage.py runserver 8000
   ```

---

## 👥 Demo Roles & Test Credentials

All demo user accounts are pre-seeded with the standard test credential: `HarvestHub@2026`.

| Role | Username | Full Name | Associated Farm / Domain |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin_user` | Aditya Verma | Master System Administration |
| **Farm Manager** | `ramesh_patil` | Ramesh Patil | Sahyadri Agro Estate (Nashik) |
| **Farm Manager** | `gurpreet_singh` | Gurpreet Singh | Malwa Golden Fields (Bathinda) |
| **Agronomist** | `lakshmi_narayana` | Lakshmi Narayana | Krishna Valley Agro (Guntur) |
| **Field Worker** | `raju_yadav` | Raju Yadav | Machinery Operator / Field Hand |
| **Field Worker** | `balwinder_singh` | Balwinder Singh | Tractor & Harvester Specialist |

---

## 🧪 Edge-Case Validation Included in Dataset
As specified in Table 3, 5 rigorous edge-case records are seeded to test platform validation:
1. **Empty Optional Attributes:** Farm ID 10 with null GPS coordinates and Fields with null GeoJSON polygons to test fallback handling.
2. **Maximum Length Text Overflow:** Supplier ID 12 with a 112-character cooperative legal name and 350-character warranty inspection text.
3. **Homoglyph & Duplicate Entity Names:** User ID 2 (`Ramesh Patil`) and User ID 12 (`Ramesh Patil Jr`) to verify strict primary key differentiation.
4. **Zero-Cost / Warranty Maintenance:** Maintenance Record ID 53 with `0.00` INR cost to test aggregate calculations.
5. **Stock Depletion & High Transaction Scale:** Spare Part ID 15 with `current_stock = 0` and single machine contract of `₹1,25,000.00`.

---

## 📈 Agile Sprint Milestones & Tags

- **Sprint 0 (`v0.1.0`):** Repository setup, 3NF database schema, wireframes, project skeleton, and authentication.
- **Sprint 1 (`v0.2.0`):** Module 1 (Field & Crop Mapping) and Module 2 (Planting & Harvesting Scheduling).
- **Sprint 2 (`v0.3.0`):** Module 3 (Input & Cost Tracking) and Module 4 (Yield Analysis & Forecasting).
- **Sprint 3 (`v1.0.0`):** Modules 5-8 (Equipment Registry, Maintenance, Utilization, Spare Parts), automated testing, and release documentation.

---

## 📄 License & Attribution
Developed for **MCA Track Project P08 (HarvestHub)** under Agile software engineering and full-stack development best practices.
