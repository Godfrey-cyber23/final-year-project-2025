import { createContext, useContext, useReducer, useEffect } from 'react';
import { mockDetections } from '../data/mockDetections'; // Optional mock data

const DetectionContext = createContext();

const detectionReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_DETECTIONS':
      return { ...state, detections: action.payload };
    case 'ADD_DETECTION':
      return { 
        ...state, 
        detections: [{
          ...action.payload,
          id: Date.now(),
          timestamp: new Date().toISOString(),
          resolved: false
        }, ...state.detections]
      };
    case 'UPDATE_DETECTION':
      return {
        ...state,
        detections: state.detections.map(detection =>
          detection.id === action.payload.id ? { ...detection, ...action.payload } : detection
        )
      };
    case 'SET_FILTERS':
      return { ...state, filterCriteria: action.payload };
    case 'SET_SEVERITY':
      return { ...state, currentSeverity: action.payload };
    case 'RESET_FILTERS':
      return { ...state, filterCriteria: initialFilters };
    default:
      return state;
  }
};

const initialFilters = {
  severity: 'all',
  dateRange: [null, null],
  resolved: 'all'
};

const initialState = {
  detections: [],
  currentSeverity: null,
  filterCriteria: initialFilters,
  loading: true,
  error: null
};

export const DetectionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(detectionReducer, initialState);

  // Load initial detections (simulated API call)
  useEffect(() => {
    const fetchDetections = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        dispatch({ type: 'INIT_DETECTIONS', payload: mockDetections });
      } catch (error) {
        dispatch({ type: 'INIT_DETECTIONS', payload: [] });
        console.error('Error fetching detections:', error);
      }
    };
    
    fetchDetections();
  }, []);

  // Action creators
  const value = {
    ...state,
    addDetection: (detection) => dispatch({ type: 'ADD_DETECTION', payload: detection }),
    updateDetection: (id, updates) => dispatch({ type: 'UPDATE_DETECTION', payload: { id, ...updates }}),
    setFilters: (filters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    setSeverity: (severity) => dispatch({ type: 'SET_SEVERITY', payload: severity }),
    
    // Calculated values
    getStats: () => ({
      total: state.detections.length,
      high: state.detections.filter(d => d.severity === 'high').length,
      medium: state.detections.filter(d => d.severity === 'medium').length,
      low: state.detections.filter(d => d.severity === 'low').length,
      resolved: state.detections.filter(d => d.resolved).length
    }),
    
    // Filtered detections
    filteredDetections: state.detections.filter(d => {
      const { severity, dateRange, resolved } = state.filterCriteria;
      const [start, end] = dateRange;
      
      return (
        (severity === 'all' || d.severity === severity) &&
        (!start || new Date(d.timestamp) >= start) &&
        (!end || new Date(d.timestamp) <= end) &&
        (resolved === 'all' || d.resolved === (resolved === 'resolved'))
      );
    })
  };

  return (
    <DetectionContext.Provider value={value}>
      {children}
    </DetectionContext.Provider>
  );
};

export const useDetection = () => {
  const context = useContext(DetectionContext);
  if (!context) {
    throw new Error('useDetection must be used within a DetectionProvider');
  }
  return context;
};