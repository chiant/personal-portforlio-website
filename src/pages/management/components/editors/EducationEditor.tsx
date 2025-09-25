import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Save, X, Calendar, MapPin, GraduationCap } from 'lucide-react';
import { EducationDegree } from '../../../../types';

interface EducationEditorProps {
  degrees: EducationDegree[];
  onUpdate: (degrees: EducationDegree[]) => void;
}

const EducationEditor: React.FC<EducationEditorProps> = ({ degrees, onUpdate }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<EducationDegree>>({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: ''
  });

  const resetForm = () => {
    setFormData({
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: ''
    });
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const handleSave = () => {
    if (!formData.degree || !formData.institution || !formData.startDate || !formData.endDate) return;

    const newDegree: EducationDegree = {
      degree: formData.degree!,
      institution: formData.institution!,
      location: formData.location || '',
      startDate: formData.startDate!,
      endDate: formData.endDate!
    };

    if (editingIndex !== null) {
      const updatedDegrees = [...degrees];
      updatedDegrees[editingIndex] = newDegree;
      onUpdate(updatedDegrees);
    } else {
      onUpdate([...degrees, newDegree]);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    const degree = degrees[index];
    setFormData(degree);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this degree?')) {
      const updatedDegrees = degrees.filter((_, i) => i !== index);
      onUpdate(updatedDegrees);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
            Education
          </h3>
          <p className="text-sm text-secondary-600 dark:text-white">
            Manage your educational background and degrees
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Degree</span>
        </button>
      </div>

      {/* Degrees List */}
      <div className="space-y-4">
        {degrees.map((degree, index) => (
          <div key={index} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <GraduationCap className="w-5 h-5 text-primary-600" />
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">
                    {degree.degree}
                  </h4>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-secondary-600 dark:text-white mb-2">
                  <span className="font-medium">{degree.institution}</span>
                  {degree.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{degree.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(degree.startDate).toLocaleDateString()} - {' '}
                      {new Date(degree.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(index)}
                  className="btn-secondary flex items-center space-x-1"
                  title="Edit degree"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center space-x-1"
                  title="Delete degree"
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
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {editingIndex !== null ? 'Edit Degree' : 'Add New Degree'}
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
                  Degree *
                </label>
                <input
                  type="text"
                  value={formData.degree || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Master in Business Administration"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Institution *
                </label>
                <input
                  type="text"
                  value={formData.institution || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., University of British Columbia"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Vancouver, BC, Canada"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
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
                disabled={!formData.degree || !formData.institution || !formData.startDate || !formData.endDate}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Degree</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationEditor;
