import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Theme, ProfileData } from '../../types';
import { dataService } from '../../services/dataService';

// Profile Components
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './shared/ScrollToTop';
import LoadingSpinner from './shared/LoadingSpinner';

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

export default ProfilePage;
