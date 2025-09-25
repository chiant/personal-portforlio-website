import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Save, X, Calendar, Award, ExternalLink } from 'lucide-react';
import { Certification } from '../../types';

interface CertificationsEditorProps {
  certifications: Certification[];
  onUpdate: (certifications: Certification[]) => void;
}

const CertificationsEditor: React.FC<CertificationsEditorProps> = ({ certifications, onUpdate }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Certification>>({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    category: 'Data Science and AI',
    credentialId: '',
    verificationUrl: '',
    badgeUrl: '',
    description: ''
  });

  const categories = [
    'Data Science and AI',
    'Data Engineering',
    'Business Intelligence and Reporting',
    'Programming Languages',
    'Cloud Platforms',
    'Other'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      category: 'Data Science and AI',
      credentialId: '',
      verificationUrl: '',
      badgeUrl: '',
      description: ''
    });
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const handleSave = () => {
    if (!formData.name || !formData.issuer || !formData.issueDate || !formData.category) return;

    const newCertification: Certification = {
      name: formData.name!,
      issuer: formData.issuer!,
      issueDate: formData.issueDate!,
      expiryDate: formData.expiryDate || null,
      category: formData.category as any,
      credentialId: formData.credentialId || '',
      verificationUrl: formData.verificationUrl || '',
      badgeUrl: formData.badgeUrl || '',
      description: formData.description || ''
    };

    if (editingIndex !== null) {
      const updatedCertifications = [...certifications];
      updatedCertifications[editingIndex] = newCertification;
      onUpdate(updatedCertifications);
    } else {
      onUpdate([...certifications, newCertification]);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    const certification = certifications[index];
    setFormData({
      ...certification,
      expiryDate: certification.expiryDate || ''
    });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      const updatedCertifications = certifications.filter((_, i) => i !== index);
      onUpdate(updatedCertifications);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Data Science and AI': 'bg-blue-100 text-blue-800',
      'Data Engineering': 'bg-green-100 text-green-800',
      'Business Intelligence and Reporting': 'bg-purple-100 text-purple-800',
      'Programming Languages': 'bg-orange-100 text-orange-800',
      'Cloud Platforms': 'bg-cyan-100 text-cyan-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
            Certifications
          </h3>
          <p className="text-sm text-secondary-600 dark:text-white">
            Manage your professional certifications and credentials
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Certifications List */}
      <div className="space-y-4">
        {certifications.map((certification, index) => (
          <div key={index} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Award className="w-5 h-5 text-primary-600" />
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">
                    {certification.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(certification.category)}`}>
                    {certification.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-secondary-600 dark:text-white mb-2">
                  <span className="font-medium">{certification.issuer}</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Issued: {new Date(certification.issueDate).toLocaleDateString()}
                      {certification.expiryDate && (
                        <span> • Expires: {new Date(certification.expiryDate).toLocaleDateString()}</span>
                      )}
                    </span>
                  </div>
                </div>
                
                {certification.description && (
                  <p className="text-secondary-700 dark:text-white mb-3">
                    {certification.description}
                  </p>
                )}
                
                {certification.credentialId && (
                  <p className="text-sm text-secondary-600 dark:text-white mb-2">
                    <span className="font-medium">Credential ID:</span> {certification.credentialId}
                  </p>
                )}
                
                <div className="flex items-center space-x-4">
                  {certification.verificationUrl && (
                    <a
                      href={certification.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Verify</span>
                    </a>
                  )}
                  {certification.badgeUrl && (
                    <a
                      href={certification.badgeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      <Award className="w-4 h-4" />
                      <span>View Badge</span>
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(index)}
                  className="btn-secondary flex items-center space-x-1"
                  title="Edit certification"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center space-x-1"
                  title="Delete certification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {editingIndex !== null ? 'Edit Certification' : 'Add New Certification'}
              </h3>
              <button
                onClick={resetForm}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Certification Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., DASCA Certified Senior Data Scientist"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={formData.issuer || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Data Science Council of America (DASCA)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Category *
                </label>
                <select
                  value={formData.category || 'Data Science and AI'}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Credential ID
                </label>
                <input
                  type="text"
                  value={formData.credentialId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, credentialId: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 9984270316"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Verification URL
                </label>
                <input
                  type="url"
                  value={formData.verificationUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, verificationUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://www.credbadge.com/credit/certified/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Badge URL
                </label>
                <input
                  type="url"
                  value={formData.badgeUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, badgeUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://www.credbadge.com/credit/certified/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Brief description of the certification..."
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-secondary-200">
              <button
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name || !formData.issuer || !formData.issueDate || !formData.category}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Certification</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsEditor;
