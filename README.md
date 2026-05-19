# LTO Information Management System

## Members

- Dimaano, Ronaldo Jr.
- Ambas, Vhonne
- Pallaza, Dinara

## Description

This app supports two user types: `admin` and `user`.
- `admin` users directly interact with the database and can approve or reject account registrations.
- `user` accounts can register and use the app only after approval.

## Requirements

- Node.js 18+ (or compatible runtime)
- MySQL / MariaDB compatible database
- `npm` or `yarn`

## Example / reference files

- `backend/.env.example` — Copy to `backend/.env` and set your database credentials and URLs.
- `backend/db.js.example` — Reference for the MySQL connection pool in `backend/db.js` (e.g. local vs RDS).

## Environment Variables

Create `backend/.env` from `backend/.env.example` with values such as:

```env
DB_HOST=localhost
DB_USER=db_user
DB_PASSWORD=db_password
DB_NAME=lto
```

If you use Amazon RDS, set `DB_HOST` to your RDS endpoint and keep the other values matching your database user configuration.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create and configure your local database.

- Option A: Use `setup.sql`.
  1. Update values in `setup.sql` to match your `.env` settings.
  2. Run:
     ```bash
     mysql -u root -p < setup.sql
     ```

- Option B: Create the database manually:
  ```sql
  CREATE DATABASE IF NOT EXISTS lto;
  CREATE USER IF NOT EXISTS 'db_user'@'localhost' IDENTIFIED BY 'db_password';
  GRANT ALL PRIVILEGES ON lto.* TO 'db_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

3. Ensure `backend/.env` is present and points to your local MySQL database.

## Amazon RDS / Online MySQL Setup

If you prefer to use Amazon RDS or another hosted MySQL service:

1. Create a MySQL database instance.
2. Create a database and user with privileges for that database.
3. Update `backend/.env` with the RDS endpoint and credentials:

```env
DB_HOST=my-rds-endpoint.rds.amazonaws.com
DB_USER=db_user
DB_PASSWORD=db_password
DB_NAME=lto
```

4. Create the schema and tables by running the app. The server automatically initializes missing tables on startup.

> Note: The app works perfectly with Amazon RDS MySQL as long as the database is reachable from the machine running the backend.

## Initial Database Initialization

The backend calls `initializeDatabaseTables()` at startup, so the required tables are created automatically if they do not exist.

## Admin Account Setup

An admin account must be created manually in the database and approved before it can be used.

1. Use `backend/generate_admin.js` to get a hashed password and salt:

```bash
node backend/generate_admin.js
```

2. Use the output values to insert an admin record directly into the `account` table:

```sql
INSERT INTO account (username, password_hash, salt, role, is_approved)
VALUES ('admin', '<hashed_password>', '<salt>', 'admin', TRUE);
```

3. Replace `<hashed_password>` and `<salt>` with the values printed by `generate_admin.js`.

## Running the App Locally

Start the backend server from the project root:

```bash
npm start
```

The backend will listen on `http://localhost:3000`.

## Manual Approval Flow

- Users register through the app and are created with `role = user` and `is_approved = FALSE`.
- Admins must approve these user accounts before login is allowed.
- Admin approval can be done manually through the database if needed.

To approve a pending user from the terminal:

```sql
UPDATE account SET is_approved = TRUE WHERE id = <user_id>;
```

To reject and delete a pending user:

```sql
DELETE FROM account WHERE id = <user_id>;
```

## Notes

- Do not commit `backend/.env` to source control.
- Make sure your database user has privileges to create tables and modify the `lto` database.
