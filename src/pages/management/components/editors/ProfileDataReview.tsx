import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Mail, 
  Image, 
  Eye, 
  Edit, 
  Save, 
  X,
  Calendar,
  MapPin,
  ExternalLink,
  Tag
} from 'lucide-react';
import { ProfileData } from '../../../../types';

interface ProfileDataReviewProps {
  profileData: ProfileData;
  onUpdate: (profileData: ProfileData) => void;
}

const ProfileDataReview: React.FC<ProfileDataReviewProps> = ({ profileData, onUpdate }) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateRange = (startDate: string, endDate: string | null) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    return `${start} - ${end}`;
  };

  const handleEditSection = (section: string, data: any) => {
    setEditingSection(section);
    setEditData(data);
  };

  const handleSaveSection = () => {
    if (editingSection && editData) {
      const updatedProfileData = {
        ...profileData,
        [editingSection]: editData
      };
      onUpdate(updatedProfileData);
      setEditingSection(null);
      setEditData(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditData(null);
  };

  const renderPersonalInfo = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <User className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Personal Information
          </h3>
        </div>
        <button
          onClick={() => handleEditSection('personalInfo', profileData.personalInfo)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-600 dark:text-white mb-1">
            Full Name
          </label>
          <p className="text-secondary-900 dark:text-white font-medium">
            {profileData.personalInfo.fullName}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-600 dark:text-white mb-1">
            Preferred Name
          </label>
          <p className="text-secondary-900 dark:text-white font-medium">
            {profileData.personalInfo.preferredName || profileData.personalInfo.fullName}
          </p>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-600 dark:text-white mb-1">
            Professional Title
          </label>
          <p className="text-secondary-900 dark:text-white font-medium">
            {profileData.personalInfo.title}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-600 dark:text-white mb-1">
            Location
          </label>
          <p className="text-secondary-900 dark:text-white">
            {profileData.personalInfo.location.city}, {profileData.personalInfo.location.province}, {profileData.personalInfo.location.country}
          </p>
        </div>
        {profileData.personalInfo.pronouns && (
          <div>
            <label className="block text-sm font-medium text-secondary-600 dark:text-white mb-1">
              Pronouns
            </label>
            <p className="text-secondary-900 dark:text-white">
              {profileData.personalInfo.pronouns}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
          Professional Summary
        </h3>
        <button
          onClick={() => handleEditSection('summary', profileData.summary)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>
      
      <p className="text-secondary-700 dark:text-white leading-relaxed">
        {profileData.summary.professionalSummary}
      </p>
    </div>
  );

  const renderWorkExperience = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Briefcase className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Work Experience ({profileData.workExperience.positions.length} positions)
          </h3>
        </div>
        <button
          onClick={() => handleEditSection('workExperience', profileData.workExperience)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {profileData.workExperience.positions.slice(0, 3).map((position, index) => (
          <div key={index} className="p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-secondary-900 dark:text-white">
                  {position.title}
                </h4>
                <p className="text-primary-600 font-medium">{position.company}</p>
              </div>
              {position.isCurrent && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Current
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-secondary-600 dark:text-white mb-2">
              {position.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{position.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDateRange(position.startDate, position.endDate)}</span>
              </div>
            </div>
            
            <p className="text-secondary-700 dark:text-white text-sm">
              {position.description}
            </p>
            
            {position.achievements && position.achievements.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-secondary-900 dark:text-white mb-1">
                  Key Achievements:
                </p>
                <ul className="text-sm text-secondary-700 dark:text-white space-y-1">
                  {position.achievements.slice(0, 2).map((achievement, achIndex) => (
                    <li key={achIndex} className="flex items-start space-x-2">
                      <span className="text-primary-600 mt-1">•</span>
                      <span>
                        <span className="font-medium">{achievement.title}:</span> {achievement.description}
                      </span>
                    </li>
                  ))}
                  {position.achievements.length > 2 && (
                    <li className="text-secondary-500 italic">
                      +{position.achievements.length - 2} more achievements
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
        {profileData.workExperience.positions.length > 3 && (
          <p className="text-center text-secondary-500 text-sm">
            +{profileData.workExperience.positions.length - 3} more positions
          </p>
        )}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <GraduationCap className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Education ({profileData.education.degrees.length} degrees)
          </h3>
        </div>
        <button
          onClick={() => handleEditSection('education', profileData.education)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {profileData.education.degrees.map((degree, index) => (
          <div key={index} className="p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
            <h4 className="font-semibold text-secondary-900 dark:text-white">
              {degree.degree}
            </h4>
            <p className="text-primary-600 font-medium">{degree.institution}</p>
            <div className="flex items-center space-x-4 text-sm text-secondary-600 dark:text-white mt-1">
              {degree.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{degree.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDateRange(degree.startDate, degree.endDate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Award className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Certifications ({profileData.certifications.certifications.length} certifications)
          </h3>
        </div>
        <button
          onClick={() => handleEditSection('certifications', profileData.certifications)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-3">
        {profileData.certifications.certifications.slice(0, 6).map((cert, index) => (
          <div key={index} className="p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-secondary-900 dark:text-white text-sm">
                {cert.name}
              </h4>
              <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                {cert.category}
              </span>
            </div>
            <p className="text-primary-600 font-medium text-sm">{cert.issuer}</p>
            <p className="text-secondary-600 dark:text-white text-xs mt-1">
              Issued: {formatDate(cert.issueDate)}
            </p>
          </div>
        ))}
        {profileData.certifications.certifications.length > 6 && (
          <div className="md:col-span-2 text-center text-secondary-500 text-sm">
            +{profileData.certifications.certifications.length - 6} more certifications
          </div>
        )}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Code className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Technical Skills ({profileData.technicalSkills.skills.length} skills)
          </h3>
        </div>
        <button
          onClick={() => handleEditSection('technicalSkills', profileData.technicalSkills)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {Object.entries(
          profileData.technicalSkills.skills.reduce((acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = [];
            acc[skill.category].push(skill);
            return acc;
          }, {} as Record<string, typeof profileData.technicalSkills.skills>)
        ).map(([category, skills]) => (
          <div key={category}>
            <h4 className="font-medium text-secondary-900 dark:text-white mb-2">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 8).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                >
                  {skill.name}
                  {skill.yearsExperience && (
                    <span className="ml-1 text-primary-600">
                      ({skill.yearsExperience}y)
                    </span>
                  )}
                </span>
              ))}
              {skills.length > 8 && (
                <span className="px-2 py-1 bg-secondary-100 text-secondary-600 text-xs rounded-full">
                  +{skills.length - 8} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Mail className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Contact Information
          </h3>
        </div>
        <button
          onClick={() => handleEditSection('contactInfo', profileData.contactInfo)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-600 dark:text-white mb-1">
            Email
          </label>
          <p className="text-secondary-900 dark:text-white">{profileData.contactInfo.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-600 dark:text-white mb-1">
            Phone
          </label>
          <p className="text-secondary-900 dark:text-white">{profileData.contactInfo.phone}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-600 dark:text-white mb-1">
            Preferred Contact
          </label>
          <p className="text-secondary-900 dark:text-white capitalize">
            {profileData.contactInfo.preferredContactMethod}
          </p>
        </div>
        {profileData.contactInfo.availability && (
          <div>
            <label className="block text-sm font-medium text-secondary-600 dark:text-white mb-1">
              Availability
            </label>
            <p className="text-secondary-900 dark:text-white">{profileData.contactInfo.availability}</p>
          </div>
        )}
      </div>
      
      {Object.values(profileData.contactInfo.socialMedia).some(url => url) && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-secondary-600 dark:text-white mb-2">
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
                  className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full hover:bg-primary-200 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="capitalize">{platform}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderMedia = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Image className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Documents
          </h3>
        </div>
        <button
          onClick={() => handleEditSection('media', profileData.media)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-600 dark:text-white mb-1">
            Profile Photo
          </label>
          <p className="text-secondary-900 dark:text-white">{profileData.media.profilePhoto.url}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-600 dark:text-white mb-1">
            CV Document
          </label>
          <p className="text-secondary-900 dark:text-white">{profileData.media.documents.cvPdf.filename}</p>
          <p className="text-secondary-600 dark:text-white text-sm">
            Last updated: {formatDate(profileData.media.documents.cvPdf.lastUpdated)}
          </p>
        </div>
        
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
            Profile Data Review
          </h3>
          <p className="text-sm text-secondary-600 dark:text-white">
            Review and edit all profile data in one place
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            Last updated: {formatDate(profileData.metadata.lastUpdated)}
          </span>
        </div>
      </div>

      {/* Profile Data Sections */}
      <div className="space-y-6">
        {renderPersonalInfo()}
        {renderSummary()}
        {renderWorkExperience()}
        {renderEducation()}
        {renderCertifications()}
        {renderSkills()}
        {renderContactInfo()}
        {renderMedia()}
      </div>

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Edit {editingSection.charAt(0).toUpperCase() + editingSection.slice(1)}
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-secondary-600 dark:text-white text-sm">
                This will open the detailed editor for this section. Click "Save Changes" to apply your edits.
              </p>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSection}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Open Editor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDataReview;
