const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'brand_metrics.db');
const db = new sqlite3.Database(dbPath);

async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create agents table
      db.run(`
        CREATE TABLE IF NOT EXISTS agents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create payroll table
      db.run(`
        CREATE TABLE IF NOT EXISTS payroll (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          agent_id INTEGER NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          period_start DATE NOT NULL,
          period_end DATE NOT NULL,
          payment_date DATE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (agent_id) REFERENCES agents (id)
        )
      `);

      // Create orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_name TEXT NOT NULL,
          project_name TEXT NOT NULL,
          order_date DATE NOT NULL,
          total_amount DECIMAL(10,2) NOT NULL,
          status TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create chat_history table
      db.run(`
        CREATE TABLE IF NOT EXISTS chat_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          agent_id INTEGER NOT NULL,
          message TEXT NOT NULL,
          response TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (agent_id) REFERENCES agents (id)
        )
      `);

      // Insert seed data
      insertSeedData()
        .then(() => {
          console.log('Seed data inserted successfully');
          resolve();
        })
        .catch(reject);
    });
  });
}

async function insertSeedData() {
  return new Promise((resolve, reject) => {
    // Check if data already exists
    db.get("SELECT COUNT(*) as count FROM agents", (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        console.log('Seed data already exists, skipping...');
        resolve();
        return;
      }

      // Insert test agent
      const testPassword = 'agent123';
      bcrypt.hash(testPassword, 10, (err, hash) => {
        if (err) {
          reject(err);
          return;
        }

        db.run(`
          INSERT INTO agents (email, password_hash, name) 
          VALUES (?, ?, ?)
        `, ['test@brandmetrics.com', hash, 'Test Agent'], function(err) {
          if (err) {
            reject(err);
            return;
          }

          const agentId = this.lastID;

          // Insert sample payroll data
          const payrollData = [
            [agentId, 1200.00, '2024-01-01', '2024-01-07', '2024-01-08'], // This week
            [agentId, 4800.00, '2024-01-01', '2024-01-31', '2024-02-01'], // This month
            [agentId, 57600.00, '2024-01-01', '2024-12-31', '2024-12-31'], // This year
            [agentId, 4800.00, '2023-12-01', '2023-12-31', '2024-01-01'], // Last month
            [agentId, 2400.00, '2024-01-08', '2024-01-14', '2024-01-15'], // Next week
            [agentId, 3600.00, '2024-01-15', '2024-01-21', '2024-01-22'], // Week 3
          ];

          let payrollInserted = 0;
          payrollData.forEach((data, index) => {
            db.run(`
              INSERT INTO payroll (agent_id, amount, period_start, period_end, payment_date)
              VALUES (?, ?, ?, ?, ?)
            `, data, function(err) {
              if (err) {
                console.error('Error inserting payroll:', err);
              }
              payrollInserted++;
              if (payrollInserted === payrollData.length) {
                insertOrders(agentId, resolve, reject);
              }
            });
          });
        });
      });
    });
  });
}

function insertOrders(agentId, resolve, reject) {
  const ordersData = [
    ['John Smith', 'Website Redesign', '2024-01-15', 2500.00, 'Completed', 'Complete website overhaul for Smith Corp'],
    ['John Smith', 'Logo Design', '2024-01-10', 500.00, 'Completed', 'New logo design for Smith Corp'],
    ['Sarah Johnson', 'Marketing Campaign', '2024-01-20', 1800.00, 'In Progress', 'Q1 marketing campaign for Johnson LLC'],
    ['Mike Wilson', 'Brand Guidelines', '2024-01-12', 1200.00, 'Completed', 'Brand style guide for Wilson Industries'],
    ['Emily Davis', 'Social Media Management', '2024-01-18', 900.00, 'In Progress', 'Monthly social media management'],
    ['David Brown', 'Print Materials', '2024-01-05', 750.00, 'Completed', 'Business cards and brochures'],
  ];

  let ordersInserted = 0;
  ordersData.forEach((data) => {
    db.run(`
      INSERT INTO orders (customer_name, project_name, order_date, total_amount, status, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `, data, function(err) {
      if (err) {
        console.error('Error inserting order:', err);
      }
      ordersInserted++;
      if (ordersInserted === ordersData.length) {
        console.log('All seed data inserted successfully');
        resolve();
      }
    });
  });
}

function getDatabase() {
  return db;
}

module.exports = {
  initializeDatabase,
  getDatabase
};
