import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AssignmentDetail from './pages/AssignmentDetail';
import SubmitAssignment from './pages/SubmitAssignment';
import GradeSubmission from './pages/GradeSubmission';
import ViewGrades from './pages/ViewGrades';
import ViewFeedback from './pages/ViewFeedback';
import Analytics from './pages/Analytics';
import Navigation from './components/Navigation';

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navigation />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route 
          path="/student" 
          element={
            <ProtectedRoute requiredRole={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/assignment/:id" 
          element={
            <ProtectedRoute>
              <AssignmentDetail />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/submit/:assignmentId" 
          element={
            <ProtectedRoute requiredRole={['student']}>
              <SubmitAssignment />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/grades" 
          element={
            <ProtectedRoute requiredRole={['student']}>
              <ViewGrades />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/feedback/:submissionId" 
          element={
            <ProtectedRoute requiredRole={['student']}>
              <ViewFeedback />
            </ProtectedRoute>
          } 
        />

        {/* Teacher Routes */}
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute requiredRole={['teacher', 'admin']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/grade/:submissionId" 
          element={
            <ProtectedRoute requiredRole={['teacher', 'admin']}>
              <GradeSubmission />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute requiredRole={['teacher', 'admin']}>
              <Analytics />
            </ProtectedRoute>
          } 
        />

        {/* Default Routes */}
        <Route 
          path="/" 
          element={
            user ? (
              user.role === 'student' ? <Navigate to="/student" /> : <Navigate to="/teacher" />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
