const { response } = require('express');
const inquirer = require('inquirer');
const db = require('../config/connection');
const cTable = require('console.table');

class EmployeeDatabase {
    constructor() { }

    start() {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'start',
                    message: `Please select your task:`,
                    choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Finish'],
                }
            ])
            .then((response) => {
                switch (response.start) {
                    case 'View all Departments':
                        this.viewDepartments();
                        this.start();
                        break;
                    case 'View all Roles':
                        this.viewRoles();
                        this.start();
                        break;
                    case 'View all Employees':
                        this.viewEmployees();
                        this.start();
                        break;
                    case 'Add a Department':
                        this.addDepartment();
                        this.start();
                        break;
                    case 'Add a Role':
                        this.addRole();
                        this.start();
                        break;
                    case 'Add an Employee':
                        this.addEmployee();
                        this.start();
                        break;
                    case 'Update an Employee Role':
                        this.updateRole();
                        this.start();
                        break;
                    case 'Finish':
                        return;
                }
            })
    }

    viewDepartments() {
        db.query('SELECT * FROM department', (err, result) => {
            if (err) {
                console.log(err);
            }
            console.table(`\n`, result);
            console.log(`\nPress any key to return to main menu.`);
        });
    }

    viewRoles() {
        db.query('SELECT * FROM roles', (err, result) => {
            if (err) {
                console.log(err);
            }
            console.table(`\n`, result);
            console.log(`\nPress any key to return to main menu.`);
        });
    }

    viewEmployees() {
        db.query('SELECT * FROM employees', (err, result) => {
            if (err) {
                console.log(err);
            }
            console.table(`\n`, result);
            console.log(`\nPress any key to return to main menu.`);
        });
    }
}

module.exports = EmployeeDatabase;