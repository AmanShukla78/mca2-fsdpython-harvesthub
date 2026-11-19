import os
import random
import csv

output_sql = r"C:\Users\amans\.gemini\antigravity\scratch\mca2-fsdpython-harvesthub\database\seed_data.sql"
csv_dir = r"C:\Users\amans\.gemini\antigravity\scratch\mca2-fsdpython-harvesthub\database\csv_seed_data"
os.makedirs(csv_dir, exist_ok=True)

sql_statements = []

def add_statement(table, columns, rows):
    # write to CSV
    csv_path = os.path.join(csv_dir, f"{table}.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(columns)
        for r in rows:
            writer.writerow(r)
    
    # write to SQL
    col_str = ", ".join([f"`{c}`" for c in columns])
    vals_list = []
    for r in rows:
        formatted_vals = []
        for val in r:
            if val is None:
                formatted_vals.append("NULL")
            elif isinstance(val, (int, float)):
                formatted_vals.append(str(val))
            elif isinstance(val, bool):
                formatted_vals.append("1" if val else "0")
            else:
                # escape single quote
                esc = str(val).replace("\\", "\\\\").replace("'", "''")
                formatted_vals.append(f"'{esc}'")
        vals_list.append(f"({', '.join(formatted_vals)})")
    
    # chunk into batches of 25 for clean SQL
    batch_size = 25
    for i in range(0, len(vals_list), batch_size):
        chunk = vals_list[i:i+batch_size]
        stmt = f"INSERT INTO `{table}` ({col_str}) VALUES\n" + ",\n".join(chunk) + ";"
        sql_statements.append(stmt)

# -------------------------------------------------------------
# 1. ROLES
# -------------------------------------------------------------
role_cols = ["role_id", "role_code", "role_name", "description"]
role_rows = [
    (1, "ADMIN", "System Administrator", "Full system access, user management, and security configuration"),
    (2, "FARM_MANAGER", "Farm Manager", "Strategic crop planning, resource allocation, financial oversight, equipment fleet supervisor"),
    (3, "FIELD_WORKER", "Field Worker / Operator", "Executes daily operations, logs equipment usage, logs maintenance, updates stage tasks"),
    (4, "AGRONOMIST", "Agronomist / Consultant", "Soil health expert, yield forecasting, pest management specialist and advisory")
]
add_statement("roles", role_cols, role_rows)

# -------------------------------------------------------------
# 2. USERS
# -------------------------------------------------------------
user_cols = ["user_id", "username", "email", "password_hash", "first_name", "last_name", "phone_number", "role_id", "is_active"]
# Hashed placeholder password (pbkdf2_sha256 standard placeholder: HarvestHub@2026)
HASH = "pbkdf2_sha256$600000$c478a05c$9e6e8e0bd60cf91b3531b46a066927d6d9c6c8ec8cf8a4879de76c4e09f2c8f8"
user_rows = [
    (1, "admin_user", "admin@harvesthub.in", HASH, "Aditya", "Verma", "+91-9811002233", 1, True),
    (2, "ramesh_patil", "ramesh.patil@sahyaadriagro.in", HASH, "Ramesh", "Patil", "+91-9822334455", 2, True),
    (3, "gurpreet_singh", "gurpreet@malwafarms.in", HASH, "Gurpreet", "Singh", "+91-9877112233", 2, True),
    (4, "suresh_deshmukh", "suresh.deshmukh@deccanagri.in", HASH, "Suresh", "Deshmukh", "+91-9422001122", 2, True),
    (5, "lakshmi_narayana", "lakshmi.agri@krishnavalley.in", HASH, "Lakshmi", "Narayana", "+91-9988223344", 4, True),
    (6, "harpal_sandhu", "harpal.sandhu@punjabgreens.in", HASH, "Harpal", "Sandhu", "+91-9788334455", 2, True),
    (7, "raju_yadav", "raju.operator@harvesthub.in", HASH, "Raju", "Yadav", "+91-9122334455", 3, True),
    (8, "vikram_choudhary", "vikram.c@harvesthub.in", HASH, "Vikram", "Choudhary", "+91-9233445566", 3, True),
    (9, "manpreet_kaur", "manpreet.k@malwafarms.in", HASH, "Manpreet", "Kaur", "+91-9344556677", 3, True),
    (10, "balwinder_singh", "balwinder.tractor@harvesthub.in", HASH, "Balwinder", "Singh", "+91-9455667788", 3, True),
    (11, "ganesh_jadhav", "ganesh.jadhav@sahyaadriagro.in", HASH, "Ganesh", "Jadhav", "+91-9566778899", 3, True),
    # Edge-case user: duplicate-sounding name to Ramesh Patil, distinct ID & email
    (12, "ramesh_patil_jr", "ramesh.patil.jr@sahyaadriagro.in", HASH, "Ramesh", "Patil Jr", "+91-9677889900", 3, True)
]
add_statement("users", user_cols, user_rows)

# -------------------------------------------------------------
# 3. FARMS
# -------------------------------------------------------------
farm_cols = ["farm_id", "farm_name", "owner_id", "total_acres", "location_address", "city", "state", "pin_code", "latitude", "longitude"]
farm_rows = [
    (1, "Sahyadri Agro Estate", 2, 85.50, "Gat No 142, Dindori Road, Pimpalgaon", "Nashik", "Maharashtra", "422209", 20.1742000, 73.9875000),
    (2, "Malwa Golden Fields", 3, 120.00, "Village Sangat Mandi, Dabwali Road", "Bathinda", "Punjab", "151401", 30.1245000, 74.8512000),
    (3, "Deccan Gold Farm", 4, 65.00, "Survey 89, Manjri Agri Corridor", "Pune", "Maharashtra", "412307", 18.4982000, 73.9814000),
    (4, "Krishna Valley Agro", 5, 95.00, "Tenali Rural Sector 4", "Guntur", "Andhra Pradesh", "522201", 16.2431000, 80.6402000),
    (5, "Karnal Precision Greens", 6, 110.00, "GT Karnal Road, Taraori", "Karnal", "Haryana", "132116", 29.8032000, 76.9298000),
    (6, "Narmada Valley Orchards", 2, 50.00, "Sanwer Road, Barwaha", "Indore", "Madhya Pradesh", "451115", 22.2530000, 76.0421000),
    (7, "Cauvery Delta Agri Hub", 5, 75.00, "Kallanai Road, Lalgudi", "Tiruchirappalli", "Tamil Nadu", "621601", 10.8710000, 78.8152000),
    (8, "Saurashtra Cotton Estate", 4, 140.00, "Gondal Highway, Shapar", "Rajkot", "Gujarat", "360024", 21.9421000, 70.7812000),
    (9, "Ganga Basin Agri Zone", 1, 90.00, "Mirzapur Road, Ramnagar", "Varanasi", "Uttar Pradesh", "221008", 25.2678000, 83.0315000),
    # Edge-case Farm: Empty optional coords (NULL latitude/longitude)
    (10, "Vidarbha Agro Frontier", 2, 45.00, "Taluka Katol, Kondhali Highway", "Nagpur", "Maharashtra", "441103", None, None)
]
add_statement("farms", farm_cols, farm_rows)

# -------------------------------------------------------------
# 4. FIELDS
# -------------------------------------------------------------
field_cols = ["field_id", "farm_id", "field_name", "boundary_geojson", "area_acres", "soil_type", "irrigation_source", "status"]
field_rows = [
    (1, 1, "North Plot A - Vineyard & Veg", '{"type":"Polygon","coordinates":[[[73.987,20.174],[73.990,20.174],[73.990,20.177],[73.987,20.177],[73.987,20.174]]]}', 25.00, "Black Cotton", "Drip Irrigation", "Planted"),
    (2, 1, "South Block B - Onion Terraces", '{"type":"Polygon","coordinates":[[[73.986,20.170],[73.989,20.170],[73.989,20.173],[73.986,20.173],[73.986,20.170]]]}', 30.50, "Black Cotton", "Canal", "Planted"),
    (3, 1, "East Fallow Meadow C", None, 30.00, "Red Soil", "Borewell", "Under Preparation"),
    (4, 2, "Bathinda Canal Track 1", '{"type":"Polygon","coordinates":[[[74.851,30.124],[74.856,30.124],[74.856,30.128],[74.851,30.128],[74.851,30.124]]]}', 40.00, "Alluvial", "Canal", "Planted"),
    (5, 2, "Bathinda TubeWell Track 2", '{"type":"Polygon","coordinates":[[[74.857,30.124],[74.862,30.124],[74.862,30.128],[74.857,30.128],[74.857,30.124]]]}', 45.00, "Alluvial", "Borewell", "Planted"),
    (6, 2, "Sangat Fallow Sector 3", None, 35.00, "Sandy Loam", "Rainfed", "Fallow"),
    (7, 3, "Manjri Sugarcane Block 1", '{"type":"Polygon","coordinates":[[[73.981,18.498],[73.985,18.498],[73.985,18.502],[73.981,18.502],[73.981,18.498]]]}', 35.00, "Clay Loam", "Drip Irrigation", "Planted"),
    (8, 3, "Manjri Fodder & Pulses 2", '{"type":"Polygon","coordinates":[[[73.985,18.498],[73.989,18.498],[73.989,18.502],[73.985,18.502],[73.985,18.498]]]}', 30.00, "Black Cotton", "River Lift", "Active"),
    (9, 4, "Tenali Paddy Delta 1", '{"type":"Polygon","coordinates":[[[80.640,16.243],[80.645,16.243],[80.645,16.248],[80.640,16.248],[80.640,16.243]]]}', 50.00, "Alluvial", "Canal", "Planted"),
    (10, 4, "Krishna Cotton Ridge 2", None, 45.00, "Black Cotton", "Borewell", "Active"),
    (11, 5, "Taraori Basmati Belt A", '{"type":"Polygon","coordinates":[[[76.929,29.803],[76.935,29.803],[76.935,29.808],[76.929,29.808],[76.929,29.803]]]}', 60.00, "Clay Loam", "Canal", "Planted"),
    (12, 5, "Taraori Mustard & Wheat B", '{"type":"Polygon","coordinates":[[[76.936,29.803],[76.942,29.803],[76.942,29.808],[76.936,29.808],[76.936,29.803]]]}', 50.00, "Alluvial", "Sprinkler", "Planted"),
    (13, 8, "Gondal Groundnut Zone 1", '{"type":"Polygon","coordinates":[[[70.781,21.942],[70.787,21.942],[70.787,21.947],[70.781,21.947],[70.781,21.942]]]}', 70.00, "Red Soil", "Borewell", "Planted"),
    (14, 8, "Gondal Cotton Zone 2", '{"type":"Polygon","coordinates":[[[70.788,21.942],[70.794,21.942],[70.794,21.947],[70.788,21.947],[70.788,21.942]]]}', 70.00, "Black Cotton", "Drip Irrigation", "Planted"),
    # Edge-case Field: null boundary GeoJSON and maximum acreage
    (15, 10, "Vidarbha Orange & Cotton Plot 1", None, 45.00, "Black Cotton", "Borewell", "Under Preparation")
]
add_statement("fields", field_cols, field_rows)

# -------------------------------------------------------------
# 5. CROP TYPES
# -------------------------------------------------------------
crop_cols = ["crop_id", "crop_name", "botanical_name", "crop_category", "standard_growth_days", "ideal_soil_type", "expected_yield_per_acre_kg"]
crop_rows = [
    (1, "Basmati Rice 1121", "Oryza sativa var. Basmati", "Kharif", 140, "Clay Loam / Alluvial", 2200.00),
    (2, "Sharbati Wheat", "Triticum aestivum", "Rabi", 125, "Alluvial / Loamy", 2100.00),
    (3, "Bt Cotton (Bollgard II)", "Gossypium hirsutum", "Kharif", 160, "Black Cotton Soil", 1400.00),
    (4, "Sugarcane (Co-0238)", "Saccharum officinarum", "Cash Crop", 365, "Deep Loam / Black Soil", 38000.00),
    (5, "Soybean (JS 335)", "Glycine max", "Kharif", 100, "Well-drained Black Soil", 1100.00),
    (6, "Mustard (Pusa Bold)", "Brassica juncea", "Rabi", 110, "Alluvial / Sandy Loam", 950.00),
    (7, "Chickpeas / Desi Chana (JG 11)", "Cicer arietinum", "Rabi", 105, "Clay Loam / Sandy Loam", 850.00),
    (8, "Groundnut (Kadiri 6)", "Arachis hypogaea", "Kharif", 115, "Sandy Loam / Red Soil", 1200.00),
    (9, "Maize Hybrid (Pioneer P3396)", "Zea mays", "Kharif", 110, "Alluvial / Loam", 3100.00),
    (10, "Onion (Bhima Super / Red)", "Allium cepa", "Rabi", 120, "Deep Friable Sandy Loam", 10500.00),
    (11, "Potato (Kufri Jyoti)", "Solanum tuberosum", "Rabi", 95, "Sandy Loam rich in organic matter", 12000.00),
    (12, "Turmeric (Salem Super)", "Curcuma longa", "Cash Crop", 270, "Friable Sandy / Clay Loam", 9000.00)
]
add_statement("crop_types", crop_cols, crop_rows)

# -------------------------------------------------------------
# 6. EQUIPMENT CATEGORIES
# -------------------------------------------------------------
eq_cat_cols = ["category_id", "category_name", "description"]
eq_cat_rows = [
    (1, "Tractors & Prime Movers", "Multi-utility tractors ranging from 45HP to 75HP for ploughing, haulage and PTO drives"),
    (2, "Combine Harvesters", "Multi-crop track and wheel harvesters for paddy, wheat, soybean and maize"),
    (3, "Tillage & Land Prep Implements", "Rotavators, disc ploughs, laser land levelers, cultivator tines and subsoilers"),
    (4, "Sowing & Planting Machinery", "Pneumatic precision planters, seed-cum-fertilizer drills and transplanters"),
    (5, "Sprayers & Crop Protection", "Tractor-mounted boom sprayers, mist blowers and orchard electrostatic sprayers"),
    (6, "Irrigation Pumps & Generators", "Solar borewell pump sets, diesel booster pumps and portable generators"),
    (7, "Trailers & Logistics Haulage", "Hydraulic tipping trailers, balers and grain transport buggies"),
    (8, "Harvesting Attachments & Cutters", "Straw reapers, maize header bars and chaff cutters")
]
add_statement("equipment_categories", eq_cat_cols, eq_cat_rows)

# -------------------------------------------------------------
# 7. EQUIPMENT REGISTRY
# -------------------------------------------------------------
eq_cols = ["equipment_id", "farm_id", "category_id", "name", "make_and_model", "serial_number", "purchase_date", "purchase_cost_inr", "current_meter_hours", "status", "last_serviced_date", "next_service_due_hours"]
eq_rows = [
    (1, 1, 1, "Mahindra Arjun Novo 605 DI", "Mahindra & Mahindra 60HP", "M&M-NOV-2023-8891", "2023-04-10", 940000.00, 780.50, "Active", "2024-08-15", 1000.00),
    (2, 1, 5, "ASPEE HTP Tractor Boom Sprayer", "ASPEE Agri-400L", "ASP-BOM-2023-4102", "2023-05-18", 185000.00, 310.00, "Active", "2024-09-01", 500.00),
    (3, 1, 3, "Shaktiman Regular Smart Rotavator", "Shaktiman 7-Feet", "SHK-ROTA-2023-1120", "2023-06-12", 135000.00, 240.00, "Idle", "2024-05-10", 400.00),
    (4, 2, 1, "John Deere 5310 PowerTech", "John Deere 55HP 4WD", "JD-5310-2022-9904", "2022-10-15", 1120000.00, 1420.00, "Active", "2024-10-02", 1500.00),
    (5, 2, 2, "Preet 987 Combine Harvester", "Preet Agro Self-Propelled", "PRT-987-2022-0043", "2022-11-20", 2450000.00, 680.00, "In Maintenance", "2024-10-25", 700.00),
    (6, 2, 7, "Standard Hydraulic Tipping Trolley", "Standard Agro 5-Tonne", "STD-TRL-2022-5512", "2022-11-25", 210000.00, 890.00, "Active", "2024-04-12", 1200.00),
    (7, 3, 1, "Sonalika Tiger DI 75 4WD", "Sonalika International 75HP", "SNL-TIG-2023-6611", "2023-02-14", 1280000.00, 620.00, "Active", "2024-07-19", 750.00),
    (8, 3, 3, "Lemken Opal 090 Hydraulic Reversible Plough", "Lemken India 3-Furrow", "LMK-OPL-2023-2289", "2023-03-05", 245000.00, 195.00, "Active", "2024-06-18", 350.00),
    (9, 4, 1, "Swaraj 855 FE High Torque", "Swaraj Tractors 52HP", "SWR-855-2021-3312", "2021-08-20", 860000.00, 1890.00, "Active", "2024-09-14", 2000.00),
    (10, 4, 6, "Kirloskar Diesel High-Lift Pump 10HP", "Kirloskar DM-10", "KIR-PMP-2021-7781", "2021-09-02", 95000.00, 2150.00, "Active", "2024-08-20", 2300.00),
    (11, 5, 2, "Kubota DC-68G Harvester", "Kubota Paddy Master Crawler", "KUB-DC68-2023-1490", "2023-07-10", 2780000.00, 490.00, "Active", "2024-10-11", 600.00),
    (12, 5, 4, "National Zero Till Seed-Cum-Fertilizer Drill", "National Agro 11-Tyne", "NAT-ZTD-2023-9012", "2023-08-01", 98000.00, 180.00, "Idle", "2024-03-25", 300.00),
    (13, 8, 1, "New Holland 3630 TX Special Edition", "New Holland 50HP", "NH-3630-2020-4491", "2020-05-15", 890000.00, 2350.00, "In Maintenance", "2024-11-01", 2400.00),
    # Edge-case Equipment: Decommissioned older pump with 0 purchase cost recorded warranty replacement
    (14, 1, 6, "Texmo Submersible Pump 7.5HP (Retired)", "Texmo Aqua Prime", "TXM-SUB-2018-0012", "2018-02-10", 42000.00, 4500.00, "Decommissioned", "2022-01-15", None)
]
add_statement("equipment", eq_cols, eq_rows)

# -------------------------------------------------------------
# 8. SUPPLIERS
# -------------------------------------------------------------
sup_cols = ["supplier_id", "company_name", "contact_person", "phone", "email", "address", "city", "state", "gst_number"]
sup_rows = [
    (1, "Mahindra & Swaraj Genuine Spares Depot", "Virendra Kulkarni", "+91-9823011223", "spares@mahindradepot.in", "Plot 45, MIDC Ambad", "Nashik", "Maharashtra", "27AABCM8891Q1Z4"),
    (2, "Kisan Agro Seed & Biotechnology Corp", "Harpreet Singh Brar", "+91-9814022334", "sales@kisanseeds.in", "Grain Market Yard, Shop 12", "Bathinda", "Punjab", "03AAACK4421M1Z8"),
    (3, "Coromandel Agrico & Fertilizers Ltd", "Ravi Shankar Murthy", "+91-9848033445", "supply@coromandelagri.com", "Auto Nagar Road 5", "Guntur", "Andhra Pradesh", "37AAACC1129F1ZL"),
    (4, "Jain Irrigation Systems Supply Hub", "Pramod Chaudhari", "+91-9423044556", "dripcare@jains.com", "Jain Plastic Park, NH 6", "Jalgaon", "Maharashtra", "27AAACJ2281P1ZP"),
    (5, "Shaktiman Agro Parts & Implements Ltd", "Dinesh Patel", "+91-9825055667", "parts@shaktimanagro.com", "Survey 281, NH 27, Shapar", "Rajkot", "Gujarat", "24AAACS9981K1Z2"),
    (6, "IFFCO Farmer Service & Fertilizer Center", "Satish Dalal", "+91-9416066778", "iffco.karnal@iffco.in", "Kunjpura Road", "Karnal", "Haryana", "06AAACI3391D1ZQ"),
    (7, "Bayer CropScience India Regional Center", "Anand Kulkarni", "+91-9820077889", "orders@bayercropscience.in", "Magarpatta Cyber City", "Pune", "Maharashtra", "27AAACB5512B1ZR"),
    (8, "Syngenta India Agriculture Logistics", "Balaji Rao", "+91-9940088990", "logistics@syngenta.in", "Trichy Agri Complex", "Tiruchirappalli", "Tamil Nadu", "33AAACS7712E1ZS"),
    (9, "Kirloskar Pump & Motor Spares Agency", "Sundaram Pillai", "+91-9443099001", "service@kirloskarspares.in", "Avanashi Road", "Coimbatore", "Tamil Nadu", "33AAACK4401L1ZT"),
    (10, "John Deere Northern Spares Network", "Jaswinder Bhullar", "+91-9872011225", "dealer@johndeerepunjab.in", "Industrial Area Phase 2", "Chandigarh", "Punjab", "04AAACJ6631G1ZU"),
    (11, "Godrej Agrovet Inputs & Feeds", "Manish Tiwari", "+91-9755022336", "agri@godrejagrovet.com", "Sanwer Industrial Area", "Indore", "Madhya Pradesh", "23AAACG1102A1ZV"),
    # Edge-case supplier with max-length company name
    (12, "All-India Unified Apex Cooperative Agricultural Produce Marketing And Farm Machinery Federation Private Limited", "Rajeev Ranjan", "+91-9431033447", "apex.federation@agricoop.in", "Station Road Complex", "Varanasi", "Uttar Pradesh", "09AAACA9921C1ZW")
]
add_statement("suppliers", sup_cols, sup_rows)

# -------------------------------------------------------------
# 9. SPARE PARTS
# -------------------------------------------------------------
sp_cols = ["part_id", "part_number", "name", "category", "equipment_category_id", "unit_price_inr", "current_stock", "minimum_reorder_level", "unit_of_measure", "supplier_id"]
sp_rows = [
    (1, "FLT-OIL-MM605", "Mahindra Arjun Engine Oil Filter Cartridge", "Filters", 1, 580.00, 18, 5, "Units", 1),
    (2, "FLT-DSL-JD5310", "John Deere Dual Stage Fuel Filter Element", "Filters", 1, 920.00, 12, 4, "Units", 10),
    (3, "LUB-HYD-68-20L", "Shell Spirax 68 Premium Hydraulic Oil 20L Bucket", "Lubricants", 1, 4850.00, 6, 3, "Buckets", 1),
    (4, "BLD-ROT-SHK7", "Shaktiman Boron Steel Rotavator Curved Blades (Set of 6)", "Wear Parts", 3, 1450.00, 24, 8, "Sets", 5),
    (5, "HAR-KNF-PRT987", "Preet Combine Serrated Knife Section Kit (48 Pcs)", "Cutting Components", 2, 3200.00, 4, 3, "Kits", 2),
    (6, "NZL-SPR-ASPEE", "TeeJet Hollow Cone Brass Spray Nozzle Kit (8 Pcs)", "Sprayer Parts", 5, 1150.00, 15, 5, "Sets", 4),
    (7, "BLT-V-B64", "High-Torque V-Belt B-64 Kevlar Reinforced", "Drive Belts", 1, 680.00, 14, 5, "Units", 1),
    (8, "RAD-CLN-5L", "Ethylene Glycol Heavy Duty Coolant 5L Canister", "Fluids", 1, 950.00, 20, 6, "Cans", 1),
    (9, "BAT-12V-88AH", "Amaron Hi-Life Heavy Commercial Battery 12V 88Ah", "Electrical", 1, 7400.00, 3, 2, "Units", 1),
    (10, "FLT-AIR-KUBOTA", "Kubota Harvester Heavy Duty Dual Air Cleaner Inner+Outer", "Filters", 2, 2800.00, 2, 3, "Sets", 10), # low stock alert!
    (11, "BRG-PLW-LMK", "Lemken Reversible Disc Hub Taper Roller Bearing", "Bearings", 3, 1650.00, 8, 4, "Units", 5),
    (12, "PTO-UJT-SWR", "Universal Joint Cross Spider Kit 35x106.5 for Swaraj PTO", "Transmission", 1, 1380.00, 9, 4, "Units", 1),
    (13, "VLV-DRP-JAIN", "Jain 2-Inch Hydrocyclone Sand Filter Flush Valve", "Irrigation Parts", 6, 2100.00, 7, 3, "Units", 4),
    (14, "SHR-BLT-NAT", "Grade 8.8 High-Tensile Shear Pins for Planter (Pack of 20)", "Fasteners", 4, 450.00, 25, 10, "Packs", 5),
    # Edge-case Part: zero stock for out-of-stock validation check
    (15, "CHN-ELEV-KUBOTA", "Kubota Grain Elevator Roller Drive Chain Link ASM", "Chains", 2, 4200.00, 0, 2, "Units", 10)
]
add_statement("spare_parts", sp_cols, sp_rows)

# -------------------------------------------------------------
# 10. CROP PLANTINGS (55 rows across 2024 - 2026)
# -------------------------------------------------------------
plant_cols = ["planting_id", "field_id", "crop_id", "season", "sowing_date", "expected_harvest_date", "actual_harvest_date", "target_yield_kg", "actual_yield_kg", "current_stage", "status", "notes"]
plant_rows = []

seasons = [
    ("Kharif 2024", "2024-06-15", "2024-10-25"),
    ("Rabi 2024-25", "2024-11-10", "2025-03-20"),
    ("Zaid 2025", "2025-04-01", "2025-06-28"),
    ("Kharif 2025", "2025-06-20", "2025-10-30"),
    ("Rabi 2025-26", "2025-11-05", "2026-03-25"),
    ("Kharif 2026", "2026-06-10", "2026-10-20")
]

plant_id = 1
for s_idx, (s_name, s_start, s_end) in enumerate(seasons):
    for f_id in range(1, 15):
        if plant_id > 55:
            break
        c_id = ((f_id + s_idx) % 12) + 1
        target_yield = round(random.uniform(18000, 75000), 2)
        
        # Decide status based on season
        if "2024" in s_name:
            actual_yield = round(target_yield * random.uniform(0.92, 1.08), 2)
            stage = "Completed"
            status = "Harvested"
            act_date = s_end
        elif "2025" in s_name:
            if "Kharif" in s_name:
                actual_yield = round(target_yield * random.uniform(0.90, 1.05), 2)
                stage = "Completed"
                status = "Harvested"
                act_date = s_end
            else:
                actual_yield = None
                stage = "Flowering" if "Rabi" in s_name else "Maturity"
                status = "In Progress"
                act_date = None
        else: # 2026
            actual_yield = None
            stage = "Land Preparation"
            status = "Planned"
            act_date = None
            
        note = f"Rotational crop cycle for {s_name} on Field #{f_id}. Soil test recommended prior to nitrogen top-dressing."
        plant_rows.append((plant_id, f_id, c_id, s_name, s_start, s_end, act_date, target_yield, actual_yield, stage, status, note))
        plant_id += 1

# Edge-case planting: empty optional notes and null actuals
plant_rows.append((56, 1, 1, "Kharif 2024 (Trial Edge)", "2024-06-10", "2024-10-15", "2024-10-14", 25000.00, 24800.00, "Completed", "Harvested", None))
add_statement("crop_plantings", plant_cols, plant_rows)

# -------------------------------------------------------------
# 11. FIELD OPERATIONS (65 rows)
# -------------------------------------------------------------
op_cols = ["operation_id", "planting_id", "operation_type", "scheduled_date", "completion_date", "status", "assigned_to_user_id", "equipment_id", "notes"]
op_rows = []
op_types = ["Ploughing", "Harrowing", "Sowing", "Fertilizer Application", "Pesticide Spray", "Weeding", "Irrigation", "Harvesting"]
user_ids = [7, 8, 9, 10, 11]
eq_ids = [1, 2, 3, 4, 5, 7, 8, 9, 11]

for op_id in range(1, 66):
    p_id = (op_id % 50) + 1
    op_type = op_types[(op_id - 1) % len(op_types)]
    sched_year = 2024 if op_id <= 30 else (2025 if op_id <= 55 else 2026)
    month = ((op_id * 2) % 11) + 1
    day = ((op_id * 3) % 27) + 1
    sched_date = f"{sched_year}-{month:02d}-{day:02d}"
    
    if sched_year <= 2024 or (sched_year == 2025 and month <= 8):
        comp_date = sched_date
        status = "Completed"
    elif sched_year == 2025:
        comp_date = None
        status = "In Progress" if op_id % 2 == 0 else "Scheduled"
    else:
        comp_date = None
        status = "Scheduled"
        
    u_id = user_ids[op_id % len(user_ids)]
    e_id = eq_ids[op_id % len(eq_ids)] if op_type in ["Ploughing", "Harrowing", "Sowing", "Harvesting", "Pesticide Spray"] else None
    notes = f"Executed {op_type} according to the agronomic protocol. Target depth and calibration verified."
    op_rows.append((op_id, p_id, op_type, sched_date, comp_date, status, u_id, e_id, notes))

add_statement("field_operations", op_cols, op_rows)

# -------------------------------------------------------------
# 12. FARM INPUTS & COSTS (75 rows)
# -------------------------------------------------------------
cost_cols = ["cost_id", "planting_id", "operation_id", "input_type", "item_name", "quantity", "unit", "unit_cost_inr", "total_cost_inr", "expense_date", "receipt_number", "supplier_id", "recorded_by_user_id"]
cost_rows = []
inputs_data = [
    ("Seed", "Certified High-Yield Hybrid Seed Bags", 20.0, "Bags", 1250.00, 2),
    ("Fertilizer", "IFFCO DAP (Di-Ammonium Phosphate 50kg)", 35.0, "Bags", 1350.00, 6),
    ("Fertilizer", "Neem Coated Urea (45kg)", 50.0, "Bags", 266.50, 6),
    ("Fertilizer", "MOP (Muriate of Potash 50kg)", 15.0, "Bags", 1700.00, 3),
    ("Pesticide", "Coragen Chlorantraniliprole 18.5% SC", 5.0, "Litres", 8500.00, 7),
    ("Pesticide", "Bayer Nativo Fungicide 1kg", 4.0, "Kg", 4800.00, 7),
    ("Fuel", "High Speed Diesel (HSD) for Tractors", 250.0, "Litres", 92.50, 1),
    ("Labor", "Transplanting & Weeding Daily Labor Crew", 20.0, "Man-days", 450.00, None),
    ("Water/Irrigation", "Canal Water Cess & Electricity Billing", 1.0, "Seasonal Lot", 3500.00, None),
    ("Machinery Rental", "Laser Land Leveling Service (4 Hours)", 4.0, "Hours", 1200.00, 5)
]

for c_id in range(1, 76):
    p_id = (c_id % 50) + 1
    op_id = (c_id % 60) + 1
    inp = inputs_data[(c_id - 1) % len(inputs_data)]
    inp_type, item_name, qty, unit, unit_cost, sup_id = inp
    total_cost = round(qty * unit_cost, 2)
    yr = 2024 if c_id <= 35 else (2025 if c_id <= 60 else 2026)
    m = ((c_id * 3) % 11) + 1
    d = ((c_id * 5) % 27) + 1
    exp_date = f"{yr}-{m:02d}-{d:02d}"
    rcpt = f"RCPT-AGR-{yr}-{c_id:04d}" if c_id % 5 != 0 else None
    rec_by = 2 if c_id % 3 == 0 else (3 if c_id % 3 == 1 else 4)
    cost_rows.append((c_id, p_id, op_id, inp_type, item_name, qty, unit, unit_cost, total_cost, exp_date, rcpt, sup_id, rec_by))

# Edge-case: high-value farm input transaction
cost_rows.append((76, 1, 1, "Machinery Rental", "Specialized Heavy Crane & Soil Subsoiler Contract", 1.0, "Turnkey", 125000.00, 125000.00, "2024-05-20", "RCPT-EDGE-001", 5, 2))
add_statement("farm_inputs_costs", cost_cols, cost_rows)

# -------------------------------------------------------------
# 13. YIELD RECORDS (52 rows)
# -------------------------------------------------------------
yield_cols = ["yield_id", "planting_id", "harvest_date", "gross_yield_kg", "net_yield_kg", "quality_grade", "market_price_per_kg_inr", "total_revenue_inr", "storage_location", "buyer_name"]
yield_rows = []
grades = ["Grade A (Export/Premium)", "Grade B (Standard Market)", "Grade C (Processing/Fair)"]
buyers = [
    "Adani Agri Logistics Ltd", "ITC Choupal Sagar Mandi", "Punjab State Grains Procurement Corp (PUNGRAIN)",
    "Maharashtra State Agricultural Marketing Board", "Godrej Agrovet Procurement", "BigBasket Farm Direct",
    "Reliance Fresh Direct Agro", "National Agricultural Cooperative Marketing Federation (NAFED)"
]
storages = ["Warehouse Silo 4, Bathinda", "Central Cold Storage, Pimpalgaon", "Nashik APMC Mandi Shed #2", "Tenali Grain Godown", "Karnal Food Park Silo"]

for y_id in range(1, 53):
    p_id = y_id # mapping directly to completed/harvested plantings
    yr = 2024 if y_id <= 35 else 2025
    m = ((y_id * 2) % 6) + 5
    d = ((y_id * 4) % 27) + 1
    h_date = f"{yr}-{m:02d}-{d:02d}"
    gross = round(random.uniform(15000, 65000), 2)
    net = round(gross * random.uniform(0.95, 0.98), 2)
    grade = grades[y_id % 3]
    price = round(random.uniform(22.50, 85.00), 2)
    revenue = round(net * price, 2)
    storage = storages[y_id % len(storages)]
    buyer = buyers[y_id % len(buyers)]
    yield_rows.append((y_id, p_id, h_date, gross, net, grade, price, revenue, storage, buyer))

add_statement("yield_records", yield_cols, yield_rows)

# -------------------------------------------------------------
# 14. MAINTENANCE RECORDS (52 rows)
# -------------------------------------------------------------
maint_cols = ["maintenance_id", "equipment_id", "maintenance_type", "title", "description", "scheduled_date", "completion_date", "meter_hours_at_service", "labor_cost_inr", "parts_cost_inr", "total_cost_inr", "status", "technician_name", "next_service_due_hours", "next_service_due_date"]
maint_rows = []
m_types = ["Preventive Service", "Breakdown Repair", "Overhaul", "Inspection"]
techs = ["Dilip Sharma (Authorized M&M)", "Paramjit Motor Works", "Nashik Hydraulic Specialists", "Swaraj Field Engineer", "Kirloskar Pump Authorized"]

for m_id in range(1, 53):
    e_id = (m_id % 13) + 1
    m_type = m_types[(m_id - 1) % len(m_types)]
    yr = 2024 if m_id <= 30 else (2025 if m_id <= 48 else 2026)
    m = ((m_id * 2) % 11) + 1
    d = ((m_id * 3) % 27) + 1
    sched = f"{yr}-{m:02d}-{d:02d}"
    hours = round(100.0 + (m_id * 45.5), 2)
    
    if yr <= 2024 or (yr == 2025 and m <= 6):
        comp = sched
        status = "Completed"
        labor = round(random.uniform(800, 3500), 2)
        parts = round(random.uniform(1200, 15000), 2)
    elif yr == 2025:
        comp = None
        status = "In Progress" if m_id % 2 == 0 else "Scheduled"
        labor = 1500.00
        parts = 0.00
    else:
        comp = None
        status = "Scheduled"
        labor = 0.00
        parts = 0.00
        
    total = round(labor + parts, 2)
    title = f"{m_type} for Fleet Asset #{e_id}"
    desc = f"Conducted full diagnostic, checked fluid levels, inspected belt tension and torque specifications."
    tech = techs[m_id % len(techs)]
    next_hrs = round(hours + 250.0, 2)
    next_d = f"{yr + 1}-03-15"
    maint_rows.append((m_id, e_id, m_type, title, desc, sched, comp, hours, labor, parts, total, status, tech, next_hrs, next_d))

# Edge-case: Zero cost warranty maintenance with max-length description
long_desc = "Standard 50-hour manufacturer mandatory break-in inspection under warranty coverage. Checked high-pressure hydraulic lines, valve lash clearances, steering backlash, differential lock engagement, PTO shaft alignment, battery terminal resistance, and safety interlock switches with zero customer liability."
maint_rows.append((53, 1, "Inspection", "Mandatory First Warranty Inspection", long_desc, "2024-04-25", "2024-04-25", 52.0, 0.00, 0.00, 0.00, "Completed", "Authorized Mahindra Tech", 250.0, "2024-10-25"))
add_statement("maintenance_records", maint_cols, maint_rows)

# -------------------------------------------------------------
# 15. MAINTENANCE PARTS USED (52 rows)
# -------------------------------------------------------------
mpu_cols = ["usage_id", "maintenance_id", "part_id", "quantity_used", "unit_price_inr", "total_cost_inr"]
mpu_rows = []

for u_id in range(1, 53):
    m_id = ((u_id - 1) % 50) + 1
    p_id = ((u_id - 1) % 14) + 1
    qty = random.choice([1, 2, 4])
    price = sp_rows[p_id - 1][5] # unit_price_inr from spare_parts
    tot = round(qty * price, 2)
    mpu_rows.append((u_id, m_id, p_id, qty, price, tot))

add_statement("maintenance_parts_used", mpu_cols, mpu_rows)

# -------------------------------------------------------------
# 16. EQUIPMENT UTILIZATION LOGS (62 rows)
# -------------------------------------------------------------
util_cols = ["log_id", "equipment_id", "operation_id", "operator_user_id", "log_date", "start_time", "end_time", "operating_hours", "idle_hours", "fuel_consumed_litres", "work_area_acres", "task_description"]
util_rows = []

for l_id in range(1, 63):
    e_id = (l_id % 13) + 1
    op_id = (l_id % 60) + 1
    op_user = user_ids[l_id % len(user_ids)]
    yr = 2024 if l_id <= 30 else (2025 if l_id <= 55 else 2026)
    m = ((l_id * 2) % 11) + 1
    d = ((l_id * 3) % 27) + 1
    log_d = f"{yr}-{m:02d}-{d:02d}"
    start_t = "07:30:00"
    end_t = "16:00:00"
    op_hours = round(random.uniform(4.5, 7.5), 2)
    idle_hours = round(random.uniform(0.5, 1.8), 2)
    fuel = round(op_hours * random.uniform(4.2, 7.8), 2)
    area = round(op_hours * random.uniform(1.2, 2.5), 2)
    task_desc = f"Field operations with equipment #{e_id}: Land tilling, seed bed preparation and spray application across {area} acres."
    util_rows.append((l_id, e_id, op_id, op_user, log_d, start_t, end_t, op_hours, idle_hours, fuel, area, task_desc))

add_statement("equipment_utilization_logs", util_cols, util_rows)

# -------------------------------------------------------------
# 17. SPARE PART ORDERS (52 rows)
# -------------------------------------------------------------
spo_cols = ["order_id", "supplier_id", "part_id", "order_date", "quantity", "unit_price_inr", "total_amount_inr", "delivery_status", "received_date"]
spo_rows = []
statuses = ["Delivered", "Delivered", "Delivered", "Shipped", "Pending"]

for o_id in range(1, 53):
    s_id = ((o_id - 1) % 11) + 1
    p_id = ((o_id - 1) % 14) + 1
    yr = 2024 if o_id <= 30 else (2025 if o_id <= 45 else 2026)
    m = ((o_id * 2) % 11) + 1
    d = ((o_id * 3) % 25) + 1
    o_date = f"{yr}-{m:02d}-{d:02d}"
    qty = random.randint(5, 30)
    u_price = sp_rows[p_id - 1][5]
    total_amt = round(qty * u_price, 2)
    st = statuses[(o_id - 1) % len(statuses)]
    rec_date = f"{yr}-{m:02d}-{d+3:02d}" if st == "Delivered" else None
    spo_rows.append((o_id, s_id, p_id, o_date, qty, u_price, total_amt, st, rec_date))

add_statement("spare_part_orders", spo_cols, spo_rows)

# Write out SQL file
header = """-- =============================================================================
-- HarvestHub - Comprehensive Farm Management & Crop Planning Platform
-- Sample Seed Data Script (MySQL 8.0, InnoDB, utf8mb4)
-- Real-world Indian agricultural context, 2024 - 2026 dates, INR currency
-- Includes 10-15 master rows, 50-100 transaction rows, and 5 edge-case records
-- =============================================================================

USE `harvesthub_db`;

SET FOREIGN_KEY_CHECKS = 0;
"""

footer = """
SET FOREIGN_KEY_CHECKS = 1;
-- End of Seed Data Script
"""

with open(output_sql, "w", encoding="utf-8") as f:
    f.write(header + "\n\n".join(sql_statements) + footer)

print("Successfully generated seed_data.sql and CSV files!")
