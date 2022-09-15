INSERT INTO department (id, name)
VALUES (1, "Accounting"),
       (2, "Engineering");

INSERT INTO role (id, title, salary, department_id)
VALUES (100, "Accountant", 65000, 1),
       (101, "Engineer", 72000, 2),
       (102, "Lead_Accountant", 85000, 1),
       (103, "Lead_Engineer", 95000, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1000, "Keneth", "Grager", 100, 1002),
       (1001, "George", "Kent", 101, 1003),
       (1002, "Laura", "Mayers", 102, NULL),
       (1003, "Kendra", "Malloy", 103, NULL);
       