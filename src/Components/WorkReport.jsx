import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid2,
  Paper,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";

const WorkReport = () => {
  const [report, setReport] = useState("");

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Work Report 
        </Typography>
        <Grid2 container alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Grid2 item>
            <Avatar src="/avatar.jpg" />
          </Grid2>
          <Grid2 item>
            <Typography fontWeight="bold">Avinash Saripalli</Typography>
            <Typography variant="body2" color="textSecondary">
              Trainee Software Engineer
            </Typography>
          </Grid2>
          <Grid2 item>
            <Typography>To:</Typography>
          </Grid2>
          <Grid2 item>
            <Avatar src="/director.jpg" />
          </Grid2>
          <Grid2 item>
            <Typography fontWeight="bold">Siva Krishna Kolli</Typography>
            <Typography variant="body2" color="textSecondary">
              Director
            </Typography>
          </Grid2>
        </Grid2>

        <TextField
          label="Enter your report"
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
          value={report}
          onChange={(e) => setReport(e.target.value)}
        />

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="contained" color="success">
            Send to Supervisor
          </Button>
          <Button variant="outlined">Save</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default WorkReport;
