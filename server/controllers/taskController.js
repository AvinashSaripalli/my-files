const db = require('../db');

// Fetch all tasks for a partner company
exports.getTasks = (req, res) => {
  const { partnerCompanyId } = req.query;

  const sql = `
    SELECT 
      t.id,
      t.title,
      t.description,
      t.status,
      t.assignedTo,
      t.dueDate,
      t.createdBy,
      t.createdOn,
      u.firstName,
      u.lastName,
      u.email
    FROM 
      tasks t
      LEFT JOIN users u ON t.assignedTo = u.employeeId
    WHERE 
      t.partnerCompanyId = ? AND (u.exists = 1 OR u.employeeId IS NULL)
    ORDER BY 
      t.createdOn DESC
  `;

  db.query(sql, [partnerCompanyId], (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

// Create a new task
exports.createTask = (req, res) => {
  const { title, description, assignedTo, dueDate, partnerCompanyId, createdBy } = req.body;

  const insertTaskSql = `
    INSERT INTO tasks (
      title, 
      description, 
      status, 
      assignedTo, 
      dueDate, 
      partnerCompanyId, 
      createdBy, 
      createdOn
    ) VALUES (?, ?, 'Pending', ?, ?, ?, ?, NOW())
  `;
  db.query(insertTaskSql, [title, description, assignedTo, dueDate, partnerCompanyId, createdBy], (err, result) => {
    if (err) {
      console.error('Error creating task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: result.insertId, message: 'Task created successfully' });
  });
};