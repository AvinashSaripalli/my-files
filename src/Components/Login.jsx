import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, Button, IconButton, InputAdornment,  Box, Typography, Container, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  
const [showPassword, setShowPassword] = useState(false);

const togglePasswordVisibility = () => {
  setShowPassword((prev) => !prev);
};
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginValues({ ...loginValues, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", loginValues);
      if (response.data.success) {
        const { token, role, photo, companyName, designation, email, firstName, jobLocation, lastName, phoneNumber, department, id, employeeId, technicalSkills, dateOfBirth, bloodGroup, gender } = response.data;
  
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userPhoto", photo);
        localStorage.setItem("companyName", companyName);
        localStorage.setItem("userDesignation", designation);
        localStorage.setItem("userJobLocation", jobLocation);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userFirstName", firstName);
        localStorage.setItem("userLastName", lastName);
        localStorage.setItem("userPhoneNumber", phoneNumber);
        localStorage.setItem("userDepartment", department);
        localStorage.setItem("userId", id);
        localStorage.setItem("userEmployeeId",employeeId);
        localStorage.setItem("userTechnicalSkills", technicalSkills);
        localStorage.setItem("userDateofBirth", dateOfBirth);
        localStorage.setItem("userBloodGroup", bloodGroup);
        localStorage.setItem("userGender", gender);
  
        setSnackbar({ open: true, message: "Login successful!", severity: "success" });
  
        setTimeout(() => {
          if (role === "Manager") {
            navigate("/sidebar");
          } else if (role === "Employee") {
            navigate("/employeesidebar");
          } else {
            navigate("/"); 
          }
        }, 1000);
      } else {
        setSnackbar({ open: true, message: "Incorrect email or password.", severity: "error" });
      }
    } catch (error) {
      console.error("Login Failed", error);
      setSnackbar({ open: true, message: "Login failed. Please try again.", severity: "error" });
    }
  };
  
  return (
    <Container
      maxWidth="100vh"
      sx={{
        display: "flex",
        alignItems: "center",
        background: "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)",
        justifyContent: "center",
        minHeight:"100vh",
      }}
    >
      <Box sx={{ mt: 5, padding: 3, borderRadius: 2, boxShadow: 3, background:"white" }}>
        <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold" }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 4 }}
          >
            Login
          </Button>
          
          <Typography sx={{ textAlign: "center" }}>
            Don't have an account? <a href="/Register">Register</a>
          </Typography>
        </form>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}  
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}
          sx={{
            width: "100%", 
            bgcolor:
              snackbar.severity === "success"
                ? "#4caf50" 
                : snackbar.severity === "error"
                ? "#f44336" 
                : snackbar.severity === "warning"
                ? "#ff9800" 
                : "#2196f3", 
                color: "white", 
              }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;