// HarvestHub API Client with Live Backend Integration & Seamless Mock Fallback

const API_BASE = 'http://127.0.0.1:8000/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    return data.results !== undefined ? data.results : data;
  } catch (err) {
    console.warn(`[HarvestHub API] Backend request to ${endpoint} failed or offline. Using local dataset fallback.`, err.message);
    return null;
  }
}

// Fallback dataset (matching seeded database records)
export const initialMockState = {
  kpis: {
    total_farms: 10,
    total_acres: 876.0,
    total_fields: 15,
    planted_fields: 11,
    active_plantings: 18,
    harvested_plantings: 38,
    pending_operations: 14,
    completed_operations: 51,
    total_expenses_inr: 4892400.0,
    total_revenue_inr: 12480600.0,
    net_profit_inr: 7588200.0,
    profit_margin_pct: 60.8,
    total_equipment: 14,
    active_equipment: 10,
    maintenance_equipment: 2,
    idle_equipment: 2,
    total_fleet_hours: 12450.5,
    total_fuel_litres: 74210.0,
    low_stock_parts: 3,
    pending_maintenance: 4,
  },
  farms: [
    { farm_id: 1, farm_name: "Sahyadri Agro Estate", owner_name: "Ramesh Patil", total_acres: 85.50, city: "Nashik", state: "Maharashtra", fields_count: 3 },
    { farm_id: 2, farm_name: "Malwa Golden Fields", owner_name: "Gurpreet Singh", total_acres: 120.00, city: "Bathinda", state: "Punjab", fields_count: 3 },
    { farm_id: 3, farm_name: "Deccan Gold Farm", owner_name: "Suresh Deshmukh", total_acres: 65.00, city: "Pune", state: "Maharashtra", fields_count: 2 },
    { farm_id: 4, farm_name: "Krishna Valley Agro", owner_name: "Lakshmi Narayana", total_acres: 95.00, city: "Guntur", state: "Andhra Pradesh", fields_count: 2 },
    { farm_id: 5, farm_name: "Karnal Precision Greens", owner_name: "Harpal Sandhu", total_acres: 110.00, city: "Karnal", state: "Haryana", fields_count: 2 },
  ],
  fields: [
    { field_id: 1, farm: 1, farm_name: "Sahyadri Agro Estate", field_name: "North Plot A - Vineyard & Veg", area_acres: 25.00, soil_type: "Black Cotton", irrigation_source: "Drip Irrigation", status: "Planted", active_crop: { crop_name: "Onion (Bhima Super)", season: "Rabi 2024-25", current_stage: "Vegetative" } },
    { field_id: 2, farm: 1, farm_name: "Sahyadri Agro Estate", field_name: "South Block B - Onion Terraces", area_acres: 30.50, soil_type: "Black Cotton", irrigation_source: "Canal", status: "Planted", active_crop: { crop_name: "Soybean (JS 335)", season: "Kharif 2025", current_stage: "Flowering" } },
    { field_id: 3, farm: 1, farm_name: "Sahyadri Agro Estate", field_name: "East Fallow Meadow C", area_acres: 30.00, soil_type: "Red Soil", irrigation_source: "Borewell", status: "Under Preparation", active_crop: null },
    { field_id: 4, farm: 2, farm_name: "Malwa Golden Fields", field_name: "Bathinda Canal Track 1", area_acres: 40.00, soil_type: "Alluvial", irrigation_source: "Canal", status: "Planted", active_crop: { crop_name: "Sharbati Wheat", season: "Rabi 2024-25", current_stage: "Maturity" } },
    { field_id: 5, farm: 2, farm_name: "Malwa Golden Fields", field_name: "Bathinda TubeWell Track 2", area_acres: 45.00, soil_type: "Alluvial", irrigation_source: "Borewell", status: "Planted", active_crop: { crop_name: "Basmati Rice 1121", season: "Kharif 2024", current_stage: "Harvested" } },
    { field_id: 7, farm: 3, farm_name: "Deccan Gold Farm", field_name: "Manjri Sugarcane Block 1", area_acres: 35.00, soil_type: "Clay Loam", irrigation_source: "Drip Irrigation", status: "Planted", active_crop: { crop_name: "Sugarcane (Co-0238)", season: "Cash Crop 2024-25", current_stage: "Vegetative" } }
  ],
  crops: [
    { crop_id: 1, crop_name: "Basmati Rice 1121", botanical_name: "Oryza sativa", crop_category: "Kharif", standard_growth_days: 140, ideal_soil_type: "Clay Loam", expected_yield_per_acre_kg: 2200 },
    { crop_id: 2, crop_name: "Sharbati Wheat", botanical_name: "Triticum aestivum", crop_category: "Rabi", standard_growth_days: 125, ideal_soil_type: "Alluvial", expected_yield_per_acre_kg: 2100 },
    { crop_id: 3, crop_name: "Bt Cotton (Bollgard II)", botanical_name: "Gossypium hirsutum", crop_category: "Kharif", standard_growth_days: 160, ideal_soil_type: "Black Cotton", expected_yield_per_acre_kg: 1400 },
    { crop_id: 4, crop_name: "Sugarcane (Co-0238)", botanical_name: "Saccharum officinarum", crop_category: "Cash Crop", standard_growth_days: 365, ideal_soil_type: "Deep Loam", expected_yield_per_acre_kg: 38000 },
    { crop_id: 5, crop_name: "Soybean (JS 335)", botanical_name: "Glycine max", crop_category: "Kharif", standard_growth_days: 100, ideal_soil_type: "Black Soil", expected_yield_per_acre_kg: 1100 },
    { crop_id: 10, crop_name: "Onion (Bhima Super)", botanical_name: "Allium cepa", crop_category: "Rabi", standard_growth_days: 120, ideal_soil_type: "Sandy Loam", expected_yield_per_acre_kg: 10500 },
  ],
  plantings: [
    { planting_id: 1, field: 1, field_name: "North Plot A", farm_name: "Sahyadri Agro", crop: 10, crop_name: "Onion (Bhima Super)", season: "Rabi 2024-25", sowing_date: "2024-11-10", expected_harvest_date: "2025-03-20", target_yield_kg: 48000, actual_yield_kg: null, current_stage: "Vegetative", status: "In Progress", total_costs: 145000 },
    { planting_id: 2, field: 2, field_name: "South Block B", farm_name: "Sahyadri Agro", crop: 5, crop_name: "Soybean (JS 335)", season: "Kharif 2024", sowing_date: "2024-06-15", expected_harvest_date: "2024-10-25", target_yield_kg: 32000, actual_yield_kg: 33500, current_stage: "Completed", status: "Harvested", total_costs: 98000 },
    { planting_id: 3, field: 4, field_name: "Bathinda Track 1", farm_name: "Malwa Golden", crop: 2, crop_name: "Sharbati Wheat", season: "Rabi 2024-25", sowing_date: "2024-11-15", expected_harvest_date: "2025-03-30", target_yield_kg: 84000, actual_yield_kg: null, current_stage: "Maturity", status: "In Progress", total_costs: 215000 },
    { planting_id: 4, field: 7, field_name: "Manjri Sugarcane", farm_name: "Deccan Gold", crop: 4, crop_name: "Sugarcane (Co-0238)", season: "Annual 2024-25", sowing_date: "2024-03-10", expected_harvest_date: "2025-03-05", target_yield_kg: 133000, actual_yield_kg: null, current_stage: "Vegetative", status: "In Progress", total_costs: 380000 },
  ],
  operations: [
    { operation_id: 1, planting: 1, crop_name: "Onion (Bhima Super)", field_name: "North Plot A", operation_type: "Fertilizer Application", scheduled_date: "2024-12-15", status: "Scheduled", assigned_to_name: "Raju Yadav", equipment_name: "ASPEE Boom Sprayer" },
    { operation_id: 2, planting: 3, crop_name: "Sharbati Wheat", field_name: "Bathinda Track 1", operation_type: "Irrigation", scheduled_date: "2024-12-18", status: "Completed", assigned_to_name: "Balwinder Singh", equipment_name: null },
    { operation_id: 3, planting: 4, crop_name: "Sugarcane", field_name: "Manjri Sugarcane", operation_type: "Weeding", scheduled_date: "2024-12-22", status: "Scheduled", assigned_to_name: "Vikram Choudhary", equipment_name: "Shaktiman Regular Rotavator" },
    { operation_id: 4, planting: 2, crop_name: "Soybean", field_name: "South Block B", operation_type: "Harvesting", scheduled_date: "2024-10-24", status: "Completed", assigned_to_name: "Raju Yadav", equipment_name: "Preet 987 Combine Harvester" },
  ],
  costs: [
    { cost_id: 1, crop_name: "Onion (Bhima Super)", field_name: "North Plot A", input_type: "Seed", item_name: "Certified Onion Seeds (10kg)", quantity: 15, unit: "Kg", unit_cost_inr: 2200, total_cost_inr: 33000, expense_date: "2024-11-05", supplier_name: "Kisan Agro Seed Corp" },
    { cost_id: 2, crop_name: "Onion (Bhima Super)", field_name: "North Plot A", input_type: "Fertilizer", item_name: "IFFCO 10:26:26 Complex", quantity: 25, unit: "Bags", unit_cost_inr: 1470, total_cost_inr: 36750, expense_date: "2024-11-12", supplier_name: "IFFCO Seva Kendra" },
    { cost_id: 3, crop_name: "Sharbati Wheat", field_name: "Bathinda Track 1", input_type: "Fuel", item_name: "High Speed Diesel (Tractor Run)", quantity: 350, unit: "Litres", unit_cost_inr: 92.5, total_cost_inr: 32375, expense_date: "2024-11-20", supplier_name: "Mahindra Spares Depot" },
    { cost_id: 4, crop_name: "Sugarcane", field_name: "Manjri Sugarcane", input_type: "Labor", item_name: "Furrow Opening & Sett Planting Crew", quantity: 30, unit: "Man-days", unit_cost_inr: 450, total_cost_inr: 13500, expense_date: "2024-03-12", supplier_name: null },
  ],
  yields: [
    { yield_id: 1, crop_name: "Soybean (JS 335)", field_name: "South Block B", farm_name: "Sahyadri Agro", season: "Kharif 2024", harvest_date: "2024-10-25", net_yield_kg: 33500, target_yield_kg: 32000, quality_grade: "Grade A (Export/Premium)", market_price_per_kg_inr: 46.50, total_revenue_inr: 1557750, buyer_name: "Godrej Agrovet Procurement" },
    { yield_id: 2, crop_name: "Basmati Rice 1121", field_name: "Bathinda Track 2", farm_name: "Malwa Golden", season: "Kharif 2024", harvest_date: "2024-10-18", net_yield_kg: 89000, target_yield_kg: 88000, quality_grade: "Grade A (Export/Premium)", market_price_per_kg_inr: 42.00, total_revenue_inr: 3738000, buyer_name: "PUNGRAIN State Procurement" },
    { yield_id: 3, crop_name: "Bt Cotton", field_name: "Krishna Cotton", farm_name: "Krishna Valley", season: "Kharif 2024", harvest_date: "2024-11-05", net_yield_kg: 62000, target_yield_kg: 63000, quality_grade: "Grade B (Standard Market)", market_price_per_kg_inr: 68.00, total_revenue_inr: 4216000, buyer_name: "NAFED Regional Cotton Hub" }
  ],
  equipment: [
    { equipment_id: 1, farm_name: "Sahyadri Agro", category_name: "Tractors", name: "Mahindra Arjun Novo 605 DI", make_and_model: "Mahindra 60HP", serial_number: "M&M-NOV-2023-8891", purchase_cost_inr: 940000, current_meter_hours: 780.5, status: "Active", last_serviced_date: "2024-08-15" },
    { equipment_id: 2, farm_name: "Sahyadri Agro", category_name: "Sprayers", name: "ASPEE Boom Sprayer 400L", make_and_model: "ASPEE Agri-400L", serial_number: "ASP-BOM-2023-4102", purchase_cost_inr: 185000, current_meter_hours: 310.0, status: "Active", last_serviced_date: "2024-09-01" },
    { equipment_id: 4, farm_name: "Malwa Golden", category_name: "Tractors", name: "John Deere 5310 PowerTech", make_and_model: "John Deere 55HP 4WD", serial_number: "JD-5310-2022-9904", purchase_cost_inr: 1120000, current_meter_hours: 1420.0, status: "Active", last_serviced_date: "2024-10-02" },
    { equipment_id: 5, farm_name: "Malwa Golden", category_name: "Harvesters", name: "Preet 987 Combine Harvester", make_and_model: "Preet Agro Self-Propelled", serial_number: "PRT-987-2022-0043", purchase_cost_inr: 2450000, current_meter_hours: 680.0, status: "In Maintenance", last_serviced_date: "2024-10-25" },
    { equipment_id: 3, farm_name: "Sahyadri Agro", category_name: "Tillage Implements", name: "Shaktiman Smart Rotavator", make_and_model: "Shaktiman 7-Feet", serial_number: "SHK-ROTA-2023-1120", purchase_cost_inr: 135000, current_meter_hours: 240.0, status: "Idle", last_serviced_date: "2024-05-10" }
  ],
  maintenance: [
    { maintenance_id: 1, equipment_name: "Preet 987 Combine Harvester", maintenance_type: "Preventive Service", title: "Post-Paddy Harvest Full Overhaul", scheduled_date: "2024-10-25", completion_date: "2024-10-28", meter_hours_at_service: 680, total_cost_inr: 18500, status: "In Progress", technician_name: "Paramjit Motor Works" },
    { maintenance_id: 2, equipment_name: "Mahindra Arjun Novo 605 DI", maintenance_type: "Preventive Service", title: "750-Hour Lube & Filter Change", scheduled_date: "2024-08-15", completion_date: "2024-08-15", meter_hours_at_service: 752, total_cost_inr: 6850, status: "Completed", technician_name: "Dilip Sharma (M&M Tech)" },
    { maintenance_id: 3, equipment_name: "John Deere 5310 PowerTech", maintenance_type: "Breakdown Repair", title: "Hydraulic Lift Cylinder Seal Replacement", scheduled_date: "2024-10-02", completion_date: "2024-10-03", meter_hours_at_service: 1410, total_cost_inr: 8900, status: "Completed", technician_name: "John Deere Service Hub" }
  ],
  spares: [
    { part_id: 1, part_number: "FLT-OIL-MM605", name: "Mahindra Arjun Engine Oil Filter", category: "Filters", current_stock: 18, minimum_reorder_level: 5, unit_price_inr: 580, unit_of_measure: "Units", supplier_name: "Mahindra Spares Depot", is_low_stock: false },
    { part_id: 2, part_number: "BLD-ROT-SHK7", name: "Shaktiman Rotavator Blades (Set of 6)", category: "Wear Parts", current_stock: 24, minimum_reorder_level: 8, unit_price_inr: 1450, unit_of_measure: "Sets", supplier_name: "Shaktiman Agro Parts", is_low_stock: false },
    { part_id: 10, part_number: "FLT-AIR-KUBOTA", name: "Kubota Dual Air Cleaner Element", category: "Filters", current_stock: 2, minimum_reorder_level: 3, unit_price_inr: 2800, unit_of_measure: "Sets", supplier_name: "John Deere Spares", is_low_stock: true },
    { part_id: 15, part_number: "CHN-ELEV-KUBOTA", name: "Kubota Elevator Drive Chain Link ASM", category: "Chains", current_stock: 0, minimum_reorder_level: 2, unit_price_inr: 4200, unit_of_measure: "Units", supplier_name: "John Deere Spares", is_low_stock: true }
  ]
};

