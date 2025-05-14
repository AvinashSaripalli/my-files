const db = require('../db');

exports.leaveApply=(req, res) => {
    const { employeeId, companyName,leaveType, startDate, endDate, reason, onlyTomorrow, halfDay } = req.body;
  
    const sql = `INSERT INTO leaves (employeeId, leave_type, start_date, end_date, reason, only_tomorrow, half_day, status, companyName)
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`;
  
    db.query(sql, [employeeId, leaveType, startDate, endDate, reason, onlyTomorrow, halfDay, companyName], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({ message: "Leave applied successfully", leaveId: result.insertId });
    });
};

exports.getAllLeaves = (req, res) => {
    const { companyName } = req.query; 

    if (!companyName) {
        return res.status(400).json({ error: 'Company name is required' });
    }

    const sql = 'SELECT * FROM leaves WHERE companyName = ? ORDER BY created_at DESC';
    
    db.query(sql, [companyName], (err, results) => {
        if (err) {
            console.error('Error fetching leave records:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
};

exports.getRecentLeaves = (req, res) => {
  const { employeeId, companyName } = req.query;

  if (!employeeId || !companyName) {
    return res.status(400).json({ error: "Employee ID and Company Name are required" });
  }

  const query = `
    SELECT * FROM leaves 
    WHERE employeeId = ? 
    AND companyName = ?
    AND (start_date < NOW() OR start_date > NOW()) 
    ORDER BY start_date DESC 
    LIMIT 4
  `;

  db.query(query, [employeeId, companyName], (err, results) => {
    if (err) {
      console.error("Error fetching recent leaves:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
};

exports.getLeaveCounts = (req, res) => {
  const { companyName } = req.query;

  if (!companyName) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  const query = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
    FROM leaves
    WHERE companyName = ?
  `;

  db.query(query, [companyName], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results[0]);
  });
};


exports.updateLeaveStatus = (req, res) => {
    const { leaveId, status } = req.body;

    if (!leaveId || !status) {
        return res.status(400).json({ error: 'Leave ID and status are required' });
    }

    const sql = 'UPDATE leaves SET status = ? WHERE id = ?';
    db.query(sql, [status, leaveId], (err, result) => {
        if (err) {
            console.error('Error updating leave status:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: `Leave ${status} successfully!` });
    });
};

exports.getLeavesByEmployee = (req, res) => {
    const { employeeId,companyName } = req.query;

    if (!employeeId) {
        return res.status(400).json({ message: "Employee ID is required" });
    }

    const query = "SELECT * FROM leaves WHERE employeeId = ? AND companyName = ? ORDER BY created_at DESC";
    db.query(query, [employeeId, companyName], (err, results) => {
        if (err) {
            console.error("Error fetching leaves:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.status(200).json(results);
    });
};

exports.getApprovedLeavesToday = (req, res) => {
    const { companyName, year } = req.query;

    if (!companyName || !year) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1; 

    const query = `
        SELECT COUNT(*) AS leaveCount 
        FROM leaves 
        WHERE companyName = ? 
        AND status = 'approved' 
        AND YEAR(start_date) = ? 
        AND MONTH(start_date) = ? 
        AND DAY(start_date) = ?
    `;

    db.query(query, [companyName, year, currentMonth, currentDate], (err, results) => {
        if (err) {
            console.error('Error fetching approved leaves:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ leaveCount: results[0].leaveCount });
    });
};