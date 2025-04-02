import React, { useState } from "react";
import { TextField, Button, Box, Typography, FormControl, Container, MenuItem, Select, InputLabel, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManagerRegister() {
  const [formValues, setFormValues] = useState({
    firstName: "", lastName: "", email: "", phoneNumber: "", password: "",
    companyName: "", gender: "", department: "", designation: "", jobLocation: "", photo: null
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!/^[a-zA-Z]+$/.test(formValues.firstName.trim())) newErrors.firstName = "Only letters allowed";
    if (!/^[a-zA-Z]+$/.test(formValues.lastName.trim())) newErrors.lastName = "Only letters allowed";
    if (!formValues.email.includes("@")) newErrors.email = "Invalid email";
    if (!/^\d{10}$/.test(formValues.phoneNumber)) newErrors.phoneNumber = "Must be 10 digits";
    if (!formValues.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/api/users/register", formValues);
      setSnackbar({ open: true, message: "Registered successfully!", severity: "success" });
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setSnackbar({ open: true, message: "Registration failed!", severity: "error" });
    }
  };

  return (
    <Container>
      <Box>
        <Typography variant="h5">Manager Registration</Typography>
        <form onSubmit={handleSubmit}>
          <TextField 
            label="First Name" 
            name="firstName" fullWidth 
            onChange={handleChange} 
            error={!!errors.firstName} 
            helperText={errors.firstName} 
          />
          <TextField label="Last Name" name="lastName" fullWidth onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName} />
          <TextField label="Email" name="email" fullWidth onChange={handleChange} error={!!errors.email} helperText={errors.email} />
          <TextField label="Phone Number" name="phoneNumber" fullWidth onChange={handleChange} error={!!errors.phoneNumber} helperText={errors.phoneNumber} />
          <TextField label="Password" name="password" type="password" fullWidth onChange={handleChange} error={!!errors.password} helperText={errors.password} />
          <Button type="submit" variant="contained" fullWidth>Register</Button>
        </form>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}

export default ManagerRegister;
