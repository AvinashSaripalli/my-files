const cron = require('node-cron');
const db = require('./db');

cron.schedule('0 0 25 * *', () => {
  console.log('Running recurring task creation job on the 25th of each month');

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
    if (!tasks.length) {
      console.log('No recurring tasks found.');
      return;
    }

    tasks.forEach(task => {
      const now = new Date();
      let nextDueDate = new Date(now.getFullYear(), now.getMonth() + 1, 25);
      if (now.getDate() > 25) {
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      }

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
          console.error(`Error creating recurring task for task ID ${task.id}:`, err);
          return;
        }
        const newTaskId = result.insertId;
        console.log(`Created new recurring task with ID ${newTaskId}`);

        const fetchAssignmentsSql = `SELECT employeeId FROM task_assignments WHERE taskId = ?`;
        db.query(fetchAssignmentsSql, [task.id], (err, assignments) => {
          if (err) {
            console.error(`Error fetching assignments for task ID ${task.id}:`, err);
            return;
          }
          if (assignments.length > 0) {
            const insertAssignmentsSql = `INSERT INTO task_assignments (taskId, employeeId) VALUES ?`;
            const values = assignments.map(assignment => [newTaskId, assignment.employeeId]);
            db.query(insertAssignmentsSql, [values], (err) => {
              if (err) {
                console.error(`Error copying assignments for task ID ${newTaskId}:`, err);
              } else {
                console.log(`Copied ${assignments.length} assignments for task ID ${newTaskId}`);
              }
            });
          }
        });
      });
    });
  });
});

module.exports = cron;