export const api = {
  async getDashboardSummary() {
    const live = await request('/dashboard-summary/');
    return live || { kpis: initialMockState.kpis, recent_operations: initialMockState.operations, alerts: [] };
  },
  async getFarms() {
    const live = await request('/farms/');
    return live || initialMockState.farms;
  },
  async getFields() {
    const live = await request('/fields/');
    return live || initialMockState.fields;
  },
  async getCrops() {
    const live = await request('/crop-types/');
    return live || initialMockState.crops;
  },
  async getPlantings() {
    const live = await request('/crop-plantings/');
    return live || initialMockState.plantings;
  },
  async getOperations() {
    const live = await request('/field-operations/');
    return live || initialMockState.operations;
  },
  async getCosts() {
    const live = await request('/farm-inputs-costs/');
    return live || initialMockState.costs;
  },
  async getYields() {
    const live = await request('/yield-records/');
    return live || initialMockState.yields;
  },
  async getEquipment() {
    const live = await request('/equipment/');
    return live || initialMockState.equipment;
  },
  async getMaintenance() {
    const live = await request('/maintenance-records/');
    return live || initialMockState.maintenance;
  },
  async getSpareParts() {
    const live = await request('/spare-parts/');
    return live || initialMockState.spares;
  },
  async getFleetAnalytics() {
    const live = await request('/fleet-analytics/');
    return live || {
      fleet_utilization_rate_pct: 82.5,
      avg_fuel_consumption_litres_per_hr: 5.96,
      total_operating_hours: 12450.5,
      total_idle_hours: 1820.0
    };
  }
};
