-- =============================================================================
-- HarvestHub - Comprehensive Farm Management & Crop Planning Platform
-- Database Schema Definition (MySQL 8.0, InnoDB, utf8mb4)
-- Normalized Relational Schema (3NF)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `harvesthub_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `harvesthub_db`;

-- Drop existing tables in reverse dependency order
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `spare_part_orders`;
DROP TABLE IF EXISTS `equipment_utilization_logs`;
DROP TABLE IF EXISTS `maintenance_parts_used`;
DROP TABLE IF EXISTS `maintenance_records`;
DROP TABLE IF EXISTS `spare_parts`;
DROP TABLE IF EXISTS `equipment`;
DROP TABLE IF EXISTS `equipment_categories`;
DROP TABLE IF EXISTS `yield_records`;
DROP TABLE IF EXISTS `farm_inputs_costs`;
DROP TABLE IF EXISTS `field_operations`;
DROP TABLE IF EXISTS `crop_plantings`;
DROP TABLE IF EXISTS `crop_types`;
DROP TABLE IF EXISTS `fields`;
DROP TABLE IF EXISTS `farms`;
DROP TABLE IF EXISTS `suppliers`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. ROLES TABLE (Master)
-- -----------------------------------------------------------------------------
CREATE TABLE `roles` (
    `role_id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_code` VARCHAR(30) NOT NULL UNIQUE,
    `role_name` VARCHAR(60) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. USERS TABLE (Master)
-- -----------------------------------------------------------------------------
CREATE TABLE `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `phone_number` VARCHAR(25) NOT NULL,
    `role_id` INT NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_users_role` (`role_id`),
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. FARMS TABLE (Master)
-- -----------------------------------------------------------------------------
CREATE TABLE `farms` (
    `farm_id` INT AUTO_INCREMENT PRIMARY KEY,
    `farm_name` VARCHAR(120) NOT NULL,
    `owner_id` INT NOT NULL,
    `total_acres` DECIMAL(10,2) NOT NULL,
    `location_address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(60) NOT NULL,
    `state` VARCHAR(60) NOT NULL,
    `pin_code` VARCHAR(10) NOT NULL,
    `latitude` DECIMAL(10,7) NULL,
    `longitude` DECIMAL(10,7) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_farms_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_farms_city` (`city`),
    INDEX `idx_farms_owner` (`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. FIELDS TABLE (Master / Module 1: Field and Crop Mapping)
