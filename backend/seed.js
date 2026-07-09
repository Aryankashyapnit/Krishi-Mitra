const bcrypt = require('bcryptjs');
const { dbType, query } = require('./db');

async function seed() {
  console.log(`Starting database seeding for ${dbType}...`);

  try {
    // 1. Drop existing tables if seeding afresh (for clean dev setup)
    // We execute drops in reverse order of foreign keys
    const dropTables = [
      'DROP TABLE IF EXISTS disease_reports',
      'DROP TABLE IF EXISTS listings',
      'DROP TABLE IF EXISTS schemes',
      'DROP TABLE IF EXISTS crops',
      'DROP TABLE IF EXISTS users'
    ];

    for (const sql of dropTables) {
      await query(sql);
    }
    console.log('Old tables dropped.');

    // 2. Create tables based on DB type
    const isMySQL = dbType === 'mysql';
    const autoIncrement = isMySQL ? 'INT PRIMARY KEY AUTO_INCREMENT' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
    const timestampDef = isMySQL ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' : 'DATETIME DEFAULT CURRENT_TIMESTAMP';
    const decimalType = isMySQL ? 'DECIMAL(10,2)' : 'REAL';

    // Users Table
    await query(`
      CREATE TABLE users (
        id ${autoIncrement},
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'farmer',
        phone VARCHAR(15),
        location VARCHAR(100),
        created_at ${timestampDef}
      )
    `);

    // Crops Table
    await query(`
      CREATE TABLE crops (
        id ${autoIncrement},
        name VARCHAR(100) NOT NULL,
        season VARCHAR(50),
        soil_type VARCHAR(100),
        water_needs TEXT,
        fertilizer_tips TEXT,
        image_url VARCHAR(255),
        created_at ${timestampDef}
      )
    `);

    // Listings Table (Marketplace)
    await query(`
      CREATE TABLE listings (
        id ${autoIncrement},
        crop_name VARCHAR(100) NOT NULL,
        quantity VARCHAR(50) NOT NULL,
        price ${decimalType} NOT NULL,
        seller_id INT,
        location VARCHAR(100),
        status VARCHAR(20) DEFAULT 'available',
        created_at ${timestampDef},
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Schemes Table (Loans & Subsidies)
    await query(`
      CREATE TABLE schemes (
        id ${autoIncrement},
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        eligibility TEXT,
        link VARCHAR(255),
        category VARCHAR(20) DEFAULT 'loan',
        created_at ${timestampDef}
      )
    `);

    // Disease Reports Table
    await query(`
      CREATE TABLE disease_reports (
        id ${autoIncrement},
        user_id INT,
        image_url VARCHAR(255) NOT NULL,
        predicted_disease VARCHAR(100) NOT NULL,
        confidence ${isMySQL ? 'DECIMAL(5,2)' : 'REAL'} NOT NULL,
        created_at ${timestampDef},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    console.log('Database tables created successfully.');

    // 3. Seed Users
    const salt = await bcrypt.genSalt(10);
    const hashAdmin = await bcrypt.hash('admin123', salt);
    const hashFarmer = await bcrypt.hash('farmer123', salt);
    const hashBuyer = await bcrypt.hash('buyer123', salt);

    await query(
      'INSERT INTO users (name, email, password, role, phone, location) VALUES (?, ?, ?, ?, ?, ?)',
      ['Admin Mitra', 'admin@krishimitra.com', hashAdmin, 'admin', '9876543210', 'New Delhi']
    );
    
    await query(
      'INSERT INTO users (name, email, password, role, phone, location) VALUES (?, ?, ?, ?, ?, ?)',
      ['Ramesh Kumar', 'farmer@krishimitra.com', hashFarmer, 'farmer', '9988776655', 'Indore, MP']
    );

    await query(
      'INSERT INTO users (name, email, password, role, phone, location) VALUES (?, ?, ?, ?, ?, ?)',
      ['Suresh Seth', 'buyer@krishimitra.com', hashBuyer, 'buyer', '9122334455', 'Mumbai, MH']
    );
    console.log('Seed users inserted.');

    // Get farmer ID for listings
    const users = await query('SELECT id FROM users WHERE role = ?', ['farmer']);
    const farmerId = users[0].id;

    // 4. Seed Crops
    const cropsData = [
      ['Wheat (गेंहू)', 'Rabi', 'Clayey / Loamy (दोमट मिट्टी)', 'Moderate watering (4-6 irrigations during growth). Avoid waterlogging.', 'Apply NPK (nitrogen, phosphorus, potassium) in a 4:2:1 ratio. Top-dress with urea during tillering.', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'],
      ['Rice (धान)', 'Kharif', 'Clayey (चिकनी मिट्टी) with high water retention', 'High water requirement. Keep 5-10cm standing water in the field during vegetative phase.', 'Apply Nitrogenous fertilizers in 3 split doses. Use zinc sulphate for zinc deficiency.', 'https://images.unsplash.com/photo-1536257130722-ea1c9ad9d447?w=400'],
      ['Tomato (टमाटर)', 'Zaid / Year-round', 'Sandy Loam (बलुई दोमट मिट्टी) well-drained', 'Regular moderate watering. Avoid overhead spraying to prevent leaf diseases.', 'Use rich compost. Apply potash during flowering to improve fruit quality.', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'],
      ['Mustard (सरसों)', 'Rabi', 'Sandy Loam (बलुई दोमट)', 'Low water needs. 2 irrigations are sufficient (pre-flowering and pod-filling).', 'Responds well to sulfur. Apply Gypsum/Single Super Phosphate.', 'https://images.unsplash.com/photo-1500937386664-56d159062255?w=400'],
      ['Maize (मक्का)', 'Kharif / Rabi', 'Well-drained Fertile Loam', 'Moderate water needs. Crucial watering stages are tasseling and silking.', 'Apply nitrogen in split applications. Add zinc sulphate if soil test indicates deficiency.', 'https://images.unsplash.com/photo-1551754655-cd27e38d20f6?w=400']
    ];

    for (const crop of cropsData) {
      await query(
        'INSERT INTO crops (name, season, soil_type, water_needs, fertilizer_tips, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        crop
      );
    }
    console.log('Seed crops inserted.');

    // 5. Seed Schemes (Subsidies & Loans)
    const schemesData = [
      ['PM Kisan Samman Nidhi Yojana', 'Under this scheme, all landholding farmers families are provided an income support of Rs. 6000 per year in three equal installments of Rs. 2000.', 'All small and marginal landholding farmer families who own cultivable land in their names.', 'https://pmkisan.gov.in/', 'subsidy'],
      ['Kisan Credit Card (KCC) Scheme', 'Enables farmers to meet their short-term credit requirements for cultivation, post-harvest expenses, and maintenance of farm assets at highly subsidized interest rates (starting at 4%).', 'All farmers, including owner-cultivators, tenant farmers, and sharecroppers.', 'https://www.sbi.co.in/web/personal-banking/loans/agriculture-banking/kisan-credit-card', 'loan'],
      ['Pradhan Mantri Fasal Bima Yojana (PMFBY)', 'A low-premium crop insurance scheme providing comprehensive coverage against crop failure due to natural calamities, pests, and diseases.', 'All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers.', 'https://pmfby.gov.in/', 'subsidy'],
      ['Sub-Mission on Agricultural Mechanization (SMAM)', 'Provides subsidies ranging from 40% to 50% for purchasing agricultural machinery like tractors, power tillers, rotavators, and seed drills.', 'Small and marginal farmers, women farmers, and SC/ST farmers have priority.', 'https://agrimachinery.nic.in/', 'subsidy']
    ];

    for (const scheme of schemesData) {
      await query(
        'INSERT INTO schemes (title, description, eligibility, link, category) VALUES (?, ?, ?, ?, ?)',
        scheme
      );
    }
    console.log('Seed schemes inserted.');

    // 6. Seed Listings
    const listingsData = [
      ['Organic Sharbati Wheat', '500 kg', 26.50, farmerId, 'Indore, MP'],
      ['Basmati Rice (Grade A)', '300 kg', 72.00, farmerId, 'Karnal, Haryana'],
      ['Fresh Hybrid Tomato', '150 kg', 18.00, farmerId, 'Nashik, MH']
    ];

    for (const listing of listingsData) {
      await query(
        'INSERT INTO listings (crop_name, quantity, price, seller_id, location) VALUES (?, ?, ?, ?, ?)',
        listing
      );
    }
    console.log('Seed marketplace listings inserted.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
