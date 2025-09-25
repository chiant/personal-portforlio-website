import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, TrendingUp, Award, Code } from 'lucide-react';
import { ExperienceProps } from '../../../types';
import { formatDateRange, getExperienceYears } from '../../../utils/profileData';

const Experience: React.FC<ExperienceProps> = ({ workExperience }) => {
  const totalExperience = getExperienceYears(workExperience.positions);

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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Don't render if no work experience
  if (!workExperience.positions || workExperience.positions.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="section-padding bg-secondary-50 dark:bg-secondary-900">
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
              Professional Experience
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full mb-4"></div>
          </motion.div>

          {/* Experience Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-600 to-accent-600"></div>

            <div className="space-y-12">
              {workExperience.positions.map((position, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative pl-20"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-6 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-soft z-10"></div>

                  {/* Experience Card */}
                  <div className="card-hover">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
                          {position.title}
                        </h3>
                        <h4 className="text-lg font-semibold text-primary-600 mb-3">
                          {position.company}
                        </h4>
                        
                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600 dark:text-white mb-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateRange(position.startDate, position.endDate)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{position.location}</span>
                          </div>
                          
                          {position.teamSize && (
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>Team of {position.teamSize}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Current Badge */}
                      {position.isCurrent && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                            Current Position
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-secondary-700 dark:text-white mb-6 leading-relaxed">
                      {position.description}
                    </p>

                    {/* Key Achievements */}
                    {position.achievements && position.achievements.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-primary-600" />
                          Key Achievements
                        </h5>
                        
                        <div className="space-y-4">
                          {position.achievements.map((achievement, achievementIndex) => (
                            <div
                              key={achievementIndex}
                              className="p-4 bg-primary-50 dark:bg-primary-900 rounded-lg border border-primary-100 dark:border-primary-700"
                            >
                              <h6 className="font-semibold text-secondary-900 dark:text-white mb-2">
                                {achievement.title}
                              </h6>
                              
                              <p className="text-secondary-700 dark:text-white mb-3">
                                {achievement.description}
                              </p>

                              {/* Technologies */}
                              {achievement.technologies && achievement.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {achievement.technologies.map((tech, techIndex) => (
                                    <span
                                      key={techIndex}
                                      className="skill-tag text-xs"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technologies Used */}
                    {position.technologies && position.technologies.length > 0 && (
                      <div>
                        <h5 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 flex items-center">
                          <Code className="w-5 h-5 mr-2 text-primary-600" />
                          Technologies & Tools
                        </h5>
                        
                        <div className="flex flex-wrap gap-2">
                          {position.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="skill-tag"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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

export default Experience;
