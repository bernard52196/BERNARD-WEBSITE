-- ============================================
-- N. Bernard Portfolio — Database Schema
-- ============================================
-- Database: bernard_portfolio
-- Engine: MySQL / PostgreSQL compatible
-- ============================================

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    avatar_url VARCHAR(500) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- ============================================
-- 2. CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) DEFAULT 'New message from portfolio',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created (created_at),
    INDEX idx_is_read (is_read)
);

-- ============================================
-- 3. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    long_description TEXT DEFAULT NULL,
    tech_stack VARCHAR(500) DEFAULT NULL,
    github_url VARCHAR(500) DEFAULT NULL,
    live_url VARCHAR(500) DEFAULT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    category VARCHAR(50) DEFAULT NULL,
    status ENUM('completed', 'in_progress', 'planned') DEFAULT 'completed',
    featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_featured (featured),
    INDEX idx_status (status)
);

-- ============================================
-- 4. SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('language', 'tool', 'area') NOT NULL,
    proficiency INT DEFAULT 50,
    icon_url VARCHAR(500) DEFAULT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. EXPERIENCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    organization VARCHAR(200) NOT NULL,
    description TEXT DEFAULT NULL,
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. SITE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 7. SESSIONS TABLE (for auth tokens)
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent VARCHAR(500) DEFAULT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user (user_id)
);

-- ============================================
-- SEED DATA: Projects
-- ============================================
INSERT INTO projects (title, slug, description, tech_stack, github_url, status, featured, sort_order) VALUES
('Chartboard AI', 'chartboard-ai', 'An AI-powered analytics dashboard that uses machine learning to automatically generate intelligent charts, detect data patterns, and provide natural language insights from raw datasets.', 'Python,AI/ML,Chart.js,Flask,Pandas,scikit-learn,NLP,PostgreSQL', 'https://github.com/bernard52196/Chartboard-AI', 'in_progress', TRUE, 1),
('Healthcare Portal System', 'healthcare-portal', 'A web-based healthcare management system that streamlines patient registration, appointment scheduling, and medical record management for clinics and hospitals.', 'Java,JavaFX,MySQL', 'https://github.com/bernard52196/JAVA_FINAL_EXAM_NDAGIJIMANA-Bernard_223007117', 'completed', TRUE, 2),
('BI Retail Analytics Dashboard', 'bi-retail', 'A data analysis project that loads retail sales data from Excel sheets, calculates key performance indicators like Gross Profit, Net Sales, and Profit Margin per store using Python and pandas.', 'Python,pandas,Data Analysis,Excel', 'https://github.com/bernard52196/BI-Retail-Case-Study', 'completed', TRUE, 3),
('Hotel Website', 'hotel-website', 'A responsive hotel booking website built as an individual web programming project for course requirements at the University of Rwanda.', 'HTML,CSS,JavaScript', 'https://github.com/bernard52196/Individual-project-Web-Programming-NDAGIJIMANA-Bernard_223007117/tree/main/hotel-website', 'completed', TRUE, 4),
('Smart Agriculture System', 'smart-agriculture', 'An IoT-based smart farming solution that monitors soil moisture, temperature, and humidity using sensors to automate irrigation and provide real-time crop health analytics for farmers.', 'Python,IoT,Arduino,MQTT,Flask,Chart.js,SQLite', 'https://github.com/bernard52196/Smart-Agriculture-System', 'in_progress', TRUE, 5);

-- ============================================
-- SEED DATA: Skills
-- ============================================
INSERT INTO skills (name, category, proficiency, sort_order) VALUES
('HTML & CSS', 'language', 90, 1),
('Java', 'language', 85, 2),
('JavaScript', 'language', 80, 3),
('Python', 'language', 85, 4),
('Git & GitHub', 'tool', 85, 1),
('VS Code', 'tool', 90, 2),
('Figma', 'tool', 70, 3),
('Responsive Design', 'area', 85, 1),
('Frontend Development', 'area', 80, 2),
('Problem Solving', 'area', 90, 3);

-- ============================================
-- SEED DATA: Experience
-- ============================================
INSERT INTO experience (title, organization, description, start_date, is_current, sort_order) VALUES
('BSc Information Technology', 'University of Rwanda', 'Studying core computer science, software engineering, and web development. Building personal projects and contributing to open source.', '2023-01-01', TRUE, 1),
('Healthcare Portal System (Final Year Project)', 'University of Rwanda', 'Built a Java-based healthcare management system for patient registration, appointment scheduling, and medical record management.', '2025-01-01', FALSE, 2);

-- ============================================
-- SEED DATA: Site Settings
-- ============================================
INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_title', 'N. Bernard — Portfolio'),
('site_description', 'Portfolio website of N. Bernard, BIT student at University of Rwanda'),
('contact_email', 'ndagijimanabernard11@gmail.com'),
('github_url', 'https://github.com/bernard52196'),
('footer_text', '© 2026 N. Bernard. Built with HTML & CSS 🚀');

-- ============================================
-- NOTE: Admin accounts should be created manually
-- or through a secure admin-only interface.
-- Public registration should only create 'user' role accounts.
-- ============================================
-- Example admin creation (run manually by DBA):
-- INSERT INTO users (name, email, password_hash, role) VALUES
-- ('Admin', 'admin@bernard-portfolio.com', '$2y$10$hashedpassword', 'admin');
-- ============================================