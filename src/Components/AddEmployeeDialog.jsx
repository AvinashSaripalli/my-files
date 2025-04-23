import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Box, Autocomplete, Chip } from "@mui/material";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const AddEmployeeDialog = ({ open, onClose, onSave, employeeId }) => {
  const initialUserState = {
    employeeId: employeeId || "",
    firstName: "",
    lastName: "",
    companyName: "",
    department: "",
    role: "",
    designation: "",
    jobLocation: "",
    email: "",
    phoneNumber: "",
    technicalSkills: [],
    dateOfBirth: null,
    photo: null,
    bloodGroup: "",
    gender: "",
    password: "",
    confirmPassword: ""
  };

  const [user, setUser] = useState(initialUserState);
  const [errors, setErrors] = useState({});
  const [skillsOption, setSkillsOption] = useState([]);

  useEffect(() => {
    if (open) {
      setErrors({});
      const userCompany = localStorage.getItem('companyName');
      setUser({
        ...initialUserState,
        employeeId: employeeId || "",
        companyName: userCompany || ""
      });
    }
  }, [open, employeeId]);

  useEffect(() => {
    setSkillsOption([
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS', 
      'Spring MVC', 'JDBC', 'Angular', 'C++', 'C#', 'Ruby', 'Django', 
      'Flask', 'SQL', 'MongoDB', 'AWS'
    ]);
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!user.firstName) newErrors.firstName = "First name is required";
    if (!user.lastName) newErrors.lastName = "Last name is required";
    if (!user.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) newErrors.email = "Invalid email address";
    if (!user.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(user.phoneNumber)) newErrors.phoneNumber = "Phone number must be 10 digits";
    if (!user.designation) newErrors.designation = "Designation is required";
    if (!user.department) newErrors.department = "Department is required";
    if (!user.role) newErrors.role = "Role is required";
    if (!user.jobLocation) newErrors.jobLocation = "Job location is required";
    if (!user.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (!user.gender) newErrors.gender = "Gender is required";
    if (!user.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!user.photo) newErrors.photo = "Photo is required";
    if (!user.password) newErrors.password = "Password is required";
    if (user.password !== user.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setUser((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => {
      let newErrors = { ...prev };
      if (name === "firstName") {
        if (!value) {
          newErrors.firstName = "First name is required";
        } else if (!/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(value)) {
          newErrors.firstName = "Only letters and a single space between words allowed";
        } else {
          delete newErrors.firstName;
        }
      } else if (name === "lastName") {
        if (!value) {
          newErrors.lastName = "Last name is required";
        } else if (!/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(value)) {
          newErrors.lastName = "Only letters and a single space between words allowed";
        } else {
          delete newErrors.lastName;
        }
      } else if (name === "phoneNumber") {
        if (!value) {
          newErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{0,10}$/.test(value)) {
          newErrors.phoneNumber = "Phone number must be 10 digits";
        } else {
          delete newErrors.phoneNumber;
        }
      } else if (name === "designation") {
        if (!value) {
          newErrors.designation = "Designation is required";
        } else if (!/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(value)) {
          newErrors.designation = "Only letters and a single space between words allowed";
        } else {
          delete newErrors.designation;
        }
      } else if (name === "password") {
        if (!value) {
          newErrors.password = "Password is required";
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(value)) {
          newErrors.password = "Password must be 8-16 characters, include at least one letter, one number, and one special character";
        } else {
          delete newErrors.password;
        }
        newErrors.confirmPassword = user.confirmPassword === value ? "" : "Passwords do not match";
      } else if (name === "confirmPassword") {
        if (value !== user.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
      } else if (name === "email") {
        const userCompany = localStorage.getItem("companyName")?.toLowerCase();
        const expectedEmailSuffix = userCompany ? `@${userCompany}.com` : null;
        
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Invalid email address";
        } else if (!value.toLowerCase().endsWith(expectedEmailSuffix)) {
          newErrors.email = `Email must end with @${userCompany}.com`;
        } else {
          delete newErrors.email;
        }
      }
       else if (name === "department" && !value) {
        newErrors.department = "Department is required";
      } else if (name === "role" && !value) {
        newErrors.role = "Role is required";
      } else if (name === "jobLocation" && !value) {
        newErrors.jobLocation = "Job location is required";
      } else if (name === "bloodGroup" && !value) {
        newErrors.bloodGroup = "Blood group is required";
      } else if (name === "gender" && !value) {
        newErrors.gender = "Gender is required";
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleSkillsChange = (e, value) => {
    setUser((prev) => ({ ...prev, technicalSkills: value }));
    setErrors((prev) => {
      let newErrors = { ...prev };
      if (value.length === 0) {
        newErrors.technicalSkills = "Please select at least one technical skill";
      } else {
        delete newErrors.technicalSkills;
      }
      return newErrors;
    });
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;
    setUser((prev) => ({ ...prev, dateOfBirth: formattedDate }));

    setErrors((prev) => {
      let newErrors = { ...prev };
      if (!formattedDate) {
        newErrors.dateOfBirth = "Date of birth is required";
      } else {
        const dob = new Date(formattedDate);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear() - 
                    (today.getMonth() < dob.getMonth() || 
                    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) ? 1 : 0);
        if (dob > today) {
          newErrors.dateOfBirth = "Date of birth cannot be in the future";
        } else if (age < 18) {
          newErrors.dateOfBirth = "You must be at least 18 years old";
        } else {
          delete newErrors.dateOfBirth;
        }
      }
      return newErrors;
    });
  };

  const handleSave = async () => {
    if (!validate()) return;
  
    const formData = new FormData();
    formData.append("employeeId", user.employeeId);
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
    formData.append("companyName", user.companyName);
    formData.append("department", user.department);
    formData.append("role", user.role);
    formData.append("designation", user.designation);
    formData.append("jobLocation", user.jobLocation);
    formData.append("email", user.email);
    formData.append("phoneNumber", user.phoneNumber);
    formData.append("technicalSkills", user.technicalSkills.join(","));
    formData.append("dateOfBirth", user.dateOfBirth);
    formData.append("photo", user.photo);
    formData.append("bloodGroup", user.bloodGroup);
    formData.append("gender", user.gender);
    formData.append("password", user.password);
    formData.append("confirmPassword", user.confirmPassword); 
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/registers",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 201) {
        alert("User added successfully");
        setUser(initialUserState);
        onSave();
        onClose();
      }
    } catch (error) {
      console.error("Error adding user:", error);
      const errorMessage = error.response?.data?.error || "User Adding Failed. Please try again.";
      if (error.response?.data?.details) {
        alert(`${errorMessage}: ${error.response.data.details}`);
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleClose = () => {
    setUser(initialUserState);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ style: { width: '80%', maxWidth: '800px' } }}>
      <DialogTitle fontWeight="bold">Add New Employee</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(370px, 1fr))" }}>
          <TextField
            label="Employee ID"
            name="employeeId"
            value={user.employeeId}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ ml: 1, width: "720px", mt: 1, mr: 1 }}
          />
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              label="First Name"
              name="firstName"
              variant="outlined"
              value={user.firstName}
              onChange={handleChange}
              inputProps={{ maxLength: 30 }}
              error={!!errors.firstName}
              helperText={errors.firstName}
              sx={{ ml: 1, width: '350px', mr: 2.25, mt: 1 }}
            />
            <TextField
              variant="outlined"
              name="lastName"
              label="Last Name"
              value={user.lastName}
              onChange={handleChange}
              inputProps={{ maxLength: 30 }}
              error={!!errors.lastName}
              helperText={errors.lastName}
              sx={{ ml: 2.25, width: '350px', mt: 1, mr: 1 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              label="Company Name"
              name="companyName"
              value={user.companyName}
              variant="outlined"
              InputProps={{ readOnly: true }}
              disabled
              sx={{ ml: 1, width: '350px', mt: 1, mr: 2.25 }}
            />
            <FormControl sx={{ ml: 2.25, width: '350px', mt: 1, mr: 1 }} margin="dense" variant="outlined" error={!!errors.department}>
              <InputLabel>Department</InputLabel>
              <Select name="department" value={user.department} onChange={handleChange} label="Department">
                <MenuItem value="Software Development">Software Development</MenuItem>
                <MenuItem value="Human Resources">Human Resources</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Testing">Testing</MenuItem>
                <MenuItem value="Accounting">Accounting</MenuItem>
              </Select>
              {errors.department && <Typography color="error" sx={{ fontSize: '0.8rem', mt: 0.5, ml: 2 }}>{errors.department}</Typography>}
            </FormControl>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <FormControl sx={{ ml: 1, width: '350px', mr: 2.25 }} margin="dense" variant="outlined" error={!!errors.role}>
              <InputLabel>Role</InputLabel>
              <Select name="role" value={user.role} onChange={handleChange} label="Role">
                <MenuItem value="Employee">Employee</MenuItem>
              </Select>
              {errors.role && <Typography color="error" sx={{ fontSize: '0.8rem', mt: 0.5, ml: 2 }}>{errors.role}</Typography>}
            </FormControl>
            <TextField
              variant="outlined"
              name="designation"
              label="Designation"
              value={user.designation}
              inputProps={{ maxLength: 50 }}
              onChange={handleChange}
              error={!!errors.designation}
              helperText={errors.designation}
              sx={{ ml: 2.25, width: '350px', mt: 1, mr: 1 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <FormControl sx={{ ml: 1, width: '350px', mr: 2.25, mt: 1 }} margin="dense" variant="outlined" error={!!errors.jobLocation}>
              <InputLabel>Job Location</InputLabel>
              <Select name="jobLocation" value={user.jobLocation} onChange={handleChange} label="Job Location">
                <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                <MenuItem value="Chennai">Chennai</MenuItem>
                <MenuItem value="Kerala">Kerala</MenuItem>
                <MenuItem value="Amaravati">Amaravati</MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Kolkata">Kolkata</MenuItem>
              </Select>
              {errors.jobLocation && <Typography color="error" sx={{ fontSize: '0.8rem', mt: 0.5, ml: 2 }}>{errors.jobLocation}</Typography>}
            </FormControl>
            <TextField
              variant="outlined"
              name="email"
              label="Email"
              value={user.email}
              onChange={handleChange}
              inputProps={{ maxLength: 50 }}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ ml: 2.25, width: '350px', mt: 1, mr: 1 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                sx={{ ml: 1, width: '350px', mt: 1, mr: 2.25 }}
                value={user.dateOfBirth ? dayjs(user.dateOfBirth) : null}
                onChange={handleDateChange}
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    error: !!errors.dateOfBirth,
                    helperText: errors.dateOfBirth,
                  },
                }}
              />
            </LocalizationProvider>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              variant="outlined"
              value={user.phoneNumber}
              inputProps={{ maxLength: 10 }}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              sx={{ ml: 2.25, width: '350px', mt: 1, mr: 1 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <FormControl sx={{ ml: 1, width: '350px', mt: 1, mr: 2.25 }} margin="dense" variant="outlined" error={!!errors.bloodGroup}>
              <InputLabel>Blood Group</InputLabel>
              <Select name="bloodGroup" value={user.bloodGroup} onChange={handleChange} label="Blood Group">
                <MenuItem value="A +ve">A +</MenuItem>
                <MenuItem value="A -ve">A -</MenuItem>
                <MenuItem value="B +ve">B +</MenuItem>
                <MenuItem value="B -ve">B -</MenuItem>
                <MenuItem value="O +ve">O +</MenuItem>
                <MenuItem value="O -ve">O -</MenuItem>
                <MenuItem value="AB +ve">AB +</MenuItem>
                <MenuItem value="AB -ve">AB -</MenuItem>
              </Select>
              {errors.bloodGroup && <Typography color="error" sx={{ fontSize: '0.8rem', mt: 0.5, ml: 2 }}>{errors.bloodGroup}</Typography>}
            </FormControl>
            <FormControl sx={{ width: '350px', ml: 2.25, mt: 1, mr: 1 }} margin="dense" error={!!errors.gender} variant="outlined">
              <InputLabel>Gender</InputLabel>
              <Select name="gender" value={user.gender} onChange={handleChange} label="Gender">
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
              {errors.gender && <Typography color="error" sx={{ fontSize: '0.8rem', mt: 0.5, ml: 2 }}>{errors.gender}</Typography>}
            </FormControl>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={user.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ ml: 1, width: '350px', mt: 1, mr: 2.25 }}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              value={user.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{ ml: 2.25, width: '350px', mt: 1, mr: 1 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Button
              variant="outlined"
              component="label"
              sx={{ display: 'flex', justifyContent: 'flex-start', height: 56, width: '740px', ml: 1, mt: 1, mr: 1 }}
            >
              {user.photo ? user.photo.name : "Upload Photo"}
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                hidden
              />
            </Button>
          </div>
          {errors.photo && <Typography color="error" sx={{ fontSize: '0.8rem', mt: 0.5, ml: 2 }}>{errors.photo}</Typography>}
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Autocomplete
              multiple
              freeSolo
              sx={{ ml: 1, width: '740px', mt: 1, mr: 1 }}
              options={skillsOption}
              value={user.technicalSkills}
              onChange={handleSkillsChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="contained" label={option} {...getTagProps({ index })} key={index} />
                ))
              }
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Technical Skills" 
                  error={!!errors.technicalSkills}
                  helperText={errors.technicalSkills}
                />
              )}
            />
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='contained' color='error'>Cancel</Button>
        <Button onClick={handleSave} variant='contained'>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;