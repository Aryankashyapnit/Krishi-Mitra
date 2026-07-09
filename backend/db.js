const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const dbType = process.env.DB_TYPE || 'sqlite';

let dbInstance = null;
let queryFn = null;

if (dbType === 'mysql') {
  const mysql = require('mysql2/promise');
  console.log('Connecting to MySQL database...');
  
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'krishi_mitra_db',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  dbInstance = pool;
  
  queryFn = async (sql, params = []) => {
    const [results] = await pool.execute(sql, params);
    return results;
  };
} else {
  // SQLite
  let sqlite3;
  let sqliteError = false;
  
  try {
    sqlite3 = require('sqlite3').verbose();
  } catch (e) {
    console.warn("sqlite3 module could not be loaded. Falling back to in-memory mock database for stateless serverless deployment.");
    sqliteError = true;
  }

  if (!sqliteError && sqlite3) {
    const dbPath = path.join(__dirname, 'database.sqlite');
    console.log(`Connecting to SQLite database at ${dbPath}...`);
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Failed to connect to SQLite:', err.message);
      } else {
        console.log('Connected to SQLite database successfully');
      }
    });

    dbInstance = db;

    queryFn = (sql, params = []) => {
      return new Promise((resolve, reject) => {
        const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
        
        if (isSelect) {
          db.all(sql, params, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        } else {
          db.run(sql, params, function (err) {
            if (err) {
              reject(err);
            } else {
              resolve({
                insertId: this.lastID,
                affectedRows: this.changes
              });
            }
          });
        }
      });
    };
  } else {
    // In-Memory mock database fallback for stateless Vercel Serverless hosting
    console.log("Initializing In-Memory fallback database...");
    
    const mockDb = {
      users: [
        { id: 1, name: "Rajesh Kumar", email: "rajesh@gmail.com", password: "$2a$10$pLwWdI6F1q25u5mJqXg8E.FjT3Y8l1NszK7F.gZszO2jFvR5B5n5m", role: "farmer", phone: "9876543210", location: "Nashik, MH", created_at: new Date().toISOString() }
      ],
      crops: [
        { id: 1, name: "Wheat (गेंहू)", season: "Rabi", soil_type: "Clayey loam", water_needs: "Medium (4-6 irrigations)", fertilizer_tips: "NPK 120:60:40 kg/ha", image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400" },
        { id: 2, name: "Tomato (टमाटर)", season: "Kharif/Rabi", soil_type: "Sandy loam", water_needs: "High (weekly)", fertilizer_tips: "Compost + Potash rich mix", image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400" },
        { id: 3, name: "Rice (धान)", season: "Kharif", soil_type: "Clayey or clay loam", water_needs: "Very High (standing water)", fertilizer_tips: "Nitrogen top-dressing in 3 splits", image_url: "https://images.unsplash.com/photo-1536657244441-c124b419f647?w=400" }
      ],
      listings: [
        { id: 1, crop_name: "Basmati Paddy", quantity: "400 kg", price: 32, seller_id: 1, location: "Indore Mandi", status: "available", created_at: new Date().toISOString() }
      ],
      schemes: [
        { id: 1, title: "Kisan Credit Card (KCC)", description: "Provides farmers with subsidized term loans and credit limits.", eligibility: "All owner farmers, tenant farmers, and sharecroppers.", link: "https://www.pmkisan.gov.in/", category: "loan", created_at: new Date().toISOString() },
        { id: 2, title: "Pradhan Mantri Fasal Bima Yojana", description: "Crop insurance scheme offering financial support against crop failure.", eligibility: "All farmers growing notified crops in notified areas.", link: "https://pmfby.gov.in/", category: "subsidy", created_at: new Date().toISOString() }
      ],
      reports: []
    };

    dbInstance = mockDb;

    queryFn = async (sql, params = []) => {
      const cleanSql = sql.trim().replace(/\s+/g, ' ').toUpperCase();
      
      // 1. SELECT id FROM users WHERE email = ?
      if (cleanSql.includes('SELECT ID FROM USERS WHERE EMAIL =')) {
        const email = params[0];
        return mockDb.users.filter(u => u.email === email).map(u => ({ id: u.id }));
      }
      
      // 2. INSERT INTO users
      if (cleanSql.includes('INSERT INTO USERS')) {
        const newUser = {
          id: mockDb.users.length + 1,
          name: params[0],
          email: params[1],
          password: params[2],
          role: params[3],
          phone: params[4],
          location: params[5],
          created_at: new Date().toISOString()
        };
        mockDb.users.push(newUser);
        return { insertId: newUser.id, affectedRows: 1 };
      }
      
      // 3. SELECT * FROM users WHERE email = ?
      if (cleanSql.includes('SELECT * FROM USERS WHERE EMAIL =')) {
        const email = params[0];
        return mockDb.users.filter(u => u.email === email);
      }
      
      // 4. SELECT id, name, email, role... FROM users WHERE id = ?
      if (cleanSql.includes('FROM USERS WHERE ID =')) {
        const id = parseInt(params[0]);
        return mockDb.users.filter(u => u.id === id);
      }
      
      // 5. SELECT * FROM crops
      if (cleanSql.includes('FROM CROPS')) {
        if (cleanSql.includes('WHERE ID =')) {
          const id = parseInt(params[0]);
          return mockDb.crops.filter(c => c.id === id);
        }
        return mockDb.crops;
      }
      
      // 6. INSERT INTO crops
      if (cleanSql.includes('INSERT INTO CROPS')) {
        const newCrop = {
          id: mockDb.crops.length + 1,
          name: params[0],
          season: params[1],
          soil_type: params[2],
          water_needs: params[3],
          fertilizer_tips: params[4],
          image_url: params[5],
          created_at: new Date().toISOString()
        };
        mockDb.crops.push(newCrop);
        return { insertId: newCrop.id, affectedRows: 1 };
      }
      
      // 7. SELECT * FROM schemes
      if (cleanSql.includes('FROM SCHEMES')) {
        if (cleanSql.includes('CATEGORY =')) {
          const cat = params[0];
          return mockDb.schemes.filter(s => s.category === cat);
        }
        return mockDb.schemes;
      }
      
      // 8. INSERT INTO schemes
      if (cleanSql.includes('INSERT INTO SCHEMES')) {
        const newScheme = {
          id: mockDb.schemes.length + 1,
          title: params[0],
          description: params[1],
          eligibility: params[2],
          link: params[3],
          category: params[4],
          created_at: new Date().toISOString()
        };
        mockDb.schemes.push(newScheme);
        return { insertId: newScheme.id, affectedRows: 1 };
      }
      
      // 9. SELECT listings
      if (cleanSql.includes('FROM LISTINGS')) {
        const joined = mockDb.listings.map(l => {
          const seller = mockDb.users.find(u => u.id === l.seller_id) || { name: 'Verified Seller', phone: '9876543210' };
          return {
            ...l,
            seller_name: seller.name,
            seller_phone: seller.phone
          };
        });
        
        if (cleanSql.includes('WHERE L.SELLER_ID =') || cleanSql.includes('WHERE SELLER_ID =')) {
          const id = parseInt(params[0]);
          return joined.filter(l => l.seller_id === id);
        }
        if (cleanSql.includes('WHERE ID =') || cleanSql.includes('WHERE L.ID =')) {
          const id = parseInt(params[0]);
          return joined.filter(l => l.id === id);
        }
        return joined;
      }
      
      // 10. INSERT INTO listings
      if (cleanSql.includes('INSERT INTO LISTINGS')) {
        const newListing = {
          id: mockDb.listings.length + 1,
          crop_name: params[0],
          quantity: params[1],
          price: parseFloat(params[2]),
          seller_id: parseInt(params[3]),
          location: params[4],
          status: 'available',
          created_at: new Date().toISOString()
        };
        mockDb.listings.push(newListing);
        return { insertId: newListing.id, affectedRows: 1 };
      }
      
      // 11. UPDATE listings SET status = 'sold'
      if (cleanSql.includes('UPDATE LISTINGS SET STATUS =')) {
        const id = parseInt(params[0]);
        const list = mockDb.listings.find(l => l.id === id);
        if (list) list.status = 'sold';
        return { affectedRows: 1 };
      }
      
      // 12. SELECT disease_reports
      if (cleanSql.includes('FROM DISEASE_REPORTS')) {
        const userId = parseInt(params[0]);
        return mockDb.reports.filter(r => r.user_id === userId);
      }
      
      // 13. INSERT INTO disease_reports
      if (cleanSql.includes('INSERT INTO DISEASE_REPORTS')) {
        const newReport = {
          id: mockDb.reports.length + 1,
          user_id: parseInt(params[0]),
          image_url: params[1],
          predicted_disease: params[2],
          confidence: parseFloat(params[3]),
          created_at: new Date().toISOString()
        };
        mockDb.reports.push(newReport);
        return { insertId: newReport.id, affectedRows: 1 };
      }
      
      return [];
    };
  }
}

module.exports = {
  dbType,
  dbInstance,
  query: queryFn
};
