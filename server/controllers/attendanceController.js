const db = require('../db');

exports.clockIn = (req, res) => {
  const {
    companyName, department, firstName, lastName, email, employeeId, designation, clockInDate, clockInTime
  } = req.body;

  db.query(
    `INSERT INTO attendance (companyName, department, firstName, lastName, email, employeeId, designation, clockInDate, clockInTime)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [companyName, department, firstName, lastName, email, employeeId, designation, clockInDate, clockInTime],
    (error, results) => {
      if (error) {
        console.error('Clock-in error:', error);
        return res.status(500).json({ error: 'Failed to record clock-in' });
      }
      res.status(201).json({ message: 'Clock-in recorded' });
    }
  );
};

exports.clockOut = (req, res) => {
  const { employeeId, companyName, clockOutTime, workedTime } = req.body;

  if (!employeeId || !companyName || !clockOutTime || !workedTime) {
    return res.status(400).json({ error: 'Missing required fields for clock-out.' });
  }

  const query = `
    SELECT clockInTime FROM attendance 
    WHERE employeeId = ? AND companyName = ? AND clockOutTime IS NULL 
    ORDER BY clockInTime DESC LIMIT 1
  `;

  db.query(query, [employeeId, companyName], (error, results) => {
    if (error) {
      console.error('Database error during clock-out fetch:', error.message);
      return res.status(500).json({ error: 'Failed to fetch clock-in record.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No active clock-in found for this user.' });
    }

    const clockInTime = results[0].clockInTime;
    if (new Date(`1970-01-01T${clockOutTime}Z`) <= new Date(`1970-01-01T${clockInTime}Z`)) {
      return res.status(400).json({ error: 'Clock-out time must be after clock-in time.' });
    }

    const updateQuery = `
      UPDATE attendance
      SET clockOutTime = ?, workedTime = ?
      WHERE employeeId = ? AND companyName = ? AND clockOutTime IS NULL
      ORDER BY clockInTime DESC LIMIT 1
    `;

    db.query(updateQuery, [clockOutTime, workedTime, employeeId, companyName], (error, results) => {
      if (error) {
        console.error('Database error during clock-out update:', error.message);
        return res.status(500).json({ error: 'Failed to record clock-out.' });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'No active clock-in found to update.' });
      }

      res.json({ message: 'Clock-out successfully recorded.' });
    });
  });
};

exports.getAllAttendances = (req, res) => {
    const { companyName } = req.query; 

    if (!companyName) {
        return res.status(400).json({ error: 'Company name is required' });
    }

    const sql = 'SELECT * FROM attendance WHERE companyName = ?';
    
    db.query(sql, [companyName], (err, results) => {
        if (err) {
            console.error('Error fetching attendance records:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
};
