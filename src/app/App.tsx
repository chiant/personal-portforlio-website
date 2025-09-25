import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { fileUploadService } from '../services/fileUploadService';

// Pages
import ProfilePage from '../pages/profile/ProfilePage';
import ManagementPage from '../pages/management/ManagementPage';


function App() {
  useEffect(() => {
    // Initialize file service and migrate existing files
    fileUploadService.initialize();
  }, []);

  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        {/* Profile-specific routes */}
        <Route path="/:endpoint" element={<ProfilePage />} />
        
        {/* Management Console Routes */}
        <Route path="/admin" element={<ManagementPage />} />
        <Route path="/management" element={<ManagementPage />} />
        
        {/* Root route - blank page */}
        <Route path="/" element={
          <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                Welcome to CVBot
              </h1>
              <p className="text-secondary-600 dark:text-white">
                Please visit a specific profile endpoint to view a profile.
              </p>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;