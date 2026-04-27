-- First, change the values here from your .env file in backend
-- Run sudo maridab -u root < setup.sql
CREATE DATABASE IF NOT EXISTS lto;
CREATE USER IF NOT EXISTS 'db_user' IDENTIFIED BY 'db_password';
GRANT ALL PRIVILEGES ON lto.* TO 'db_user';
FLUSH PRIVILEGES;