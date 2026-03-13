import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import projectsReducer from './projectsSlice'; 

export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectsReducer, 
  },
});