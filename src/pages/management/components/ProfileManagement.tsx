import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Copy,
  Download,
  Upload,
  Settings,
  FileText,
  Loader
} from 'lucide-react';
import { ProfileMetadata, MultiProfileConfig, ProfileData } from '../../../types';
import { dataService } from '../../../services/dataService';
import { fileUploadService } from '../../../services/fileUploadService';
import { resumeParserService } from '../../services/resumeParserService';

interface ProfileManagementProps {
  currentProfileData: ProfileData;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({ 
  currentProfileData 
}) => {
  const [config, setConfig] = useState<MultiProfileConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDescription, setNewProfileDescription] = useState('');
  const [newProfileEndpoint, setNewProfileEndpoint] = useState('');
  const [editingProfile, setEditingProfile] = useState<ProfileMetadata | null>(null);
  const [editProfileName, setEditProfileName] = useState('');
  const [editProfileDescription, setEditProfileDescription] = useState('');
  const [editProfileEndpoint, setEditProfileEndpoint] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parsedProfileData, setParsedProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    setLoading(true);
    const profileConfig = dataService.getMultiProfileConfig();
    setConfig(profileConfig);
    setLoading(false);
  };

  const handleResumeUpload = async (file: File) => {
    setIsParsingResume(true);
    try {
      const parsedData = await resumeParserService.parseResume(file);
      const emptyProfile = dataService.generateEmptyProfileData();
      const mergedProfile = resumeParserService.mergeWithEmptyProfile(parsedData, emptyProfile);
      
      setParsedProfileData(mergedProfile);
      
      // Auto-populate form fields if available
      if (parsedData.personalInfo.fullName) {
        setNewProfileName(parsedData.personalInfo.fullName);
      }
      if (parsedData.personalInfo.title) {
        setNewProfileDescription(parsedData.personalInfo.title);
      }
      
      // Generate endpoint from name if available
      if (parsedData.personalInfo.fullName) {
        const endpoint = parsedData.personalInfo.fullName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50);
        setNewProfileEndpoint(endpoint);
      }
      
    } catch (error) {
      console.error('Resume parsing error:', error);
      alert('Failed to parse resume: ' + (error as Error).message);
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!newProfileName.trim() || !newProfileEndpoint.trim()) return;

    let profileData: ProfileData;
    
    if (parsedProfileData) {
      // Use parsed data from resume
      profileData = parsedProfileData;
    } else {
      // Create empty profile data
      profileData = dataService.generateEmptyProfileData();
    }
    
    const result = await dataService.createProfile(
      profileData,
      newProfileName.trim(),
      newProfileDescription.trim(),
      newProfileEndpoint.trim()
    );

    if (result.success) {
      // Upload resume file if provided
      if (resumeFile) {
        try {
          const formData = new FormData();
          formData.append('resumeFile', resumeFile);
          formData.append('endpoint', newProfileEndpoint.trim());
          
          const response = await fetch('http://localhost:3004/api/upload/resume', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            console.error('Failed to upload resume file');
          }
        } catch (error) {
          console.error('Resume upload error:', error);
        }
      }
      
      loadConfig();
      setShowCreateForm(false);
      setNewProfileName('');
      setNewProfileDescription('');
      setNewProfileEndpoint('');
      setResumeFile(null);
      setParsedProfileData(null);
    }
  };

  const handleToggleProfileStatus = async (profileId: string) => {
    const result = await dataService.toggleProfileStatus(profileId);
    if (result.success) {
      loadConfig();
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    const result = await dataService.deleteProfile(profileId);
    if (result.success) {
      loadConfig();
      setShowDeleteConfirm(null);
    }
  };

  const handleDuplicateProfile = async (profile: ProfileMetadata) => {
    const result = await dataService.createProfile(
      currentProfileData,
      `${profile.name} (Copy)`,
      `${profile.description} - Duplicated`,
      `${profile.endpoint}-copy`,
      profile.id
    );

    if (result.success) {
      loadConfig();
    }
  };

  const handleEditProfileMetadata = (profile: ProfileMetadata) => {
    setEditingProfile(profile);
    setEditProfileName(profile.name);
    setEditProfileDescription(profile.description);
    setEditProfileEndpoint(profile.endpoint);
    setShowEditForm(true);
  };

  const handleUpdateProfileMetadata = async () => {
    if (!editingProfile || !editProfileName.trim() || !editProfileEndpoint.trim()) return;

    const updatedConfig = dataService.getMultiProfileConfig();
    const profileIndex = updatedConfig.profiles.findIndex(p => p.id === editingProfile.id);
    
    if (profileIndex !== -1) {
      // Check if endpoint is unique (excluding current profile)
      const existingProfile = updatedConfig.profiles.find(p => p.endpoint === editProfileEndpoint.trim() && p.id !== editingProfile.id);
      if (existingProfile) {
        alert('Endpoint already exists. Please choose a different endpoint.');
        return;
      }

      updatedConfig.profiles[profileIndex].name = editProfileName.trim();
      updatedConfig.profiles[profileIndex].description = editProfileDescription.trim();
      updatedConfig.profiles[profileIndex].endpoint = editProfileEndpoint.trim();
      updatedConfig.profiles[profileIndex].lastUpdated = new Date().toISOString();
      updatedConfig.lastUpdated = new Date().toISOString();
      
      localStorage.setItem('cvbot_config', JSON.stringify(updatedConfig));
      loadConfig();
      setShowEditForm(false);
      setEditingProfile(null);
      setEditProfileName('');
      setEditProfileDescription('');
      setEditProfileEndpoint('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600 dark:text-white">Failed to load profile configuration</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
            Profile Management
          </h3>
          <p className="text-sm text-secondary-600 dark:text-white">
            Manage multiple CV profiles and switch between them
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Profile</span>
        </button>
      </div>

      {/* Active Profile Info */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-secondary-900 dark:text-white mb-1">
              Currently Active Profile
            </h4>
            <p className="text-sm text-secondary-600 dark:text-white">
              {config.profiles.find(p => p.id === config.activeProfileId)?.name || 'Unknown'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Profile List */}
      <div className="grid gap-4">
        {config.profiles.map((profile) => (
          <div
            key={profile.id}
            className={`card ${
              profile.id === config.activeProfileId 
                ? 'border-primary-200 bg-primary-50 dark:bg-primary-900/20' 
                : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-secondary-900 dark:text-white">
                    {profile.name}
                  </h4>
                  {profile.id === config.activeProfileId && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Active
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-secondary-600 dark:text-white mb-2">
                  {profile.description}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-secondary-500 dark:text-white">
                  <span>Created: {formatDate(profile.created)}</span>
                  <span>Updated: {formatDate(profile.lastUpdated)}</span>
                  <span>Endpoint: /{profile.endpoint}</span>
                </div>
                
                {/* File Information */}
                <div className="mt-2 flex items-center space-x-4">
                  {(() => {
                    const files = fileUploadService.getFilesForProfile(profile.id);
                    const profilePhoto = files.find(f => f.type.startsWith('image/'));
                    const cvFile = files.find(f => 
                      f.type.includes('pdf') || 
                      f.type.includes('word') || 
                      f.type.includes('document') ||
                      f.type.includes('text')
                    );
                    
                    return (
                      <>
                        {profilePhoto && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <Image className="w-4 h-4" />
                            <span className="text-xs">Photo: {profilePhoto.originalName}</span>
                          </div>
                        )}
                        {cvFile && (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <FileText className="w-4 h-4" />
                            <span className="text-xs">CV: {cvFile.originalName}</span>
                          </div>
                        )}
                        {!profilePhoto && !cvFile && (
                          <span className="text-xs text-secondary-500">No files uploaded</span>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleProfileStatus(profile.id)}
                  className={`flex items-center space-x-1 ${
                    profile.isActive 
                      ? 'btn-primary' 
                      : 'btn-outline text-secondary-600 border-secondary-600 hover:bg-secondary-50'
                  }`}
                  title={profile.isActive ? 'Deactivate profile' : 'Activate profile'}
                >
                  {profile.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>{profile.isActive ? 'Active' : 'Inactive'}</span>
                </button>
                
                <button
                  onClick={() => handleEditProfileMetadata(profile)}
                  className="btn-secondary flex items-center space-x-1"
                  title="Edit profile details"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDuplicateProfile(profile)}
                  className="btn-secondary flex items-center space-x-1"
                  title="Duplicate profile"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                {config.profiles.length > 1 && (
                  <button
                    onClick={() => setShowDeleteConfirm(profile.id)}
                    className="btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center space-x-1"
                    title="Delete profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Profile Form */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Edit Profile Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Profile Name *
                </label>
                <input
                  type="text"
                  value={editProfileName}
                  onChange={(e) => setEditProfileName(e.target.value)}
                  placeholder="e.g., Brian Sun - Data Scientist"
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Endpoint *
                </label>
                <input
                  type="text"
                  value={editProfileEndpoint}
                  onChange={(e) => setEditProfileEndpoint(e.target.value)}
                  placeholder="e.g., brian-sun, data-scientist"
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  value={editProfileDescription}
                  onChange={(e) => setEditProfileDescription(e.target.value)}
                  placeholder="Brief description of this profile..."
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setEditingProfile(null);
                  setEditProfileName('');
                  setEditProfileDescription('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfileMetadata}
                disabled={!editProfileName.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Profile Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Create New Profile
            </h3>
            
            <div className="space-y-4">
              {/* Resume Upload Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Upload Resume (Optional)
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                  Upload a resume file (PDF, TXT, DOC, DOCX) to automatically populate profile data. The file will be saved as the profile's CV document.
                </p>
                
                <div className="space-y-3">
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setResumeFile(file);
                        handleResumeUpload(file);
                      }
                    }}
                    className="w-full text-sm text-secondary-600 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-300"
                  />
                  
                  {isParsingResume && (
                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Parsing resume...</span>
                    </div>
                  )}
                  
                  {parsedProfileData && (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Resume parsed successfully! Form fields have been auto-populated.</span>
                    </div>
                  )}
                  
                  {resumeFile && (
                    <div className="flex items-center space-x-2 text-secondary-600 dark:text-white">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">Selected: {resumeFile.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Profile Name *
                </label>
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="e.g., Brian Sun - Data Scientist"
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Endpoint *
                </label>
                <input
                  type="text"
                  value={newProfileEndpoint}
                  onChange={(e) => setNewProfileEndpoint(e.target.value)}
                  placeholder="e.g., brian-sun, data-scientist"
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  value={newProfileDescription}
                  onChange={(e) => setNewProfileDescription(e.target.value)}
                  placeholder="Brief description of this profile..."
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewProfileName('');
                  setNewProfileDescription('');
                  setNewProfileEndpoint('');
                  setResumeFile(null);
                  setParsedProfileData(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProfile}
                disabled={!newProfileName.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Delete Profile
            </h3>
            <p className="text-secondary-600 dark:text-white mb-6">
              Are you sure you want to delete this profile? This action cannot be undone and will permanently remove all associated data.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProfile(showDeleteConfirm)}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManagement;
