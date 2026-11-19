# HarvestHub - REST API Documentation & Integration Specification

**Base URL:** `http://localhost:8000/api`  
**Protocol:** HTTP/1.1 & HTTPS  
**Data Format:** JSON (`application/json`)  
**Authentication:** Token / Session / Basic Authentication  

---

## 1. Authentication & System Endpoints

### 1.1 User Login
- **Endpoint:** `POST /api/auth/login/`
- **Request Body:**
  ```json
  {
    "username": "ramesh_patil",
    "password": "HarvestHub@2026"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "message": "Login successful",
    "token": "harvesthub-demo-token-2",
    "user": {
      "user_id": 2,
      "username": "ramesh_patil",
      "email": "ramesh.patil@sahyaadriagro.in",
      "first_name": "Ramesh",
      "last_name": "Patil",
      "phone_number": "+91-9822334455",
      "role": 2,
      "role_details": {
        "role_id": 2,
        "role_code": "FARM_MANAGER",
        "role_name": "Farm Manager"
      }
    }
  }
  ```

### 1.2 Dashboard Summary KPI
- **Endpoint:** `GET /api/dashboard-summary/`
- **Description:** Consolidates multi-module telemetry for executive dashboards.
- **Success Response (200 OK):**
  ```json
  {
    "kpis": {
      "total_farms": 10,
      "total_acres": 876.0,
      "total_fields": 15,
      "planted_fields": 11,
      "active_plantings": 18,
      "total_expenses_inr": 4892400.0,
      "total_revenue_inr": 12480600.0,
      "net_profit_inr": 7588200.0,
      "profit_margin_pct": 60.8,
      "total_equipment": 14,
      "active_equipment": 10,
      "maintenance_equipment": 2,
      "total_fleet_hours": 12450.5,
      "total_fuel_litres": 74210.0,
      "low_stock_parts": 3,
      "pending_maintenance": 4
    },
    "recent_operations": [...],
    "alerts": [...]
  }
  ```

---

## 2. Module 1: Field and Crop Mapping

### 2.1 List All Fields
- **Endpoint:** `GET /api/fields/`
- **Query Parameters:** `?farm=1&status=Planted&soil_type=Black Cotton`
- **Success Response (200 OK):**
  ```json
  [
    {
      "field_id": 1,
      "farm": 1,
      "farm_name": "Sahyadri Agro Estate",
      "field_name": "North Plot A - Vineyard & Veg",
      "boundary_geojson": { "type": "Polygon", "coordinates": [...] },
      "area_acres": "25.00",
      "soil_type": "Black Cotton",
      "irrigation_source": "Drip Irrigation",
      "status": "Planted",
      "active_crop": {
        "planting_id": 1,
        "crop_name": "Onion (Bhima Super)",
        "season": "Rabi 2024-25",
        "current_stage": "Vegetative"
      }
    }
  ]
  ```

### 2.2 Register Field Parcel
- **Endpoint:** `POST /api/fields/`
- **Request Body:**
  ```json
  {
    "farm": 1,
    "field_name": "East Terrace C2",
    "area_acres": "18.50",
    "soil_type": "Alluvial",
    "irrigation_source": "Canal",
    "status": "Active"
  }
  ```

---

## 3. Module 2: Planting and Harvesting Scheduling

### 3.1 List Crop Rotations & Plantings
- **Endpoint:** `GET /api/crop-plantings/`
- **Success Response (200 OK):**
  ```json
  [
    {
      "planting_id": 1,
      "field": 1,
      "field_name": "North Plot A",
      "farm_name": "Sahyadri Agro Estate",
      "crop": 10,
      "crop_name": "Onion (Bhima Super)",
      "crop_category": "Rabi",
      "season": "Rabi 2024-25",
      "sowing_date": "2024-11-10",
      "expected_harvest_date": "2025-03-20",
      "target_yield_kg": "48000.00",
      "actual_yield_kg": null,
      "current_stage": "Vegetative",
      "status": "In Progress",
      "total_costs": 145000.0
    }
  ]
  ```

