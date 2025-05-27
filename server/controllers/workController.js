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
      u.firstName,
      u.lastName,
      u.email,
      u.phoneNumber,
      u.role,
      u.designation,
      u.department,
      u.jobLocation,
      u.technicalSkills,
      u.gender,
      u.photo
    FROM 
      workgroups w
      INNER JOIN users u ON w.employeeId = u.employeeId
    WHERE 
      w.companyName = ? AND u.exists=1
    ORDER BY 
      w.createdOn DESC
  `;

  db.query(sql, [companyName], (err, results) => {
    if (err) {
      consolu.error('Error fetching workgroups:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};


