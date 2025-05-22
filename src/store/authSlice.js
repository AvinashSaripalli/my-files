// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  userRole: null,
  userPhoto: null,
  companyName: null,
  userDesignation: null,
  userJobLocation: null,
  userEmail: null,
  userFirstName: null,
  userLastName: null,
  userPhoneNumber: null,
  userDepartment: null,
  userId: null,
  userEmployeeId: null,
  userTechnicalSkills: null,
  userDateOfBirth: null,
  userBloodGroup: null,
  userGender: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...state, ...action.payload };
    },
    clearUser(state) {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;