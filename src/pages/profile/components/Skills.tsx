import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Filter } from 'lucide-react';
import { SkillsProps } from '../../../types';
import { getSkillsByCategory } from '../../../utils/profileData';

const Skills: React.FC<SkillsProps> = ({ technicalSkills }) => {
  // Don't render if no skills
  if (!technicalSkills.skills || technicalSkills.skills.length === 0) {
    return null;
  }

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const skillCategories = getSkillsByCategory(technicalSkills.skills);
  
  const allCategories = ['All', ...Object.keys(skillCategories)];
  
  const filteredSkills = selectedCategory === 'All' 
    ? technicalSkills.skills 
    : skillCategories[selectedCategory] || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };




  return (
    <section id="skills" className="section-padding bg-white dark:bg-secondary-900">
      <div className="container-max">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Technical Skills
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-secondary-600 dark:text-white">
              Comprehensive technical expertise across multiple domains
            </p>
          </motion.div>


          {/* Category Filter */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Filter className="w-5 h-5 text-secondary-600 dark:text-white" />
              <span className="text-sm font-medium text-secondary-700 dark:text-white">Filter by category:</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white shadow-soft'
                      : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-white border border-secondary-200 dark:border-secondary-600 hover:border-primary-200 dark:hover:border-primary-400 hover:text-primary-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Skills List */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCategory} 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
                  {selectedCategory === 'All' ? 'All Technical Skills' : selectedCategory}
                </h3>
                <span className="text-sm text-secondary-500">
                  ({selectedCategory === 'All' ? technicalSkills.skills.length : filteredSkills.length} skills)
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {(selectedCategory === 'All' ? technicalSkills.skills : filteredSkills).map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full border border-secondary-200 dark:border-secondary-600 transition-all duration-200 hover:shadow-soft hover:border-primary-200 dark:hover:border-primary-400"
                  >
                    <span className="text-sm font-medium text-secondary-700 dark:text-white">
                      {skill.name}
                    </span>
                    {skill.yearsExperience && (
                      <span className="text-xs text-secondary-500 dark:text-white bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                        {skill.yearsExperience}+ years
                      </span>
                    )}
                  </div>
                ))}
              </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
