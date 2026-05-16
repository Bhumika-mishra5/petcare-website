const mysql = require('mysql2');
require('dotenv').config();

async function initDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    }).promise();

    console.log(`Checking for database: ${process.env.DB_NAME || 'petverse_db'}...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'petverse_db'}\`;`);
    console.log('Database initialized successfully.');
    await connection.end();
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error('Failed to connect to MySQL. Is it running on localhost:3306?');
    } else {
      console.error('Failed to initialize database:', err.message);
    }
    process.exit(1);
  }
}

initDB();
