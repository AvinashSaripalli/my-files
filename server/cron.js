const cron = require('node-cron');
const db = require('./db');


cron.schedule('0 0 20 * *', () => {
  console.log('Running recurring task creation job on the 19th of each month');

  const fetchRecurringTasksSql = `
    SELECT 
      id, companyName, name, description, createdBy, status, isRecurring
    FROM 
      tasks 
    WHERE 
      isRecurring = TRUE
  `;
  db.query(fetchRecurringTasksSql, (err, tasks) => {
    if (err) {
      console.error('Error fetching recurring tasks:', err);
      return;
    }

    tasks.forEach(task => {
      const nextDueDate = new Date();
      nextDueDate.setDate(20);
      if (nextDueDate.getDate() < 20) {
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      }
      nextDueDate.setDate(20);

      // Insert new task with updated due date
      const insertTaskSql = `
        INSERT INTO tasks (companyName, name, description, dueDate, createdBy, status, isRecurring)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertTaskSql, [
        task.companyName,
        task.name,
        task.description,
        nextDueDate.toISOString().split('T')[0],
        task.createdBy,
        task.status,
        task.isRecurring
      ], (err, result) => {
        if (err) {
          console.error('Error creating recurring task:', err);
          return;
        }
        const newTaskId = result.insertId;

        // Copy task assignments
        const fetchAssignmentsSql = `SELECT employeeId FROM task_assignments WHERE taskId = ?`;
        db.query(fetchAssignmentsSql, [task.id], (err, assignments) => {
          if (err) {
            console.error('Error fetching task assignments:', err);
            return;
          }
          if (assignments.length > 0) {
            const insertAssignmentsSql = `INSERT INTO task_assignments (taskId, employeeId) VALUES ?`;
            const values = assignments.map(assignment => [newTaskId, assignment.employeeId]);
            db.query(insertAssignmentsSql, [values], (err) => {
              if (err) {
                console.error('Error copying task assignments:', err);
              }
            });
          }
        });
      });
    });
  });
});

module.exports = cron;