-- -----------------------------------------------------------------------------
CREATE TABLE `fields` (
    `field_id` INT AUTO_INCREMENT PRIMARY KEY,
    `farm_id` INT NOT NULL,
    `field_name` VARCHAR(80) NOT NULL,
    `boundary_geojson` JSON NULL,
    `area_acres` DECIMAL(8,2) NOT NULL,
    `soil_type` ENUM('Black Cotton', 'Alluvial', 'Red Soil', 'Laterite', 'Clay Loam', 'Sandy Loam') NOT NULL,
    `irrigation_source` ENUM('Borewell', 'Canal', 'Drip Irrigation', 'Rainfed', 'Sprinkler', 'River Lift') NOT NULL,
    `status` ENUM('Active', 'Fallow', 'Under Preparation', 'Planted', 'Harvested') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_fields_farm` FOREIGN KEY (`farm_id`) REFERENCES `farms` (`farm_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_fields_farm` (`farm_id`),
    INDEX `idx_fields_soil` (`soil_type`),
    INDEX `idx_fields_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. CROP TYPES TABLE (Master / Crop Catalog)
-- -----------------------------------------------------------------------------
CREATE TABLE `crop_types` (
    `crop_id` INT AUTO_INCREMENT PRIMARY KEY,
    `crop_name` VARCHAR(80) NOT NULL UNIQUE,
    `botanical_name` VARCHAR(120) NULL,
    `crop_category` ENUM('Kharif', 'Rabi', 'Zaid', 'Cash Crop', 'Horticulture') NOT NULL,
    `standard_growth_days` INT NOT NULL,
    `ideal_soil_type` VARCHAR(100) NOT NULL,
    `expected_yield_per_acre_kg` DECIMAL(10,2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_crops_category` (`crop_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. CROP PLANTINGS TABLE (Transactional / Module 1 & 2: Scheduling & Rotation)
-- -----------------------------------------------------------------------------
CREATE TABLE `crop_plantings` (
    `planting_id` INT AUTO_INCREMENT PRIMARY KEY,
    `field_id` INT NOT NULL,
    `crop_id` INT NOT NULL,
    `season` VARCHAR(30) NOT NULL,
    `sowing_date` DATE NOT NULL,
    `expected_harvest_date` DATE NOT NULL,
    `actual_harvest_date` DATE NULL,
    `target_yield_kg` DECIMAL(12,2) NOT NULL,
    `actual_yield_kg` DECIMAL(12,2) NULL,
    `current_stage` ENUM('Land Preparation', 'Sowing', 'Vegetative', 'Flowering', 'Maturity', 'Harvesting', 'Completed', 'Terminated') NOT NULL DEFAULT 'Land Preparation',
    `status` ENUM('Planned', 'In Progress', 'Harvested', 'Archived') NOT NULL DEFAULT 'Planned',
    `notes` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_plantings_field` FOREIGN KEY (`field_id`) REFERENCES `fields` (`field_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_plantings_crop` FOREIGN KEY (`crop_id`) REFERENCES `crop_types` (`crop_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_plantings_field` (`field_id`),
    INDEX `idx_plantings_crop` (`crop_id`),
    INDEX `idx_plantings_season` (`season`),
    INDEX `idx_plantings_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. EQUIPMENT CATEGORIES TABLE (Master)
-- -----------------------------------------------------------------------------
CREATE TABLE `equipment_categories` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_name` VARCHAR(80) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. EQUIPMENT REGISTRY TABLE (Master / Module 5: Equipment Registry & Inventory)
-- -----------------------------------------------------------------------------
CREATE TABLE `equipment` (
    `equipment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `farm_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `make_and_model` VARCHAR(100) NOT NULL,
    `serial_number` VARCHAR(80) NOT NULL UNIQUE,
    `purchase_date` DATE NOT NULL,
    `purchase_cost_inr` DECIMAL(12,2) NOT NULL,
    `current_meter_hours` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `status` ENUM('Active', 'In Maintenance', 'Idle', 'Decommissioned') NOT NULL DEFAULT 'Active',
    `last_serviced_date` DATE NULL,
    `next_service_due_hours` DECIMAL(10,2) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_equipment_farm` FOREIGN KEY (`farm_id`) REFERENCES `farms` (`farm_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_equipment_category` FOREIGN KEY (`category_id`) REFERENCES `equipment_categories` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_equipment_farm` (`farm_id`),
    INDEX `idx_equipment_category` (`category_id`),
    INDEX `idx_equipment_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. FIELD OPERATIONS TABLE (Transactional / Module 2: Scheduling & Operations)
-- -----------------------------------------------------------------------------
CREATE TABLE `field_operations` (
    `operation_id` INT AUTO_INCREMENT PRIMARY KEY,
    `planting_id` INT NOT NULL,
    `operation_type` ENUM('Ploughing', 'Harrowing', 'Sowing', 'Fertilizer Application', 'Pesticide Spray', 'Weeding', 'Irrigation', 'Harvesting', 'Post-Harvest Baling') NOT NULL,
    `scheduled_date` DATE NOT NULL,
    `completion_date` DATE NULL,
    `status` ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Delayed') NOT NULL DEFAULT 'Scheduled',
    `assigned_to_user_id` INT NULL,
    `equipment_id` INT NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_operations_planting` FOREIGN KEY (`planting_id`) REFERENCES `crop_plantings` (`planting_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_operations_user` FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_operations_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX `idx_operations_planting` (`planting_id`),
    INDEX `idx_operations_date` (`scheduled_date`),
    INDEX `idx_operations_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. SUPPLIERS TABLE (Master / Module 8 & 3: Vendors & Suppliers)
-- -----------------------------------------------------------------------------
CREATE TABLE `suppliers` (
    `supplier_id` INT AUTO_INCREMENT PRIMARY KEY,
    `company_name` VARCHAR(120) NOT NULL,
    `contact_person` VARCHAR(80) NOT NULL,
    `phone` VARCHAR(25) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(60) NOT NULL,
    `state` VARCHAR(60) NOT NULL,
    `gst_number` VARCHAR(20) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_suppliers_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. FARM INPUTS & COSTS TABLE (Transactional / Module 3: Cost Tracking)
-- -----------------------------------------------------------------------------
CREATE TABLE `farm_inputs_costs` (
    `cost_id` INT AUTO_INCREMENT PRIMARY KEY,
    `planting_id` INT NOT NULL,
    `operation_id` INT NULL,
    `input_type` ENUM('Seed', 'Fertilizer', 'Pesticide', 'Fuel', 'Labor', 'Water/Irrigation', 'Machinery Rental', 'Other') NOT NULL,
    `item_name` VARCHAR(100) NOT NULL,
    `quantity` DECIMAL(10,2) NOT NULL,
    `unit` VARCHAR(30) NOT NULL,
    `unit_cost_inr` DECIMAL(10,2) NOT NULL,
    `total_cost_inr` DECIMAL(12,2) NOT NULL,
    `expense_date` DATE NOT NULL,
    `receipt_number` VARCHAR(60) NULL,
    `supplier_id` INT NULL,
    `recorded_by_user_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_costs_planting` FOREIGN KEY (`planting_id`) REFERENCES `crop_plantings` (`planting_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_costs_operation` FOREIGN KEY (`operation_id`) REFERENCES `field_operations` (`operation_id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_costs_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_costs_user` FOREIGN KEY (`recorded_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_costs_planting` (`planting_id`),
    INDEX `idx_costs_input_type` (`input_type`),
    INDEX `idx_costs_date` (`expense_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. YIELD RECORDS TABLE (Transactional / Module 4: Yield Analysis & Forecasting)
-- -----------------------------------------------------------------------------
CREATE TABLE `yield_records` (
    `yield_id` INT AUTO_INCREMENT PRIMARY KEY,
    `planting_id` INT NOT NULL,
    `harvest_date` DATE NOT NULL,
    `gross_yield_kg` DECIMAL(12,2) NOT NULL,
    `net_yield_kg` DECIMAL(12,2) NOT NULL,
    `quality_grade` ENUM('Grade A (Export/Premium)', 'Grade B (Standard Market)', 'Grade C (Processing/Fair)') NOT NULL,
    `market_price_per_kg_inr` DECIMAL(8,2) NOT NULL,
    `total_revenue_inr` DECIMAL(14,2) NOT NULL,
    `storage_location` VARCHAR(120) NOT NULL,
    `buyer_name` VARCHAR(120) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_yield_planting` FOREIGN KEY (`planting_id`) REFERENCES `crop_plantings` (`planting_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_yield_planting` (`planting_id`),
    INDEX `idx_yield_harvest_date` (`harvest_date`),
    INDEX `idx_yield_grade` (`quality_grade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 13. SPARE PARTS TABLE (Master / Module 8: Spare Parts Management)
-- -----------------------------------------------------------------------------
CREATE TABLE `spare_parts` (
    `part_id` INT AUTO_INCREMENT PRIMARY KEY,
    `part_number` VARCHAR(60) NOT NULL UNIQUE,
    `name` VARCHAR(120) NOT NULL,
    `category` VARCHAR(60) NOT NULL,
    `equipment_category_id` INT NULL,
    `unit_price_inr` DECIMAL(10,2) NOT NULL,
    `current_stock` INT NOT NULL DEFAULT 0,
    `minimum_reorder_level` INT NOT NULL DEFAULT 5,
    `unit_of_measure` VARCHAR(20) NOT NULL DEFAULT 'Units',
    `supplier_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_spare_category` FOREIGN KEY (`equipment_category_id`) REFERENCES `equipment_categories` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_spare_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_spare_supplier` (`supplier_id`),
    INDEX `idx_spare_stock` (`current_stock`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 14. MAINTENANCE RECORDS TABLE (Transactional / Module 6: Maintenance Tracking)
-- -----------------------------------------------------------------------------
CREATE TABLE `maintenance_records` (
    `maintenance_id` INT AUTO_INCREMENT PRIMARY KEY,
    `equipment_id` INT NOT NULL,
    `maintenance_type` ENUM('Preventive Service', 'Breakdown Repair', 'Overhaul', 'Inspection') NOT NULL,
    `title` VARCHAR(140) NOT NULL,
    `description` TEXT NOT NULL,
    `scheduled_date` DATE NOT NULL,
    `completion_date` DATE NULL,
    `meter_hours_at_service` DECIMAL(10,2) NOT NULL,
    `labor_cost_inr` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `parts_cost_inr` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `total_cost_inr` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `status` ENUM('Scheduled', 'In Progress', 'Completed', 'Deferred') NOT NULL DEFAULT 'Scheduled',
    `technician_name` VARCHAR(100) NOT NULL,
    `next_service_due_hours` DECIMAL(10,2) NULL,
    `next_service_due_date` DATE NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_maint_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_maint_equipment` (`equipment_id`),
    INDEX `idx_maint_status` (`status`),
    INDEX `idx_maint_due_date` (`next_service_due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 15. MAINTENANCE PARTS USED TABLE (Junction / Module 6 & 8)
-- -----------------------------------------------------------------------------
CREATE TABLE `maintenance_parts_used` (
    `usage_id` INT AUTO_INCREMENT PRIMARY KEY,
    `maintenance_id` INT NOT NULL,
    `part_id` INT NOT NULL,
    `quantity_used` INT NOT NULL,
    `unit_price_inr` DECIMAL(10,2) NOT NULL,
    `total_cost_inr` DECIMAL(10,2) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_usage_maintenance` FOREIGN KEY (`maintenance_id`) REFERENCES `maintenance_records` (`maintenance_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_usage_part` FOREIGN KEY (`part_id`) REFERENCES `spare_parts` (`part_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_usage_maint` (`maintenance_id`),
    INDEX `idx_usage_part` (`part_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 16. EQUIPMENT UTILIZATION LOGS TABLE (Transactional / Module 7: Utilization Analysis)
-- -----------------------------------------------------------------------------
CREATE TABLE `equipment_utilization_logs` (
    `log_id` INT AUTO_INCREMENT PRIMARY KEY,
    `equipment_id` INT NOT NULL,
    `operation_id` INT NULL,
    `operator_user_id` INT NOT NULL,
    `log_date` DATE NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `operating_hours` DECIMAL(6,2) NOT NULL,
    `idle_hours` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    `fuel_consumed_litres` DECIMAL(8,2) NOT NULL,
    `work_area_acres` DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    `task_description` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_util_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_util_operation` FOREIGN KEY (`operation_id`) REFERENCES `field_operations` (`operation_id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_util_operator` FOREIGN KEY (`operator_user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_util_equipment` (`equipment_id`),
    INDEX `idx_util_date` (`log_date`),
    INDEX `idx_util_operator` (`operator_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 17. SPARE PART PURCHASE ORDERS TABLE (Transactional / Module 8: Supply Management)
-- -----------------------------------------------------------------------------
CREATE TABLE `spare_part_orders` (
    `order_id` INT AUTO_INCREMENT PRIMARY KEY,
    `supplier_id` INT NOT NULL,
    `part_id` INT NOT NULL,
    `order_date` DATE NOT NULL,
    `quantity` INT NOT NULL,
    `unit_price_inr` DECIMAL(10,2) NOT NULL,
    `total_amount_inr` DECIMAL(12,2) NOT NULL,
    `delivery_status` ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Pending',
    `received_date` DATE NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_order_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_order_part` FOREIGN KEY (`part_id`) REFERENCES `spare_parts` (`part_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_order_supplier` (`supplier_id`),
    INDEX `idx_order_status` (`delivery_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
