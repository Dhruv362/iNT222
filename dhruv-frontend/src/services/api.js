import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ Auth APIs ============
export const loginUser = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

export const registerUser = (userData) => {
  return apiClient.post('/auth/register', userData);
};

// ============ User APIs ============
export const getUserProfile = (userId) => {
  return apiClient.get(`/users/${userId}`);
};

export const updateUserProfile = (userId, data) => {
  return apiClient.patch(`/users/${userId}`, data);
};

// ============ Assignment APIs ============
export const getAssignments = (courseCode) => {
  return apiClient.get(`/assignments/course/${courseCode}`);
};

export const getAssignmentDetail = (assignmentId) => {
  return apiClient.get(`/assignments/${assignmentId}`);
};

export const createAssignment = (data) => {
  return apiClient.post('/assignments', data);
};

export const updateAssignment = (assignmentId, data) => {
  return apiClient.patch(`/assignments/${assignmentId}`, data);
};

export const deleteAssignment = (assignmentId) => {
  return apiClient.delete(`/assignments/${assignmentId}`);
};

export const getTeacherAssignments = (teacherId) => {
  return apiClient.get(`/assignments/teacher/${teacherId}`);
};

// ============ Submission APIs ============
export const submitAssignment = (formData) => {
  return apiClient.post('/submissions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getSubmission = (submissionId) => {
  return apiClient.get(`/submissions/${submissionId}`);
};

export const getAssignmentSubmissions = (assignmentId) => {
  return apiClient.get(`/submissions/assignment/${assignmentId}`);
};

export const getStudentSubmissions = (studentId) => {
  return apiClient.get(`/submissions/student/${studentId}`);
};

export const updateSubmissionStatus = (submissionId, data) => {
  return apiClient.patch(`/submissions/${submissionId}`, data);
};

// ============ Grade APIs ============
export const createGrade = (data) => {
  return apiClient.post('/grades', data);
};

export const autoGradeAssignment = (assignmentId) => {
  return apiClient.post(`/grades/auto/${assignmentId}`);
};

export const getSubmissionGrade = (submissionId) => {
  return apiClient.get(`/grades/submission/${submissionId}`);
};

export const getAssignmentGrades = (assignmentId) => {
  return apiClient.get(`/grades/assignment/${assignmentId}`);
};

export const getStudentGrades = (studentId) => {
  return apiClient.get(`/grades/student/${studentId}`);
};

export const updateGrade = (gradeId, data) => {
  return apiClient.patch(`/grades/${gradeId}`, data);
};

// ============ Feedback APIs ============
export const createFeedback = (data) => {
  return apiClient.post('/feedback', data);
};

export const autoGenerateFeedback = (assignmentId) => {
  return apiClient.post(`/feedback/auto/${assignmentId}`);
};

export const getFeedback = (feedbackId) => {
  return apiClient.get(`/feedback/${feedbackId}`);
};

export const getSubmissionFeedback = (submissionId) => {
  return apiClient.get(`/feedback/submission/${submissionId}`);
};

export const updateFeedback = (feedbackId, data) => {
  return apiClient.patch(`/feedback/${feedbackId}`, data);
};

// ============ Analytics APIs ============
export const calculateAssignmentAnalytics = (assignmentId) => {
  return apiClient.post(`/analytics/assignment/${assignmentId}`);
};

export const getAssignmentAnalytics = (assignmentId) => {
  return apiClient.get(`/analytics/assignment/${assignmentId}`);
};

export const getCourseAnalytics = (courseCode) => {
  return apiClient.get(`/analytics/course/${courseCode}`);
};

export const getStudentProgress = (studentId) => {
  return apiClient.get(`/analytics/student/${studentId}`);
};

export const getDashboardAnalytics = () => {
  return apiClient.get('/analytics/dashboard');
};

// ============ Health Check ============
export const healthCheck = () => {
  return apiClient.get('/health');
};

export default apiClient;
