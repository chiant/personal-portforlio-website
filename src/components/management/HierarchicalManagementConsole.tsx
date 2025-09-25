import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Plus, 
  Settings, 
  ChevronRight, 
  ChevronDown,
  Home,
  Edit,
  Copy,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Globe,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Mail,
  Image,
  Save,
  Eye,
  Download,
  X,
  LogOut,
  FileText,
  Loader,
  Check,
  Upload
} from 'lucide-react';
import { ProfileData, ProfileMetadata, MultiProfileConfig, Theme } from '../../types';
import { dataService } from '../../services/dataService';
import { resumeParserService } from '../../services/resumeParserService';
import llmResumeParserService from '../../services/llmResumeParserService';
import backendFileUploadService from '../../services/backendFileUploadService';

// Import all editor components
import PersonalInfoEditor from './PersonalInfoEditor';
import CompetenciesEditor from './CompetenciesEditor';
import ExperienceEditor from './ExperienceEditor';
import EducationEditor from './EducationEditor';
import CertificationsEditor from './CertificationsEditor';
import SkillsEditor from './SkillsEditor';
import MediaEditor from './MediaEditor';
import MessageManagement from './MessageManagement';
import QRCodeGenerator from '../QRCodeGenerator';

interface HierarchicalManagementConsoleProps {
  profileData: ProfileData | null;
  theme: Theme;
  toggleTheme: () => void;
  onLogout?: () => void;
}

type NavigationItem = 
  | { type: 'main'; id: 'profiles' | 'messages'; label: string; icon: React.ComponentType<any> }
  | { type: 'sub'; id: 'create-profile' | 'manage-profiles'; label: string; parent: string }
  | { type: 'profile'; id: string; label: string; profile: ProfileMetadata; parent: string }
  | { type: 'data-section'; id: string; label: string; profileId: string; parent: string };

