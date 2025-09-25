import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Calendar,
  Mail,
  Phone,
  Linkedin,
  Github,
  Twitter,
  Globe,
  Plus,
  Trash2,
  Edit,
  X
} from 'lucide-react';
import { PersonalInfo, Summary, ContactInfo } from '../../../../types';

interface PersonalInfoEditorProps {
  personalInfo: PersonalInfo;
  summary: Summary;
  contactInfo: ContactInfo;
  onUpdate: (data: { personalInfo: PersonalInfo; summary: Summary; contactInfo: ContactInfo }) => void;
}

const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({
  personalInfo,
  summary,
  contactInfo,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    personalInfo,
    summary,
    contactInfo
  });
  const [editingSocial, setEditingSocial] = useState<string | null>(null);
  const [newSocialType, setNewSocialType] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  const socialMediaTypes = [
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { key: 'github', label: 'GitHub', icon: Github },
    { key: 'twitter', label: 'Twitter', icon: Twitter },
    { key: 'website', label: 'Website', icon: Globe }
  ];

  const handleInputChange = (section: string, field: string, value: any) => {
    const updatedData = {
      ...formData,
      [section]: {
        ...formData[section as keyof typeof formData],
        [field]: value
      }
    };
    setFormData(updatedData);
    // Auto-save when data changes
    onUpdate(updatedData);
  };

  const handleNestedInputChange = (section: string, parentField: string, field: string, value: any) => {
    const updatedData = {
      ...formData,
      [section]: {
        ...formData[section as keyof typeof formData],
        [parentField]: {
          ...(formData[section as keyof typeof formData] as any)[parentField],
          [field]: value
        }
      }
    };
    setFormData(updatedData);
    // Auto-save when data changes
    onUpdate(updatedData);
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    const updatedData = {
      ...formData,
      contactInfo: {
        ...formData.contactInfo,
        socialMedia: {
          ...formData.contactInfo.socialMedia,
          [platform]: value
        }
      }
    };
    setFormData(updatedData);
    // Auto-save when data changes
    onUpdate(updatedData);
  };

  const handleAddSocialMedia = () => {
    if (newSocialType && newSocialUrl) {
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          socialMedia: {
            ...prev.contactInfo.socialMedia,
            [newSocialType]: newSocialUrl
          }
        }
      }));
      setNewSocialType('');
      setNewSocialUrl('');
    }
  };

  const handleRemoveSocialMedia = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        socialMedia: {
          ...prev.contactInfo.socialMedia,
          [platform]: undefined
        }
      }
    }));
  };

  const getSocialIcon = (platform: string) => {
    const socialType = socialMediaTypes.find(type => type.key === platform);
    return socialType ? socialType.icon : Globe;
  };

  const getSocialLabel = (platform: string) => {
    const socialType = socialMediaTypes.find(type => type.key === platform);
    return socialType ? socialType.label : platform;
  };

  const availableSocialTypes = socialMediaTypes.filter(
    type => !formData.contactInfo.socialMedia[type.key as keyof typeof formData.contactInfo.socialMedia]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Personal Information */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Personal Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.personalInfo.fullName}
              onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Preferred Name
            </label>
            <input
              type="text"
              value={formData.personalInfo.preferredName || ''}
              onChange={(e) => handleInputChange('personalInfo', 'preferredName', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
              placeholder="Enter your preferred name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Pronouns
            </label>
            <input
              type="text"
              value={formData.personalInfo.pronouns || ''}
              onChange={(e) => handleInputChange('personalInfo', 'pronouns', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
              placeholder="e.g., he/him, she/her, they/them"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Professional Title
            </label>
            <input
              type="text"
              value={formData.personalInfo.title || ''}
              onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
              placeholder="e.g., Software Engineer, Data Scientist"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              City
            </label>
            <input
              type="text"
              value={formData.personalInfo.location?.city || ''}
              onChange={(e) => handleNestedInputChange('personalInfo', 'location', 'city', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
              placeholder="Enter your city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Province/State
            </label>
            <input
              type="text"
              value={formData.personalInfo.location?.province || ''}
              onChange={(e) => handleNestedInputChange('personalInfo', 'location', 'province', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
              placeholder="Enter your province or state"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
              Country
            </label>
            <input
              type="text"
              value={formData.personalInfo.location?.country || ''}
              onChange={(e) => handleNestedInputChange('personalInfo', 'location', 'country', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
              placeholder="Enter your country"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Mail className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Contact Information
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
                placeholder="(123) 456-7890"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
            Preferred Contact Method
          </label>
          <select
            value={formData.contactInfo.preferredContactMethod}
            onChange={(e) => handleInputChange('contactInfo', 'preferredContactMethod', e.target.value)}
            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
            Availability Status
          </label>
          <input
            type="text"
            value={formData.contactInfo.availability || ''}
            onChange={(e) => handleInputChange('contactInfo', 'availability', e.target.value)}
            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
            placeholder="e.g., Available for new opportunities"
          />
        </div>
      </div>

      {/* Social Media Profiles */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Social Media Profiles
          </h4>
          {availableSocialTypes.length > 0 && (
            <button
              onClick={() => setEditingSocial('new')}
              className="btn-secondary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Profile</span>
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {Object.entries(formData.contactInfo.socialMedia).map(([platform, url]) => {
            if (!url) return null;
            const Icon = getSocialIcon(platform);
            
            return (
              <div key={platform} className="flex items-center space-x-4 p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                <div className="flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-secondary-900 dark:text-white">
                      {getSocialLabel(platform)}
                    </span>
                    <span className="text-sm text-secondary-600 dark:text-white">
                      {url}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingSocial(platform)}
                    className="p-2 text-secondary-400 hover:text-secondary-600"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveSocialMedia(platform)}
                    className="p-2 text-red-400 hover:text-red-600"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Professional Summary */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Professional Summary
          </h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
            Summary *
          </label>
          <textarea
            value={formData.summary.professionalSummary}
            onChange={(e) => handleInputChange('summary', 'professionalSummary', e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
            placeholder="Write a brief professional summary highlighting your key skills, experience, and career objectives..."
          />
        </div>
      </div>

      {/* Add/Edit Social Media Modal */}
      {editingSocial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {editingSocial === 'new' ? 'Add Social Media Profile' : 'Edit Social Media Profile'}
              </h3>
              <button
                onClick={() => {
                  setEditingSocial(null);
                  setNewSocialType('');
                  setNewSocialUrl('');
                }}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {editingSocial === 'new' ? (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                    Platform
                  </label>
                  <select
                    value={newSocialType}
                    onChange={(e) => setNewSocialType(e.target.value)}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
                  >
                    <option value="">Select platform</option>
                    {availableSocialTypes.map(type => (
                      <option key={type.key} value={type.key}>{type.label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                    Platform
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                    {React.createElement(getSocialIcon(editingSocial), { className: "w-5 h-5 text-primary-600" })}
                    <span className="font-medium text-secondary-900 dark:text-white">
                      {getSocialLabel(editingSocial)}
                    </span>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={editingSocial === 'new' ? newSocialUrl : formData.contactInfo.socialMedia[editingSocial as keyof typeof formData.contactInfo.socialMedia] || ''}
                  onChange={(e) => {
                    if (editingSocial === 'new') {
                      setNewSocialUrl(e.target.value);
                    } else {
                      handleSocialMediaChange(editingSocial, e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-900 dark:border-secondary-700 dark:text-white"
                  placeholder="https://..."
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-secondary-200">
              <button
                onClick={() => {
                  setEditingSocial(null);
                  setNewSocialType('');
                  setNewSocialUrl('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingSocial === 'new') {
                    handleAddSocialMedia();
                  }
                  setEditingSocial(null);
                  setNewSocialType('');
                  setNewSocialUrl('');
                }}
                disabled={editingSocial === 'new' ? (!newSocialType || !newSocialUrl) : !formData.contactInfo.socialMedia[editingSocial as keyof typeof formData.contactInfo.socialMedia]}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingSocial === 'new' ? 'Add Profile' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PersonalInfoEditor;