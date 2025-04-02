import React, { useState } from "react";
import { 
  TextField, Button, Box, Typography, FormControl, Container, 
  MenuItem, Select, InputLabel, Tabs, Tab ,Snackbar,Alert
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MailRounded } from "@mui/icons-material";

function Register() {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    gender: "",
    role: "Manager",
    department: "",
    designation: "",
    jobLocation: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const validate = () => {
    const newErrors = {};
    
    if (!formValues.firstName) {
      newErrors.firstName = "Enter the First Name";
    }
    
    if (!formValues.lastName) {
      newErrors.lastName = "Enter the Last Name";
    }
    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else {
      const emailDomain = formValues.email.split("@")[1];
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
        newErrors.email = "Invalid email address";
      } else if (formValues.companyName === "Karncy" && emailDomain !== "karncy.com") {
        newErrors.email = "Email must end with @karncy.com";
      } else if (formValues.companyName === "Karnipuna" && emailDomain !== "karnipuna.com") {
        newErrors.email = "Email must end with @karnipuna.com";
      }
    }
    // else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
    //   newErrors.email = "Invalid email address";
    // }

    if (!formValues.phoneNumber) {
      newErrors.phoneNumber = "Please enter your Phone number";
    }

    if (!formValues.password) {
      newErrors.password = "Password is required";
    }
    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    }
    if (!formValues.companyName) {
      newErrors.companyName = "Company Name is required";
    }

    if (!formValues.department) {
      newErrors.department = "Please select your Department.";
    }
    if (!formValues.role) {
      newErrors.role = "Please select your Role.";
    }
    if (!formValues.jobLocation) {
      newErrors.jobLocation = "Please select your Job Location.";
    }

    if (!formValues.gender) {
      newErrors.gender = "Please select your Gender.";
    }

    if (!formValues.photo) {
      newErrors.photo = "Please upload an image.";
    }

    if (!/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(formValues.designation.trim())) {
      newErrors.designation = "Designation must contain only letters and single spaces";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  
    setErrors((prev) => {
      let newErrors = { ...prev };
  
      if (name === "firstName" && !/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(value)) {
        newErrors.firstName = "Only letters and a single space between words allowed";
      } else if (name === "lastName" && !/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(value)) {
        newErrors.lastName = "Only letters and a single space between words allowed";
      } else if (name === "phoneNumber" && !/^(\d{0,10})?$/.test(value)) {
        newErrors.phoneNumber = "Password must be 10 digits";
      } else if (name === "designation" && !/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(value)) {
        newErrors.designation = "Only letters and a single space between words allowed";
      } else if (name === "password") {
        newErrors.password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(value)
          ? ""
          : "Password must be 8-10 characters, include at least one letter, one number, and one special character.";
        
        newErrors.confirmPassword = formValues.confirmPassword === value ? "" : "Passwords do not match";
      } else if (name === "confirmPassword") {
        newErrors.confirmPassword = value === formValues.password ? "" : "Passwords do not match";
      } else {
        delete newErrors[name];
      }
  
      return newErrors;
    });
  };
  

  const handlePhotoChange = (e) => {
    setFormValues({ ...formValues, photo: e.target.files[0] });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFormValues((prev) => ({
      ...prev,
      role: newValue === 0 ? "Manager" : "Employee",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });
  
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]); 
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      console.log("Response:", response.data);
      setSnackbar({ open: true, message: "Registered successfully!", severity: "success" });
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || "Registration failed!", 
        severity: "error" 
      });
    }
  };

  return (
    <Container maxWidth="100vh" sx={{
      display: "flex", justifyContent: "center", alignItems: "center",
      background: "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)",
      minHeight: "100vh",
    }}>
      <Box maxWidth="sm" sx={{ mt: 5, mb: 5, p: 3, borderRadius: 2, boxShadow: 3, background: "white" }}>
        <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold" }}>
          Register
        </Typography>

        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Manager" />
          <Tab label="Employee" />
        </Tabs>

        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField 
            label="First Name" 
            name="firstName" 
            margin="dense" fullWidth
            value={formValues.firstName}
            inputProps={{maxLength:30}}
            onChange={handleChange} 
            error={!!errors.firstName} 
            helperText={errors.firstName} 
          />

          <TextField 
            label="Last Name" 
            name="lastName" 
            margin="dense" fullWidth
            value={formValues.lastName}
            inputProps={{maxLength:30}} 
            onChange={handleChange} 
            error={!!errors.lastName} 
            helperText={errors.lastName} 
            />

          <FormControl fullWidth margin="dense" error={!!errors.companyName}>
            <InputLabel >Company Name</InputLabel>
            <Select name="companyName" value={formValues.companyName}  onChange={handleChange} label="Company Name">
              <MenuItem value="Karncy">Karncy</MenuItem>
              <MenuItem value="Karnipuna">Karnipuna</MenuItem>
            </Select>
            {errors.companyName && <Typography color="error" sx={{ fontSize: '0.75rem', mt: 0.5,ml:2 }}>{errors.companyName}</Typography>}
          </FormControl >

          <TextField 
            label="Email" 
            name="email" 
            margin="dense" fullWidth
            value={formValues.email}
            inputProps={{maxLength:50}} 
            onChange={handleChange} 
            error={!!errors.email} 
            helperText={errors.email} 
          />

          <FormControl fullWidth margin="dense" error={!!errors.gender}>
            <InputLabel>Gender</InputLabel>
            <Select name="gender" value={formValues.gender} onChange={handleChange} label="Gender">
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
            {errors.gender && <Typography color="error" sx={{ fontSize: '0.75rem', mt: 0.5, ml:2 }}>{errors.gender}</Typography>}
          </FormControl>

          <TextField 
            label="Phone Number" 
            name="phoneNumber" 
            margin="dense" fullWidth 
            inputProps={{ maxLength: 10 }}
            value={formValues.phoneNumber} 
            onChange={handleChange} 
            error={!!errors.phoneNumber} 
            helperText={errors.phoneNumber} 
          />

          <TextField 
            label="Password"
            name="password" 
            margin="dense" fullWidth
            value={formValues.password}
            inputProps={{maxLength:10}} 
            onChange={handleChange} 
            error={!!errors.password} 
            helperText={errors.password} 
          />

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            margin="dense"
            fullWidth
            value={formValues.confirmPassword}
            inputProps={{ maxLength: 10 }}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <TextField 
            label="Designation" 
            name="designation" 
            margin="dense" fullWidth
            value={formValues.designation}
            inputProps={{maxLength:50}} 
            onChange={handleChange} 
            error={!!errors.designation} 
            helperText={errors.designation} 
          />

          <FormControl fullWidth margin="dense"variant="outlined" error={!!errors.department}>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              onChange={handleChange}
              label="Department"
            >
              <MenuItem value="Software Development">Software Development</MenuItem>
              <MenuItem value="Human Resources"> Human Resources</MenuItem>
              <MenuItem value="Design">Design</MenuItem>
              <MenuItem value="Testing">Testing</MenuItem>
              <MenuItem value="Accounting">Accounting</MenuItem>
            </Select>
            {errors.department && <Typography color="error" sx={{ fontSize: '0.75rem', mt: 0.5, ml:2 }}>{errors.department}</Typography>}
          </FormControl>

          <FormControl fullWidth margin="dense" error={!!errors.jobLocation}>
            <InputLabel>Job Location</InputLabel>
            <Select name="jobLocation" value={formValues.jobLocation} error={!!errors.jobLocation} helperText={errors.jobLocation}onChange={handleChange} label="Job Location">
              <MenuItem value="Hyderabad">Hyderabad</MenuItem>
              <MenuItem value="Chennai">Chennai</MenuItem>
              <MenuItem value="Kerala">Kerala</MenuItem>
              <MenuItem value="Amaravati">Amaravati</MenuItem>
              <MenuItem value="Delhi">Delhi</MenuItem>
              <MenuItem value="Mumbai">Mumbai</MenuItem>
              <MenuItem value="Kolkata">Kolkata</MenuItem>
            </Select>
            {errors.jobLocation && <Typography color="error" sx={{ fontSize: '0.75rem', mt: 0.5, ml:2 }}>{errors.jobLocation}</Typography>}
          </FormControl>

          <Button variant="outlined" component="label" sx={{ mt: 1, height:56,width: 600 }}>
            <input type="file" name="photo"  onChange={handlePhotoChange} />
          </Button>
          {errors.photo && <div style={{ color:"#d32f2f",fontSize: '0.8rem',mt:0.5, marginLeft: '25px' }}>{errors.photo}</div>} 
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account? <a href="/login">Login</a>
          </Typography>

        </form>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}  
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}
           
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Register;
