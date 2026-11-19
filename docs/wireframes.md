# HarvestHub - UX Wireframes & UI Screen Specifications

## 1. Master Application Layout & Navigation
```
+----------------------------------------------------------------------------------------------------+
| 🌾 HarvestHub (P08) - Farm Management & Crop Planning Platform        [● Live API] [Role: Farm Mgr]|
+----------------------------------------------------------------------------------------------------+
| [📊 Dashboard] [🗺️ Field Mapping] [📅 Schedules] [💰 Costs] [🌾 Yields] [🚜 Fleet] [🔧 Maint] [📦 Spares]|
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|                                       < ACTIVE VIEW CONTENT >                                      |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
| Footer: P08 HarvestHub • Python Django REST & React 18 & MySQL 8.0 • Sprint 0 - 3                  |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Executive Dashboard Wireframe (`DashboardView`)
```
+----------------------------------------------------------------------------------------------------+
| Farm Operations Executive Dashboard                         [+ Schedule Field Task] [+ Record Cost]|
+----------------------------------------------------------------------------------------------------+
| [ Total Land Holding ]   [ Active Plantings ]   [ Fleet Status       ]   [ Net Farm Profit       ] |
| 876.0 Acres              18 Cycles              10 / 14 Active           ₹75.88 Lakh             |
| 15 Parcels, 10 Estates   11 Planted Fields      2 in Maintenance         Rev: 124.8L | Cost: 48.9L|
+----------------------------------------------------------------------------------------------------+
|                                                  |                                                 |
| ⚠️ CRITICAL ALERTS                               | 🗓️ UPCOMING FIELD OPERATIONS                    |
| - Low Spare Parts: Air cleaners & chains         | +---------------------------------------------+ |
|   [View Reorder List ->]                         | | Task          | Parcel        | Date  | St  | |
| - Scheduled Overhaul Due: Preet Harvester        | | Fertilizer    | North Plot A  | 12-15 | Sched| |
| - Weather Advisory: Canal water rotation ready   | | Irrigation    | Bathinda Trk1 | 12-18 | Done| |
|                                                  | | Weeding/Spray | Manjri Block  | 12-22 | Sched| |
| ⚡ FLEET TELEMETRY                               | +---------------------------------------------+ |
| - Run Hours: 12,450.5 hrs | Fuel: 74,210 L       |                                                 |
| - Burn Rate: 5.96 L/hr    | Utilization: 82.5%   |                                                 |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Field & Crop Mapping Wireframe (`FieldMappingView`)
```
+----------------------------------------------------------------------------------------------------+
| Module 1: Field & Crop Mapping                                      [+ Register New Field Parcel]  |
| [Search...] [Soil Filter: All v] [Status Filter: All v]                      Showing 15 of 15 Parcels|
+----------------------------------------------------------------------------------------------------+
| +-----------------------------+  +-----------------------------+  +-----------------------------+  |
| | North Plot A - Vineyard &Veg|  | South Block B - Onion Terrac|  | East Fallow Meadow C        |  |
| | 📍 Sahyadri Agro Estate     |  | 📍 Sahyadri Agro Estate     |  | 📍 Sahyadri Agro Estate     |  |
| | Area: 25.0 Acres            |  | Area: 30.5 Acres            |  | Area: 30.0 Acres            |  |
| | Soil: Black Cotton          |  | Soil: Black Cotton          |  | Soil: Red Soil              |  |
| | Irrigation: Drip Irrigation |  | Irrigation: Canal           |  | Irrigation: Borewell        |  |
| | Crop: Onion (Bhima Super)   |  | Crop: Soybean (JS 335)      |  | Crop: None (Fallow)         |  |
| | Stage: Vegetative [Planted] |  | Stage: Flowering [Planted]  |  | Status: [Under Preparation] |  |
| +-----------------------------+  +-----------------------------+  +-----------------------------+  |
+----------------------------------------------------------------------------------------------------+
```

---