### 3.2 List Field Operations
- **Endpoint:** `GET /api/field-operations/`
- **Success Response (200 OK):**
  ```json
  [
    {
      "operation_id": 1,
      "planting": 1,
      "crop_name": "Onion (Bhima Super)",
      "field_name": "North Plot A",
      "operation_type": "Fertilizer Application",
      "scheduled_date": "2024-12-15",
      "completion_date": null,
      "status": "Scheduled",
      "assigned_to": 7,
      "assigned_to_name": "Raju Yadav",
      "equipment": 2,
      "equipment_name": "ASPEE Boom Sprayer"
    }
  ]
  ```

---

## 4. Module 3: Input and Cost Tracking

### 4.1 Record Input Cost
- **Endpoint:** `POST /api/farm-inputs-costs/`
- **Request Body:**
  ```json
  {
    "planting": 1,
    "input_type": "Fertilizer",
    "item_name": "IFFCO DAP 50kg",
    "quantity": "20.00",
    "unit": "Bags",
    "unit_cost_inr": "1350.00",
    "total_cost_inr": "27000.00",
    "expense_date": "2024-11-20",
    "receipt_number": "RCPT-AGR-2024-0091",
    "supplier": 6,
    "recorded_by": 2
  }
  ```

### 4.2 Cost Breakdown by Category
- **Endpoint:** `GET /api/costs-by-category/`
- **Response:**
  ```json
  {
    "total_expenses_inr": 4892400.0,
    "by_category": [
      { "input_type": "Fertilizer", "total_amount": 1420500.0, "count": 24 },
      { "input_type": "Fuel", "total_amount": 1150000.0, "count": 18 },
      { "input_type": "Labor", "total_amount": 890000.0, "count": 14 }
    ]
  }
  ```

---

## 5. Module 4: Yield Analysis and Forecasting

### 5.1 Yield Records & Realization
- **Endpoint:** `GET /api/yield-records/`
- **Success Response (200 OK):**
  ```json
  [
    {
      "yield_id": 1,
      "planting": 2,
      "crop_name": "Soybean (JS 335)",
      "field_name": "South Block B",
      "farm_name": "Sahyadri Agro Estate",
      "season": "Kharif 2024",
      "harvest_date": "2024-10-25",
      "gross_yield_kg": "34200.00",
      "net_yield_kg": "33500.00",
      "quality_grade": "Grade A (Export/Premium)",
      "market_price_per_kg_inr": "46.50",
      "total_revenue_inr": "1557750.00",
      "storage_location": "Central Cold Storage, Pimpalgaon",
      "buyer_name": "Godrej Agrovet Procurement"
    }
  ]
  ```

---

## 6. Module 5, 6, 7 & 8: Fleet, Maintenance, Telematics & Inventory

| Module | Method | Endpoint | Description |
| :--- | :---: | :--- | :--- |
| **M5: Fleet Registry** | `GET, POST` | `/api/equipment/` | Machinery fleet assets, hours, status |
| **M6: Maintenance** | `GET, POST` | `/api/maintenance-records/`| Preventive service and breakdown repairs |
| **M6: Parts Used** | `GET, POST` | `/api/maintenance-parts-used/` | Line-item parts consumption in service |
| **M7: Utilization Logs** | `GET, POST` | `/api/equipment-utilization-logs/` | Daily run hours, fuel litres, work acres |
| **M7: Fleet Analytics** | `GET` | `/api/fleet-analytics/` | Aggregated utilization % and fuel burn |
| **M8: Spare Parts** | `GET, POST` | `/api/spare-parts/` | Inventory catalog and low-stock monitor |
| **M8: Suppliers** | `GET, POST` | `/api/suppliers/` | Registered agricultural vendors |
| **M8: Purchase Orders**| `GET, POST` | `/api/spare-part-orders/` | Restock procurement purchase orders |
