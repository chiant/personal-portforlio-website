import { 
  ProfileData, 
  VisitorMessage, 
  MessageStorage, 
  MultiProfileConfig, 
  ProfileMetadata,
  DataServiceResponse,
  SaveProfileResponse,
  SaveMessageResponse
} from '../types';

// In a real application, these would be API calls to a backend
// For now, we'll simulate file operations using localStorage and mock data

class DataService {
  private readonly PROFILE_PREFIX = 'cvbot_profile_';
  private readonly MESSAGES_KEY = 'cvbot_messages';
  private readonly CONFIG_KEY = 'cvbot_config';

  // Profile Management Methods
  async getProfileByEndpoint(endpoint: string): Promise<DataServiceResponse<ProfileData>> {
    try {
      const config = this.getMultiProfileConfig();
      const profile = config.profiles.find(p => p.endpoint === endpoint && p.isActive);
      
      if (!profile) {
        return { success: false, error: 'Profile not found or inactive' };
      }

      const profileData = localStorage.getItem(`${this.PROFILE_PREFIX}${profile.id}`);
      if (!profileData) {
        return { success: false, error: 'Profile data not found' };
      }

      return { success: true, data: JSON.parse(profileData) };
    } catch (error) {
      return { success: false, error: 'Failed to load profile data' };
    }
  }

  async getProfileById(profileId: string): Promise<DataServiceResponse<ProfileData>> {
    try {
      const storageKey = `${this.PROFILE_PREFIX}${profileId}`;
      console.log('Getting profile data from localStorage with key:', storageKey);
      const profileData = localStorage.getItem(storageKey);
      if (!profileData) {
        console.log('No profile data found in localStorage for key:', storageKey);
        return { success: false, error: 'Profile data not found' };
      }

      const parsedData = JSON.parse(profileData);
      console.log('Parsed profile data:', parsedData);
      console.log('Profile metadata:', parsedData.metadata);
      console.log('Profile ID from metadata:', parsedData.metadata?.id);
      
      // Ensure metadata has the correct ID and endpoint
      if (!parsedData.metadata) {
        parsedData.metadata = {};
      }
      if (!parsedData.metadata.id) {
        parsedData.metadata.id = profileId;
        console.log('Fixed missing metadata ID, setting to:', profileId);
      }
      
      // Ensure endpoint is set in metadata from config
      const config = this.getMultiProfileConfig();
      const profileConfig = config.profiles.find(p => p.id === profileId);
      if (profileConfig && profileConfig.endpoint && !parsedData.metadata.endpoint) {
        parsedData.metadata.endpoint = profileConfig.endpoint;
        console.log('Set missing endpoint in profile metadata:', profileConfig.endpoint);
      }
      
      return { success: true, data: parsedData };
    } catch (error) {
      console.error('Error parsing profile data:', error);
      return { success: false, error: 'Failed to load profile data' };
    }
  }

  async saveProfile(profileId: string, profileData: ProfileData): Promise<SaveProfileResponse> {
    try {
      console.log('DataService.saveProfile called with profileId:', profileId);
      console.log('Profile data summary:', {
        name: profileData.personalInfo.fullName,
        summary: profileData.summary.professionalSummary?.substring(0, 100) + '...'
      });
      
      // Update metadata
      profileData.metadata.id = profileId; // Ensure the ID is set in metadata
      profileData.metadata.lastUpdated = new Date().toISOString();
      profileData.metadata.updatedBy = 'Admin';
      
      // Ensure endpoint is set in metadata from config
      const config = this.getMultiProfileConfig();
      const profileConfig = config.profiles.find(p => p.id === profileId);
      if (profileConfig && profileConfig.endpoint) {
        profileData.metadata.endpoint = profileConfig.endpoint;
        console.log('Set endpoint in profile metadata:', profileConfig.endpoint);
      }

      // Save profile data
      const storageKey = `${this.PROFILE_PREFIX}${profileId}`;
      console.log('Saving to localStorage with key:', storageKey);
      localStorage.setItem(storageKey, JSON.stringify(profileData));

      // Update profile metadata (reuse existing config)
      const profileIndex = config.profiles.findIndex(p => p.id === profileId);
      if (profileIndex !== -1) {
        config.profiles[profileIndex].lastUpdated = new Date().toISOString();
        config.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
        console.log('Updated profile metadata in config');
      } else {
        console.log('Profile not found in config, profileIndex:', profileIndex);
      }

      console.log('Profile saved successfully');
      return { success: true, profileId, message: 'Profile saved successfully' };
    } catch (error) {
      return { success: false, profileId, message: 'Failed to save profile' };
    }
  }

