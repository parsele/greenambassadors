-- MySQL Database Setup Script for Amboseli Tree Tracker
-- Run this script to create the database manually (optional - Sequelize will create tables automatically)

CREATE DATABASE IF NOT EXISTS amboseli_trees CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE amboseli_trees;

-- Note: Tables will be created automatically by Sequelize when the server starts
-- This script is provided for reference only

-- If you want to create tables manually, uncomment below:

/*
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  species VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  date_planted DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  planter_name VARCHAR(255) NOT NULL,
  planter_email VARCHAR(255),
  status ENUM('planted', 'growing', 'mature', 'deceased') DEFAULT 'planted',
  notes TEXT,
  photo_url VARCHAR(255),
  added_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_location (latitude, longitude),
  INDEX idx_date_planted (date_planted)
);
*/

