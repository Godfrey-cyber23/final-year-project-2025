export const mockDetections = [
  {
    id: 1,
    type: 'Metal Detection',
    severity: 'high',
    location: 'Main Gate - Scanner 1',
    description: 'Suspected hidden metallic object in bag',
    timestamp: '2024-05-18T08:15:00Z',
    resolved: false,
    deviceId: 'MD-001',
    studentId: null,
    image: '/images/detections/metal-1.jpg'
  },
  {
    id: 2,
    type: 'RF Signal',
    severity: 'medium',
    location: 'Exam Hall A - Sector 3',
    description: '2.4GHz wireless signal detected',
    timestamp: '2024-05-18T09:30:00Z',
    resolved: true,
    deviceId: 'RF-003',
    studentId: 'STU-4567',
    image: null
  },
  {
    id: 3,
    type: 'ID Mismatch',
    severity: 'low',
    location: 'North Entrance - Terminal 2',
    description: 'Student ID verification failed',
    timestamp: '2024-05-18T10:45:00Z',
    resolved: false,
    deviceId: 'CAM-002',
    studentId: 'STU-8910',
    image: '/images/detections/id-mismatch-2.jpg'
  },
  {
    id: 4,
    type: 'Suspicious Object',
    severity: 'high',
    location: 'Security Checkpoint 4',
    description: 'Unidentified object in pocket',
    timestamp: '2024-05-18T11:20:00Z',
    resolved: false,
    deviceId: 'XRAY-004',
    studentId: 'STU-1121',
    image: '/images/detections/xray-4.png'
  },
  {
    id: 5,
    type: 'Facial Mismatch',
    severity: 'medium',
    location: 'Biometric Gate 3',
    description: 'Face recognition mismatch',
    timestamp: '2024-05-18T13:00:00Z',
    resolved: true,
    deviceId: 'BIO-001',
    studentId: 'STU-3141',
    image: '/images/detections/face-3.jpg'
  }
];

// Additional metadata for dropdowns/filters
export const detectionTypes = [
  'Metal Detection',
  'RF Signal',
  'ID Mismatch',
  'Suspicious Object',
  'Facial Mismatch'
];

export const locations = [
  'Main Gate',
  'North Entrance',
  'Exam Hall A',
  'Security Checkpoint 4',
  'Biometric Gate 3'
];