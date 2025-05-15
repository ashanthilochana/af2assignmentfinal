import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Attempting registration with:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.data);
      
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Registration failed',
          errors: error.response.data.errors
        });
      } else if (error.request) {
        return rejectWithValue({
          message: 'No response from server. Please try again.'
        });
      } else {
        return rejectWithValue({
          message: error.message || 'An unexpected error occurred'
        });
      }
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', userData);
      const response = await api.post('/auth/login', userData);
      console.log('Login response:', response.data);
      
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', response.data.token);
      
      // Fetch user profile after successful login
      const profileResponse = await api.get('/auth/me');
      console.log('Profile response:', profileResponse.data);
      
      return {
        ...response.data,
        user: profileResponse.data
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Login failed',
          errors: error.response.data.errors
        });
      } else if (error.request) {
        return rejectWithValue({
          message: 'No response from server. Please try again.'
        });
      } else {
        return rejectWithValue({
          message: error.message || 'An unexpected error occurred'
        });
      }
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      console.log('GetMe response:', response.data);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch user data');
      }
      return response.data.data;  // Return just the user data from the data field
    } catch (error) {
      console.error('GetMe error:', error);
      if (error.response) {
        return rejectWithValue({
          message: error.response.data.message || 'Failed to fetch profile',
          errors: error.response.data.errors
        });
      } else if (error.request) {
        return rejectWithValue({
          message: 'No response from server. Please try again.'
        });
      } else {
        return rejectWithValue({
          message: error.message || 'An unexpected error occurred'
        });
      }
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        // Only clear auth state if it's an authentication error
        if (action.error.message.includes('401') || action.error.message.includes('auth')) {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          localStorage.removeItem('token');
        }
        state.error = action.error.message;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 