import React, { useState, useRef } from 'react';
import { 
  Eye,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import { Media } from '../../types';
import { backendFileUploadService } from '../../services/backendFileUploadService';

interface MediaEditorProps {
  media: Media;
  onUpdate: (media: Media) => void;
  profileName: string;
  endpoint: string;
  profileId?: string;
}

const MediaEditor: React.FC<MediaEditorProps> = ({ media, onUpdate, endpoint, profileId }) => {
  const [formData, setFormData] = useState<Media>(media);
  const [isUploading, setIsUploading] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const cvFileInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);



  const handleNestedInputChange = (parentField: keyof Media, field: string, value: any) => {
    const updatedData = {
      ...formData,
      [parentField]: {
        ...(formData[parentField] as any),
        [field]: value
      }
    };
    setFormData(updatedData);
    // Auto-save when data changes
    onUpdate(updatedData);
  };


  const isPdfFile = (url: string) => {
    return url.toLowerCase().endsWith('.pdf');
  };

  const handleViewFile = async () => {
    if (!formData.documents.cvPdf.url) return;
    
    if (isPdfFile(formData.documents.cvPdf.url)) {
      // For PDF files, open in a new tab instead of iframe to avoid CORS issues
      window.open(formData.documents.cvPdf.url, '_blank');
    } else {
      // Download non-PDF files
      try {
        // Add download=true query parameter to force download behavior
        const downloadUrl = formData.documents.cvPdf.url + (formData.documents.cvPdf.url.includes('?') ? '&' : '?') + 'download=true';
        
        // Fetch the file as a blob to force download
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error('Download failed');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        // Use custom download filename if set, otherwise use backend filename
        link.download = formData.documents.cvPdf.description || formData.documents.cvPdf.filename || 'cv-document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback to direct link if fetch fails
        window.open(formData.documents.cvPdf.url, '_blank');
      }
    }
  };

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await backendFileUploadService.uploadCV(file, endpoint, profileId);
      if (result.success && result.file) {
        const updatedData = {
          ...formData,
          documents: {
            ...formData.documents,
            cvPdf: {
              url: result.file.url,
              filename: result.file.filename,
              lastUpdated: new Date().toISOString(),
              description: formData.documents.cvPdf.description
            }
          }
        };
        setFormData(updatedData);
        onUpdate(updatedData);
      } else {
        alert(result.error || 'Failed to upload CV file');
      }
    } catch (error) {
      alert('Failed to upload CV file');
    } finally {
      setIsUploading(false);
      if (cvFileInputRef.current) {
        cvFileInputRef.current.value = '';
      }
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await backendFileUploadService.uploadPhoto(file, endpoint, profileId);
      if (result.success && result.file) {
        const updatedData = {
          ...formData,
          profilePhoto: {
            url: result.file.url
          }
        };
        setFormData(updatedData);
        onUpdate(updatedData);
      } else {
        alert(result.error || 'Failed to upload profile photo');
      }
    } catch (error) {
      alert('Failed to upload profile photo');
    } finally {
      setIsUploading(false);
      if (photoFileInputRef.current) {
        photoFileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveCV = () => {
    setShowRemoveConfirm(true);
  };

  const confirmRemoveCV = () => {
    const updatedData = {
      ...formData,
      documents: {
        ...formData.documents,
        cvPdf: {
          url: '',
          filename: '',
          lastUpdated: new Date().toISOString(),
          description: formData.documents.cvPdf.description
        }
      }
    };
    setFormData(updatedData);
    onUpdate(updatedData);
    setShowRemoveConfirm(false);
  };

  const handleRemovePhoto = () => {
    const updatedData = {
      ...formData,
      profilePhoto: {
        url: ''
      }
    };
    setFormData(updatedData);
    onUpdate(updatedData);
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
          Documents
        </h3>
        <p className="text-sm text-secondary-600 dark:text-white">
          Manage your profile photo and documents
        </p>
      </div>

      {/* Profile Photo */}
      <div className="card">
        <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Profile Photo
        </h4>
        
        {/* Photo Preview */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
            Current Photo
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {(() => {
                const hasCustomPhoto = formData.profilePhoto.url && formData.profilePhoto.url.trim() !== '';
                const photoSrc = hasCustomPhoto ? formData.profilePhoto.url : '/icons/gender-neutral-user.svg';
                const photoAlt = hasCustomPhoto ? 'Profile photo' : 'Default profile avatar';
                
                return (
                  <img
                    src={photoSrc}
                    alt={photoAlt}
                    className={`w-24 h-24 rounded-lg border-2 border-secondary-200 dark:border-secondary-600 ${
                      hasCustomPhoto ? 'object-cover' : 'object-contain p-2 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900'
                    }`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-24 h-24 bg-secondary-100 dark:bg-secondary-700 rounded-lg border-2 border-secondary-200 dark:border-secondary-600 flex items-center justify-center"><span class="text-secondary-400 text-xs">Image not found</span></div>';
                      }
                    }}
                  />
                );
              })()}
            </div>
            <div className="flex-1">
              <p className="text-sm text-secondary-600 dark:text-white">
                <span className="font-medium">Status:</span> {formData.profilePhoto.url && formData.profilePhoto.url.trim() !== '' ? '✓ Custom photo' : '⚙️ Default avatar'}
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                {formData.profilePhoto.url && formData.profilePhoto.url.trim() !== '' 
                  ? 'Custom profile photo uploaded'
                  : 'Using default gender-neutral avatar'
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
            Upload Profile Photo
          </label>
          <div className="flex items-center space-x-4">
            <input
              ref={photoFileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              onClick={() => photoFileInputRef.current?.click()}
              disabled={isUploading}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Choose Photo'}</span>
            </button>
            {formData.profilePhoto.url && formData.profilePhoto.url.trim() !== '' && (
              <button
                onClick={handleRemovePhoto}
                className="btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            )}
          </div>
          <p className="text-xs text-secondary-500 mt-2">
            Supported formats: JPEG, PNG, WebP, GIF (max 10MB)
          </p>
        </div>
      </div>

      {/* Documents */}
      <div className="card">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">
            CV Document
          </h4>
        </div>
        
        {/* CV Document Status */}
        {formData.documents.cvPdf.url && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-secondary-600 dark:text-white">
                    <span className="font-medium">Status:</span> ✓ Configured
                  </p>
                    <p className="text-xs text-secondary-500 mt-1 truncate">
                      Server Filename: {formData.documents.cvPdf.filename}
                    </p>
                  {formData.documents.cvPdf.lastUpdated && (
                    <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                      Updated: {new Date(formData.documents.cvPdf.lastUpdated).toLocaleString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleViewFile}
                  className="btn-secondary flex items-center space-x-2 text-sm px-3 py-2 ml-2"
                >
                  {isPdfFile(formData.documents.cvPdf.url) ? (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
              <button
                onClick={handleRemoveCV}
                className="btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center space-x-1 text-xs px-2 py-2 ml-6"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        )}
        
        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
            Upload a New CV Document
          </label>
          <div className="flex items-center space-x-4">
            <input
              ref={cvFileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleCVUpload}
              className="hidden"
            />
            <button
              onClick={() => cvFileInputRef.current?.click()}
              disabled={isUploading}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Choose CV File'}</span>
            </button>
          </div>
          <p className="text-xs text-secondary-500 mt-2">
            Supported formats: PDF, DOCX, DOC, TXT (max 10MB)
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
              Set CV Download File Name
            </label>
            <input
              type="text"
              value={formData.documents.cvPdf.description || ''}
              onChange={(e) => handleNestedInputChange('documents', 'cvPdf', { ...formData.documents.cvPdf, description: e.target.value })}
              className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., John_Smith_Resume.pdf (optional - leave blank to use backend filename)"
            />
            <p className="text-xs text-secondary-500 mt-1">
              Optional: Set a custom filename for downloads. If not set, the system will use the backend filename.
            </p>
          </div>
        </div>
      </div>

      {/* Remove CV Confirmation Dialog */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-3">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Remove CV Document
              </h3>
            </div>
            <p className="text-secondary-600 dark:text-white mb-6">
              Are you sure you want to remove the CV document? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="btn-outline px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveCV}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MediaEditor;