## 4. Planting & Harvesting Scheduling Wireframe (`SchedulingView`)
```
+----------------------------------------------------------------------------------------------------+
| Module 2: Planting & Harvesting Scheduling       [+ Schedule Field Task] [+ Plan New Crop Rotation]|
| Tabs: [🌱 Active Crop Rotations (18)]  [🚜 Scheduled Field Tasks (65)]                              |
+----------------------------------------------------------------------------------------------------+
| +------------------------------------------------------------------------------------------------+ |
| | Onion (Bhima Super) [Rabi 2024-25]                          Status: [In Progress] [Advance ->] | |
| | Parcel: North Plot A (Sahyadri Agro)                                                           | |
| | Stage: Vegetative (45% Progress) [==========================>                                ] | |
| | Stages: [✓ Land Prep] -> [✓ Sowing] -> [● Vegetative] -> [○ Flowering] -> [○ Harvest]         | |
| | Sowing: 2024-11-10 | Harvest: 2025-03-20 | Target: 48,000 kg | Costs: ₹1,45,000                | |
| +------------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

---

## 5. Input & Cost Tracking Wireframe (`CostTrackingView`)
```
+----------------------------------------------------------------------------------------------------+
| Module 3: Input & Cost Tracking                                  [+ Record Farm Input Expense]     |
| [Total: ₹48,92,400]  [Fertilizers: ₹18,40,000]  [Fuel: ₹12,85,000]  [Labor: ₹9,65,000]              |
+----------------------------------------------------------------------------------------------------+
| Filter: [All Categories v]                                                                         |
| +------------------------------------------------------------------------------------------------+ |
| | Date       | Category   | Item Description        | Crop & Parcel | Qty    | Rate  | Total (₹) | |
| | 2024-11-05 | Seed       | Certified Onion Seeds   | Onion (Plot A)| 15 Kg  | 2,200 |    33,000 | |
| | 2024-11-12 | Fertilizer | IFFCO 10:26:26 Complex  | Onion (Plot A)| 25 Bag | 1,470 |    36,750 | |
| | 2024-11-20 | Fuel       | High Speed Diesel (HSD) | Wheat (Trk 1) | 350 L  | 92.50 |    32,375 | |
| +------------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

---

## 6. Yield Analysis & Forecasting Wireframe (`YieldAnalysisView`)
```
+----------------------------------------------------------------------------------------------------+
| Module 4: Yield Analysis & Forecasting                            [+ Log Harvest Output & Sale]    |
| [Total Output: 2,450 MT]  [Revenue: ₹1.24 Cr]  [Avg Rate: ₹48.50/kg]  [Quality: 78.5% Grade A]     |
+----------------------------------------------------------------------------------------------------+
| +------------------------------------------------------------------------------------------------+ |
| | Date       | Crop & Parcel    | Net Yield | Target Yield | Variance  | Quality | Rate  | Rev (₹)   | |
| | 2024-10-25 | Soybean (Plot B) | 33,500 kg | 32,000 kg    | +1,500 kg | Grade A | 46.50 | 15,57,750 | |
| | 2024-10-18 | Basmati (Trk 2)  | 89,000 kg | 88,000 kg    | +1,000 kg | Grade A | 42.00 | 37,38,000 | |
| +------------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

---

## 7. Equipment, Maintenance & Spares Wireframes
```
+----------------------------------------------------------------------------------------------------+
| Module 5: Fleet Registry           Module 6: Maintenance              Module 8: Spare Parts        |
| - Machine: Mahindra Arjun 605 DI   - Scheduled Service Job Log        - Inventory Catalog: 15 SKUs |
| - Hours: 780.5 hrs | [Active]      - Breakdown Repairs Tracker        - ⚠️ Low Stock Indicators     |
| - Preet 987 Combine Harvester      - Parts Consumed Line Items        - [+ Dispatch Reorder PO]    |
| - Hours: 680 hrs | [Maintenance]   - Tech Labor Outlay                - Supplier Directory         |
+----------------------------------------------------------------------------------------------------+
```
