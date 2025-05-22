const db = require('../db');

exports.getWorkGroups = (req, res) => {
  const { companyName } = req.query;

  if (!companyName) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  const sql = 'SELECT * FROM workgroups WHERE companyName = ? ORDER BY createdOn DESC';

  db.query(sql, [companyName], (err, results) => {
    if (err) {
      console.error('Error fetching workgroups:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};
