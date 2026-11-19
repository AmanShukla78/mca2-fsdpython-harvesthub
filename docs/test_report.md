# HarvestHub - Test Execution & Edge-Case Validation Report

**Test Suite:** Django Automated Test Runner & API Integration Suite  
**Date of Execution:** 2026-11-20  
**Status:** PASS (All tests green, 0 failures, 0 errors)  

---

## 1. Automated Test Execution Summary

```
Creating test database for alias 'default'...
.....
----------------------------------------------------------------------
Ran 5 tests in 6.765s

OK
Destroying test database for alias 'default'...
Found 5 test(s).
System check identified no issues (0 silenced).
```

### Detailed Test Case Matrix

| Test ID | Test Case Title | Target Endpoint / Module | Status | Result / Observations |
| :--- | :--- | :--- | :---: | :--- |
| **TC-01** | `test_dashboard_summary_kpis` | `GET /api/dashboard-summary/` | **PASS** | Validates consolidated telemetry (total farms, acres, active plantings, expenses, revenue). Returns 200 OK. |
| **TC-02** | `test_field_listing_and_filtering` | `GET /api/fields/` | **PASS** | Validates field mapping entity retrieval, foreign key joins to Farm, and soil type representation. |
| **TC-03** | `test_crop_planting_creation` | `POST /api/crop-plantings/` | **PASS** | Asserts successful scheduling of a new seasonal rotation cycle with valid 201 Created response. |
| **TC-04** | `test_cost_breakdown_endpoint` | `GET /api/costs-by-category/` | **PASS** | Verifies input expenditure aggregation by category (`Fertilizer`, `Fuel`, `Labor`) and total INR calculation. |
| **TC-05** | `test_yield_forecasting_endpoint` | `GET /api/yield-forecast/` | **PASS** | Asserts accurate net yield sum in kg, market price per kg, quality grade breakdown, and revenue realization. |

---

## 2. Validation of 5 Required Agricultural Edge Cases

| Edge Case ID | Requirement Description | Test Record & Data Values | Observed Behavior & Assertion |
| :--- | :--- | :--- | :--- |
| **EC-01** | **Empty Optional Attributes** | Farm ID 10 (`Vidarbha Agro Frontier`) has `latitude=NULL`, `longitude=NULL`. Fields ID 3, 6, 10 have `boundary_geojson=NULL`. | Handled gracefully without null-pointer exceptions. The frontend safely renders fallback cadastral badges rather than attempting map polygon projection. |
| **EC-02** | **Maximum Length Text Overflow** | Supplier ID 12 with 112-character legal entity name; Maintenance ID 53 with 350-character warranty description. | Column boundaries (`VARCHAR(120)` and `TEXT`) accommodated the full text without database truncation or UI table overflow anomalies. |
| **EC-03** | **Homoglyph & Duplicate Entity Names** | User ID 2 (`Ramesh Patil`, Farm Manager) and User ID 12 (`Ramesh Patil Jr`, Field Worker). | Foreign key references and user assignment dropdowns resolve strictly by immutable primary keys (`user_id = 2` vs `user_id = 12`). |
| **EC-04** | **Zero-Cost / Warranty Maintenance** | Maintenance Record ID 53 (`labor_cost_inr = 0.00`, `parts_cost_inr = 0.00`, `total_cost_inr = 0.00`). | SQL aggregate functions (`SUM`, `AVG`) compute sums correctly without divide-by-zero errors or incorrect exclusion from maintenance ticket counts. |
| **EC-05** | **Zero-Stock & High-Value Scale** | Spare Part ID 15 (`CHN-ELEV-KUBOTA`, `current_stock = 0`); Farm Input Cost ID 76 (`₹1,25,000.00`). | Zero stock accurately triggers the `Out of Stock` critical badge in Module 8. High-scale INR values format without precision loss in `DECIMAL(12,2)` columns. |

---

## 3. Definition of Done (DoD) Verification
- [x] Code is committed to Git repository with conventional commit standards (`feat`, `fix`, `docs`, `test`).
- [x] Acceptance criteria of user stories (P08-US01 to P08-US10) are met and demonstrated.
- [x] Unit and integration tests written and passing.
- [x] Complete REST API documentation and wireframes included in `docs/`.
- [x] DDL script (`schema.sql`), Seed script (`seed_data.sql`), and CSV datasets available in `database/`.
