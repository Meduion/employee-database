const mysql = require('mysql2');

// Connect to mysql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Use dotenv functionality to hide user credentials
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the employees_db database.`)
  );

  module.exports = db;