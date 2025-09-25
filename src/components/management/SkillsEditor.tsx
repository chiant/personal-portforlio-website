import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Save, X, Code } from 'lucide-react';
import { TechnicalSkill } from '../../types';

interface SkillsEditorProps {
  skills: TechnicalSkill[];
  onUpdate: (skills: TechnicalSkill[]) => void;
}

const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills, onUpdate }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<TechnicalSkill>>({
    name: '',
    category: 'Programming Languages',
    yearsExperience: undefined
  });

  const categories = [
    'Programming Languages',
    'Data Science & ML',
    'Cloud Platforms',
    'Databases',
    'Tools & Frameworks',
    'Operating Systems',
    'Other'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Programming Languages',
      yearsExperience: undefined
    });
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category) return;

    const newSkill: TechnicalSkill = {
      name: formData.name!,
      category: formData.category as any,
      yearsExperience: formData.yearsExperience
    };

    if (editingIndex !== null) {
      const updatedSkills = [...skills];
      updatedSkills[editingIndex] = newSkill;
      onUpdate(updatedSkills);
    } else {
      onUpdate([...skills, newSkill]);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    const skill = skills[index];
    setFormData(skill);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      const updatedSkills = skills.filter((_, i) => i !== index);
      onUpdate(updatedSkills);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Programming Languages': 'bg-blue-100 text-blue-800',
      'Data Science & ML': 'bg-green-100 text-green-800',
      'Cloud Platforms': 'bg-purple-100 text-purple-800',
      'Databases': 'bg-orange-100 text-orange-800',
      'Tools & Frameworks': 'bg-cyan-100 text-cyan-800',
      'Operating Systems': 'bg-pink-100 text-pink-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const getSkillsByCategory = () => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, TechnicalSkill[]>);
  };

  const skillsByCategory = getSkillsByCategory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
            Technical Skills
          </h3>
          <p className="text-sm text-secondary-600 dark:text-white">
            Manage your technical skills and proficiencies
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Skills by Category */}
      <div className="space-y-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category} className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Code className="w-5 h-5 text-primary-600" />
              <h4 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {category}
              </h4>
              <span className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs font-medium rounded-full">
                {categorySkills.length} skills
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categorySkills.map((skill, index) => {
                const globalIndex = skills.findIndex(s => s === skill);
                return (
                  <div key={globalIndex} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-secondary-900 dark:text-white">
                          {skill.name}
                        </span>
                        {skill.yearsExperience && (
                          <span className="text-xs text-secondary-600 dark:text-white">
                            ({skill.yearsExperience} years)
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEdit(globalIndex)}
                        className="p-1 text-secondary-400 hover:text-secondary-600"
                        title="Edit skill"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(globalIndex)}
                        className="p-1 text-red-400 hover:text-red-600"
                        title="Delete skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {editingIndex !== null ? 'Edit Skill' : 'Add New Skill'}
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
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Python"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Category *
                </label>
                <select
                  value={formData.category || 'Programming Languages'}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsExperience || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 5"
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
                disabled={!formData.name || !formData.category}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Skill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsEditor;
