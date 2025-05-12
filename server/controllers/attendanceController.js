const db = require('../db'); 

exports.clockIn = (req, res) => {
  const {
    employeeId,
    companyName,
    firstName,
    lastName,
    email,
    date,
    clockInTime,
  } = req.body;

  db.query(
    'SELECT * FROM attendance WHERE employeeId = ? AND date = ?',
    [employeeId, date],
    (err, results) => {
      if (err) {
        console.error('Database error during check:', err.message);
        return res.status(500).json({ message: 'Server error during clock-in.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Already clocked in for today.' });
      }
      db.query(
        'INSERT INTO attendance (employeeId, companyName, firstName, lastName, email, date, clockInTime) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [employeeId, companyName, firstName, lastName, email, date, clockInTime],
        (insertErr) => {
          if (insertErr) {
            console.error('Error during clock-in insertion:', insertErr.message);
            return res.status(500).json({ message: 'Error inserting clock-in data.' });
          }

          res.status(201).json({ message: 'Clock-in successful!' });
        }
      );
    }
  );
};

exports.clockOut = (req, res) => {
  const { employeeId, date, clockOutTime, workedHours } = req.body;

  db.query(
    'SELECT * FROM attendance WHERE employeeId = ? AND date = ?',
    [employeeId, date],
    (err, results) => {
      if (err) {
        console.error('Database error during check:', err.message);
        return res.status(500).json({ message: 'Server error during clock-out.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No clock-in record found for today.' });
      }

      db.query(
        'UPDATE attendance SET clockOutTime = ?, workedHours = ? WHERE employeeId = ? AND date = ?',
        [clockOutTime, workedHours, employeeId, date],
        (updateErr) => {
          if (updateErr) {
            console.error('Error during clock-out update:', updateErr.message);
            return res.status(500).json({ message: 'Error updating clock-out data.' });
          }

          res.status(200).json({ message: 'Clock-out successful!' });
        }
      );
    }
  );
};


