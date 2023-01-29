INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 80000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ben", "Franklin", 1, null),
       ("Tom", "Jefferson", 2, 1),
       ("John", "Kennedy", 3, null),
       ("Ted", "Roosevelt", 4, 3),
       ("Dick", "Nixon", 5, null),
       ("Bill", "Clinton", 6, 5),
       ("George", "Washington", 7, null),
       ("Woody", "Wilson", 8, 7);