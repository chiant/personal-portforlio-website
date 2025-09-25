import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, RefreshCw } from 'lucide-react';
// No default profile data - profiles are created through management console
import { Theme, ProfileData } from './types';
import { dataService } from './services/dataService';
import { fileUploadService } from './services/fileUploadService';

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
import HierarchicalManagementConsole from './components/management/HierarchicalManagementConsole';
import Login from './components/management/Login';

// Profile Page Component
const ProfilePage: React.FC = () => {
  const { endpoint } = useParams<{ endpoint: string }>();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>('Profile Loading......');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('cvbot-theme') as Theme;
    return savedTheme || 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('cvbot-theme', newTheme);
      return newTheme;
    });
  };

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!endpoint) {
        setError('No endpoint provided');
        setIsLoading(false);
        return;
      }

      try {
        // First, get the profile metadata to show the name during loading
        const config = dataService.getMultiProfileConfig();
        console.log('ProfilePage: Config loaded:', config);
        console.log('ProfilePage: Looking for endpoint:', endpoint);
        const profile = config.profiles.find(p => p.endpoint === endpoint && p.isActive);
        console.log('ProfilePage: Found profile:', profile);
        
        if (profile) {
          console.log('ProfilePage: Setting profile name to:', profile.name);
          setProfileName(profile.name);
        } else {
          console.log('ProfilePage: No profile found, keeping default name');
        }

        // Then load the full profile data
        const result = await dataService.getProfileByEndpoint(endpoint);
        if (result.success && result.data) {
          setProfileData(result.data);
        } else {
          setError(result.error || 'Profile not found');
        }
      } catch (error) {
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [endpoint]);

  if (isLoading) {
    return <LoadingSpinner name={profileName} message="Loading profile page now......" />;
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            Profile Not Found
          </h1>
          <p className="text-secondary-600 dark:text-white">
            The profile you're looking for doesn't exist or is not active.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-secondary-50 dark:bg-secondary-900"
    >
      <Header 
        profileData={profileData}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main>
        <Hero 
          personalInfo={profileData.personalInfo}
          summary={profileData.summary}
          media={profileData.media}
          contactInfo={profileData.contactInfo}
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
      <ScrollToTop />
    </motion.div>
  );
};

// Management Console Page Component
const ManagementPage: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('cvbot-theme') as Theme;
    return savedTheme || 'light';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if there's a valid session in localStorage
    const sessionData = localStorage.getItem('cvbot-session');
    if (sessionData) {
      try {
        const { timestamp } = JSON.parse(sessionData);
        const now = Date.now();
        const sessionTimeout = 60 * 60 * 1000; // 60 minutes in milliseconds
        
        // Check if session is still valid (not expired)
        if (now - timestamp < sessionTimeout) {
          return true;
        } else {
          // Session expired, remove it
          localStorage.removeItem('cvbot-session');
        }
      } catch (error) {
        // Invalid session data, remove it
        localStorage.removeItem('cvbot-session');
      }
    }
    return false;
  });
  const [currentProfileData] = useState<ProfileData | null>(null);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionWarningCountdown, setSessionWarningCountdown] = useState(0);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('cvbot-theme', newTheme);
      return newTheme;
    });
  };

  const handleLogin = () => {
    // Create session data with current timestamp
    const sessionData = {
      timestamp: Date.now(),
      authenticated: true
    };
    localStorage.setItem('cvbot-session', JSON.stringify(sessionData));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('cvbot-session');
    setIsAuthenticated(false);
    setShowSessionWarning(false);
  };

  const handleExtendSession = () => {
    // Update session timestamp to extend the session
    const sessionData = {
      timestamp: Date.now(),
      authenticated: true
    };
    localStorage.setItem('cvbot-session', JSON.stringify(sessionData));
    setShowSessionWarning(false);
    setSessionWarningCountdown(0);
  };

  // Session timeout and activity tracking
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId: NodeJS.Timeout;
    let warningTimeoutId: NodeJS.Timeout;
    let countdownIntervalId: NodeJS.Timeout;

    const resetSessionTimeout = () => {
      // Clear existing timeouts
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (warningTimeoutId) {
        clearTimeout(warningTimeoutId);
      }
      if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
      }

      // Hide warning if it's showing
      setShowSessionWarning(false);
      setSessionWarningCountdown(0);

      // Set warning timeout for 55 minutes (5 minutes before session expires)
      warningTimeoutId = setTimeout(() => {
        setShowSessionWarning(true);
        setSessionWarningCountdown(300); // 5 minutes = 300 seconds
        
        // Start countdown
        countdownIntervalId = setInterval(() => {
          setSessionWarningCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownIntervalId);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 55 * 60 * 1000); // 55 minutes

      // Set session timeout for 60 minutes
      timeoutId = setTimeout(() => {
        console.log('Session expired due to inactivity');
        handleLogout();
      }, 60 * 60 * 1000); // 60 minutes
    };

    const updateSessionActivity = () => {
      // Update session timestamp on user activity
      const sessionData = localStorage.getItem('cvbot-session');
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          parsed.timestamp = Date.now();
          localStorage.setItem('cvbot-session', JSON.stringify(parsed));
        } catch (error) {
          console.error('Error updating session:', error);
        }
      }
      resetSessionTimeout();
    };

    // Track user activity - expanded list for better detection
    const events = [
      'mousedown', 'mousemove', 'keypress', 'keydown', 'scroll', 'touchstart', 'click',
      'focus', 'blur', 'input', 'change', 'submit', 'resize', 'visibilitychange'
    ];
    
    events.forEach(event => {
      document.addEventListener(event, updateSessionActivity, true);
    });

    // Initial timeout setup
    resetSessionTimeout();

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (warningTimeoutId) {
        clearTimeout(warningTimeoutId);
      }
      if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
      }
      events.forEach(event => {
        document.removeEventListener(event, updateSessionActivity, true);
      });
    };
  }, [isAuthenticated]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <HierarchicalManagementConsole
        profileData={currentProfileData}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
      
      {/* Session Warning Dialog */}
      <AnimatePresence>
        {showSessionWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                    Session Expiring Soon
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Your session will expire in:
                  </p>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {Math.floor(sessionWarningCountdown / 60)}:{(sessionWarningCountdown % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Click "Extend Session" to continue working, or you'll be logged out automatically.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 transition-colors"
                >
                  Logout Now
                </button>
                <button
                  onClick={handleExtendSession}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Extend Session</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

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