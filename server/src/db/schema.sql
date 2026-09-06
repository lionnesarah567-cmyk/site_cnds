-- Schema SQL pour la base de données CNDS Burundi (Turso / LibSQL SQLite)

-- 1. Table des Administrateurs (sécurité forte, hash bcrypt)
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table des Actualités (avec support trilingue FR/RN/EN et assainissement)
CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title_fr TEXT NOT NULL,
    title_rn TEXT,
    title_en TEXT,
    summary_fr TEXT NOT NULL,
    summary_rn TEXT,
    summary_en TEXT,
    content_fr TEXT NOT NULL,
    content_rn TEXT,
    content_en TEXT,
    category TEXT DEFAULT 'Dialogue Social',
    image_url TEXT,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_published INTEGER DEFAULT 1,
    views_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table des Membres du Bureau Exécutif
CREATE TABLE IF NOT EXISTS board_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    role_title_fr TEXT NOT NULL,
    role_title_rn TEXT,
    role_title_en TEXT,
    college TEXT NOT NULL, -- Gouvernement, Employeurs, Travailleurs, Présidence
    photo_url TEXT,
    bio_fr TEXT,
    bio_rn TEXT,
    bio_en TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table des Textes Juridiques et Décrets
CREATE TABLE IF NOT EXISTS legal_texts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    decree_number TEXT NOT NULL,
    category TEXT NOT NULL, -- Charte, Décret, Nomination
    title_fr TEXT NOT NULL,
    title_rn TEXT,
    title_en TEXT,
    date_promulgated DATE NOT NULL,
    summary_fr TEXT NOT NULL,
    summary_rn TEXT,
    summary_en TEXT,
    file_url TEXT DEFAULT '#',
    file_size TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table Multimédia (Vidéos et Rapports Annuels)
CREATE TABLE IF NOT EXISTS multimedia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'video' ou 'report'
    title_fr TEXT NOT NULL,
    title_rn TEXT,
    title_en TEXT,
    description_fr TEXT,
    description_rn TEXT,
    description_en TEXT,
    url TEXT NOT NULL,
    thumbnail TEXT,
    file_size TEXT,
    date_published DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table Galerie Photo
CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_fr TEXT NOT NULL,
    title_rn TEXT,
    title_en TEXT,
    caption_fr TEXT,
    caption_rn TEXT,
    caption_en TEXT,
    image_url TEXT NOT NULL,
    date_taken DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table des Partenaires Institutionnels
CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    category_en TEXT,
    description_fr TEXT,
    description_rn TEXT,
    description_en TEXT,
    logo_url TEXT,
    website_url TEXT DEFAULT '#',
    badge TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Table des Messages de Contact (sécurisé, rate-limité, traçabilité IP)
CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    ip_address TEXT,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. Table des Abonnés Newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    lang TEXT DEFAULT 'fr', -- 'fr', 'rn', 'en'
    unsubscribe_token TEXT UNIQUE NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performances et unicité
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_legal_texts_date ON legal_texts(date_promulgated);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_token ON newsletter_subscribers(unsubscribe_token);
