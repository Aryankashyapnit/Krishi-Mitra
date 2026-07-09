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
    // Convert SQLite "?" placeholders to MySQL format if needed, but standard "?" works in both!
    const [results] = await pool.execute(sql, params);
    return results;
  };
} else {
  // SQLite
  const sqlite3 = require('sqlite3').verbose();
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
      // If it's a SELECT query, use db.all. Otherwise, use db.run.
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
            // Return object compatible with MySQL insertId/affectedRows structure
            resolve({
              insertId: this.lastID,
              affectedRows: this.changes
            });
          }
        });
      }
    });
  };
}

module.exports = {
  dbType,
  dbInstance,
  query: queryFn
};
