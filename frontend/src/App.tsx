import React, { type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;