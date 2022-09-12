INSERT INTO department (id, name)
VALUES (100, "Accounting"),
       (200, "Engineering");

INSERT INTO role (id, title, salary, department_id)
VALUES (102, "Accountant", 65000, 100),
       (202, "Engineer", 72000, 200),
       (101, "Lead_Accountant", 85000, 100),
       (201, "Lead_Engineer", 95000, 200);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (8432, "Keneth", "Grager", 101, 0000),
       (4325, "George", "Kent", 202, 2334),
       (1543, "Laura", "Mayers", 102, 8432),
       (2334, "Kendra", "Malloy", 201, 0000);