  async getProfile(profileId: string): Promise<DataServiceResponse<ProfileData>> {
    try {
      const profileData = localStorage.getItem(`${this.PROFILE_PREFIX}${profileId}`);
      if (!profileData) {
        return { success: false, error: 'Profile not found' };
      }

      return { success: true, data: JSON.parse(profileData) };
    } catch (error) {
      return { success: false, error: 'Failed to load profile' };
    }
  }

  // Multi-Profile Management Methods
  public getMultiProfileConfig(): MultiProfileConfig {
    const config = localStorage.getItem(this.CONFIG_KEY);
    if (config) {
      return JSON.parse(config);
    }

    // Initialize with empty profile list
    const emptyConfig: MultiProfileConfig = {
      profiles: [],
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(emptyConfig));
    return emptyConfig;
  }

  // Generate empty profile data template
  generateEmptyProfileData(): ProfileData {
    return {
      personalInfo: {
        fullName: '',
        preferredName: '',
        title: '',
        location: {
          city: '',
          province: '',
          country: ''
        },
        pronouns: '',
        languages: []
      },
      summary: {
        professionalSummary: ''
      },
      coreCompetencies: {
        competencies: []
      },
      workExperience: {
        positions: []
      },
      education: {
        degrees: []
      },
      certifications: {
        certifications: []
      },
      technicalSkills: {
        skills: []
      },
      contactInfo: {
        email: '',
        phone: '',
        socialMedia: {
          linkedin: null,
          github: null,
          twitter: null,
          website: null
        },
        preferredContactMethod: 'email',
        availability: ''
      },
      media: {
        profilePhoto: {
          url: ''
        },
        documents: {
          cvPdf: {
            url: '',
            filename: '',
            description: ''
          }
        }
      },
      metadata: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        created: new Date().toISOString(),
        updatedBy: 'Admin',
        tags: [],
        id: ''
      }
    };
  }

  async createProfile(profileData: ProfileData, name: string, description: string, endpoint: string, copyFromProfileId?: string): Promise<SaveProfileResponse> {
    try {
      console.log('Creating profile with data:', {
        name,
        description,
        endpoint,
        profileData: profileData.personalInfo,
        copyFromProfileId
      });
      
      const config = this.getMultiProfileConfig();
      
      // Validate endpoint uniqueness
      const existingProfile = config.profiles.find(p => p.endpoint === endpoint);
      if (existingProfile) {
        return { success: false, profileId: '', message: 'Endpoint already exists. Please choose a different endpoint.' };
      }

      const newProfileId = `profile_${Date.now()}`;
      
      // If copying from existing profile, copy files
      if (copyFromProfileId) {
        console.log('Copying files from profile:', copyFromProfileId, 'to endpoint:', endpoint);
        const sourceProfileResult = await this.getProfileById(copyFromProfileId);
        if (sourceProfileResult.success && sourceProfileResult.data) {
          const sourceProfile = sourceProfileResult.data;
          const sourceProfileConfig = config.profiles.find(p => p.id === copyFromProfileId);
          
          if (sourceProfileConfig) {
            console.log('Source profile config found:', sourceProfileConfig.endpoint);
            // Import backend file upload service
            const { backendFileUploadService } = await import('./backendFileUploadService');
            
            // Copy files with new naming using backend service
            const copiedFiles = await backendFileUploadService.copyProfileFiles(
              sourceProfileConfig.endpoint,
              endpoint,
              name
            );
            
            console.log('File copying result:', copiedFiles);
            
            // Update profile data with copied file URLs
            if (copiedFiles.cvFile) {
              profileData.media.documents.cvPdf.url = copiedFiles.cvFile.url;
              profileData.media.documents.cvPdf.filename = copiedFiles.cvFile.filename;
              console.log('Updated CV file URL:', copiedFiles.cvFile.url);
            }
            
            if (copiedFiles.photoFile) {
              profileData.media.profilePhoto.url = copiedFiles.photoFile.url;
              console.log('Updated photo file URL:', copiedFiles.photoFile.url);
            }
          } else {
            console.log('Source profile config not found for ID:', copyFromProfileId);
          }
        } else {
          console.log('Failed to load source profile data:', sourceProfileResult.error);
        }
      }
      
      const newProfile: ProfileMetadata = {
        id: newProfileId,
        name,
        description,
        endpoint,
        isActive: true,
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        cvPdfPath: profileData.media.documents.cvPdf.url,
        cvPdfFilename: profileData.media.documents.cvPdf.filename
      };

      config.profiles.push(newProfile);
      config.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
      await this.saveProfile(newProfileId, profileData);

      return { success: true, profileId: newProfileId, message: 'Profile created successfully' };
    } catch (error) {
      return { success: false, profileId: '', message: 'Failed to create profile' };
    }
  }

  async toggleProfileStatus(profileId: string): Promise<DataServiceResponse<boolean>> {
    try {
      const config = this.getMultiProfileConfig();
      const profileIndex = config.profiles.findIndex(p => p.id === profileId);
      
      if (profileIndex === -1) {
        return { success: false, error: 'Profile not found' };
      }

      config.profiles[profileIndex].isActive = !config.profiles[profileIndex].isActive;
      config.profiles[profileIndex].lastUpdated = new Date().toISOString();
      config.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
      
      return { success: true, data: config.profiles[profileIndex].isActive };
    } catch (error) {
      return { success: false, error: 'Failed to toggle profile status' };
    }
  }

  async updateProfileName(profileId: string, newName: string): Promise<DataServiceResponse<boolean>> {
    try {
      const config = this.getMultiProfileConfig();
      const profileIndex = config.profiles.findIndex(p => p.id === profileId);
      
      if (profileIndex === -1) {
        return { success: false, error: 'Profile not found' };
      }

      const oldName = config.profiles[profileIndex].name;
      const endpoint = config.profiles[profileIndex].endpoint;
      
      // Update profile name in config
      config.profiles[profileIndex].name = newName;
      config.profiles[profileIndex].lastUpdated = new Date().toISOString();
      config.lastUpdated = new Date().toISOString();
      
      // Update profile data
      const profileResult = await this.getProfileById(profileId);
      if (profileResult.success && profileResult.data) {
        profileResult.data.personalInfo.fullName = newName;
        await this.saveProfile(profileId, profileResult.data);
        
        // Note: Files are now named by endpoint only, so no need to rename files when name changes
      }
      
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
      
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile name' };
    }
  }

  async updateProfileEndpoint(profileId: string, newEndpoint: string): Promise<DataServiceResponse<boolean>> {
    try {
      const config = this.getMultiProfileConfig();
      const profileIndex = config.profiles.findIndex(p => p.id === profileId);
      
      if (profileIndex === -1) {
        return { success: false, error: 'Profile not found' };
      }

      // Validate endpoint uniqueness
      const existingProfile = config.profiles.find(p => p.endpoint === newEndpoint && p.id !== profileId);
      if (existingProfile) {
        return { success: false, error: 'Endpoint already exists. Please choose a different endpoint.' };
      }

      const oldEndpoint = config.profiles[profileIndex].endpoint;
      const profileName = config.profiles[profileIndex].name;
      
      // Update endpoint in config
      config.profiles[profileIndex].endpoint = newEndpoint;
      config.profiles[profileIndex].lastUpdated = new Date().toISOString();
      config.lastUpdated = new Date().toISOString();
      
      // Rename files if endpoint changed
      if (oldEndpoint !== newEndpoint) {
        const { fileUploadService } = await import('./fileUploadService');
        await fileUploadService.renameProfileFiles(oldEndpoint, newEndpoint, profileName);
      }
      
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
      
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile endpoint' };
    }
  }

  async deleteProfile(profileId: string): Promise<DataServiceResponse<boolean>> {
    try {
      const config = this.getMultiProfileConfig();
      
      if (config.profiles.length <= 1) {
        return { success: false, error: 'Cannot delete the last profile' };
      }

      // Remove profile from config
      config.profiles = config.profiles.filter(p => p.id !== profileId);
      config.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
      localStorage.removeItem(`${this.PROFILE_PREFIX}${profileId}`);

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete profile' };
    }
  }

  // Message Management Methods
  async saveMessage(message: Omit<VisitorMessage, 'id' | 'timestamp' | 'status'>): Promise<SaveMessageResponse> {
    try {
      const messages = this.getMessages();
      const newMessage: VisitorMessage = {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        status: 'unread'
      };

      messages.messages.unshift(newMessage); // Add to beginning
      messages.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));

      return { success: true, messageId: newMessage.id, message: 'Message saved successfully' };
    } catch (error) {
      return { success: false, messageId: '', message: 'Failed to save message' };
    }
  }

  getMessages(): MessageStorage {
    const messages = localStorage.getItem(this.MESSAGES_KEY);
    if (messages) {
      return JSON.parse(messages);
    }

    // Initialize with empty messages
    const emptyStorage: MessageStorage = {
      messages: [],
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(emptyStorage));
    return emptyStorage;
  }

  async updateMessageStatus(messageId: string, status: VisitorMessage['status']): Promise<DataServiceResponse<boolean>> {
    try {
      const messages = this.getMessages();
      const messageIndex = messages.messages.findIndex(m => m.id === messageId);
      
      if (messageIndex === -1) {
        return { success: false, error: 'Message not found' };
      }

      messages.messages[messageIndex].status = status;
      messages.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Failed to update message status' };
    }
  }

  async deleteMessage(messageId: string): Promise<DataServiceResponse<boolean>> {
    try {
      const messages = this.getMessages();
      messages.messages = messages.messages.filter(m => m.id !== messageId);
      messages.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete message' };
    }
  }

  async deleteAllMessages(): Promise<DataServiceResponse<boolean>> {
    try {
      const emptyStorage: MessageStorage = {
        messages: [],
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(emptyStorage));

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete all messages' };
    }
  }

  // File Management Methods
  getProfileFiles(profileId: string) {
    const files = localStorage.getItem('cvbot_uploaded_files');
    if (!files) return [];
    
    const allFiles = JSON.parse(files);
    return allFiles.filter((file: any) => file.profileId === profileId);
  }

  updateProfileFileAssociation(profileId: string, fileId: string, type: 'cv' | 'image'): DataServiceResponse<boolean> {
    try {
      const files = localStorage.getItem('cvbot_uploaded_files');
      if (!files) return { success: false, error: 'No files found' };
      
      const allFiles = JSON.parse(files);
      const fileIndex = allFiles.findIndex((file: any) => file.id === fileId);
      
      if (fileIndex === -1) {
        return { success: false, error: 'File not found' };
      }
      
      // Remove any existing files of the same type for this profile
      allFiles.forEach((file: any, index: number) => {
        if (file.profileId === profileId) {
          if (type === 'cv' && (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('document'))) {
            allFiles[index].profileId = null;
          } else if (type === 'image' && file.type.startsWith('image/')) {
            allFiles[index].profileId = null;
          }
        }
      });
      
      // Set the new file association
      allFiles[fileIndex].profileId = profileId;
      
      localStorage.setItem('cvbot_uploaded_files', JSON.stringify(allFiles));
      return { success: true, data: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to update file association' 
      };
    }
  }

  // Utility Methods
  async initializeDefaultProfile(defaultProfileData: ProfileData): Promise<void> {
    const config = this.getMultiProfileConfig();
    const defaultProfile = config.profiles.find(p => p.id === 'default');
    
    if (defaultProfile) {
      await this.saveProfile('default', defaultProfileData);
    }
  }
}

export const dataService = new DataService();
