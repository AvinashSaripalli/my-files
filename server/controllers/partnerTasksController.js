const db = require('../db');

exports.getPartnerTasks = (req, res) => {
  const { partnerCompanyId } = req.query;

  const sql = `

    SELECT 
    pt.id,
    pt.title,
    pt.description,
    pt.status,
    pt.dueDate,
    pt.createdBy,
    pt.assignedTo,
    pt.partnerCompanyId,
    uc.firstName AS createdByFirstName,
    uc.lastName AS createdByLastName,
    ua.firstName AS assignedToFirstName,
    ua.lastName AS assignedToLastName,
    ua.email AS assignedToEmail,
    ua.designation AS assignedToDesignation,
    ua.department AS assignedToDepartment,
    ua.technicalSkills AS assignedToTechnicalSkills,
    ua.photo AS assignedToPhoto
FROM 
    partner_tasks pt
    LEFT JOIN users uc ON pt.createdBy = uc.employeeId
    LEFT JOIN users ua ON pt.assignedTo = ua.employeeId
WHERE 
    pt.partnerCompanyId = ? AND (pt.exists = 1 OR pt.exists IS NULL)
ORDER BY 
    pt.createdOn DESC
  `;

  db.query(sql, [partnerCompanyId], (err, results) => {
    if (err) {
      console.error('Error fetching partner tasks:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

exports.createPartnerTask = (req, res) => {
  const { title, description, assignedTo, dueDate, createdBy, partnerCompanyId } = req.body;

  if (!partnerCompanyId) {
    return res.status(400).json({ error: 'partnerCompanyId is required' });
  }
  if (!title || !assignedTo || !dueDate || !createdBy) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO partner_tasks (
      title, description, assignedTo, dueDate, createdBy, partnerCompanyId, createdOn, status
    ) VALUES (?, ?, ?, ?, ?, ?, NOW(), 'Pending')
  `;

  db.query(sql, [title, description, assignedTo, dueDate, createdBy, partnerCompanyId], (err, result) => {
    if (err) {
      console.error('Error creating partner task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: result.insertId, message: 'Partner task created successfully' });
  });
};

exports.updatePartnerTask = (req, res) => {
  const { id } = req.params;
  const { title, description, assignedTo, dueDate, status, partnerCompanyId } = req.body;

  if (!partnerCompanyId) {
    return res.status(400).json({ error: 'partnerCompanyId is required' });
  }
  const sql = `
    UPDATE partner_tasks 
    SET 
      title = ?, 
      description = ?, 
      assignedTo = ?, 
      dueDate = ?, 
      status = ?
    WHERE id = ?
  `;

  db.query(sql, [title, description, assignedTo, dueDate, status, id], (err, result) => {
    if (err) {
      console.error('Error updating partner task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Partner task not found' });
    }
    res.json({ message: 'Partner task updated successfully' });
  });
};

exports.deletePartnerTask = (req, res) => {
  const { id } = req.params;
  const { partnerCompanyId } = req.body;

  if (!partnerCompanyId) {
    return res.status(400).json({ error: 'partnerCompanyId is required' });
  }

  const sql = `UPDATE partner_tasks SET \`exists\` = 0 WHERE id = ? AND partnerCompanyId = ?`;

  db.query(sql, [id, partnerCompanyId], (err, result) => {
    if (err) {
      console.error('Error deleting partner task:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Partner task not found' });
    }
    res.json({ message: 'Partner task deleted successfully' });
  });
};