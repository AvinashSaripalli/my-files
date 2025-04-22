const db = require("../db");

exports.getReports = (req, res) => {
  const sql = "SELECT * FROM reports ORDER BY date DESC";
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

  const sql = "SELECT * FROM reports WHERE employeeId = ? ORDER BY date DESC";
  db.query(sql, [employeeId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};


exports.createReport = (req, res) => {
  const { employeeId, department, date, taskName, workDescription, hoursWorked, status } = req.body;
  const sql = "INSERT INTO reports (employeeId, department, date, taskName, workDescription, hoursWorked, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [employeeId, department, date, taskName, workDescription, hoursWorked, status], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Report added successfully", id: result.insertId });
  });
};