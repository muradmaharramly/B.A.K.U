-- B.A.K.U Database Schema (Neon.com / PostgreSQL)

-- Administrative Accounts
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ENUM Types
CREATE TYPE user_tier AS ENUM ('citizen', 'tourist', 'family');
CREATE TYPE social_category AS ENUM ('standard', 'student', 'veteran', 'senior');
CREATE TYPE signal_type AS ENUM ('GPS', 'SIM');
CREATE TYPE trip_status AS ENUM ('active', 'completed', 'cancelled');

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    tier user_tier NOT NULL DEFAULT 'citizen',
    social_category social_category NOT NULL DEFAULT 'standard',
    balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    negative_limit NUMERIC(10, 2) NOT NULL DEFAULT -5.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cards Table (BAKU Card)
CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_number VARCHAR(20) UNIQUE NOT NULL,
    is_physical BOOLEAN NOT NULL DEFAULT FALSE,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Family Account Links
CREATE TABLE IF NOT EXISTS family_links (
    id SERIAL PRIMARY KEY,
    primary_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    linked_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(primary_user_id, linked_user_id)
);

-- Bus/Metro Operators
CREATE TABLE IF NOT EXISTS operators (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    contact_info TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Routes Table
CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    operator_id INTEGER NOT NULL REFERENCES operators(id) ON DELETE SET NULL,
    route_number VARCHAR(20) NOT NULL,
    route_type VARCHAR(20) NOT NULL DEFAULT 'bus', -- 'bus' or 'metro'
    path_coordinates JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stops Table
CREATE TABLE IF NOT EXISTS stops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    is_metro BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Route Stops (junction)
CREATE TABLE IF NOT EXISTS route_stops (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    stop_id INTEGER NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
    stop_order INTEGER NOT NULL
);

-- Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    route_id INTEGER REFERENCES routes(id) ON DELETE SET NULL,
    start_stop_id INTEGER REFERENCES stops(id) ON DELETE SET NULL,
    end_stop_id INTEGER REFERENCES stops(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    distance_km NUMERIC(8, 3),
    fare NUMERIC(8, 2),
    signal_type signal_type NOT NULL DEFAULT 'GPS',
    status trip_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Top-ups / Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id INTEGER REFERENCES cards(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'topup', 'fare', 'voucher', 'debt_recovery'
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vouchers (Next Ride Free)
CREATE TABLE IF NOT EXISTS vouchers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'next_ride_free',
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- System Logs
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    source VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Network Nodes
CREATE TABLE IF NOT EXISTS nodes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'onlayn',
    uptime VARCHAR(50),
    load_percent INTEGER DEFAULT 0,
    type VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fleet Units (Hardware tracking)
CREATE TABLE IF NOT EXISTS fleet_units (
    id VARCHAR(50) PRIMARY KEY,
    route_number VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'In Transit',
    load_percent INTEGER DEFAULT 0,
    current_location VARCHAR(255),
    health_status VARCHAR(20) NOT NULL DEFAULT 'Optimal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------
-- SEED DATA
-- -----------------------------------------------

-- Operators
INSERT INTO operators (name) VALUES
    ('Çinar Trans'),
    ('Baku Bus'),
    ('Xaliq Faiqoğlu'),
    ('Baku Metro')
ON CONFLICT (name) DO NOTHING;

-- Sample Users
INSERT INTO users (full_name, email, phone, tier, social_category, balance) VALUES
    ('Əli Məmmədov', 'ali@example.com', '+994501234567', 'citizen', 'standard', 12.50),
    ('Nigar Həsənova', 'nigar@example.com', '+994502345678', 'citizen', 'student', 8.00),
    ('Rauf Əliyev', 'rauf@example.com', '+994503456789', 'citizen', 'senior', 5.75),
    ('John Smith', 'john@tourist.com', '+447911123456', 'tourist', 'standard', 25.00),
    ('Leyla Əhmədova', 'leyla@example.com', '+994504567890', 'family', 'standard', 30.00),
    ('Kamran Hüseynov', 'kamran@example.com', '+994505678901', 'citizen', 'veteran', 3.20)
ON CONFLICT (email) DO NOTHING;

-- Sample Cards
INSERT INTO cards (user_id, card_number, is_physical, is_primary) VALUES
    (1, 'BAKU-0001-2024', TRUE, TRUE),
    (2, 'BAKU-0002-2024', FALSE, TRUE),
    (3, 'BAKU-0003-2024', TRUE, TRUE),
    (4, 'BAKU-T004-2024', TRUE, TRUE),
    (5, 'BAKU-0005-2024', FALSE, TRUE),
    (6, 'BAKU-0006-2024', TRUE, TRUE)
ON CONFLICT (card_number) DO NOTHING;

-- Routes - Çinar Trans (op_id=1)
INSERT INTO routes (operator_id, route_number, route_type) VALUES
    (1, '76', 'bus'), (1, '78', 'bus'), (1, '81', 'bus'), (1, '133', 'bus'),
    (1, '142', 'bus'), (1, '146', 'bus'), (1, '184', 'bus'), (1, '193', 'bus');

-- Routes - Baku Bus (op_id=2)
INSERT INTO routes (operator_id, route_number, route_type) VALUES
    (2, '1', 'bus'), (2, '2', 'bus'), (2, '3', 'bus'), (2, '4', 'bus'),
    (2, '5', 'bus'), (2, '6', 'bus'), (2, '7', 'bus'), (2, '8', 'bus'),
    (2, '10', 'bus'), (2, '11', 'bus'), (2, '12', 'bus'), (2, '13', 'bus'),
    (2, '14', 'bus'), (2, '17', 'bus'), (2, '18', 'bus'), (2, '20', 'bus'),
    (2, '21', 'bus'), (2, '24', 'bus'), (2, '30', 'bus'), (2, '32', 'bus'),
    (2, '49', 'bus'), (2, '62', 'bus'), (2, '120', 'bus'), (2, '121E', 'bus'),
    (2, '132', 'bus'), (2, '140', 'bus'), (2, '140E', 'bus'), (2, '183', 'bus'),
    (2, '217', 'bus'), (2, 'H1', 'bus');

-- Routes - Xaliq Faiqoğlu (op_id=3)
INSERT INTO routes (operator_id, route_number, route_type) VALUES
    (3, '18', 'bus'), (3, '41', 'bus'), (3, '61', 'bus'), (3, '65', 'bus'),
    (3, '71', 'bus'), (3, '79', 'bus'), (3, '83', 'bus'), (3, '85', 'bus'),
    (3, '93', 'bus'), (3, '135', 'bus'), (3, '170', 'bus');

-- Metro Stops
INSERT INTO stops (name, latitude, longitude, is_metro) VALUES
    ('İçərişəhər', 40.3663, 49.8320, TRUE),
    ('Sahil', 40.3695, 49.8360, TRUE),
    ('28 May', 40.3760, 49.8440, TRUE),
    ('Gənclik', 40.3830, 49.8490, TRUE),
    ('Nəriman Nərimanov', 40.3900, 49.8530, TRUE),
    ('Bakmil', 40.3960, 49.8580, TRUE),
    ('Ulduz', 40.4030, 49.8640, TRUE),
    ('Koroğlu', 40.4110, 49.8690, TRUE),
    ('Qara Qarayev', 40.4160, 49.8760, TRUE),
    ('Neftçilər', 40.4200, 49.8830, TRUE),
    ('Xalqlar Dostluğu', 40.4260, 49.8890, TRUE),
    ('Əhmədli', 40.4310, 49.8960, TRUE),
    ('Hövsan', 40.4360, 49.9060, TRUE),
    ('8 Noyabr', 40.3775, 49.8464, TRUE),
    ('Avtovağzal', 40.3825, 49.8495, TRUE),
    ('Memar Əcəmi', 40.3840, 49.8345, TRUE),
    ('Nəsimi', 40.3870, 49.8290, TRUE),
    ('Xətai', 40.3965, 49.8495, TRUE),
    ('Həzi Aslanov', 40.4085, 49.8700, TRUE)
ON CONFLICT DO NOTHING;

-- Sample Trips
INSERT INTO trips (user_id, card_id, route_id, start_time, end_time, distance_km, fare, signal_type, status) VALUES
    (1, 1, 1, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 45 min', 4.2, 0.50, 'GPS', 'completed'),
    (2, 2, 5, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '4 hours 30 min', 7.8, 0.80, 'SIM', 'completed'),
    (3, 3, 10, NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours 50 min', 2.1, 0.30, 'GPS', 'completed'),
    (4, 4, 2, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 40 min', 5.5, 0.60, 'GPS', 'completed'),
    (5, 5, 8, NOW() - INTERVAL '30 min', NULL, NULL, NULL, 'GPS', 'active');

-- Default Admin (admin / admin123)
INSERT INTO admins (username, password_hash, full_name) VALUES
    ('admin', '$2b$10$auTyixOhItVpY5RpeknBfusWJpX3Ooe9xbpDrPI0V8UA36z2CEv02', 'System Administrator')
ON CONFLICT (username) DO NOTHING;
