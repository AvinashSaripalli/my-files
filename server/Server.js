const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
require('./cron');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

const leaveRoutes = require('./routes/leaveRoutes');
app.use('/api/leaves', leaveRoutes);

const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

const attendanceRoutes = require('./routes/attendanceRoutes');
app.use('/api/attendance', attendanceRoutes);

const workRoutes = require('./routes/workRoutes');
app.use('/api/workgroups', workRoutes);

const taskRoutes = require('./routes/taskRoutes');
app.use('/api', taskRoutes);

const partnerTasksRoutes = require('./routes/partnerTasksRoutes');
app.use('/api/partnerTasks', partnerTasksRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
