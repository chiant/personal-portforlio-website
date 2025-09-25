import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  File, 
  Image, 
  X, 
  Check, 
  AlertCircle, 
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { fileUploadService, UploadedFile } from '../../services/fileUploadService';

interface FileUploadProps {
  type: 'cv' | 'image';
  currentFile?: UploadedFile | null;
  onFileUploaded: (file: UploadedFile) => void;
  onFileRemoved: () => void;
  profileId?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  type,
  currentFile,
  onFileUploaded,
  onFileRemoved,
  profileId,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    // Validate file
    const validation = fileUploadService.validateFile(file, type);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      setIsUploading(false);
      return;
    }

    try {
      const result = await fileUploadService.uploadFile(file, profileId);
      
      if (result.success && result.file) {
        onFileUploaded(result.file);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    if (currentFile) {
      fileUploadService.deleteFile(currentFile.id);
      onFileRemoved();
    }
  };

  const handleDownloadFile = () => {
    if (currentFile) {
      const link = document.createElement('a');
      link.href = currentFile.url;
      link.download = currentFile.originalName;
      link.click();
    }
  };

  const getAcceptTypes = () => {
    if (type === 'cv') {
      return '.pdf,.docx,.doc,.txt';
    }
    return '.jpg,.jpeg,.png,.webp,.gif';
  };

  const getFileTypeIcon = () => {
    if (type === 'cv') {
      return <File className="w-8 h-8 text-primary-600" />;
    }
    return <Image className="w-8 h-8 text-primary-600" />;
  };

  const getFileTypeLabel = () => {
    if (type === 'cv') {
      return 'CV Document';
    }
    return 'Profile Photo';
  };

  const getFileTypeDescription = () => {
    if (type === 'cv') {
      return 'Upload PDF, DOCX, DOC, or TXT files (max 10MB)';
    }
    return 'Upload JPEG, PNG, WebP, or GIF files (max 10MB)';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current File Display */}
      {currentFile && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {fileUploadService.getFileTypeIcon(currentFile.type)}
              </div>
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  {currentFile.originalName}
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {fileUploadService.formatFileSize(currentFile.size)} • 
                  Uploaded {new Date(currentFile.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadFile}
                className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                title="Download file"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!currentFile && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-400 dark:hover:border-primary-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptTypes()}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          
          <div className="space-y-4">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-secondary-600 dark:text-white">
                  Uploading file...
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  {getFileTypeIcon()}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                    Upload {getFileTypeLabel()}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-white mb-4">
                    {getFileTypeDescription()}
                  </p>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary flex items-center space-x-2 mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                  </button>
                  
                  <p className="text-xs text-secondary-500 dark:text-white mt-2">
                    or drag and drop your file here
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload Another File Button */}
      {currentFile && (
        <div className="text-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary flex items-center space-x-2 mx-auto"
            disabled={isUploading}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Different File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptTypes()}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-800 dark:text-green-200">
            File uploaded successfully!
          </span>
        </motion.div>
      )}

      {/* Error Message */}
      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-800 dark:text-red-200">
            {uploadError}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
