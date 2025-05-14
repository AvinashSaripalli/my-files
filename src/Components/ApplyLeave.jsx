import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import axios from "axios";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [onlyTomorrow, setOnlyTomorrow] = useState(false);
  const [halfDay, setHalfDay] = useState(false);
  const [errors, setErrors] = useState({});
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentLeaves, setRecentLeaves] = useState([]);


  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const employeeId = localStorage.getItem("userEmployeeId");
        const companyName = localStorage.getItem("companyName");

        if (!employeeId || !companyName) return;

        const response = await axios.get("http://localhost:5000/api/leaves", {
          params: { employeeId, companyName },
        });
        setLeaves(response.data);

        const recentResponse = await axios.get("http://localhost:5000/api/leaves/recent", {
          params: { employeeId, companyName },
        });
        setRecentLeaves(recentResponse.data);

      } catch (error) {
        console.error("Error fetching leaves:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const validateForm = () => {
    let newErrors = {};
    if (!leaveType) newErrors.leaveType = "Leave type is required.";
    if (!startDate) newErrors.startDate = "Start date is required.";
    if (!endDate) newErrors.endDate = "End date is required.";
    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = "End date cannot be before start date.";
    }
    if (reason.length < 10) {
      newErrors.reason = "Reason must be at least 10 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const employeeId = localStorage.getItem("userEmployeeId");
    const companyName = localStorage.getItem("companyName");
    if (!employeeId) {
      alert("Error: Employee ID not found. Please log in again.");
      return;
    }

    const leaveData = {
      employeeId,
      companyName,
      leaveType,
      startDate,
      endDate,
      reason,
      onlyTomorrow,
      halfDay,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/leaves/apply", leaveData);
      alert(response.data.message);
      const updatedLeaves = await axios.get("http://localhost:5000/api/leaves", {
        params: { employeeId, companyName },
      });
      setLeaves(updatedLeaves.data);
      handleClear();
    } catch (error) {
      alert("Failed to apply for leave. Please try again.");
    }
  };

  const handleClear = () => {
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setOnlyTomorrow(false);
    setHalfDay(false);
    setErrors({});
  };

  const handleOnlyTomorrowChange = (e) => {
    const checked = e.target.checked;
    setOnlyTomorrow(checked);
    if (checked) {
      setStartDate(tomorrowDate);
      setEndDate(tomorrowDate);
      setHalfDay(false);
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleHalfDayChange = (e) => {
    if (e.target.checked) {
      setOnlyTomorrow(false);
    }
    setHalfDay(e.target.checked);
  };

  const isLeaveDate = (date) => {
    const currentDate = dayjs(date).format('YYYY-MM-DD');
    return leaves.some((leave) => {
      const start = dayjs(leave.start_date).format('YYYY-MM-DD');
      const end = dayjs(leave.end_date).format('YYYY-MM-DD');
      return (
        leave.status === "Approved" &&
        currentDate >= start &&
        currentDate <= end
      );
    });
  };

  const CustomDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const isLeave = !outsideCurrentMonth && isLeaveDate(day);

    return (
      <Box
        sx={{
          position: 'relative',
          '& .leave-indicator': {
            position: 'absolute',
            bottom: 4,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#4caf50',
          },
        }}
      >
        <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth} />
        {isLeave && <div className="leave-indicator" />}
      </Box>
    );
  };

  const upcomingHolidays = [
    { date: "2025-12-25", name: "Christmas" },
    { date: "2026-01-01", name: "New Year's Day" },
  ];

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 3, ml: 6 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <CardContent sx={{ py: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Total Leaves
                  </Typography>
                  <Typography variant="h5">12</Typography>
                </CardContent>
              </Grid>
              <Grid item xs={3}>
                <CardContent sx={{ py: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Leave Balance
                  </Typography>
                  <Typography variant="h5">10</Typography>
                </CardContent>
              </Grid>
              <Grid item xs={3}>
                <CardContent sx={{ py: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Extra Leaves taken
                  </Typography>
                  <Typography variant="h5">8</Typography>
                </CardContent>
              </Grid>
              <Grid item xs={3}>
                <CardContent sx={{ py: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Public Holidays
                  </Typography>
                  <Typography variant="h5">24</Typography>
                </CardContent>
              </Grid>
            </Grid>
          </Card>

          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" mb={2} textAlign="left">
                Apply Leave
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          select
                          label="Leave Type"
                          value={leaveType}
                          onChange={(e) => setLeaveType(e.target.value)}
                          fullWidth
                          error={!!errors.leaveType}
                          helperText={errors.leaveType}
                        >
                          <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                          <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                          <MenuItem value="Earned Leave">Earned Leave</MenuItem>
                        </TextField>
                      </Grid>

                      <Grid item xs={6}>
                        <FormControlLabel
                          control={<Checkbox checked={onlyTomorrow} onChange={handleOnlyTomorrowChange} />}
                          label="Only For Tomorrow"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={<Checkbox checked={halfDay} onChange={handleHalfDayChange} />}
                          label="Half Day"
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          type="date"
                          label="From"
                          InputLabelProps={{ shrink: true }}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          fullWidth
                          error={!!errors.startDate}
                          helperText={errors.startDate}
                          inputProps={{ min: today.toISOString().split("T")[0] }}
                          disabled={onlyTomorrow}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          type="date"
                          label="To"
                          InputLabelProps={{ shrink: true }}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          fullWidth
                          error={!!errors.endDate}
                          helperText={errors.endDate}
                          inputProps={{ min: startDate || today.toISOString().split("T")[0] }}
                          disabled={onlyTomorrow}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Reason for Leave"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          fullWidth
                          multiline
                          rows={3}
                          margin="normal"
                          error={!!errors.reason}
                          helperText={errors.reason}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ backgroundColor: "#E0E0E0", color: "#000" }}
                          onClick={handleClear}
                        >
                          Clear
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button type="submit" variant="contained" fullWidth color="primary">
                          Apply
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      slots={{ day: CustomDay }}
                      sx={{
                        '& .Mui-selected': {
                          backgroundColor: '#1976d2 !important',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Recent Leaves Card */}
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Recent Leaves
                </Typography>
                {recentLeaves.length > 0 ? (
                  recentLeaves.map((leave, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        {leave.leave_type}:
                      </Typography>
                      <Typography>
                        {dayjs(leave.start_date).format('MMM DD, YYYY')} -{' '}
                        {dayjs(leave.end_date).format('MMM DD, YYYY')} ({leave.status})
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No recent leaves.
                  </Typography>
                )}

              </CardContent>
            </Card>

            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Upcoming Holidays
                </Typography>
                {upcomingHolidays.length > 0 ? (
                  upcomingHolidays.map((holiday, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        {holiday.name}: {dayjs(holiday.date).format('MMM DD, YYYY')}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No upcoming holidays.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApplyLeave;