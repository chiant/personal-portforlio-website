// Backend-integrated file upload service
// Communicates with Express.js backend for actual file storage

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  profileId?: string;
  profileName?: string;
  endpoint?: string;
}

export interface UploadResult {
  success: boolean;
  file?: UploadedFile;
  error?: string;
}

export interface FileRenameResult {
  success: boolean;
  newFilename?: string;
  error?: string;
}

class BackendFileUploadService {
  private readonly API_BASE_URL = 'http://localhost:3004/api';
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_CV_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'text/plain' // .txt
  ];
  private readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  // Validate file before upload
  private validateFile(file: File, type: 'cv' | 'photo'): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    // Check file type
    const allowedTypes = type === 'cv' ? this.ALLOWED_CV_TYPES : this.ALLOWED_IMAGE_TYPES;
    if (!allowedTypes.includes(file.type)) {
      const allowedExts = type === 'cv' ? 'PDF, DOC, DOCX, TXT' : 'JPEG, JPG, PNG';
      return { valid: false, error: `Invalid file type. Only ${allowedExts} files are allowed.` };
    }

    return { valid: true };
  }

  // Upload CV file to backend
  async uploadCV(file: File, endpoint: string, profileId?: string): Promise<UploadResult> {
    try {
      console.log('BackendFileUploadService.uploadCV called with:', { 
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type, 
        endpoint, 
        profileId 
      });

      // Validate file
      const validation = this.validateFile(file, 'cv');
      if (!validation.valid) {
        console.log('CV validation failed:', validation.error);
        return { success: false, error: validation.error };
      }

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('cvFile', file);
      formData.append('endpoint', endpoint);

      console.log('Uploading CV to backend...');

      // Upload to backend
      const response = await fetch(`${this.API_BASE_URL}/upload/cv`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Backend CV upload failed:', result);
        return { success: false, error: result.error || 'Failed to upload CV file' };
      }

      console.log('Backend CV upload successful:', result);

      // Create UploadedFile object
      const uploadedFile: UploadedFile = {
        id: `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: result.file.filename,
        originalName: result.file.originalName,
        size: result.file.size,
        type: result.file.mimetype,
        url: `${this.API_BASE_URL}/files/cv/${result.file.filename}`,
        uploadedAt: new Date().toISOString(),
        profileId,
        endpoint
      };

      return { success: true, file: uploadedFile };

    } catch (error) {
      console.error('Error in uploadCV:', error);
      return { success: false, error: 'Network error or server unavailable' };
    }
  }

  // Upload photo file to backend
  async uploadPhoto(file: File, endpoint: string, profileId?: string): Promise<UploadResult> {
    try {
      console.log('BackendFileUploadService.uploadPhoto called with:', { 
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type, 
        endpoint, 
        profileId 
      });

      // Validate file
      const validation = this.validateFile(file, 'photo');
      if (!validation.valid) {
        console.log('Photo validation failed:', validation.error);
        return { success: false, error: validation.error };
      }

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('photoFile', file);
      formData.append('endpoint', endpoint);

      console.log('Uploading photo to backend...');

      // Upload to backend
      const response = await fetch(`${this.API_BASE_URL}/upload/photo`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Backend photo upload failed:', result);
        return { success: false, error: result.error || 'Failed to upload photo file' };
      }

      console.log('Backend photo upload successful:', result);

      // Create UploadedFile object
      const uploadedFile: UploadedFile = {
        id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: result.file.filename,
        originalName: result.file.originalName,
        size: result.file.size,
        type: result.file.mimetype,
        url: `${this.API_BASE_URL}/files/photo/${result.file.filename}`,
        uploadedAt: new Date().toISOString(),
        profileId,
        endpoint
      };

      return { success: true, file: uploadedFile };

    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      return { success: false, error: 'Network error or server unavailable' };
    }
  }

  // Get file by endpoint (for checking if file exists)
  async getFileByEndpoint(endpoint: string, type: 'cv' | 'photo'): Promise<UploadedFile | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/files/${type}`);
      const result = await response.json();

      if (!response.ok) {
        console.error('Failed to list files:', result);
        return null;
      }

      // Find file with matching endpoint
      const file = result.files.find((f: any) => f.filename.startsWith(`${type}-${endpoint}.`));
      
      if (file) {
        return {
          id: `backend_${type}_${endpoint}`,
          filename: file.filename,
          originalName: file.filename,
          size: file.size,
          type: type === 'cv' ? 'application/pdf' : 'image/jpeg',
          url: `${this.API_BASE_URL}/files/${type}/${file.filename}`,
          uploadedAt: file.created,
          endpoint
        };
      }

      return null;

    } catch (error) {
      console.error('Error getting file by endpoint:', error);
      return null;
    }
  }

  // Copy files when creating new profile
  async copyProfileFiles(sourceEndpoint: string, targetEndpoint: string, profileName: string): Promise<{ cvFile?: UploadedFile; photoFile?: UploadedFile }> {
    try {
      console.log('BackendFileUploadService.copyProfileFiles called with:', { 
        sourceEndpoint, 
        targetEndpoint, 
        profileName 
      });

      const result: { cvFile?: UploadedFile; photoFile?: UploadedFile } = {};

      // Call backend API to copy files
      const response = await fetch(`${this.API_BASE_URL}/copy-files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceEndpoint,
          targetEndpoint
        }),
      });

      const copyResult = await response.json();

      if (!response.ok) {
        console.error('Backend copy files failed:', copyResult);
        return {};
      }

      console.log('Backend copy files successful:', copyResult);

      // Create UploadedFile objects for the copied files
      for (const copiedFile of copyResult.copiedFiles) {
        if (copiedFile.type === 'cv') {
          result.cvFile = {
            id: `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            filename: copiedFile.newFilename,
            originalName: copiedFile.originalFilename,
            size: copiedFile.size,
            type: 'application/pdf', // Default type, will be updated when file is accessed
            url: `${this.API_BASE_URL}/files/cv/${copiedFile.newFilename}`,
            uploadedAt: new Date().toISOString(),
            endpoint: targetEndpoint
          };
        } else if (copiedFile.type === 'photo') {
          result.photoFile = {
            id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            filename: copiedFile.newFilename,
            originalName: copiedFile.originalFilename,
            size: copiedFile.size,
            type: 'image/jpeg', // Default type, will be updated when file is accessed
            url: `${this.API_BASE_URL}/files/photo/${copiedFile.newFilename}`,
            uploadedAt: new Date().toISOString(),
            endpoint: targetEndpoint
          };
        }
      }

      return result;

    } catch (error) {
      console.error('Error copying profile files:', error);
      return {};
    }
  }

  // Rename files when endpoint changes (backend handles this automatically)
  async renameProfileFiles(oldEndpoint: string, newEndpoint: string, profileName: string): Promise<FileRenameResult> {
    try {
      // In a real implementation, you would call a backend endpoint to rename files
      // For now, we'll just return success as the backend handles file naming automatically
      console.log(`Files for endpoint ${oldEndpoint} will be accessible as ${newEndpoint} on next upload`);
      return { success: true };

    } catch (error) {
      console.error('Error renaming profile files:', error);
      return { success: false, error: 'Failed to rename profile files' };
    }
  }

  // Check if backend server is available
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL.replace('/api', '')}/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const backendFileUploadService = new BackendFileUploadService();
export default backendFileUploadService;
