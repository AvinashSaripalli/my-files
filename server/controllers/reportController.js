const db = require("../db");

exports.getReports = (req, res) => {
  const sql = "SELECT * FROM reports ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getTheReports = (req, res) => {
  const { employeeId } = req.query; 

  if (!employeeId) {
    return res.status(400).json({ error: "employeeId is required" });
  }

  const sql = "SELECT * FROM reports WHERE employeeId = ? ORDER BY id DESC";
  db.query(sql, [employeeId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.updateFeedbackByEmployeeId = (req, res) => {
  const { employeeId } = req.body;
  const { feedback } = req.body;
  const { id } = req.params;       

  if (!feedback) {
    return res.status(400).json({ error: 'Feedback is required' });
  }

  const query = 'UPDATE reports SET feedback = ? WHERE id = ? AND employeeId = ?';
  db.query(query, [feedback, id, employeeId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update feedback' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee report not found' });
    }

    res.status(200).json({ message: 'Feedback updated successfully' });
  });
};

exports.createReport = (req, res) => {
  const { employeeId, department, date, taskName, workDescription, hoursWorked} = req.body;
  const sql = "INSERT INTO reports (employeeId, department, date, taskName, workDescription, hoursWorked) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [employeeId, department, date, taskName, workDescription, hoursWorked], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Report added successfully", id: result.insertId });
  });
};