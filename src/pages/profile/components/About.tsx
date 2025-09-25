import React from 'react';
import { motion } from 'framer-motion';
import { AboutProps } from '../../../types';

const About: React.FC<AboutProps> = ({ coreCompetencies }) => {
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

  // Don't render if no competencies
  if (!coreCompetencies.competencies || coreCompetencies.competencies.length === 0) {
    return null;
  }

  return (
    <section id="about" className="section-padding bg-white dark:bg-secondary-900">
      <div className="container-max">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Core Competencies
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full"></div>
          </motion.div>



          {/* Core Competencies */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <div className="flex flex-wrap gap-3">
                {coreCompetencies.competencies.map((competency, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full border border-secondary-200 dark:border-secondary-600 transition-all duration-200 hover:shadow-soft hover:border-primary-200 dark:hover:border-primary-400"
                  >
                    <span className="text-sm font-medium text-secondary-700 dark:text-white">
                      {competency.name}
                    </span>
                    {competency.yearsExperience && (
                      <span className="text-xs text-secondary-500 dark:text-white bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
                        {competency.yearsExperience}+ years
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default About;
