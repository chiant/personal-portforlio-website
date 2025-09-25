import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Download, User } from 'lucide-react';
import { ProfileData, Theme } from '../../../types';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  profileData: ProfileData;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, profileData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { endpoint } = useParams<{ endpoint: string }>();

  // Function to check if a section has data
  const hasSectionData = (section: string) => {
    switch (section) {
      case 'about':
        return profileData.coreCompetencies.competencies.length > 0;
      case 'experience':
        return profileData.workExperience.positions.length > 0;
      case 'education':
        return profileData.education.degrees.length > 0;
      case 'certifications':
        return profileData.certifications.certifications.length > 0;
      case 'skills':
        return profileData.technicalSkills.skills.length > 0;
      case 'contact':
        return (profileData.contactInfo.email && profileData.contactInfo.email.trim() !== '') ||
               (profileData.contactInfo.phone && profileData.contactInfo.phone.trim() !== '') ||
               (profileData.personalInfo.location && 
                (profileData.personalInfo.location.city || 
                 profileData.personalInfo.location.province || 
                 profileData.personalInfo.location.country));
      default:
        return false;
    }
  };

  // Generate navigation items based on available data
  const navItems = [
    { label: 'Competencies', href: '#about', section: 'about' },
    { label: 'Experience', href: '#experience', section: 'experience' },
    { label: 'Education', href: '#education', section: 'education' },
    { label: 'Certifications', href: '#certifications', section: 'certifications' },
    { label: 'Skills', href: '#skills', section: 'skills' },
    { label: 'Contact', href: '#contact', section: 'contact' },
  ].filter(item => hasSectionData(item.section));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const downloadCV = async () => {
    if (!profileData.media.documents.cvPdf.url) return;
    
    try {
      // Add download=true query parameter to force download behavior
      const downloadUrl = profileData.media.documents.cvPdf.url + (profileData.media.documents.cvPdf.url.includes('?') ? '&' : '?') + 'download=true';
      
      // Fetch the file as a blob to force download
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      // Use custom download filename if set, otherwise use backend filename
      link.download = profileData.media.documents.cvPdf.description || profileData.media.documents.cvPdf.filename || 'cv-document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link if fetch fails
      window.open(profileData.media.documents.cvPdf.url, '_blank');
    }
  };

  // Check if CV file is available
  const hasCVFile = profileData.media.documents.cvPdf.url && profileData.media.documents.cvPdf.url.trim() !== '';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-secondary-900/90 backdrop-blur-md shadow-soft border-b border-secondary-200 dark:border-secondary-700' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-max">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link 
            to={endpoint ? `/${endpoint}` : "/"} 
            className="flex items-center space-x-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <User className="w-8 h-8" />
            <span className="hidden sm:block">{profileData.personalInfo.preferredName || profileData.personalInfo.fullName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-secondary-600 dark:text-white hover:text-primary-600 font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-secondary-600 dark:text-white" />
              ) : (
                <Sun className="w-5 h-5 text-secondary-600 dark:text-white" />
              )}
            </button>

            {/* Download CV Button */}
            <button
              onClick={downloadCV}
              disabled={!hasCVFile}
              className={`hidden sm:flex items-center space-x-2 text-sm ${
                hasCVFile 
                  ? 'btn-primary' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 px-4 py-2 rounded-lg'
              }`}
              title={hasCVFile ? 'Download CV' : 'No CV file available'}
            >
              <Download className="w-4 h-4" />
              <span>Download CV</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-secondary-600 dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-secondary-600 dark:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700"
            >
              <nav className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left px-4 py-2 text-secondary-600 dark:text-white hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-lg transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                ))}
                
                {/* Mobile Download CV Button */}
                <button
                  onClick={downloadCV}
                  disabled={!hasCVFile}
                  className={`flex items-center justify-center space-x-2 w-full mt-4 ${
                    hasCVFile 
                      ? 'btn-primary' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 px-4 py-2 rounded-lg'
                  }`}
                  title={hasCVFile ? 'Download CV' : 'No CV file available'}
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV</span>
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
