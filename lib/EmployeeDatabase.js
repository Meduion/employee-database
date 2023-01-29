const { response } = require('express');
const inquirer = require('inquirer');
const db = require('../config/connection');
const cTable = require('console.table');

class EmployeeDatabase {
    constructor() { }
    
    getDepartments(depts) {
        db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {
                console.log(err);
            }
            for (let i = 0; i < result.length; i++) {
                depts.push(result[i].id);
            }
        })
    }

    getManagers(managers) {
        db.query(`SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS manager FROM employee`, (err, result) => {
            if (err) {
                console.log(err);
            }
            for (let i = 0; i < result.length; i++) {
                managers.push(result[i].id);
            }
        })
    }

    getRoles(roles) {
        db.query(`SELECT role.id, role.title FROM role`, (err, result) => {
            if (err) {
                console.log(err);
            }
            for (let i = 0; i < result.length; i++) {
                roles.push(result[i].id);
            }
        })
    }

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
                        console.log(`You have ended your database session.`)
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
        let depts = []
        this.getDepartments(depts);

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
                },
                {
                    type: 'list',
                    name: 'roleDept',
                    message: `Please select the department for this role from the following list:`,
                    choices: depts,
                },
            ])
            .then((response) => {
                db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.roleTitle}', ${response.roleSalary}, ${response.roleDept})`)
                console.log(response.roleTitle)
                console.log(response.roleSalary)
                console.log(response.roleDept)
                console.log(response);
                console.log(depts);
                this.start();
            })
    }
    
    addEmployee() {
        let roles = [];
        let managers = [];
        this.getManagers(managers);
        this.getRoles(roles);
        
        inquirer 
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: `Please provide new employee's first name:`,
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: `Please provide new employee's last name:`
                },
                {
                    type: 'list',
                    name: 'role',
                    message: `Please select new employee's role:`,
                    choices: roles,
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: `Please select new employee's manager if applicable:`,
                    choices: managers,
                },
            ])
            .then((response) => {
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.firstName}', '${response.lastName}', ${response.role}, ${response.manager})`)
                console.log(response.firstName)
                console.log(response.lastName)
                console.log(response.role)
                console.log(response.manager);
                console.log(roles);
                console.log(managers);
                this.start();
            })
    }

    updateRole() {

    }
}

module.exports = EmployeeDatabase;