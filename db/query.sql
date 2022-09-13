USE emp_track_db;

SELECT employee.id,employee.first_name,employee.last_name,role.title,department.name AS "department",role.salary,CONCAT(mgr.first_name, " ", mgr.last_name) AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT OUTER JOIN employee mgr ON employee.manager_id = mgr.id
ORDER BY employee.id;