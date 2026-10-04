import { createSlice } from '@reduxjs/toolkit';

const MOCK_USERS = [
  {
    id: 'user_1',
    name: 'Corolab',
    cvrNumber: '37793132',
    role: 'Company',
    email: 'kontakt@corolab.dk'
  },
  {
    id: 'user_2',
    name: 'Novo Nordisk A/S',
    cvrNumber: '24256790',
    role: 'Company',
    email: 'info@novonordisk.com'
  },
  {
    id: 'user_3',
    name: 'Danske Bank Rådgiver',
    cvrNumber: null,
    role: 'Advisor',
    email: 'radgiver@danskebank.dk'
  }
];

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: MOCK_USERS[0], // Standard er Corolab
    availableUsers: MOCK_USERS,
    isAuthenticated: true
  },
  reducers: {
    setUser: (state, action) => {
      const selected = state.availableUsers.find(u => u.id === action.payload);
      if (selected) {
        state.user = selected;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    loginAs: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    }
  }
});

export const { setUser, logout, loginAs } = authSlice.actions;
export default authSlice.reducer;