const HierarchicalManagementConsole: React.FC<HierarchicalManagementConsoleProps> = ({
  profileData,
  theme,
  toggleTheme,
  onLogout
}) => {
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [activeItem, setActiveItem] = useState<string>('profiles');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['profiles']));
  const [config, setConfig] = useState<MultiProfileConfig | null>(null);
  const [currentProfileData, setCurrentProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    const profileConfig = dataService.getMultiProfileConfig();
    setConfig(profileConfig);
    buildNavigation(profileConfig);
  };

  const buildNavigation = (profileConfig: MultiProfileConfig) => {
    const nav: NavigationItem[] = [
      { type: 'main', id: 'profiles', label: 'Profile Management', icon: Users },
      { type: 'sub', id: 'create-profile', label: 'Create New Profile', parent: 'profiles' },
      { type: 'sub', id: 'manage-profiles', label: 'Manage Existing Profiles', parent: 'profiles' },
      { type: 'main', id: 'messages', label: 'Message Management', icon: MessageSquare }
    ];

    // Add profile items
    profileConfig.profiles.forEach(profile => {
      nav.push({
        type: 'profile',
        id: `profile-${profile.id}`,
        label: profile.name,
        profile,
        parent: 'manage-profiles'
      });

      // Add data editing sections
      const dataSections = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'competencies', label: 'Competencies', icon: Settings },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'certifications', label: 'Certifications', icon: Award },
        { id: 'skills', label: 'Skills', icon: Code },
        { id: 'media', label: 'Documents', icon: Image }
      ];

      dataSections.forEach(section => {
        nav.push({
          type: 'data-section',
          id: `data-${profile.id}-${section.id}`,
          label: section.label,
          profileId: profile.id,
          parent: `profile-${profile.id}`
        });
      });
    });

    setNavigation(nav);
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };


  const handleDataUpdate = async (section: string, data: any) => {
    if (!currentProfileData) {
      console.error('No current profile data available for update');
      return;
    }
    console.log('handleDataUpdate called with section:', section, 'data:', data);
    const updatedData = {
      ...currentProfileData,
      [section]: data
    };
    setCurrentProfileData(updatedData);
    // Auto-save to backend
    console.log('Saving profile with ID:', currentProfileData.metadata.id);
    const result = await dataService.saveProfile(currentProfileData.metadata.id, updatedData);
    console.log('Save result:', result);
  };

  const loadProfileData = async (profileId: string) => {
    console.log('Loading profile data for ID:', profileId);
    const result = await dataService.getProfileById(profileId);
    if (result.success && result.data) {
      console.log('Loaded profile data:', result.data);
      console.log('Profile metadata:', result.data.metadata);
      console.log('Profile ID from metadata:', result.data.metadata?.id);
      setCurrentProfileData(result.data);
    } else {
      console.error('Failed to load profile data:', result.error);
    }
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeItem === item.id;
    const hasChildren = navigation.some(nav => nav.parent === item.id);

    const getIcon = () => {
      if (item.type === 'main') {
        const IconComponent = item.icon;
        return <IconComponent className="w-5 h-5" />;
      }
      if (item.type === 'sub') {
        return item.id === 'create-profile' ? <Plus className="w-4 h-4" /> : <Settings className="w-4 h-4" />;
      }
      if (item.type === 'profile') {
        const iconColor = item.profile.isActive ? 'text-green-600' : 'text-red-600';
        return <User className={`w-4 h-4 ${iconColor}`} fill="currentColor" />;
      }
      if (item.type === 'data-section') {
        const sectionIcons: Record<string, React.ComponentType<any>> = {
          personal: User,
          experience: Briefcase,
          education: GraduationCap,
          certifications: Award,
          skills: Code,
          contact: Mail,
          media: Image
        };
        const IconComponent = sectionIcons[item.id.split('-').pop() || ''] || Edit;
        return <IconComponent className="w-4 h-4" />;
      }
      return null;
    };

    const handleClick = () => {
      if (hasChildren) {
        toggleExpanded(item.id);
      }
      setActiveItem(item.id);

      // Load profile data if it's a profile-related item
      if (item.type === 'profile' || item.type === 'profile-detail' || item.type === 'data-section') {
        const profileId = item.type === 'profile' ? item.profile.id : 
                         item.type === 'profile-detail' ? item.profile.id :
                         item.profileId;
        loadProfileData(profileId);
      }
    };

    return (
      <div key={item.id}>
        <motion.div
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            isActive 
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
              : 'hover:bg-secondary-100 dark:hover:bg-secondary-700'
          }`}
          style={{ paddingLeft: `${12 + level * 20}px` }}
          onClick={handleClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {hasChildren && (
            <button
              className="p-1 hover:bg-secondary-200 dark:hover:bg-secondary-600 rounded"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(item.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          
          {getIcon()}
          <span className="text-sm font-medium">{item.label}</span>
          
          {item.type === 'profile' && (
            <div className="ml-auto flex items-center justify-center">
              {item.profile.isActive ? (
                <ToggleRight className="w-6 h-6 text-green-600" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-red-600" />
              )}
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {navigation
                .filter(nav => nav.parent === item.id)
                .map(child => renderNavigationItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderContent = () => {
    const activeNavItem = navigation.find(item => item.id === activeItem);
    
    if (!activeNavItem) return null;

    switch (activeNavItem.type) {
      case 'sub':
        if (activeNavItem.id === 'create-profile') {
          return <CreateProfileView onProfileCreated={(profileId) => {
            loadConfig();
            if (profileId) {
              // Auto-select the newly created profile
              setTimeout(() => {
                // Expand the manage-profiles section to show the new profile
                setExpandedItems(prev => new Set([...prev, 'manage-profiles']));
                setActiveItem(`profile-${profileId}`);
                loadProfileData(profileId);
              }, 100);
            }
          }} />;
        }
        if (activeNavItem.id === 'manage-profiles') {
          return <ManageProfilesView config={config} onConfigChange={loadConfig} />;
        }
        break;

      case 'data-section':
        const section = activeNavItem.id.split('-').pop();
        return renderDataEditor(section!, activeNavItem.profileId);

      case 'main':
        if (activeNavItem.id === 'messages') {
          return <MessageManagement />;
        }
        break;
    }

    // Show profile data overview when a profile is selected but no specific section
    if (activeNavItem.type === 'profile') {
      return <ProfileDataOverview profileData={currentProfileData} />;
    }

    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            Welcome to Profile Management
          </h3>
          <p className="text-secondary-600 dark:text-white mb-8">
            Select an option from the sidebar to get started.
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col gap-4 justify-center">
            <button
              onClick={() => {
                setActiveItem('create-profile');
                setExpandedItems(prev => new Set([...prev, 'profiles']));
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-3 text-lg font-medium transition-colors min-w-64"
            >
              <Plus className="w-6 h-6" />
              <span>Create New Profile</span>
            </button>
            
            <button
              onClick={() => {
                setActiveItem('manage-profiles');
                setExpandedItems(prev => new Set([...prev, 'profiles']));
              }}
              className="bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-4 rounded-lg flex items-center justify-center space-x-3 text-lg font-medium transition-colors min-w-64"
            >
              <Users className="w-6 h-6" />
              <span>Manage Existing Profiles</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDataEditor = (section: string, profileId: string) => {
    if (!currentProfileData) {
      return <div>Loading profile data...</div>;
    }

    const commonProps = {
      onUpdate: handleDataUpdate
    };

    switch (section) {
      case 'personal':
        return (
          <PersonalInfoEditor
            personalInfo={currentProfileData.personalInfo}
            summary={currentProfileData.summary}
            contactInfo={currentProfileData.contactInfo}
            onUpdate={async (data) => {
              if (!currentProfileData) {
                console.error('No current profile data available for PersonalInfo update');
                return;
              }
              console.log('PersonalInfoEditor onUpdate called with data:', data);
              console.log('Current profile data before update:', currentProfileData);
              console.log('Current profile metadata:', currentProfileData.metadata);
              console.log('Current profile ID:', currentProfileData.metadata?.id);
              
              const updatedData = {
                ...currentProfileData,
                personalInfo: data.personalInfo,
                summary: data.summary,
                contactInfo: data.contactInfo
              };
              setCurrentProfileData(updatedData);
              // Auto-save to backend
              console.log('Saving profile with ID:', currentProfileData.metadata.id);
              const result = await dataService.saveProfile(currentProfileData.metadata.id, updatedData);
              console.log('Save result:', result);
            }}
          />
        );
      case 'competencies':
        return (
          <CompetenciesEditor
            coreCompetencies={currentProfileData.coreCompetencies}
            onUpdate={async (coreCompetencies) => await handleDataUpdate('coreCompetencies', coreCompetencies)}
          />
        );
      case 'experience':
        return (
          <ExperienceEditor
            positions={currentProfileData.workExperience.positions}
            onUpdate={async (positions) => await handleDataUpdate('workExperience', { positions })}
          />
        );
      case 'education':
        return (
          <EducationEditor
            degrees={currentProfileData.education.degrees}
            onUpdate={async (degrees) => await handleDataUpdate('education', { degrees })}
          />
        );
      case 'certifications':
        return (
          <CertificationsEditor
            certifications={currentProfileData.certifications.certifications}
            onUpdate={async (certifications) => await handleDataUpdate('certifications', { certifications })}
          />
        );
      case 'skills':
        return (
          <SkillsEditor
            skills={currentProfileData.technicalSkills.skills}
            onUpdate={async (skills) => await handleDataUpdate('technicalSkills', { skills })}
          />
        );
      case 'media':
        console.log('Rendering MediaEditor with currentProfileData:', currentProfileData);
        console.log('currentProfileData.metadata:', currentProfileData.metadata);
        console.log('currentProfileData.metadata.endpoint:', currentProfileData.metadata?.endpoint);
        return (
          <MediaEditor
            media={currentProfileData.media}
            onUpdate={async (media) => await handleDataUpdate('media', media)}
            profileName={currentProfileData.personalInfo.fullName}
            endpoint={currentProfileData.metadata?.endpoint || 'default'}
            profileId={currentProfileData.metadata?.id}
          />
        );
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Home className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                  CVBot Management Console
                </h1>
                <p className="text-sm text-secondary-600 dark:text-white">
                  Hierarchical Profile & Message Management
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <div className="w-5 h-5 text-secondary-600 dark:text-white">🌙</div>
                ) : (
                  <div className="w-5 h-5 text-secondary-600 dark:text-white">☀️</div>
                )}
              </button>
              
              {/* Logout Button */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-96 bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Navigation
            </h2>
            <div className="space-y-1">
              {navigation
                .filter(item => item.type === 'main')
                .map(item => renderNavigationItem(item))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Create Profile View Component
const CreateProfileView: React.FC<{ onProfileCreated: (profileId?: string) => void }> = ({ onProfileCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endpoint: ''
  });
  const [creationMethod, setCreationMethod] = useState<'manual' | 'resume' | 'copy'>('manual');
  const [copyFromProfile, setCopyFromProfile] = useState<string>('');
  const [availableProfiles, setAvailableProfiles] = useState<ProfileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copyPreview, setCopyPreview] = useState<ProfileData | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parsedProfileData, setParsedProfileData] = useState<ProfileData | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  
  // LLM Configuration state
  const [llmConfig, setLlmConfig] = useState({
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.1,
    maxTokens: 4000
  });

  useEffect(() => {
    loadAvailableProfiles();
  }, []);

  const loadAvailableProfiles = () => {
    const config = dataService.getMultiProfileConfig();
    setAvailableProfiles(config.profiles);
  };

  const handleCreationMethodChange = (method: 'manual' | 'resume' | 'copy') => {
    setCreationMethod(method);
    
    // Clear form data when switching methods
    setFormData({ name: '', description: '', endpoint: '' });
    setCopyFromProfile('');
    setCopyPreview(null);
    setResumeFile(null);
    setParsedProfileData(null);
    setParseError(null);
  };

  const handleResumeUpload = async (file: File) => {
    console.log('handleResumeUpload called with file:', file.name, file.type, file.size);
    setIsParsingResume(true);
    setParseError(null);
    setParsedProfileData(null);
    
    try {
      // Generate endpoint from filename for LLM parsing
      const tempEndpoint = file.name
        .replace(/\.[^/.]+$/, '') // Remove file extension
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);

      console.log('Using LLM parser for resume parsing...');
      // Configure LLM service
      llmResumeParserService.configure(llmConfig);
      const parsedProfile = await llmResumeParserService.parseResume(file, tempEndpoint);
      console.log('LLM parsed resume data:', parsedProfile);
      
      setParsedProfileData(parsedProfile);
      
      // Auto-populate form fields if available
      if (parsedProfile.personalInfo.fullName) {
        setFormData(prev => ({ ...prev, name: parsedProfile.personalInfo.fullName }));
      }
      if (parsedProfile.personalInfo.title) {
        setFormData(prev => ({ ...prev, description: parsedProfile.personalInfo.title }));
      }
      
      // Generate endpoint from name if available
      if (parsedProfile.personalInfo.fullName) {
        const endpoint = parsedProfile.personalInfo.fullName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50);
        setFormData(prev => ({ ...prev, endpoint }));
      }
      
    } catch (error) {
      console.error('LLM resume parsing error:', error);
      const errorMessage = (error as Error).message;
      setParseError(errorMessage);
      
      // Show helpful suggestions based on error type
      if (errorMessage.includes('API key')) {
        setParseError(errorMessage + '\n\nPlease ensure your OpenAI API key is configured in the .env file.');
      } else if (errorMessage.includes('Word document') || errorMessage.includes('PDF')) {
        setParseError(errorMessage + '\n\nFor best results, try converting your document to a plain text file (.txt) and upload that instead.');
      }
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleCopyFromProfileChange = async (profileId: string) => {
    setCopyFromProfile(profileId);
    
    if (profileId) {
      // Auto-populate form with selected profile's metadata
      const selectedProfile = availableProfiles.find(p => p.id === profileId);
      if (selectedProfile) {
        setFormData(prev => ({
          ...prev,
          name: `${selectedProfile.name} (Copy)`,
          description: selectedProfile.description,
          endpoint: `${selectedProfile.endpoint}-copy`
        }));
        
        // Load preview data
        const result = await dataService.getProfileById(profileId);
        if (result.success && result.data) {
          setCopyPreview(result.data);
        }
      }
    } else {
      // Clear form when no profile is selected
      setFormData({ name: '', description: '', endpoint: '' });
      setCopyPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.endpoint.trim()) return;

    setIsLoading(true);
    try {
      console.log('Creating profile with method:', creationMethod, 'parsedProfileData available:', !!parsedProfileData);
      let profileDataToUse: ProfileData;

      if (creationMethod === 'copy' && copyFromProfile) {
        // Copy from existing profile
        const result = await dataService.getProfileById(copyFromProfile);
        if (result.success && result.data) {
          profileDataToUse = result.data;
        } else {
          alert('Failed to load profile data for copying');
          setIsLoading(false);
          return;
        }
      } else if (creationMethod === 'resume' && parsedProfileData) {
        // Use parsed data from resume
        profileDataToUse = parsedProfileData;
        console.log('Using parsed profile data for creation:', profileDataToUse);
        
        // Upload the resume file as the CV document for this profile
        if (resumeFile) {
          console.log('Uploading resume file as CV document for new profile...');
          try {
            const uploadResult = await backendFileUploadService.uploadCV(resumeFile, formData.endpoint.trim());
            if (uploadResult.success && uploadResult.file) {
              // Update the profile data with the uploaded CV file information
              profileDataToUse.media.documents.cvPdf = {
                url: uploadResult.file.url,
                filename: uploadResult.file.filename,
                lastUpdated: new Date().toISOString()
              };
              console.log('Resume file uploaded successfully as CV document:', uploadResult.file);
            } else {
              console.error('Failed to upload resume file as CV:', uploadResult.error);
              // Continue with profile creation even if CV upload fails
            }
          } catch (uploadError) {
            console.error('Error uploading resume file as CV:', uploadError);
            // Continue with profile creation even if CV upload fails
          }
        }
      } else if (creationMethod === 'resume' && !parsedProfileData) {
        console.log('Resume creation method selected but no parsed data available');
        alert('Please upload and parse a resume file first');
        setIsLoading(false);
        return;
      } else {
        // Create new profile with empty data (manual input)
        profileDataToUse = dataService.generateEmptyProfileData();
      }

      const result = await dataService.createProfile(
        profileDataToUse,
        formData.name.trim(),
        formData.description.trim(),
        formData.endpoint.trim(),
        copyFromProfile || undefined
      );

      if (result.success) {
        console.log('Profile created successfully with ID:', result.profileId);
        // Upload resume file if provided
        if (resumeFile) {
          try {
            const uploadFormData = new FormData();
            uploadFormData.append('resumeFile', resumeFile);
            uploadFormData.append('endpoint', formData.endpoint.trim());
            
            const response = await fetch('http://localhost:3004/api/upload/resume', {
              method: 'POST',
              body: uploadFormData,
            });
            
            if (!response.ok) {
              console.error('Failed to upload resume file');
            }
          } catch (error) {
            console.error('Resume upload error:', error);
          }
        }
        
        setFormData({ name: '', description: '', endpoint: '' });
        setCreationMethod('manual');
        setCopyFromProfile('');
        setResumeFile(null);
        setParsedProfileData(null);
        setParseError(null);
        onProfileCreated(result.profileId);
      } else {
        alert(result.message || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('An error occurred while creating the profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
        Create New Profile
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Creation Method Selection */}
        <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Choose Creation Method
          </h3>
          
          <div className="space-y-4">
            {/* Manual Input Option */}
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="manual"
                name="creationMethod"
                value="manual"
                checked={creationMethod === 'manual'}
                onChange={() => handleCreationMethodChange('manual')}
                disabled={isParsingResume}
                className="mt-1 w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex-1">
                <label htmlFor="manual" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                  Create new profile by manual input
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Start with an empty profile and manually input all data
                </p>
              </div>
            </div>

            {/* Resume Upload Option */}
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="resume"
                name="creationMethod"
                value="resume"
                checked={creationMethod === 'resume'}
                onChange={() => handleCreationMethodChange('resume')}
                disabled={isParsingResume}
                className="mt-1 w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex-1">
                <label htmlFor="resume" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                  Create new profile by uploading a resume
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Upload a resume file (PDF, TXT, DOC, DOCX) to automatically populate profile data
                </p>
              </div>
            </div>

            {/* Copy Existing Profile Option */}
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                id="copy"
                name="creationMethod"
                value="copy"
                checked={creationMethod === 'copy'}
                onChange={() => handleCreationMethodChange('copy')}
                disabled={availableProfiles.length === 0 || isParsingResume}
                className="mt-1 w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex-1">
                <label htmlFor="copy" className={`text-sm font-medium cursor-pointer ${availableProfiles.length === 0 ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'}`}>
                  Create new profile by copying existing profile
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {availableProfiles.length === 0 
                    ? 'No existing profiles available to copy from'
                    : 'Select an existing profile to copy all its data'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Upload Section - Only show when resume method is selected */}
        {creationMethod === 'resume' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 relative">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
              Upload Resume
            </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                    Upload a resume file to automatically populate profile data using AI-powered parsing. The file will be saved as the profile's CV document.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>🤖 AI-Powered Parsing:</strong> Using OpenAI GPT for intelligent resume parsing. 
                      Supports <strong>PDF files (.pdf)</strong> and <strong>text files (.txt)</strong> with full parsing capabilities. Word documents (.doc, .docx) are also supported but may require conversion to text format for best results.
                    </p>
                    
                    {/* LLM Configuration */}
                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-blue-700 dark:text-blue-300 mb-1">Model:</label>
                          <select
                            value={llmConfig.model}
                            onChange={(e) => setLlmConfig(prev => ({ ...prev, model: e.target.value }))}
                            disabled={isParsingResume}
                            className="w-full px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-blue-900 text-blue-900 dark:text-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="gpt-4o-mini">GPT-4o Mini (Fast)</option>
                            <option value="gpt-4o">GPT-4o (Best)</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-blue-700 dark:text-blue-300 mb-1">Temperature:</label>
                          <select
                            value={llmConfig.temperature}
                            onChange={(e) => setLlmConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                            disabled={isParsingResume}
                            className="w-full px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-blue-900 text-blue-900 dark:text-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value={0.0}>0.0 (Precise)</option>
                            <option value={0.1}>0.1 (Recommended)</option>
                            <option value={0.3}>0.3 (Balanced)</option>
                            <option value={0.7}>0.7 (Creative)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
            
            <div className="space-y-3">
              {/* Hidden file input */}
              <input
                ref={(input) => {
                  if (input) {
                    (window as any).resumeFileInput = input;
                  }
                }}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  console.log('File selected:', file);
                  if (file) {
                    console.log('Setting resume file and starting upload:', file.name);
                    setResumeFile(file);
                    handleResumeUpload(file);
                  }
                }}
                className="hidden"
              />
              
              {/* Styled Choose File Button */}
              <button
                type="button"
                onClick={() => {
                  if (!(window as any).resumeFileInput) return;
                  (window as any).resumeFileInput.click();
                }}
                disabled={isParsingResume}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 w-full justify-center"
              >
                {isParsingResume ? (
                  <>
                    <div className="w-4 h-4 animate-pulse">
                      <img 
                        src="/robot-icon.svg" 
                        alt="AI Robot" 
                        className="w-full h-full"
                      />
                    </div>
                    <span>🤖 AI is parsing your resume...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                  </>
                )}
              </button>
              
              {isParsingResume && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <div className="w-4 h-4 animate-pulse">
                    <img 
                      src="/robot-icon.svg" 
                      alt="AI Robot" 
                      className="w-full h-full"
                    />
                  </div>
                  <span className="text-sm">🤖 AI is parsing your resume...</span>
                </div>
              )}
              
              {parsedProfileData && (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Resume parsed successfully! Form fields have been auto-populated.</span>
                </div>
              )}
              
              {parseError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start space-x-2 text-red-600 dark:text-red-400">
                    <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Failed to parse resume</p>
                      <p className="text-xs">{parseError}</p>
                      {parseError.includes('Word document') && (
                        <p className="text-xs mt-2">
                          <strong>Tip:</strong> For best results with Word documents, try saving as a .txt file or ensure your document contains readable text.
                        </p>
                      )}
                      {parseError.includes('PDF') && (
                        <p className="text-xs mt-2">
                          <strong>Tip:</strong> For best results with PDFs, try converting to a .txt file or ensure your PDF contains selectable text.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {resumeFile && (
                <div className="flex items-center space-x-2 text-secondary-600 dark:text-white">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Selected: {resumeFile.name}</span>
                </div>
              )}
            </div>
            
            {/* Loading Overlay */}
            {isParsingResume && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 animate-pulse">
                    <img 
                      src="/robot-icon.svg" 
                      alt="AI Robot" 
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-green-700 dark:text-green-300 font-medium">🤖 AI is parsing your resume...</p>
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1">Please wait, this may take a moment</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Copy from Profile Section - Only show when copy method is selected */}
        {creationMethod === 'copy' && availableProfiles.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Select Profile to Copy
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
              Choose an existing profile to copy all its data, including personal info, experience, education, certifications, skills, contact info, and media files.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Copy from Profile
              </label>
              <select
                value={copyFromProfile}
                onChange={(e) => handleCopyFromProfileChange(e.target.value)}
                className="w-full px-4 py-3 border border-blue-200 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary-800"
              >
                <option value="">Select a profile to copy...</option>
                {availableProfiles.map(profile => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name} ({profile.endpoint})
                  </option>
                ))}
              </select>
            </div>
            
            {copyFromProfile && (
              <div className="mt-3 space-y-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Copy className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Copying from: {availableProfiles.find(p => p.id === copyFromProfile)?.name}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> All data from the selected profile will be copied. You can edit everything after creation.
                  </p>
                </div>
                
                {copyPreview && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                      Data Preview (will be copied):
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-green-700 dark:text-green-300">
                      <div>• Personal Info: {copyPreview.personalInfo.fullName}</div>
                      <div>• Experience: {copyPreview.workExperience.positions.length} positions</div>
                      <div>• Education: {copyPreview.education.degrees.length} degrees</div>
                      <div>• Certifications: {copyPreview.certifications.certifications.length} certifications</div>
                      <div>• Skills: {copyPreview.technicalSkills.skills.length} skills</div>
                      <div>• Contact: {copyPreview.contactInfo.email ? 'Email provided' : 'No email'}</div>
                      <div>• Media: {copyPreview.media.profilePhoto.url ? 'Photo included' : 'No photo'}</div>
                      <div>• CV: {copyPreview.media.documents.cvPdf.url ? 'CV included' : 'No CV'}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
            Profile Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={isParsingResume}
            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
            placeholder="e.g., Brian Sun - Data Scientist"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
            Endpoint *
          </label>
          <input
            type="text"
            value={formData.endpoint}
            onChange={(e) => setFormData(prev => ({ ...prev, endpoint: e.target.value }))}
            disabled={isParsingResume}
            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
            placeholder="e.g., brian-sun, data-scientist"
            required
          />
          <p className="text-xs text-secondary-500 mt-1">
            This will be the URL endpoint for this profile (e.g., /brian-sun)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            disabled={isParsingResume}
            rows={4}
            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
            placeholder="Brief description of this profile..."
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={isLoading || isParsingResume}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Create Profile</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFormData({ name: '', description: '', endpoint: '' });
              setCreationMethod('manual');
              setCopyFromProfile('');
              setCopyPreview(null);
              setResumeFile(null);
              setParsedProfileData(null);
              setParseError(null);
            }}
            disabled={isParsingResume}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

// Manage Profiles View Component
const ManageProfilesView: React.FC<{ 
  config: MultiProfileConfig | null; 
  onConfigChange: () => void;
}> = ({ config, onConfigChange }) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    endpoint: ''
  });
  const [endpointError, setEndpointError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!config) return <div>Loading...</div>;

  const handleDeleteProfile = async (profileId: string) => {
    if (config.profiles.length <= 1) {
      alert('Cannot delete the last remaining profile. You must have at least one profile.');
      return;
    }

    setIsDeleting(true);
    try {
      const result = await dataService.deleteProfile(profileId);
      if (result.success) {
        const deletedProfileName = config.profiles.find(p => p.id === profileId)?.name || 'Profile';
        setDeleteConfirm(null);
        setDeleteSuccess(`${deletedProfileName} has been deleted successfully`);
        onConfigChange();
        
        // Clear success message after 3 seconds
        setTimeout(() => setDeleteSuccess(null), 3000);
      } else {
        alert(result.error || 'Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('An error occurred while deleting the profile');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (profileId: string) => {
    try {
      const result = await dataService.toggleProfileStatus(profileId);
      if (result.success) {
        onConfigChange();
      } else {
        alert(result.error || 'Failed to toggle profile status');
      }
    } catch (error) {
      console.error('Error toggling profile status:', error);
      alert('An error occurred while updating profile status');
    }
  };

  const handleEditProfile = (profile: ProfileMetadata) => {
    setEditingProfile(profile.id);
    setEditFormData({
      name: profile.name,
      description: profile.description,
      endpoint: profile.endpoint
    });
    setEndpointError(null);
  };

  const handleCancelEdit = () => {
    setEditingProfile(null);
    setEditFormData({ name: '', description: '', endpoint: '' });
    setEndpointError(null);
  };

  const validateEndpoint = (endpoint: string, currentProfileId: string) => {
    if (!endpoint.trim()) {
      setEndpointError('Endpoint is required');
      return false;
    }
    
    // Check for duplicates (excluding current profile)
    const duplicateProfile = config?.profiles.find(p => 
      p.id !== currentProfileId && p.endpoint === endpoint.trim()
    );
    
    if (duplicateProfile) {
      setEndpointError(`Endpoint "${endpoint}" is already used by "${duplicateProfile.name}"`);
      return false;
    }
    
    setEndpointError(null);
    return true;
  };

  const handleEndpointChange = (value: string) => {
    setEditFormData(prev => ({ ...prev, endpoint: value }));
    if (editingProfile) {
      validateEndpoint(value, editingProfile);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProfile) return;
    
    if (!validateEndpoint(editFormData.endpoint, editingProfile)) {
      return;
    }
    
    setIsSaving(true);
    try {
      const config = dataService.getMultiProfileConfig();
      const profileIndex = config.profiles.findIndex(p => p.id === editingProfile);
      
      if (profileIndex !== -1) {
        config.profiles[profileIndex].name = editFormData.name.trim();
        config.profiles[profileIndex].description = editFormData.description.trim();
        config.profiles[profileIndex].endpoint = editFormData.endpoint.trim();
        config.profiles[profileIndex].lastUpdated = new Date().toISOString();
        config.lastUpdated = new Date().toISOString();
        
        localStorage.setItem('cvbot_config', JSON.stringify(config));
        onConfigChange();
        handleCancelEdit();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('An error occurred while saving the profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getProfileUrl = (endpoint: string) => {
    return `${window.location.origin}/${endpoint}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Manage Existing Profiles
        </h2>
        <div className="text-sm text-secondary-600 dark:text-white">
          {config.profiles.length} profile{config.profiles.length !== 1 ? 's' : ''} total
        </div>
      </div>
      
      {deleteSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 text-green-600">✅</div>
            <p className="text-sm text-green-800 dark:text-green-200">
              {deleteSuccess}
            </p>
          </div>
        </div>
      )}
      
      {config.profiles.length === 1 && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 text-amber-600">⚠️</div>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Warning:</strong> You have only one profile remaining. You cannot delete the last profile.
            </p>
          </div>
        </div>
      )}
      
      <div className="grid gap-4">
        {config.profiles.map(profile => (
          <div key={profile.id} className="bg-white dark:bg-secondary-800 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700">
            {editingProfile === profile.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                    Edit Profile
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaving || !!endpointError}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                      Profile Name *
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Profile name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                      Endpoint *
                    </label>
                    <input
                      type="text"
                      value={editFormData.endpoint}
                      onChange={(e) => handleEndpointChange(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        endpointError ? 'border-red-300' : 'border-secondary-200'
                      }`}
                      placeholder="endpoint-name"
                    />
                    {endpointError && (
                      <p className="text-sm text-red-600 mt-1">{endpointError}</p>
                    )}
                    <p className="text-xs text-secondary-500 mt-1">
                      URL: {getProfileUrl(editFormData.endpoint)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Profile description"
                  />
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                      {profile.name}
                    </h3>
                    <p className="text-secondary-600 dark:text-white">{profile.description}</p>
                    
                    {/* Web Link */}
                    <div className="mt-2">
                      <a
                        href={getProfileUrl(profile.endpoint)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Globe className="w-4 h-4" />
                        <span>{getProfileUrl(profile.endpoint)}</span>
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-500">
                      <span>Endpoint: /{profile.endpoint}</span>
                      <span>Created: {new Date(profile.created).toLocaleDateString()}</span>
                      <span>Updated: {new Date(profile.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={() => handleToggleStatus(profile.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          profile.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
                        }`}
                        title={profile.isActive ? 'Click to deactivate' : 'Click to activate'}
                      >
                        {profile.isActive ? 'Active' : 'Inactive'}
                      </button>
                      
                      <button
                        onClick={() => handleEditProfile(profile)}
                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit profile"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => setDeleteConfirm(profile.id)}
                        disabled={config.profiles.length <= 1}
                        className={`p-2 rounded-lg transition-colors ${
                          config.profiles.length <= 1
                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : 'text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                        title={config.profiles.length <= 1 ? 'Cannot delete the last profile' : 'Delete profile'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* QR Code */}
                  <div className="text-center">
                    <QRCodeGenerator 
                      url={getProfileUrl(profile.endpoint)} 
                      size={120}
                      className="flex-shrink-0"
                    />
                    <p className="text-xs text-secondary-500 mt-1">QR Code</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Delete Profile
                </h3>
                <p className="text-sm text-secondary-600 dark:text-white">
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-secondary-700 dark:text-white">
                Are you sure you want to delete the profile{' '}
                <strong>{config.profiles.find(p => p.id === deleteConfirm)?.name}</strong>?
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                This will permanently delete all profile data, including personal info, experience, 
                education, certifications, skills, contact info, and media files.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleDeleteProfile(deleteConfirm)}
                disabled={isDeleting}
                className="btn-outline text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Profile</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Data Overview Component
const ProfileDataOverview: React.FC<{ profileData: ProfileData }> = ({ profileData }) => {
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Not specified';
    return date.toLocaleDateString();
  };

  const formatLocation = (location: any) => {
    if (typeof location === 'string') {
      return location;
    }
    if (location && typeof location === 'object') {
      const parts = [];
      if (location.city) parts.push(location.city);
      if (location.province) parts.push(location.province);
      if (location.country) parts.push(location.country);
      return parts.join(', ');
    }
    return 'Not specified';
  };

  const isPdfFile = (url: string) => {
    return url.toLowerCase().endsWith('.pdf');
  };

  const handleViewFile = async () => {
    if (!profileData.media.documents.cvPdf.url) return;
    
    if (isPdfFile(profileData.media.documents.cvPdf.url)) {
      setShowPdfViewer(true);
    } else {
      // Download non-PDF files
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
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Profile Data Overview
          </h2>
          <p className="text-secondary-600 dark:text-white">
            Complete overview of all profile data sections
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <User className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Personal Information
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Full Name
            </label>
            <p className="text-secondary-900 dark:text-white">{profileData.personalInfo.fullName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Preferred Name
            </label>
            <p className="text-secondary-900 dark:text-white">{profileData.personalInfo.preferredName || profileData.personalInfo.fullName || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Professional Title
            </label>
            <p className="text-secondary-900 dark:text-white">{profileData.personalInfo.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Pronouns
            </label>
            <p className="text-secondary-900 dark:text-white">{profileData.personalInfo.pronouns || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Location
            </label>
            <p className="text-secondary-900 dark:text-white">{formatLocation(profileData.personalInfo.location)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Email
            </label>
            <p className="text-secondary-900 dark:text-white">{profileData.contactInfo.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Phone
            </label>
            <p className="text-secondary-900 dark:text-white">{profileData.contactInfo.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Preferred Contact
            </label>
            <p className="text-secondary-900 dark:text-white">{profileData.contactInfo.preferredContactMethod || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Availability
            </label>
            <p className="text-secondary-900 dark:text-white">{profileData.contactInfo.availability || 'Not specified'}</p>
          </div>
        </div>
        {profileData.contactInfo.socialMedia && Object.keys(profileData.contactInfo.socialMedia).length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
              Social Media
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(profileData.contactInfo.socialMedia).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                );
              })}
            </div>
          </div>
        )}
        <div className="mt-4">
          <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
            Professional Summary
          </label>
          <p className="text-secondary-900 dark:text-white text-sm leading-relaxed">
            {profileData.summary.professionalSummary}
          </p>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
            Core Competencies
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {profileData.coreCompetencies.competencies?.map((competency, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border-l-4 border-primary-200">
                <div className="space-y-1">
                  <h4 className="font-medium text-secondary-900 dark:text-white text-sm">
                    {competency.name}
                  </h4>
                  <p className="text-xs text-secondary-600 dark:text-white">
                    {competency.yearsExperience || 0} years experience
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Work Experience */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Briefcase className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Work Experience
          </h3>
          <span className="text-sm text-secondary-500">
            ({profileData.workExperience.positions?.length || 0} positions)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profileData.workExperience.positions?.map((position, index) => (
            <div key={index} className="border-l-4 border-primary-200 pl-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
              <div className="space-y-2">
                <h4 className="font-medium text-secondary-900 dark:text-white text-sm">
                  {position.title}
                </h4>
                <p className="text-xs text-secondary-600 dark:text-white">
                  {position.company}
                </p>
                <p className="text-xs text-secondary-500">
                  {formatLocation(position.location)}
                </p>
                <p className="text-xs text-secondary-500 font-medium">
                  {formatDate(position.startDate)} - {position.endDate || 'Present'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <GraduationCap className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Education
          </h3>
          <span className="text-sm text-secondary-500">
            ({profileData.education.degrees?.length || 0} degrees)
          </span>
        </div>
        <div className="space-y-3">
          {profileData.education.degrees?.map((degree, index) => (
            <div key={index} className="border-l-4 border-primary-200 pl-4 py-2">
              <h4 className="font-medium text-secondary-900 dark:text-white">
                {degree.degree}
              </h4>
              <p className="text-sm text-secondary-600 dark:text-white">
                {degree.institution} • {formatLocation(degree.location)}
              </p>
              <p className="text-xs text-secondary-500">
                {formatDate(degree.endDate)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Certifications
          </h3>
          <span className="text-sm text-secondary-500">
            ({profileData.certifications.certifications?.length || 0} certifications)
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {profileData.certifications.certifications?.map((cert, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
              <Award className="w-4 h-4 text-primary-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                  {cert.name}
                </p>
                <p className="text-xs text-secondary-500">
                  {cert.issuer} • {formatDate(cert.issueDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Code className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Technical Skills
          </h3>
          <span className="text-sm text-secondary-500">
            ({profileData.technicalSkills.skills?.length || 0} skills)
          </span>
        </div>
        <div className="space-y-4">
          {(() => {
            // Group skills by category
            const skillsByCategory = (profileData.technicalSkills.skills || []).reduce((acc, skill) => {
              if (!acc[skill.category]) {
                acc[skill.category] = [];
              }
              acc[skill.category].push(skill);
              return acc;
            }, {} as Record<string, any[]>);

            return Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary-900 dark:text-white">
                    {category}
                  </span>
                  <span className="text-xs text-secondary-500">
                    {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 8).map((skill, skillIndex) => (
                    <span key={skillIndex} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {skill.name}
                      {skill.yearsExperience && (
                        <span className="ml-1 text-blue-600 dark:text-blue-300">
                          ({skill.yearsExperience}y)
                        </span>
                      )}
                    </span>
                  ))}
                  {skills.length > 8 && (
                    <span className="text-xs text-secondary-500">
                      +{skills.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>


      {/* Documents */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Image className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Documents
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
              Profile Photo
            </label>
{(() => {
              const hasCustomPhoto = profileData.media.profilePhoto.url && profileData.media.profilePhoto.url.trim() !== '';
              const photoSrc = hasCustomPhoto ? profileData.media.profilePhoto.url : '/gender-neutral-user.svg';
              const photoAlt = hasCustomPhoto ? 'Profile photo' : 'Default profile avatar';
              const photoStatus = hasCustomPhoto ? '✓ Custom photo' : '⚙️ Default avatar';
              
              return (
                <div className="flex items-center space-x-3">
                  <img
                    src={photoSrc}
                    alt={photoAlt}
                    className={`w-16 h-16 rounded-lg border-2 border-secondary-200 dark:border-secondary-600 ${
                      hasCustomPhoto ? 'object-cover' : 'object-contain p-2 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900'
                    }`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-lg border-2 border-secondary-200 dark:border-secondary-600 flex items-center justify-center"><span class="text-secondary-400 text-xs">Image not found</span></div>';
                      }
                    }}
                  />
                  <div>
                    <p className="text-sm text-secondary-900 dark:text-white">
                      {photoStatus}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {hasCustomPhoto ? 'Custom profile photo' : 'Gender-neutral default'}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
              CV Document
            </label>
            {profileData.media.documents.cvPdf.url ? (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-secondary-900 dark:text-white">
                    ✓ Configured
                  </p>
                  <p className="text-xs text-secondary-500 truncate">
                    Server Filename: {profileData.media.documents.cvPdf.filename}
                  </p>
                  {profileData.media.documents.cvPdf.lastUpdated && (
                    <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                      Updated: {new Date(profileData.media.documents.cvPdf.lastUpdated).toLocaleString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleViewFile}
                  className="ml-3 btn-secondary flex items-center space-x-1 text-xs px-2 py-1"
                >
                  {isPdfFile(profileData.media.documents.cvPdf.url) ? (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <p className="text-sm text-secondary-900 dark:text-white">
                ✗ Not set
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-600">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {profileData.media.documents.cvPdf.filename || 'CV Document'}
              </h3>
              <button
                onClick={() => setShowPdfViewer(false)}
                className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={profileData.media.documents.cvPdf.url}
                className="w-full h-full border-0 rounded"
                title="CV Document"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HierarchicalManagementConsole;
