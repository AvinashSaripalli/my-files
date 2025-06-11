const db = require('../db');

exports.getTasks = (req, res) => {
  const { companyName } = req.query;
  const sql = `
    SELECT 
      t.id, t.name, t.description, t.dueDate, t.createdBy, t.status, t.createdOn,
      GROUP_CONCAT(ta.employeeId) AS assignedEmployees,
      u.firstName, u.lastName, u.email, u.designation, u.department, u.photo
    FROM 
      tasks t
      LEFT JOIN task_assignments ta ON t.id = ta.taskId
      LEFT JOIN users u ON t.createdBy = u.employeeId
    WHERE 
      t.companyName = ?
    GROUP BY 
      t.id
    ORDER BY 
      t.createdOn DESC
  `;
  db.query(sql, [companyName], (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results.map(task => ({
      ...task,
      assignedEmployees: task.assignedEmployees ? task.assignedEmployees.split(',') : []
    })));
  });
};

exports.getTasksByEmployeeId = (req, res) => {
  const { employeeId } = req.params;
  const { companyName } = req.query;
  const sql = `
    SELECT 
      t.id, t.name, t.description, t.dueDate, t.createdBy, t.status, t.createdOn,
      GROUP_CONCAT(ta.employeeId) AS assignedEmployees,
      u.firstName, u.lastName, u.email, u.designation, u.department, u.photo
    FROM 
      tasks t
      INNER JOIN task_assignments ta ON t.id = ta.taskId
      LEFT JOIN users u ON t.createdBy = u.employeeId
    WHERE 
      ta.employeeId = ? AND t.companyName = ?
    GROUP BY 
      t.id
    ORDER BY 
      t.createdOn DESC
  `;
  db.query(sql, [employeeId, companyName], (err, results) => {
    if (err) {
      console.error('Error fetching tasks for employee:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results.map(task => ({
      ...task,
      assignedEmployees: task.assignedEmployees ? task.assignedEmployees.split(',') : []
    })));
  });
};

