const db = require('../db');

exports.getWorkGroups = (req, res) => {
  const { companyName } = req.query;

  if (!companyName) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  const sql = `
    SELECT 
      w.id,
      w.companyName,
      w.createdOn,
      w.privacyType,
      w.employeeId,
      w.partnerCompanyName,
      e.firstName,
      e.lastName,
      e.email,
      e.phoneNumber,
      e.role,
      e.designation,
      e.department,
      e.jobLocation,
      e.technicalSkills,
      e.gender,
      e.photo
    FROM 
      workgroups w
      INNER JOIN users e ON w.employeeId = e.employeeId
    WHERE 
      w.companyName = ?
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
