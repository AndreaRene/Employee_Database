SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

SELECT employee.id,employee.first_name,employee.last_name,role.title,department.name as "department",role.salary,employee.manager_id
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;