const { response } = require('express');
const inquirer = require('inquirer');
const db = require('../config/connection');
const cTable = require('console.table');

class EmployeeDatabase {
    constructor() { }

    // Function to select departments from db for use later
    getDepartments(data) {
        db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {
                console.log(err);
            }
            for (let i = 0; i < result.length; i++) {
                data.push(result[i]);
            }
        })
    }

    // function to select employees and display them by name for later methods.
    getEmployee(data) {
        db.query(`SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS manager FROM employee`, (err, result) => {
            if (err) {
                console.log(err);
            }
            for (let i = 0; i < result.length; i++) {
                data.push(result[i].manager);
            }
        })
    }

    // function to get roles by title for later methods
    getRoles(data) {
        db.query(`SELECT role.id, role.title FROM role`, (err, result) => {
            if (err) {
                console.log(err);
            }
            for (let i = 0; i < result.length; i++) {
                data.push(result[i].title);
            }
        })
    }

    // method to initialize inquirer interactions with db
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

    // displays roles, joins department table to role table to display what department specific roles belong to
    viewRoles() {
        db.query(`SELECT role.id, role.title, department.name, role.salary FROM role LEFT JOIN department ON department.id = role.department_id`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.table(`\n`, result);
            this.start();;
        });
    }

    // displays employees, joins role titles and department names to table, concats first and last name of manager to display as manager choice
    viewEmployees() {
        db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON manager.id = employee.manager_id`, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.table(`\n`, result);
            this.start();;
        });
    }

    // simple call to insert new department name into db
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

    // function to add a new role
    addRole() {
        // creates empty depts variable, pushes current departments to variable by calling getDepartments function
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
                // db query to get the specific id value for the user's department choice selection
                db.query(`SELECT department.id FROM department WHERE name = "${response.roleDept}"`, (err, result) => {
                    // variable holds only the id value from first db query to pass to next db query
                    let departmentChoice = result[0].id;
                    if (err) {
                        console.log(err);
                    } else {
                        // db query creates new role using user response for title and salary, department id from variable
                        db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.roleTitle}', ${response.roleSalary}, ${departmentChoice})`);
                        this.start();
                    }
                });
            })
    }

    // function to add new employee
    addEmployee() {
        // creates empty roles and managers variables, uses functions to push options to variables
        let roles = [];
        let managers = ['None'];

        this.getRoles(roles);
        this.getEmployee(managers);

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
                    message: `Please provide new employee's last name:`,
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
                    message: `Please select new employee's manager or None if not applicable:`,
                    choices: managers,
                },
            ])
            .then((response) => {
                // if statement for if None is selected so that db entry will have no information for manager column
                if (response.manager === 'None') {
                    // queries db with selected role title to return role id to pass into table when employee is created
                    db.query(`SELECT role.id FROM role WHERE role.title = "${response.role}"`, (err, result) => {
                        let roleChoice = result[0].id;
                        if (err) {
                            console.log(err);
                        } else {
                            // inserts new value into employee without including manager_id property so that it fills in as null for no manager
                            db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ('${response.firstName}', '${response.lastName}', ${roleChoice})`);
                            this.start();
                        }
                    });         
                } else {
                    // queries db to return employee id from the manager name
                    db.query(`SELECT employee.id FROM employee WHERE CONCAT(employee.first_name, " ", employee.last_name) = "${response.manager}"`, (err, result) => {
                        let managerChoice = result[0].id;
                        if (err) {
                            console.log(err);
                        } else {
                            // queries db with selected role title to return role id to pass into table when employee is created
                            db.query(`SELECT role.id FROM role WHERE role.title = "${response.role}"`, (err, result) => {
                                let roleChoice = result[0].id;
                                if (err) {
                                    console.log(err);
                                } else {
                                    // creates new employee entry into employee table, passing in roleChoice and managerChoice so that values populate correctly
                                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.firstName}', '${response.lastName}', ${roleChoice}, ${managerChoice})`);
                                    this.start();
                                }
                            });
                        }
                    });
                }
            })
    }

    updateRole() {
        // creates empty newRole and employees variables, uses functions to push options to variables
        let newRole = [];
        let employees = [];

        this.getRoles(newRole);
        this.getEmployee(employees);

        inquirer
            .prompt([
                {
                    // If user is trying to update to a role that doesn't yet exist will take them to addRole method instead
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Does the role for this employee already exist?',
                    default: true,
                },
                {
                    // uses employees array to offer possible employees to select, only fires if previous inquirer prompt returns true
                    type: 'list',
                    name: 'employee',
                    message: `Which employee's role do you wish to update?`,
                    choices: employees,
                    when: (response) => response.confirm
                },
                {
                    // uses newRole array to offer possible roles to select, only fires if previous inquirer prompt returns true
                    type: 'list',
                    name: 'role',
                    message: `Which role do you wish to update this employee with?`,
                    choices: newRole,
                    when: (response) => response.employee
                },
            ])
            .then((response) => {
                if (response.confirm == false) {
                    console.log(`Re-directing to the Add Role program!`);
                    this.addRole();
                } else {
                    // queries db with selected role title to return role id to pass into table when employee is created
                    db.query(`SELECT role.id FROM role WHERE role.title = "${response.role}"`, (err, result) => {
                        let roleChoice = result[0].id;
                        if (err) {
                            console.log(err);
                        } else {
                            // updates employee's role on db entry that matches first and last name of selected employee
                            db.query(`UPDATE employee set role_id = ${roleChoice} WHERE CONCAT(employee.first_name, " ", employee.last_name) = "${response.employee}"`);
                            this.start();
                        }
                    })
                }
            })
    }
}

module.exports = EmployeeDatabase;