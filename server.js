// Import express, inquirer, cTable, dotenv and database functionality
const express = require('express');
// const inquirer = require('inquirer');
// const cTable = require('console.table');
require('dotenv').config();
const db = require('./config/connection');
const EmployeeDatabase = require('./lib/EmployeeDatabase');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
db.connect(function(err) {
  if (err) {
    console.log('Database Connection Failed', err);
  } else {
    console.log('Database Connected');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const directory = new EmployeeDatabase;

directory.start();