exports.createTask = (req, res) => {
  const { companyName, name, description, dueDate, createdBy, employeeIds, status } = req.body;
  const insertTaskSql = `
    INSERT INTO tasks (companyName, name, description, dueDate, createdBy, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(insertTaskSql, [companyName, name, description, dueDate, createdBy, status || 'Pending'], (err, result) => {
    if (err) {
      console.error('Error creating task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    const taskId = result.insertId;
    if (employeeIds && employeeIds.length > 0) {
      const insertAssignmentsSql = `INSERT INTO task_assignments (taskId, employeeId) VALUES ?`;
      const values = employeeIds.map(employeeId => [taskId, employeeId]);
      db.query(insertAssignmentsSql, [values], (err) => {
        if (err) {
          console.error('Error assigning employees to task:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: taskId, message: 'Task created successfully' });
      });
    } else {
      res.status(201).json({ id: taskId, message: 'Task created successfully' });
    }
  });
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { name, description, dueDate, createdBy, employeeIds, status } = req.body;
  const updateTaskSql = `
    UPDATE tasks 
    SET name = ?, description = ?, dueDate = ?, createdBy = ?, status = ?
    WHERE id = ?
  `;
  db.query(updateTaskSql, [name, description, dueDate, createdBy, status, id], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const deleteAssignmentsSql = `DELETE FROM task_assignments WHERE taskId = ?`;
    db.query(deleteAssignmentsSql, [id], (err) => {
      if (err) {
        console.error('Error deleting task assignments:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (employeeIds && employeeIds.length > 0) {
        const insertAssignmentsSql = `INSERT INTO task_assignments (taskId, employeeId) VALUES ?`;
        const values = employeeIds.map(employeeId => [id, employeeId]);
        db.query(insertAssignmentsSql, [values], (err) => {
          if (err) {
            console.error('Error assigning employees:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Task updated successfully' });
        });
      } else {
        res.json({ message: 'Task updated successfully' });
      }
    });
  });
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const deleteTaskSql = `DELETE FROM tasks WHERE id = ?`;
  db.query(deleteTaskSql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
};

exports.getProjects = (req, res) => {
  const { companyName } = req.query;
  const sql = `
    SELECT 
      p.id, p.name, p.description, p.startDate, p.endDate, p.createdBy, p.status, p.createdOn,
      GROUP_CONCAT(pa.employeeId) AS assignedEmployees,
      u.firstName, u.lastName, u.email, u.designation, u.department, u.photo
    FROM 
      projects p
      LEFT JOIN project_assignments pa ON p.id = pa.projectId
      LEFT JOIN users u ON p.createdBy = u.employeeId
    WHERE 
      p.companyName = ?
    GROUP BY 
      p.id
    ORDER BY 
      p.createdOn DESC
  `;
  db.query(sql, [companyName], (err, results) => {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results.map(project => ({
      ...project,
      assignedEmployees: project.assignedEmployees ? project.assignedEmployees.split(',') : []
    })));
  });
};

exports.getProjectsByEmployeeId = (req, res) => {
  const { employeeId } = req.params;
  const { companyName } = req.query;
  const sql = `
    SELECT 
      p.id, p.name, p.description, p.startDate, p.endDate, p.createdBy, p.status, p.createdOn,
      GROUP_CONCAT(pa.employeeId) AS assignedEmployees,
      u.firstName, u.lastName, u.email, u.designation, u.department, u.photo
    FROM 
      projects p
      INNER JOIN project_assignments pa ON p.id = pa.projectId
      LEFT JOIN users u ON p.createdBy = u.employeeId
    WHERE 
      pa.employeeId = ? AND p.companyName = ?
    GROUP BY 
      p.id
    ORDER BY 
      p.createdOn DESC
  `;
  db.query(sql, [employeeId, companyName], (err, results) => {
    if (err) {
      console.error('Error fetching projects for employee:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results.map(project => ({
      ...project,
      assignedEmployees: project.assignedEmployees ? project.assignedEmployees.split(',') : []
    })));
  });
};

exports.createProject = (req, res) => {
  const { companyName, name, description, startDate, endDate, createdBy, employeeIds, status } = req.body;

  const insertProjectSql = `
    INSERT INTO projects (companyName, name, description, startDate, endDate, createdBy, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(insertProjectSql, [companyName, name, description, startDate, endDate || null, createdBy, status || 'Pending'], (err, result) => {
    if (err) {
      console.error('Error creating project:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const projectId = result.insertId;

    if (employeeIds && employeeIds.length > 0) {
      const insertAssignmentsSql = `INSERT INTO project_assignments (projectId, employeeId) VALUES ?`;
      const values = employeeIds.map(employeeId => [projectId, employeeId]);
      db.query(insertAssignmentsSql, [values], (err) => {
        if (err) {
          console.error('Error assigning employees to project:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: projectId, message: 'Project created successfully' });
      });
    } else {
      res.status(201).json({ id: projectId, message: 'Project created successfully' });
    }
  });
};

exports.updateProject = (req, res) => {
  const { id } = req.params;
  const { name, description, startDate, endDate, createdBy, employeeIds, status } = req.body;

  const updateProjectSql = `
    UPDATE projects 
    SET name = ?, description = ?, startDate = ?, endDate = ?, createdBy = ?, status = ?
    WHERE id = ?
  `;
  db.query(updateProjectSql, [name, description, startDate, endDate || null, createdBy, status, id], (err, result) => {
    if (err) {
      console.error('Error updating project:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const deleteAssignmentsSql = `DELETE FROM project_assignments WHERE projectId = ?`;
    db.query(deleteAssignmentsSql, [id], (err) => {
      if (err) {
        console.error('Error deleting project assignments:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (employeeIds && employeeIds.length > 0) {
        const insertAssignmentsSql = `INSERT INTO project_assignments (projectId, employeeId) VALUES ?`;
        const values = employeeIds.map(employeeId => [id, employeeId]);
        db.query(insertAssignmentsSql, [values], (err) => {
          if (err) {
            console.error('Error assigning employees:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Project updated successfully' });
        });
      } else {
        res.json({ message: 'Project updated successfully' });
      }
    });
  });
};

exports.deleteProject = (req, res) => {
  const { id } = req.params;

  const deleteProjectSql = `DELETE FROM projects WHERE id = ?`;
  db.query(deleteProjectSql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting project:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  });
};