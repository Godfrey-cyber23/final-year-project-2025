 
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  detections: [],
  currentSeverity: null,
  notifications: []
};

const detectionSlice = createSlice({
  name: 'detections',
  initialState,
  reducers: {
    addDetection: (state, action) => {
      state.detections.unshift(action.payload);
    },
    updateSeverity: (state, action) => {
      state.currentSeverity = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { addDetection, updateSeverity, addNotification, clearNotifications } = detectionSlice.actions;
export default detectionSlice.reducer;