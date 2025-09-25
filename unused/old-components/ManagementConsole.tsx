import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Mail, 
  Image, 
  LogOut,
  Save,
  Eye,
  Home,
  Users,
  MessageSquare
} from 'lucide-react';
import { ProfileData, Theme } from '../types';
import { dataService } from '../../services/dataService';
import ProfileManagement from './ProfileManagement';
import MessageManagement from './MessageManagement';
import ExperienceEditor from './ExperienceEditor';
import EducationEditor from './EducationEditor';
import CertificationsEditor from './CertificationsEditor';
import SkillsEditor from './SkillsEditor';
import ContactEditor from './ContactEditor';
import MediaEditor from './MediaEditor';
import ProfileDataReview from './ProfileDataReview';

interface ManagementConsoleProps {
  profileData: ProfileData;
  theme: Theme;
  toggleTheme: () => void;
}

const ManagementConsole: React.FC<ManagementConsoleProps> = ({ 
  profileData: initialProfileData, 
  theme, 
  toggleTheme 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentProfileData, setCurrentProfileData] = useState<ProfileData>(initialProfileData);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'profiles', label: 'Profiles', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'review', label: 'Data Review', icon: Eye },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'media', label: 'Media', icon: Image },
  ];

  useEffect(() => {
    // Initialize default profile if needed
    dataService.initializeDefaultProfile(initialProfileData);
  }, [initialProfileData]);

  const handleLogout = () => {
    // In a real app, this would clear authentication tokens
    window.location.href = '/';
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const config = dataService.getMultiProfileConfig();
      const result = await dataService.saveProfile(config.activeProfileId, currentProfileData);
      
      if (result.success) {
        setHasUnsavedChanges(false);
        // Show success message
        console.log('Profile saved successfully');
      } else {
        console.error('Failed to save profile:', result.message);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDataUpdate = (section: string, data: any) => {
    setCurrentProfileData(prev => ({
      ...prev,
      [section]: data
    }));
    setHasUnsavedChanges(true);
  };

  const handlePreview = () => {
    // Open profile in new tab
    window.open('/', '_blank');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {currentProfileData.workExperience.positions.length}
                </div>
                <div className="text-secondary-600 dark:text-white">Work Positions</div>
              </div>
              
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {currentProfileData.certifications.certifications.length}
                </div>
                <div className="text-secondary-600 dark:text-white">Certifications</div>
              </div>
              
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {currentProfileData.technicalSkills.skills.length}
                </div>
                <div className="text-secondary-600 dark:text-white">Technical Skills</div>
              </div>
              
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {currentProfileData.education.degrees.length}
                </div>
                <div className="text-secondary-600 dark:text-white">Degrees</div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-secondary-700 dark:text-white">Profile last updated: {new Date(currentProfileData.metadata.lastUpdated).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-secondary-700 dark:text-white">CV version: {currentProfileData.metadata.version}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-secondary-700 dark:text-white">Last backup: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profiles':
        return (
          <ProfileManagement 
            currentProfileData={currentProfileData}
          />
        );

      case 'messages':
        return <MessageManagement />;

      case 'review':
        return (
          <ProfileDataReview 
            profileData={currentProfileData}
            onUpdate={(profileData) => {
              setCurrentProfileData(profileData);
              setHasUnsavedChanges(true);
            }}
          />
        );

      case 'personal':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={currentProfileData.personalInfo.fullName}
                    onChange={(e) => handleDataUpdate('personalInfo', { ...currentProfileData.personalInfo, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                    Preferred Name
                  </label>
                  <input
                    type="text"
                    defaultValue={currentProfileData.personalInfo.preferredName}
                    onChange={(e) => handleDataUpdate('personalInfo', { ...currentProfileData.personalInfo, preferredName: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    defaultValue={currentProfileData.personalInfo.title}
                    onChange={(e) => handleDataUpdate('personalInfo', { ...currentProfileData.personalInfo, title: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <ExperienceEditor 
            positions={currentProfileData.workExperience.positions}
            onUpdate={(positions) => handleDataUpdate('workExperience', { positions })}
          />
        );

      case 'education':
        return (
          <EducationEditor 
            degrees={currentProfileData.education.degrees}
            onUpdate={(degrees) => handleDataUpdate('education', { degrees })}
          />
        );

      case 'certifications':
        return (
          <CertificationsEditor 
            certifications={currentProfileData.certifications.certifications}
            onUpdate={(certifications) => handleDataUpdate('certifications', { certifications })}
          />
        );

      case 'skills':
        return (
          <SkillsEditor 
            skills={currentProfileData.technicalSkills.skills}
            onUpdate={(skills) => handleDataUpdate('technicalSkills', { skills })}
          />
        );

      case 'contact':
        return (
          <ContactEditor 
            contactInfo={currentProfileData.contactInfo}
            onUpdate={(contactInfo) => handleDataUpdate('contactInfo', contactInfo)}
          />
        );

      case 'media':
        return (
          <MediaEditor
            media={currentProfileData.media}
            onUpdate={(media) => handleDataUpdate('media', media)}
            profileId={currentProfileData.metadata.id}
          />
        );

      default:
        return (
          <div className="card">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                Coming Soon
              </h3>
              <p className="text-secondary-600 dark:text-white">
                This section is under development. Check back soon for full editing capabilities.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-secondary-900 dark:text-white">
                Portfolio Management Console
              </h1>
              {hasUnsavedChanges && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Unsaved Changes
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePreview}
                className="btn-outline flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || loading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
              
              <a
                href="/"
                className="btn-secondary flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>View Portfolio</span>
              </a>
              
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'text-secondary-700 dark:text-white hover:bg-secondary-100 dark:hover:bg-secondary-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementConsole;
