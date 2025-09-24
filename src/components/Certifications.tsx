import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Calendar, Shield, Filter } from 'lucide-react';
import { CertificationsProps } from '../types';
import { getCertificationsByCategory, getLatestCertifications, formatDate } from '../data/profileData';

const Certifications: React.FC<CertificationsProps> = ({ certifications }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const certificationCategories = getCertificationsByCategory(certifications.certifications);
  const latestCertifications = getLatestCertifications(certifications.certifications, 3);
  
  const allCategories = ['All', ...Object.keys(certificationCategories)];
  
  const filteredCertifications = selectedCategory === 'All' 
    ? certifications.certifications 
    : certificationCategories[selectedCategory] || [];

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Data Science and AI':
        return '🚀';
      case 'Data Engineering':
        return '⚙️';
      case 'Business Intelligence and Reporting':
        return '📊';
      case 'Programming Languages':
        return '💻';
      case 'Cloud Platforms':
        return '☁️';
      default:
        return '🏆';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Data Science and AI':
        return 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700';
      case 'Data Engineering':
        return 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
      case 'Business Intelligence and Reporting':
        return 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'Programming Languages':
        return 'bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700';
      case 'Cloud Platforms':
        return 'bg-cyan-50 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700';
      default:
        return 'bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
    }
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry <= threeMonthsFromNow && expiry > new Date();
  };

  return (
    <section id="certifications" className="section-padding bg-secondary-50 dark:bg-secondary-800">
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
              Professional Certifications
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-secondary-600 dark:text-white">
              Industry-recognized credentials validating expertise and continuous learning
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Filter className="w-5 h-5 text-secondary-600 dark:text-white" />
              <span className="text-sm font-medium text-secondary-700 dark:text-white">Filter by category:</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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

          {/* Certifications Grid */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCategory} 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {filteredCertifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="certification-badge group"
                  >
                    {/* Header with Verify Link */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-1">
                          <h4 className="text-sm font-semibold text-secondary-900 dark:text-white mb-0 group-hover:text-primary-600 transition-colors leading-tight">
                            {cert.name}
                          </h4>
                          <p className="text-xs text-secondary-600 dark:text-white">
                            {cert.issuer}
                          </p>
                        </div>
                        
                        {/* Verify Link */}
                        <div className="flex-shrink-0">
                          <a
                            href={cert.verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-xs font-medium transition-colors group-hover:underline"
                          >
                            <span>Verify</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Category and Date at Bottom */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(cert.category)}`}>
                          {cert.category}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-secondary-500">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{formatDate(cert.issueDate)}</span>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;