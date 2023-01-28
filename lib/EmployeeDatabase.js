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
                        break;
                    case 'View all Roles':
                        this.viewRoles();
                        break;
                    case 'View all Employees':
                        this.viewEmployees();
                        break;
                    case 'Add a Department':
                        this.addDepartment();
                        break;
                    case 'Add a Role':
                        this.addRole();
                        break;
                    case 'Add an Employee':
                        this.addEmployee();
                        break;
                    case 'Update an Employee Role':
                        this.updateRole();
                        break;
                    case 'Finish':
                        return;
                }
            })
    }

    viewDepartments() {
        db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.table(`\n`, result);
            this.start();;
        });
    }

    viewRoles() {
        db.query(`SELECT role.id, role.title, department.name, role.salary FROM role LEFT JOIN department ON department.id = role.department_id`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.table(`\n`, result);
            this.start();;
        });
    }

    viewEmployees() {
        db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.table(`\n`, result);
            this.start();;
        });
    }

    addDepartment() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'deptName',
                    message: `Please provide new department name:`,
                },
            ])
            .then((response) => {
                db.query(`INSERT INTO department (name) VALUES ('${response.deptName}')`)
                console.log(response.deptName)
                this.start();
            })
    }
    addRole() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'roleTitle',
                    message: `Please provide new role title:`,
                },
                {
                    type: 'number',
                    name: 'roleSalary',
                    message: `Please provide new role salary as a numeric value:`
                }
            ])
            .then((response) => {
                db.query(`INSERT INTO department (name) VALUES ('${response.roleName}')`)
                console.log(response.roleName)
                this.start();
            })
    }
    
    addEmployee() {

    }

    updateRole() {

    }
}

module.exports = EmployeeDatabase;