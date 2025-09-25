// File upload service for handling CV files and profile photos
// Uses organized folder structure: upload/cv and upload/photo
// Naming rules: cv-{profile-full-name}-{endpoint}.{ext} and photo-{profile-full-name}-{endpoint}.{ext}

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

class FileUploadService {
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
    'image/png',
    'image/webp',
    'image/gif'
  ];

  // Generate filename following naming rules
  // Examples:
  // - Endpoint: "sas" → "cv-sas.pdf" and "photo-sas.png"
  // - Endpoint: "brian-sun-ds" → "cv-brian-sun-ds.pdf" and "photo-brian-sun-ds.jpg"
  // - Endpoint: "data-scientist" → "cv-data-scientist.pdf" and "photo-data-scientist.jpeg"
  private generateFilename(profileName: string, endpoint: string, fileType: 'cv' | 'photo', extension: string): string {
    console.log('generateFilename called with:', { profileName, endpoint, fileType, extension });
    
    if (!endpoint) {
      console.error('Endpoint is undefined or empty:', endpoint);
      throw new Error('Endpoint is required for file naming');
    }
    
    const sanitizedEndpoint = endpoint
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const filename = `${fileType}-${sanitizedEndpoint}.${extension}`;
    console.log('Generated filename:', filename);
    return filename;
  }

  // Get file extension from filename or MIME type
  private getFileExtension(filename: string, mimeType: string): string {
    // First try to get extension from filename
    const filenameExt = filename.split('.').pop()?.toLowerCase();
    if (filenameExt && ['pdf', 'docx', 'doc', 'txt', 'jpg', 'jpeg', 'png', 'webp', 'gif'].includes(filenameExt)) {
      return filenameExt;
    }

    // Fallback to MIME type
    const mimeToExt: { [key: string]: string } = {
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/msword': 'doc',
      'text/plain': 'txt',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif'
    };

    return mimeToExt[mimeType] || 'bin';
  }

  // Upload CV file
  async uploadCV(file: File, profileName: string, endpoint: string, profileId?: string): Promise<UploadResult> {
    try {
      console.log('uploadCV called with:', { 
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type, 
        profileName, 
        endpoint, 
        profileId 
      });

      // Validate file
      const validation = this.validateFile(file, 'cv');
      console.log('CV validation result:', validation);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate filename
      const extension = this.getFileExtension(file.name, file.type);
      const filename = this.generateFilename(profileName, endpoint, 'cv', extension);
      const filePath = `upload/cv/${filename}`;
      console.log('Generated CV filename:', filename, 'filePath:', filePath);

      // Convert file to base64 (simulating file system storage)
      const base64 = await this.fileToBase64(file);
      console.log('CV file converted to base64, length:', base64.length);
      
      // Create file object
      const uploadedFile: UploadedFile = {
        id: `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: base64, // Store base64 for immediate use
        uploadedAt: new Date().toISOString(),
        profileId,
        profileName,
        endpoint
      };

      // Store in localStorage (simulating file system)
      this.storeFile(uploadedFile, filePath);
      console.log('CV file stored successfully');

      return {
        success: true,
        file: uploadedFile
      };

    } catch (error) {
      console.error('Error in uploadCV:', error);
      return {
        success: false,
        error: 'Failed to upload CV file. Please try again.'
      };
    }
  }

  // Upload profile photo
  async uploadPhoto(file: File, profileName: string, endpoint: string, profileId?: string): Promise<UploadResult> {
    try {
      console.log('uploadPhoto called with:', { 
        fileName: file.name, 
        fileSize: file.size, 
        fileType: file.type, 
        profileName, 
        endpoint, 
        profileId 
      });

      // Validate file
      const validation = this.validateFile(file, 'image');
      console.log('File validation result:', validation);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate filename
      const extension = this.getFileExtension(file.name, file.type);
      const filename = this.generateFilename(profileName, endpoint, 'photo', extension);
      const filePath = `upload/photo/${filename}`;
      console.log('Generated filename:', filename, 'filePath:', filePath);

      // Convert file to base64 (simulating file system storage)
      const base64 = await this.fileToBase64(file);
      console.log('File converted to base64, length:', base64.length);
      
      // Create file object
      const uploadedFile: UploadedFile = {
        id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: base64, // Store base64 for immediate use
        uploadedAt: new Date().toISOString(),
        profileId,
        profileName,
        endpoint
      };

      // Store in localStorage (simulating file system)
      this.storeFile(uploadedFile, filePath);
      console.log('File stored successfully');

      return {
        success: true,
        file: uploadedFile
      };

    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      return {
        success: false,
        error: 'Failed to upload profile photo. Please try again.'
      };
    }
  }

  // Copy files when creating new profile from existing one
  async copyProfileFiles(sourceProfileName: string, sourceEndpoint: string, targetProfileName: string, targetEndpoint: string, profileId?: string): Promise<{ cvFile?: UploadedFile; photoFile?: UploadedFile }> {
    try {
      const result: { cvFile?: UploadedFile; photoFile?: UploadedFile } = {};

      // Copy CV file
      const cvFile = this.getFileByEndpoint(sourceEndpoint, 'cv');
      if (cvFile) {
        const extension = this.getFileExtension(cvFile.filename, cvFile.type);
        const newFilename = this.generateFilename(targetProfileName, targetEndpoint, 'cv', extension);
        const newFilePath = `upload/cv/${newFilename}`;

        const copiedCVFile: UploadedFile = {
          ...cvFile,
          id: `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          filename: newFilename,
          profileName: targetProfileName,
          endpoint: targetEndpoint,
          profileId,
          uploadedAt: new Date().toISOString()
        };

        this.storeFile(copiedCVFile, newFilePath);
        result.cvFile = copiedCVFile;
      }

      // Copy photo file
      const photoFile = this.getFileByEndpoint(sourceEndpoint, 'photo');
      if (photoFile) {
        const extension = this.getFileExtension(photoFile.filename, photoFile.type);
        const newFilename = this.generateFilename(targetProfileName, targetEndpoint, 'photo', extension);
        const newFilePath = `upload/photo/${newFilename}`;

        const copiedPhotoFile: UploadedFile = {
          ...photoFile,
          id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          filename: newFilename,
          profileName: targetProfileName,
          endpoint: targetEndpoint,
          profileId,
          uploadedAt: new Date().toISOString()
        };

        this.storeFile(copiedPhotoFile, newFilePath);
        result.photoFile = copiedPhotoFile;
      }

      return result;

    } catch (error) {
      console.error('Error copying profile files:', error);
      return {};
    }
  }

  // Rename files when endpoint changes
  async renameProfileFiles(oldEndpoint: string, newEndpoint: string, profileName: string): Promise<FileRenameResult> {
    try {
      // Find and rename CV file
      const cvFile = this.getFileByEndpoint(oldEndpoint, 'cv');
      if (cvFile) {
        const extension = this.getFileExtension(cvFile.filename, cvFile.type);
        const newFilename = this.generateFilename(profileName, newEndpoint, 'cv', extension);
        const newFilePath = `upload/cv/${newFilename}`;

        // Update file record
        cvFile.filename = newFilename;
        cvFile.endpoint = newEndpoint;
        cvFile.profileName = profileName;
        this.storeFile(cvFile, newFilePath);
        this.deleteFileRecord(cvFile.id);
      }

      // Find and rename photo file
      const photoFile = this.getFileByEndpoint(oldEndpoint, 'photo');
      if (photoFile) {
        const extension = this.getFileExtension(photoFile.filename, photoFile.type);
        const newFilename = this.generateFilename(profileName, newEndpoint, 'photo', extension);
        const newFilePath = `upload/photo/${newFilename}`;

        // Update file record
        photoFile.filename = newFilename;
        photoFile.endpoint = newEndpoint;
        photoFile.profileName = profileName;
        this.storeFile(photoFile, newFilePath);
        this.deleteFileRecord(photoFile.id);
      }

      return { success: true };

    } catch (error) {
      return { success: false, error: 'Failed to rename profile files' };
    }
  }

  // Get file by profile name and endpoint
  getFileByProfile(profileName: string, endpoint: string, type: 'cv' | 'photo'): UploadedFile | null {
    const files = this.getAllFiles();
    return files.find(file => 
      file.profileName === profileName && 
      file.endpoint === endpoint && 
      file.filename.startsWith(type + '-')
    ) || null;
  }

  // Get file by endpoint only (new naming convention)
  getFileByEndpoint(endpoint: string, type: 'cv' | 'photo'): UploadedFile | null {
    const files = this.getAllFiles();
    return files.find(file => 
      file.endpoint === endpoint && 
      file.filename.startsWith(type + '-')
    ) || null;
  }

  // Get file by ID
  getFile(fileId: string): UploadedFile | null {
    const files = this.getAllFiles();
    return files.find(file => file.id === fileId) || null;
  }

  // Get all uploaded files
  getAllFiles(): UploadedFile[] {
    const filesJson = localStorage.getItem('cvbot_uploaded_files');
    return filesJson ? JSON.parse(filesJson) : [];
  }

  // Get files for a specific profile
  getFilesForProfile(profileId: string): UploadedFile[] {
    const allFiles = this.getAllFiles();
    return allFiles.filter(file => file.profileId === profileId);
  }

  // Delete file
  deleteFile(fileId: string): boolean {
    try {
      const files = this.getAllFiles();
      const updatedFiles = files.filter(file => file.id !== fileId);
      localStorage.setItem('cvbot_uploaded_files', JSON.stringify(updatedFiles));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Delete file record (internal use)
  private deleteFileRecord(fileId: string): void {
    const files = this.getAllFiles();
    const updatedFiles = files.filter(file => file.id !== fileId);
    localStorage.setItem('cvbot_uploaded_files', JSON.stringify(updatedFiles));
  }

  // Update file profile association
  updateFileProfile(fileId: string, profileId: string): boolean {
    try {
      const files = this.getAllFiles();
      const fileIndex = files.findIndex(file => file.id === fileId);
      
      if (fileIndex !== -1) {
        files[fileIndex].profileId = profileId;
        localStorage.setItem('cvbot_uploaded_files', JSON.stringify(files));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // Convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Store file in localStorage (simulating file system)
  private storeFile(file: UploadedFile, filePath: string): void {
    const files = this.getAllFiles();
    files.push(file);
    localStorage.setItem('cvbot_uploaded_files', JSON.stringify(files));
    
    // Also store the file content with the file path as key (simulating file system)
    localStorage.setItem(`cvbot_file_${filePath}`, file.url);
  }

  // Get file content by path
  getFileContent(filePath: string): string | null {
    return localStorage.getItem(`cvbot_file_${filePath}`);
  }

  // Check if file is CV type
  isCVFile(file: File): boolean {
    return this.ALLOWED_CV_TYPES.includes(file.type);
  }

  // Check if file is image type
  isImageFile(file: File): boolean {
    return this.ALLOWED_IMAGE_TYPES.includes(file.type);
  }

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get file type icon
  getFileTypeIcon(fileType: string): string {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    return '📁';
  }

  // Validate file before upload
  validateFile(file: File, expectedType: 'cv' | 'image'): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds 10MB limit. Current size: ${this.formatFileSize(file.size)}`
      };
    }

    // Check file type
    if (expectedType === 'cv' && !this.isCVFile(file)) {
      return {
        valid: false,
        error: 'Please upload a PDF, DOCX, DOC, or TXT file for CV documents.'
      };
    }

    if (expectedType === 'image' && !this.isImageFile(file)) {
      return {
        valid: false,
        error: 'Please upload a JPEG, PNG, WebP, or GIF file for images.'
      };
    }

    return { valid: true };
  }

  // Migrate existing files to new structure
  async migrateExistingFiles(): Promise<void> {
    try {
      const files = this.getAllFiles();
      const migratedFiles: UploadedFile[] = [];

      for (const file of files) {
        // Skip if already migrated (has profileName and endpoint)
        if (file.profileName && file.endpoint) {
          migratedFiles.push(file);
          continue;
        }

        // Try to extract profile info from existing data
        // This is a fallback for existing files without proper naming
        const migratedFile: UploadedFile = {
          ...file,
          profileName: 'migrated-profile',
          endpoint: 'migrated-endpoint'
        };

        migratedFiles.push(migratedFile);
      }

      localStorage.setItem('cvbot_uploaded_files', JSON.stringify(migratedFiles));
    } catch (error) {
      console.error('Error migrating existing files:', error);
    }
  }

  // Convert file path to base64 URL (for existing files)
  async convertFilePathToBase64(filePath: string): Promise<string | null> {
    try {
      // For now, return the file path as-is since we're using a development setup
      // In a real application, this would fetch the file from the server and convert to base64
      return filePath;
    } catch (error) {
      console.error('Error converting file path to base64:', error);
      return null;
    }
  }

  // Get file URL (handles both base64 and file paths)
  getFileUrl(filePathOrBase64: string): string {
    // If it's already a base64 data URL, return as-is
    if (filePathOrBase64.startsWith('data:')) {
      return filePathOrBase64;
    }
    
    // If it's a file path, return as-is (in development)
    // In production, this would be converted to a proper URL
    return filePathOrBase64;
  }

  // Initialize file service and migrate existing files
  async initialize(): Promise<void> {
    try {
      // Run migration on startup
      await this.migrateExistingFiles();
      console.log('File service initialized and migration completed');
    } catch (error) {
      console.error('Error initializing file service:', error);
    }
  }
}

export const fileUploadService = new FileUploadService();