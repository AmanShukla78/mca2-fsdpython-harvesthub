-- ============================================================
-- HarvestHub - Farm Management & Crop Planning Platform
-- MySQL 8.0 schema (3NF, InnoDB, utf8mb4)
-- Run this file first, then seed_data.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS harvesthub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE harvesthub;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS purchase_order_items, purchase_orders, equipment_usage_logs,
    maintenance_parts_used, maintenance_logs, maintenance_schedules, yield_records,
    cost_records, input_usage, field_operations, planting_schedules, crop_rotation_plans,
    spare_parts, inputs, input_categories, equipment, equipment_categories, suppliers,
    crop_varieties, crops, fields, farms, soil_types, users, roles;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------- Users and roles ----------
CREATE TABLE roles (
    role_id      INT AUTO_INCREMENT PRIMARY KEY,
    role_name    VARCHAR(50)  NOT NULL UNIQUE,
    description  VARCHAR(255) NULL
) ENGINE=InnoDB;

CREATE TABLE users (
    user_id        INT AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(50)  NOT NULL UNIQUE,
    email          VARCHAR(120) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    full_name      VARCHAR(100) NOT NULL,
    phone          VARCHAR(20)  NULL,
    role_id        INT NOT NULL,
    is_active      TINYINT(1)   NOT NULL DEFAULT 1,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id)
) ENGINE=InnoDB;

-- ---------- Module 1: Field and crop mapping ----------
CREATE TABLE soil_types (
    soil_type_id  INT AUTO_INCREMENT PRIMARY KEY,
    soil_name     VARCHAR(60)  NOT NULL UNIQUE,
    description   VARCHAR(255) NULL
) ENGINE=InnoDB;

CREATE TABLE farms (
    farm_id     INT AUTO_INCREMENT PRIMARY KEY,
    farm_name   VARCHAR(150) NOT NULL,
    owner_id    INT NOT NULL,
    village     VARCHAR(100) NULL,
    district    VARCHAR(100) NOT NULL,
    state       VARCHAR(100) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_farms_owner FOREIGN KEY (owner_id) REFERENCES users(user_id),
    INDEX idx_farms_location (state, district)
) ENGINE=InnoDB;

CREATE TABLE fields (
    field_id         INT AUTO_INCREMENT PRIMARY KEY,
    farm_id          INT NOT NULL,
    soil_type_id     INT NOT NULL,
    field_name       VARCHAR(100) NOT NULL,
    area_acres       DECIMAL(8,2) NOT NULL,
    latitude         DECIMAL(9,6) NULL,
    longitude        DECIMAL(9,6) NULL,
    irrigation_type  ENUM('canal','tube_well','drip','sprinkler','rainfed') NULL,
    status           ENUM('active','fallow','inactive') NOT NULL DEFAULT 'active',
    UNIQUE KEY uk_field_per_farm (farm_id, field_name),
    CONSTRAINT chk_field_area CHECK (area_acres > 0),
    CONSTRAINT fk_fields_farm FOREIGN KEY (farm_id) REFERENCES farms(farm_id),
    CONSTRAINT fk_fields_soil FOREIGN KEY (soil_type_id) REFERENCES soil_types(soil_type_id)
) ENGINE=InnoDB;

CREATE TABLE crops (
    crop_id            INT AUTO_INCREMENT PRIMARY KEY,
    crop_name          VARCHAR(80) NOT NULL UNIQUE,
    crop_type          ENUM('cereal','pulse','oilseed','cash_crop','vegetable','fibre') NOT NULL,
    season             ENUM('Kharif','Rabi','Zaid') NOT NULL,
    avg_duration_days  SMALLINT UNSIGNED NOT NULL,
    notes              VARCHAR(255) NULL
) ENGINE=InnoDB;

CREATE TABLE crop_varieties (
    variety_id                  INT AUTO_INCREMENT PRIMARY KEY,
    crop_id                     INT NOT NULL,
    variety_name                VARCHAR(100) NOT NULL,
    expected_yield_kg_per_acre  DECIMAL(9,2) NULL,
    UNIQUE KEY uk_variety_per_crop (crop_id, variety_name),
    CONSTRAINT fk_variety_crop FOREIGN KEY (crop_id) REFERENCES crops(crop_id)
) ENGINE=InnoDB;

