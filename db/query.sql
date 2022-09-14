USE emp_track_db;

-- show all employees table with department and manager info
SELECT employee.id,employee.first_name,employee.last_name,role.title,department.name AS "department",role.salary,CONCAT(mgr.first_name, " ", mgr.last_name) AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT OUTER JOIN employee mgr ON employee.manager_id = mgr.id;

-- show all department list
SELECT * FROM department;

-- show all roles list
SELECT * FROM role;

SELECT id AS value, title AS name FROM role;

SELECT id AS value, CONCAT(first_name, " ", last_name) AS name from Employee;



