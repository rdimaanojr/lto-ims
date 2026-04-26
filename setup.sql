-- First, change the values here from your config.js
-- Run sudo maridab -u root < setup.sql
CREATE DATABASE IF NOT EXISTS lto;
CREATE USER IF NOT EXISTS 'user_name' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON lto.* TO 'user_name';
FLUSH PRIVILEGES;