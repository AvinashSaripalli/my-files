const db = require('../db');

// Fetch all workgroups
exports.getWorkGroups = (req, res) => {
  const { companyName } = req.query;

  const sql = `
    SELECT 
      w.id,
      w.companyName,
      w.partnerCompanyName,
      w.partnerCompanyId,
      w.privacyType,
      w.createdBy,
      w.createdOn,
      u.employeeId,
      u.firstName,
      u.lastName,
      u.email,
      u.designation,
      u.department,
      u.technicalSkills,
      u.photo
    FROM 
      workgroups w
      LEFT JOIN workgroup_employees we ON w.id = we.workgroupId
      LEFT JOIN users u ON we.employeeId = u.employeeId
    WHERE 
      w.companyName = ? AND (u.exists = 1 OR u.employeeId IS NULL)
    ORDER BY 
      w.createdOn DESC
  `;

  db.query(sql, [companyName], (err, results) => {
    if (err) {
      console.error('Error fetching workgroups:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

// Create a new workgroup
exports.createWorkGroup = (req, res) => {
  const { companyName, partnerCompanyName, partnerCompanyId, privacyType, createdBy, employeeIds } = req.body;

  const insertWorkgroupSql = `
    INSERT INTO workgroups (
      companyName, 
      partnerCompanyName, 
      partnerCompanyId, 
      privacyType, 
      createdBy, 
      createdOn
    ) VALUES (?, ?, ?, ?, ?, NOW())
  `;
  db.query(insertWorkgroupSql, [companyName, partnerCompanyName, partnerCompanyId, privacyType, createdBy], (err, result) => {
    if (err) {
      console.error('Error creating workgroup:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const workgroupId = result.insertId;

    if (employeeIds && employeeIds.length > 0) {
      const insertEmployeesSql = `INSERT INTO workgroup_employees (workgroupId, employeeId) VALUES ?`;
      const values = employeeIds.map((employeeId) => [workgroupId, employeeId]);
      db.query(insertEmployeesSql, [values], (err) => {
        if (err) {
          console.error('Error assigning employees:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: workgroupId, message: 'Workgroup created successfully' });
      });
    } else {
      res.status(201).json({ id: workgroupId, message: 'Workgroup created successfully' });
    }
  });
};

// Update a workgroup
exports.updateWorkGroup = (req, res) => {
  const { id } = req.params;
  const { partnerCompanyName, partnerCompanyId, privacyType, createdBy, employeeIds } = req.body;

  const updateWorkgroupSql = `
    UPDATE workgroups 
    SET 
      partnerCompanyName = ?, 
      partnerCompanyId = ?, 
      privacyType = ?, 
      createdBy = ?
    WHERE id = ?
  `;
  db.query(updateWorkgroupSql, [partnerCompanyName, partnerCompanyId, privacyType, createdBy, id], (err, result) => {
    if (err) {
      console.error('Error updating workgroup:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Workgroup not found' });
    }

    const deleteEmployeesSql = `DELETE FROM workgroup_employees WHERE workgroupId = ?`;
    db.query(deleteEmployeesSql, [id], (err) => {
      if (err) {
        console.error('Error deleting employee assignments:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (employeeIds && employeeIds.length > 0) {
        const insertEmployeesSql = `INSERT INTO workgroup_employees (workgroupId, employeeId) VALUES ?`;
        const values = employeeIds.map((employeeId) => [id, employeeId]);
        db.query(insertEmployeesSql, [values], (err) => {
          if (err) {
            console.error('Error assigning employees:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Workgroup updated successfully' });
        });
      } else {
        res.json({ message: 'Workgroup updated successfully' });
      }
    });
  });
};

// Fetch partner companies
exports.getPartnerCompanies = (req, res) => {
  const sql = `SELECT partnerCompanyId, partnerCompanyName FROM partner_companies`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching partner companies:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};