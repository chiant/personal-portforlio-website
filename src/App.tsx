import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { profileData } from './data/profileData';
import { Theme } from './types';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';

// Management Console Components
import ManagementConsole from './components/management/ManagementConsole';
import Login from './components/management/Login';

function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-secondary-900 text-white' : 'bg-white text-secondary-900'
      }`}>
        <ScrollToTop />
        
        <Routes>
          {/* Public Portfolio Route */}
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Header 
                theme={theme} 
                toggleTheme={toggleTheme}
                profileData={profileData}
              />
              
              <main>
                <Hero 
                  personalInfo={profileData.personalInfo}
                  summary={profileData.summary}
                  media={profileData.media}
                />
                
                <About 
                  summary={profileData.summary}
                  coreCompetencies={profileData.coreCompetencies}
                />
                
                <Experience 
                  workExperience={profileData.workExperience}
                />
                
                <Education 
                  education={profileData.education}
                />
                
                <Certifications 
                  certifications={profileData.certifications}
                />
                
                <Skills 
                  technicalSkills={profileData.technicalSkills}
                />
                
                <Contact 
                  contactInfo={profileData.contactInfo}
                  media={profileData.media}
                />
              </main>
              
              <Footer profileData={profileData} />
            </motion.div>
          } />
          
          {/* Management Console Routes */}
          <Route path="/admin" element={
            isAuthenticated ? (
              <ManagementConsole 
                profileData={profileData}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            ) : (
              <Login onLogin={() => setIsAuthenticated(true)} />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
