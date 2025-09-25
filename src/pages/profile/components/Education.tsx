import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { EducationProps } from '../../../types';
import { formatDate } from '../../../utils/profileData';

const Education: React.FC<EducationProps> = ({ education }) => {
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

  // Don't render if no education
  if (!education.degrees || education.degrees.length === 0) {
    return null;
  }

  const getDegreeIcon = (degree: string) => {
    if (degree.toLowerCase().includes('master')) {
      return '🎓';
    } else if (degree.toLowerCase().includes('bachelor')) {
      return '📚';
    } else if (degree.toLowerCase().includes('phd') || degree.toLowerCase().includes('doctorate')) {
      return '🎖️';
    }
    return '📖';
  };

  return (
    <section id="education" className="section-padding bg-white dark:bg-secondary-900">
      <div className="container-max">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              Education
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full"></div>
          </motion.div>

          {/* Education Timeline */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {education.degrees.map((degree, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="card-compact"
                >
                  <div className="flex items-start space-x-4">
                    {/* Degree Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center text-xl">
                        {getDegreeIcon(degree.degree)}
                      </div>
                    </div>

                    {/* Degree Information */}
                    <div className="flex-1 relative flex flex-col justify-between">
                      {/* Top content: Degree and Dates */}
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-1">
                            {degree.degree}
                          </h3>
                        </div>
                        {/* Graduation Date */}
                        <div className="flex items-center space-x-1 text-sm text-secondary-600 dark:text-white mt-2 mr-2 px-2 py-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(degree.startDate)} - {formatDate(degree.endDate)}</span>
                        </div>
                      </div>

                      {/* Bottom content: Institution and Location */}
                      <div className="flex items-end justify-between mt-auto mb-2">
                        <h4 className="text-lg font-semibold text-primary-600">
                          {degree.institution}
                        </h4>
                        <div className="flex items-center space-x-1 text-sm text-secondary-600 dark:text-white mr-2 px-2 py-1">
                          <MapPin className="w-4 h-4" />
                          <span>{degree.location}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Education;