-- ---------- Suppliers (used by inputs, spare parts, purchase orders) ----------
CREATE TABLE suppliers (
    supplier_id     INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name   VARCHAR(120) NOT NULL UNIQUE,
    contact_person  VARCHAR(100) NULL,
    phone           VARCHAR(20)  NOT NULL,
    email           VARCHAR(120) NULL,
    address         VARCHAR(255) NULL,
    city            VARCHAR(80)  NOT NULL,
    state           VARCHAR(80)  NOT NULL
) ENGINE=InnoDB;

-- ---------- Module 5: Equipment registry and inventory ----------
CREATE TABLE equipment_categories (
    category_id    INT AUTO_INCREMENT PRIMARY KEY,
    category_name  VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE equipment (
    equipment_id     INT AUTO_INCREMENT PRIMARY KEY,
    category_id      INT NOT NULL,
    equipment_name   VARCHAR(120) NOT NULL,
    registration_no  VARCHAR(40)  NOT NULL UNIQUE,
    make             VARCHAR(60)  NULL,
    model            VARCHAR(60)  NULL,
    purchase_date    DATE NULL,
    purchase_cost    DECIMAL(12,2) NULL,
    hourly_cost      DECIMAL(8,2) NOT NULL DEFAULT 0,
    status           ENUM('available','in_use','under_maintenance','retired') NOT NULL DEFAULT 'available',
    CONSTRAINT fk_equipment_category FOREIGN KEY (category_id) REFERENCES equipment_categories(category_id),
    INDEX idx_equipment_status (status)
) ENGINE=InnoDB;

CREATE TABLE input_categories (
    input_category_id  INT AUTO_INCREMENT PRIMARY KEY,
    category_name      VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE inputs (
    input_id           INT AUTO_INCREMENT PRIMARY KEY,
    input_category_id  INT NOT NULL,
    supplier_id        INT NULL,
    input_name         VARCHAR(120) NOT NULL UNIQUE,
    unit               VARCHAR(20)  NOT NULL,
    unit_cost          DECIMAL(10,2) NOT NULL,
    quantity_on_hand   DECIMAL(12,2) NOT NULL DEFAULT 0,
    reorder_level      DECIMAL(12,2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_inputs_category FOREIGN KEY (input_category_id) REFERENCES input_categories(input_category_id),
    CONSTRAINT fk_inputs_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
) ENGINE=InnoDB;

-- ---------- Module 8: Spare parts and supply management ----------
CREATE TABLE spare_parts (
    part_id                INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id            INT NULL,
    equipment_category_id  INT NULL,
    part_name              VARCHAR(120) NOT NULL,
    part_number            VARCHAR(50)  NOT NULL UNIQUE,
    unit_price             DECIMAL(10,2) NOT NULL,
    quantity_on_hand       INT NOT NULL DEFAULT 0,
    reorder_level          INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_parts_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    CONSTRAINT fk_parts_category FOREIGN KEY (equipment_category_id) REFERENCES equipment_categories(category_id)
) ENGINE=InnoDB;

-- ---------- Module 2: Planting and harvesting scheduling ----------
CREATE TABLE crop_rotation_plans (
    plan_id     INT AUTO_INCREMENT PRIMARY KEY,
    field_id    INT NOT NULL,
    variety_id  INT NOT NULL,
    plan_year   SMALLINT NOT NULL,
    season      ENUM('Kharif','Rabi','Zaid') NOT NULL,
    created_by  INT NOT NULL,
    notes       VARCHAR(255) NULL,
    UNIQUE KEY uk_plan_field_season (field_id, plan_year, season),
    CONSTRAINT fk_plan_field   FOREIGN KEY (field_id)   REFERENCES fields(field_id),
    CONSTRAINT fk_plan_variety FOREIGN KEY (variety_id) REFERENCES crop_varieties(variety_id),
    CONSTRAINT fk_plan_user    FOREIGN KEY (created_by) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE planting_schedules (
    planting_id           INT AUTO_INCREMENT PRIMARY KEY,
    field_id              INT NOT NULL,
    variety_id            INT NOT NULL,
    plan_id               INT NULL,
    planned_sowing_date   DATE NOT NULL,
    actual_sowing_date    DATE NULL,
    planned_harvest_date  DATE NOT NULL,
    actual_harvest_date   DATE NULL,
    area_planted_acres    DECIMAL(8,2) NOT NULL,
    status                ENUM('planned','sown','harvested','cancelled') NOT NULL DEFAULT 'planned',
    CONSTRAINT chk_planting_dates CHECK (planned_harvest_date > planned_sowing_date),
    CONSTRAINT fk_planting_field   FOREIGN KEY (field_id)   REFERENCES fields(field_id),
    CONSTRAINT fk_planting_variety FOREIGN KEY (variety_id) REFERENCES crop_varieties(variety_id),
    CONSTRAINT fk_planting_plan    FOREIGN KEY (plan_id)    REFERENCES crop_rotation_plans(plan_id),
    INDEX idx_planting_status (status),
    INDEX idx_planting_sowing (planned_sowing_date)
) ENGINE=InnoDB;

CREATE TABLE field_operations (
    operation_id    INT AUTO_INCREMENT PRIMARY KEY,
    planting_id     INT NOT NULL,
    operation_type  ENUM('ploughing','sowing','irrigation','fertilizing','spraying','weeding','harvesting') NOT NULL,
    operation_date  DATE NOT NULL,
    assigned_to     INT NOT NULL,
    status          ENUM('scheduled','completed','cancelled') NOT NULL DEFAULT 'scheduled',
    notes           VARCHAR(255) NULL,
    CONSTRAINT fk_ops_planting FOREIGN KEY (planting_id) REFERENCES planting_schedules(planting_id),
    CONSTRAINT fk_ops_user     FOREIGN KEY (assigned_to) REFERENCES users(user_id),
    INDEX idx_ops_date (operation_date)
) ENGINE=InnoDB;

-- ---------- Module 3: Input and cost tracking ----------
CREATE TABLE input_usage (
    usage_id      INT AUTO_INCREMENT PRIMARY KEY,
    planting_id   INT NOT NULL,
    input_id      INT NOT NULL,
    operation_id  INT NULL,
    quantity      DECIMAL(12,2) NOT NULL,
    usage_date    DATE NOT NULL,
    cost_amount   DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_usage_planting  FOREIGN KEY (planting_id)  REFERENCES planting_schedules(planting_id),
    CONSTRAINT fk_usage_input     FOREIGN KEY (input_id)     REFERENCES inputs(input_id),
    CONSTRAINT fk_usage_operation FOREIGN KEY (operation_id) REFERENCES field_operations(operation_id),
    INDEX idx_usage_date (usage_date)
) ENGINE=InnoDB;

CREATE TABLE cost_records (
    cost_id      INT AUTO_INCREMENT PRIMARY KEY,
    planting_id  INT NOT NULL,
    cost_type    ENUM('labour','irrigation','transport','equipment_rent','other') NOT NULL,
    amount       DECIMAL(12,2) NOT NULL,
    cost_date    DATE NOT NULL,
    description  VARCHAR(255) NULL,
    CONSTRAINT fk_cost_planting FOREIGN KEY (planting_id) REFERENCES planting_schedules(planting_id),
    INDEX idx_cost_date (cost_date)
) ENGINE=InnoDB;

-- ---------- Module 4: Yield analysis and forecasting ----------
CREATE TABLE yield_records (
    yield_id              INT AUTO_INCREMENT PRIMARY KEY,
    planting_id           INT NOT NULL UNIQUE,
    harvest_date          DATE NOT NULL,
    quantity_kg           DECIMAL(12,2) NOT NULL,
    quality_grade         ENUM('A','B','C') NOT NULL,
    selling_price_per_kg  DECIMAL(8,2) NOT NULL,
    revenue_amount        DECIMAL(14,2) GENERATED ALWAYS AS (quantity_kg * selling_price_per_kg) STORED,
    CONSTRAINT fk_yield_planting FOREIGN KEY (planting_id) REFERENCES planting_schedules(planting_id)
) ENGINE=InnoDB;

-- ---------- Module 6: Maintenance scheduling and tracking ----------
CREATE TABLE maintenance_schedules (
    schedule_id     INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id    INT NOT NULL,
    task_name       VARCHAR(100) NOT NULL,
    interval_days   SMALLINT UNSIGNED NOT NULL,
    last_done_date  DATE NULL,
    next_due_date   DATE NOT NULL,
    priority        ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
    UNIQUE KEY uk_task_per_equipment (equipment_id, task_name),
    CONSTRAINT fk_msched_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id),
    INDEX idx_msched_due (next_due_date)
) ENGINE=InnoDB;

CREATE TABLE maintenance_logs (
    log_id          INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id    INT NOT NULL,
    schedule_id     INT NULL,
    performed_on    DATE NOT NULL,
    performed_by    INT NOT NULL,
    labour_cost     DECIMAL(10,2) NOT NULL DEFAULT 0,
    downtime_hours  DECIMAL(6,2)  NOT NULL DEFAULT 0,
    description     VARCHAR(255) NULL,
    CONSTRAINT fk_mlog_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id),
    CONSTRAINT fk_mlog_schedule  FOREIGN KEY (schedule_id)  REFERENCES maintenance_schedules(schedule_id),
    CONSTRAINT fk_mlog_user      FOREIGN KEY (performed_by) REFERENCES users(user_id),
    INDEX idx_mlog_date (performed_on)
) ENGINE=InnoDB;

-- Many-to-many: maintenance logs <-> spare parts
CREATE TABLE maintenance_parts_used (
    log_id    INT NOT NULL,
    part_id   INT NOT NULL,
    quantity  INT NOT NULL,
    PRIMARY KEY (log_id, part_id),
    CONSTRAINT fk_mpu_log  FOREIGN KEY (log_id)  REFERENCES maintenance_logs(log_id),
    CONSTRAINT fk_mpu_part FOREIGN KEY (part_id) REFERENCES spare_parts(part_id)
) ENGINE=InnoDB;

-- ---------- Module 7: Utilization analysis and optimization ----------
CREATE TABLE equipment_usage_logs (
    usage_id      INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id  INT NOT NULL,
    operation_id  INT NULL,
    field_id      INT NOT NULL,
    used_by       INT NOT NULL,
    usage_date    DATE NOT NULL,
    hours_used    DECIMAL(6,2) NOT NULL,
    fuel_litres   DECIMAL(7,2) NULL,
    CONSTRAINT fk_eul_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id),
    CONSTRAINT fk_eul_operation FOREIGN KEY (operation_id) REFERENCES field_operations(operation_id),
    CONSTRAINT fk_eul_field     FOREIGN KEY (field_id)     REFERENCES fields(field_id),
    CONSTRAINT fk_eul_user      FOREIGN KEY (used_by)      REFERENCES users(user_id),
    INDEX idx_eul_date (usage_date)
) ENGINE=InnoDB;

-- ---------- Module 8 (continued): Purchase orders ----------
CREATE TABLE purchase_orders (
    po_id         INT AUTO_INCREMENT PRIMARY KEY,
    po_number     VARCHAR(30) NOT NULL UNIQUE,
    supplier_id   INT NOT NULL,
    created_by    INT NOT NULL,
    order_date    DATE NOT NULL,
    expected_date DATE NULL,
    status        ENUM('draft','ordered','received','cancelled') NOT NULL DEFAULT 'draft',
    CONSTRAINT fk_po_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    CONSTRAINT fk_po_user     FOREIGN KEY (created_by)  REFERENCES users(user_id),
    INDEX idx_po_date (order_date)
) ENGINE=InnoDB;

CREATE TABLE purchase_order_items (
    po_item_id  INT AUTO_INCREMENT PRIMARY KEY,
    po_id       INT NOT NULL,
    input_id    INT NULL,
    part_id     INT NULL,
    quantity    DECIMAL(12,2) NOT NULL,
    unit_price  DECIMAL(10,2) NOT NULL,
    CONSTRAINT chk_po_item_one_target CHECK (
        (input_id IS NOT NULL AND part_id IS NULL) OR (input_id IS NULL AND part_id IS NOT NULL)
    ),
    CONSTRAINT fk_poi_po    FOREIGN KEY (po_id)    REFERENCES purchase_orders(po_id),
    CONSTRAINT fk_poi_input FOREIGN KEY (input_id) REFERENCES inputs(input_id),
    CONSTRAINT fk_poi_part  FOREIGN KEY (part_id)  REFERENCES spare_parts(part_id)
) ENGINE=InnoDB;
