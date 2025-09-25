import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Save, X, Calendar, MapPin, Building } from 'lucide-react';
import { WorkPosition, Achievement } from '../../types';

interface ExperienceEditorProps {
  positions: WorkPosition[];
  onUpdate: (positions: WorkPosition[]) => void;
}

const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ positions, onUpdate }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<WorkPosition>>({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    achievements: [],
    technologies: []
  });

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      achievements: [],
      technologies: []
    });
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const handleSave = () => {
    if (!formData.title || !formData.company || !formData.startDate) return;

    const newPosition: WorkPosition = {
      title: formData.title!,
      company: formData.company!,
      location: formData.location || '',
      startDate: formData.startDate!,
      endDate: formData.isCurrent ? null : formData.endDate || '',
      isCurrent: formData.isCurrent || false,
      description: formData.description || '',
      achievements: formData.achievements || [],
      technologies: formData.technologies || []
    };

    if (editingIndex !== null) {
      const updatedPositions = [...positions];
      updatedPositions[editingIndex] = newPosition;
      onUpdate(updatedPositions);
    } else {
      onUpdate([...positions, newPosition]);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    const position = positions[index];
    setFormData({
      ...position,
      endDate: position.endDate || '',
      isCurrent: position.isCurrent
    });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      const updatedPositions = positions.filter((_, i) => i !== index);
      onUpdate(updatedPositions);
    }
  };

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...(prev.achievements || []), { title: '', description: '', technologies: [] }]
    }));
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: any) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.map((achievement, i) => 
        i === index ? { ...achievement, [field]: value } : achievement
      )
    }));
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index)
    }));
  };

  const addTechnology = () => {
    setFormData(prev => ({
      ...prev,
      technologies: [...(prev.technologies || []), '']
    }));
  };

  const updateTechnology = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.map((tech, i) => i === index ? value : tech)
    }));
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
            Work Experience
          </h3>
          <p className="text-sm text-secondary-600 dark:text-white">
            Manage your professional work experience and achievements
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Positions List */}
      <div className="space-y-4">
        {positions.map((position, index) => (
          <div key={index} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Building className="w-5 h-5 text-primary-600" />
                  <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">
                    {position.title}
                  </h4>
                  {position.isCurrent && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Current
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-secondary-600 dark:text-white mb-2">
                  <span className="font-medium">{position.company}</span>
                  {position.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{position.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(position.startDate).toLocaleDateString()} - {' '}
                      {position.endDate ? new Date(position.endDate).toLocaleDateString() : 'Present'}
                    </span>
                  </div>
                </div>
                
                <p className="text-secondary-700 dark:text-white mb-3">
                  {position.description}
                </p>
                
                {position.achievements && position.achievements.length > 0 && (
                  <div className="mb-3">
                    <h5 className="font-medium text-secondary-900 dark:text-white mb-2">Key Achievements:</h5>
                    <ul className="space-y-2">
                      {position.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="text-sm">
                          <span className="font-medium text-secondary-900 dark:text-white">
                            {achievement.title}:
                          </span>
                          <span className="text-secondary-700 dark:text-white ml-1">
                            {achievement.description}
                          </span>
                          {achievement.technologies && achievement.technologies.length > 0 && (
                            <div className="mt-1">
                              <span className="text-xs text-secondary-500">
                                Technologies: {achievement.technologies.join(', ')}
                              </span>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {position.technologies && position.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {position.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(index)}
                  className="btn-secondary flex items-center space-x-1"
                  title="Edit position"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center space-x-1"
                  title="Delete position"
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
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {editingIndex !== null ? 'Edit Position' : 'Add New Position'}
              </h3>
              <button
                onClick={resetForm}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Senior Data Scientist"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., HSBC"
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
                    placeholder="e.g., Toronto, ON, Canada"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
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
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      disabled={formData.isCurrent}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={formData.isCurrent || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, isCurrent: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isCurrent" className="text-sm font-medium text-secondary-700 dark:text-white">
                  This is my current position
                </label>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Job Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Brief description of your role and responsibilities..."
                />
              </div>
              
              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white">
                    Key Achievements
                  </label>
                  <button
                    onClick={addAchievement}
                    className="btn-secondary flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Achievement</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.achievements?.map((achievement, index) => (
                    <div key={index} className="p-4 border border-secondary-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-secondary-900 dark:text-white">
                          Achievement {index + 1}
                        </h5>
                        <button
                          onClick={() => removeAchievement(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={achievement.title}
                          onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                          placeholder="Achievement title"
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        
                        <textarea
                          value={achievement.description}
                          onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                          placeholder="Achievement description"
                          rows={2}
                          className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                        
                        <div>
                          <label className="block text-xs font-medium text-secondary-600 dark:text-white mb-1">
                            Technologies Used (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={achievement.technologies.join(', ')}
                            onChange={(e) => updateAchievement(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                            placeholder="Python, Machine Learning, SQL"
                            className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Technologies */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-white">
                    Technologies Used
                  </label>
                  <button
                    onClick={addTechnology}
                    className="btn-secondary flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Technology</span>
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.technologies?.map((tech, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-primary-100 px-3 py-1 rounded-full">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => updateTechnology(index, e.target.value)}
                        className="bg-transparent border-none outline-none text-sm"
                        placeholder="Technology name"
                      />
                      <button
                        onClick={() => removeTechnology(index)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
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
                disabled={!formData.title || !formData.company || !formData.startDate}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Position</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceEditor;
