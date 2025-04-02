import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Box, Autocomplete, Chip} from "@mui/material";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const AddEmployeeDialog = ({ open, onClose, onSave,employeeId }) => {
  const initialUserState = {
    employeeId: employeeId,
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
  };
  const [user, setUser] = useState(initialUserState);
  const [errors, setErrors] = useState({});
  const [skillsOption, setSkillsOption] = useState([]);
  const [newEmployeeId, setNewEmployeeId] = useState(employeeId || '');


  useEffect(() => {
    if (open) {
      setErrors({});
      setSkillsOption([
        'JavaScript',
        'Python',
        'Java',
        'React',
        'Node.js',
        'HTML',
        'CSS',
        'Spring MVC',
        'JDBC',
        'Angular',
        'C++',
        'C#',
        'Ruby',
        'Django',
        'Flask',
        'SQL',
        'MongoDB',
        'AWS',

      ]);
      setUser(initialUserState);
      setNewEmployeeId(employeeId);
      const userCompany = localStorage.getItem('companyName');
      if (userCompany) {
        setUser((prev) => ({ ...prev, companyName: userCompany }));
      }
    }
  }, [open,employeeId]);

  // useEffect(() => {
  //   setSkillsOption([
  //     'JavaScript',
  //     'Python',
  //     'Java',
  //     'React',
  //     'Node.js',
  //     'HTML',
  //     'CSS',
  //     'Spring MVC',
  //     'JDBC',
  //     'Angular',
  //     'C++',
  //     'C#',
  //     'Ruby',
  //     'Django',
  //     'Flask',
  //     'SQL',
  //     'MongoDB',
  //     'AWS',
  //   ]);
  // }, []);

  const validate = () => {
    const newErrors = {};

    if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(user.firstName)) {
      newErrors.firstName = "First name must contain only letters and spaces.";
    }
    if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(user.lastName)) {
      newErrors.lastName = "Last name must contain only letters and spaces.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Invalid email address.";
    } else if (user.companyName) {
      const companyDomain = `@${user.companyName.toLowerCase()}.com`;
      if (!user.email.endsWith(companyDomain)) {
        newErrors.email = `Email must end with ${companyDomain}`;
      }
    }
    if (!/^\d{10}$/.test(user.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }
    if (!user.designation) newErrors.designation = "Enter your designation.";
    if (!user.department) newErrors.department = "Select your department.";
    if (!user.role) newErrors.role = "Select your role.";
    if (!user.jobLocation) newErrors.jobLocation = "Select job location.";
    if (!user.bloodGroup) newErrors.bloodGroup = "Select blood group.";
    if (!user.gender) newErrors.gender = "Select gender.";
    if (!user.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";
    if (!user.photo) newErrors.photo = "Upload a profile photo.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
  //   if (name === "firstName" && !/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(value)) {
  //     setErrors((prev) => ({ ...prev, firstName: "Only letters and space allowed" }));
  //   } else if (name === "lastName" && !/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(value)) {
  //     setErrors((prev) => ({ ...prev, lastName: "Only letters and space allowed" }));
  //   } else if (name === "phoneNumber" && !/^\d{0,10}$/.test(value)) {
  //     setErrors((prev) => ({ ...prev, phoneNumber: "Must be 10 digits" }));
  //   } else if (name === "designation" && !/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(value)) {
  //     setErrors((prev) => ({ ...prev, designation: "Only letters and space allowed" }));
  //  }else if (name === "email") {
  //   const companyDomain = user.companyName ? `@${user.companyName.toLowerCase()}.com` : "";
  //   if (companyDomain && !value.endsWith(companyDomain)) {
  //     setErrors((prev) => ({ ...prev, email: `Email must end with ${companyDomain}` }));
  //   } else {
  //     setErrors((prev) => {
  //       const { email, ...rest } = prev;
  //       return rest;
  //     });
  //   }
  // }  
  //   else {
  //     setErrors((prev) => {
  //       const { [name]: removed, ...rest } = prev;
  //       return rest;
  //     }); 
  //   }

    if (name === "photo") {
      setUser((prev) => ({ ...prev, photo: files[0] }));
    } 
     else {
      setUser((prev) => ({ ...prev, [name]: value }));  
    }
  }; 

  const handleSkillsChange = (e, value) => {
    setUser((prev) => ({ ...prev, technicalSkills: value }));
  };

  const handleDateChange = (date) => {
    setUser((prev) => ({ ...prev, dateOfBirth: dayjs(date).format("YYYY-MM-DD") }));
  };
  
  const handleSave = async () => {

    if (!validate()) return;
   
    const formData = new FormData();
    formData.append("photo", user.photo);
    formData.append("technicalSkills", user.technicalSkills.join(","));
    //formData.append("dateOfBirth", user.dateOfBirth);
    Object.keys(user).forEach((key) => {
      if (key !== "photo" && key !== "technicalSkills") {
        formData.append(
          key, user[key]
        );
      }
    });

    // console.log("FormData Contents:");
    // for (let pair of formData.entries()) {
    //     console.log(pair[0] + ": ", pair[1]);
    // }

    try {  
      const response = await axios.post(
        "http://localhost:5000/api/users/registers",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        alert("User added successfully");
        setUser(initialUserState);
        onSave();
        onClose();
      }
      console.log("User Added Sucessfully");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("User Adding Failed. Please try again.");
    }
  };

  const handleClose = () => {
    setUser(initialUserState);
    onClose();
  };
  
  return (
    <Dialog open={open} onClose={handleClose} 
    PaperProps={{
      style: {
        width: '80%',
        maxWidth: '800px',
      },
    }}
    >
      
      <DialogTitle fontWeight="bold">Add New Employee</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fit, minmax(370px, 1fr))",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start" }}> 
          
          <TextField
            label="Employee ID"
            name="employeeId"
            value={newEmployeeId}
           
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ ml: 1, width: "740px", mt: 1, mr: 1 }}
          />
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-start",  }}>
          <TextField
            label="First Name"
            name="firstName"
            variant="outlined"
            onChange={handleChange}
            inputProps={{maxLength:30}}
            error={!!errors.firstName}
            helperText={errors.firstName}
            sx={{ ml:1,width:'350px',mr:2.25,mt:1 }}
          /> 
            <TextField
              variant="outlined"
              name="lastName"
              label="Last Name"
              onChange={handleChange}
              inputProps={{maxLength:30}}
              error={!!errors.lastName}
              helperText={errors.lastName}
              sx={{ml:2.25,width:'350px' ,mt:1,mr:1}}
            />
          </div>
          {/**/}    
          <div style={{ display: "flex", alignItems: "flex-start",  }}>
          <TextField
            label="Company Name"
            name="companyName"
            value={user.companyName}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            disabled
            sx={{ ml: 1, width: '350px', mt: 1, mr: 2.25 }}
          />
          {/**/}
          <FormControl sx={{ ml:2.25, width:'350px',mt:1,mr:1 }} margin="dense"variant="outlined" error={!!errors.department}>
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              onChange={handleChange}
              label="Department"
            >
              <MenuItem value="Software Development">Software Development</MenuItem>
              <MenuItem value="Human Resources"> Human Resources</MenuItem>
              <MenuItem value="Design">Design</MenuItem>
            </Select>
            {errors.department && <Typography color="error" sx={{ fontSize: '0.8rem', mt: 0.5, ml:2 }}>{errors.department}</Typography>}
          </FormControl>
          </div>
         
          <div style={{ display: "flex", alignItems: "flex-start",  }}>
            <FormControl  sx={{ ml:1, width: '350px',mr:2.25}} margin="dense" variant="outlined" error={!!errors.role}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="Employee">Employee</MenuItem>
              </Select>
              {errors.role && <Typography color="error" sx={{ fontSize: '0.8rem', mt: 0.5, ml:2}}>{errors.role}</Typography>}
            </FormControl>
           
            <TextField
              variant="outlined"
              name="designation"
              label="Designation"
              inputProps={{maxLength:50}}
              onChange={handleChange}
              error={!!errors.designation}
              helperText={errors.designation}
              sx={{ml:2.25,width:'350px' ,mt:1,mr:1}}
            />
          </div>
          <div>
            {/**/}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start",  }}> 
          <FormControl sx={{ ml:1, width:'350px',mr:2.25,mt:1}} margin="dense"variant="outlined" error={!!errors.jobLocation}>
            <InputLabel>Job Location</InputLabel>
            <Select
              name="jobLocation"
              onChange={handleChange}
              label="Job Location"
            >
              <MenuItem value="Hyderabad">Hyderabad</MenuItem>
              <MenuItem value="Chennai">Chennai</MenuItem>
              <MenuItem value="Kerala">Kerala</MenuItem>
              <MenuItem value="Amaravati">Amaravati</MenuItem>
              <MenuItem value="Delhi">Delhi</MenuItem>
              <MenuItem value="Mumbai">Mumbai</MenuItem>
              <MenuItem value="Kolkata">Kolkata</MenuItem>
            </Select>
            {errors.jobLocation && <Typography color="error" sx={{ fontSize: '0.8rem', mt: 0.5, ml:2 }}>{errors.jobLocation}</Typography>}
            </FormControl>
           
            <TextField
              variant="outlined"
              name="email"
              label="Email"
              onChange={handleChange}
              inputProps={{maxLength:50}}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ml:2.25,width:'350px',mt:1,mr:1}}
            />
          </div>

          <div style={{ display: "flex", alignItems: "flex-start",  }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              sx={{ ml:1,width:'350px',mt:1,mr:2.25}}
              value={user.dateOfBirth ? dayjs(user.dateOfBirth) :null }
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params}  />}
              maxDate={dayjs()}
            />
          </LocalizationProvider>
          <TextField 
              label="Phone Number"
              name="phoneNumber"
              variant='outlined'
              inputProps={{maxLength:10}}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              sx={{ ml:2.25, width:'350px',mt:1,mr:1 }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "flex-start",  }}>
            <FormControl sx={{ ml:1, width:'350px',mt:1 ,mr:2.25}} margin="dense"  variant="outlined" error={!!errors.bloodGroup}>
              <InputLabel>Blood Group</InputLabel>
                <Select
                  name="bloodGroup"
                  onChange={handleChange}
                  label="Blood Group"
                >
                  <MenuItem value="A +ve">A +</MenuItem>
                  <MenuItem value="A -ve">A -</MenuItem>
                  <MenuItem value="B +ve">B +</MenuItem>
                  <MenuItem value="B -ve">B -</MenuItem>
                  <MenuItem value="O +ve">O +</MenuItem>
                  <MenuItem value="O -ve">O -</MenuItem>
                  <MenuItem value="AB +ve">AB +</MenuItem>
                  <MenuItem value="AB -ve">AB -</MenuItem>
                </Select>
                {errors.bloodGroup && <Typography color="error" sx={{ fontSize: '0.8rem', mt: 0.5, ml:2 }}>{errors.bloodGroup}</Typography>} 
            </FormControl>
              <FormControl  sx={{width:'350px' ,ml:2.25,mt:1,mr:1 }} margin="dense" error={!!errors.gender} variant="outlined">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
              {errors.gender && <Typography color="error" sx={{ fontSize: '0.8rem', mt: 0.5, ml:2 }}>{errors.gender}</Typography>}  
          </FormControl>
           
          </div>
           
          <div style={{ display: "flex", alignItems: "flex-start",  }}> 
            <Button
              variant="outlined"
              component="label"
              sx={{
                display: 'flex',
                justifyContent: 'flex-start', 
                height:56,width:'740px',ml:1,mt:1,mr:1
              }}  
            >
              <input
                type="file"
                name="photo" 
                onChange={handleChange} 
              />  
            </Button>
             
          </div>
          {errors.photo && <div style={{ color:"#d32f2f",fontSize: '0.8rem',mt:0.5, marginLeft: '25px' }}>{errors.photo}</div>} 
          <div style={{ display: "flex", alignItems: "flex-start",  }}>
          <Autocomplete 
            multiple
            freeSolo
            sx={{ ml:1,width:'740px',mt:1,mr:1}}
            options={skillsOption}
            onChange={handleSkillsChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="contained" label={option} {...getTagProps({ index })} key={index} />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Technical Skills" />}
            
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