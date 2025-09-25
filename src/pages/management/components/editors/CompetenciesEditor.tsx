import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CoreCompetencies } from '../../../../types';

interface CompetenciesEditorProps {
  coreCompetencies: CoreCompetencies;
  onUpdate: (coreCompetencies: CoreCompetencies) => void;
}

const CompetenciesEditor: React.FC<CompetenciesEditorProps> = ({ coreCompetencies, onUpdate }) => {
  const [formData, setFormData] = useState<CoreCompetencies>(coreCompetencies);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompetency, setNewCompetency] = useState({ name: '', yearsExperience: 0 });

  const handleNestedInputChange = (index: number, field: string, value: any) => {
    const updatedCompetencies = [...formData.competencies];
    updatedCompetencies[index] = {
      ...updatedCompetencies[index],
      [field]: value
    };
    
    const updatedData = {
      ...formData,
      competencies: updatedCompetencies
    };
    
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const handleAddCompetency = () => {
    if (newCompetency.name.trim()) {
      const updatedCompetencies = [
        ...formData.competencies,
        {
          id: `competency_${Date.now()}`,
          name: newCompetency.name.trim(),
          yearsExperience: newCompetency.yearsExperience
        }
      ];
      
      const updatedData = {
        ...formData,
        competencies: updatedCompetencies
      };
      
      setFormData(updatedData);
      onUpdate(updatedData);
      
      // Reset form
      setNewCompetency({ name: '', yearsExperience: 0 });
      setShowAddModal(false);
    }
  };

  const handleRemoveCompetency = (index: number) => {
    const updatedCompetencies = formData.competencies.filter((_, i) => i !== index);
    
    const updatedData = {
      ...formData,
      competencies: updatedCompetencies
    };
    
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Core Competencies
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
            Manage your core professional competencies and years of experience
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Competency</span>
        </button>
      </div>

      {/* Competencies Grid */}
      {formData.competencies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.competencies.map((competency, index) => (
            <div
              key={`competency-${index}-${competency.name}`}
              className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg p-4 relative"
            >
              {/* Delete Button */}
              <button
                onClick={() => handleRemoveCompetency(index)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Remove competency"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Competency Name */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
                  Competency Name
                </label>
                <input
                  type="text"
                  value={competency.name}
                  onChange={(e) => handleNestedInputChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  placeholder="Enter competency name"
                />
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={competency.yearsExperience}
                  onChange={(e) => handleNestedInputChange(index, 'yearsExperience', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg">
          <div className="text-4xl mb-4">🎯</div>
          <h4 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            No Competencies Added
          </h4>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            Add your core professional competencies to showcase your expertise.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Competency</span>
          </button>
        </div>
      )}

      {/* Add Competency Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-secondary-800 rounded-lg w-full max-w-md p-6">
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Add New Competency
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
                  Competency Name
                </label>
                <input
                  type="text"
                  value={newCompetency.name}
                  onChange={(e) => setNewCompetency({ ...newCompetency, name: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  placeholder="e.g., Data Science, Machine Learning"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-white mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={newCompetency.yearsExperience}
                  onChange={(e) => setNewCompetency({ ...newCompetency, yearsExperience: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCompetency({ name: '', yearsExperience: 0 });
                }}
                className="px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCompetency}
                disabled={!newCompetency.name.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Competency
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetenciesEditor;
