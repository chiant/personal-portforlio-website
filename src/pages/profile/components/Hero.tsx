import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin, ArrowDown, Linkedin, Github } from 'lucide-react';
import { HeroProps } from '../../../types';

const Hero: React.FC<HeroProps> = ({ personalInfo, summary, media, contactInfo }) => {
  const downloadCV = async () => {
    if (!media.documents.cvPdf.url) return;
    
    try {
      // Add download=true query parameter to force download behavior
      const downloadUrl = media.documents.cvPdf.url + (media.documents.cvPdf.url.includes('?') ? '&' : '?') + 'download=true';
      
      // Fetch the file as a blob to force download
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      // Use custom download filename if set, otherwise use backend filename
      link.download = media.documents.cvPdf.description || media.documents.cvPdf.filename || 'cv-document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link if fetch fails
      window.open(media.documents.cvPdf.url, '_blank');
    }
  };

  // Check if CV file is available
  const hasCVFile = media.documents.cvPdf.url && media.documents.cvPdf.url.trim() !== '';

  // Check if profile photo is available, use default if not
  const hasProfilePhoto = media.profilePhoto.url && media.profilePhoto.url.trim() !== '';
  const profilePhotoSrc = hasProfilePhoto ? media.profilePhoto.url : '/icons/gender-neutral-user.svg';
  const profilePhotoAlt = hasProfilePhoto ? 'Profile photo' : 'Default profile avatar';

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-800 dark:via-secondary-900 dark:to-secondary-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-max section-padding relative z-10">
        <div className="grid lg:grid-cols-[70%_30%] gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-primary-600 font-medium mb-4"
            >
              Hello, I'm
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 dark:text-white mb-4"
            >
              {personalInfo.preferredName || personalInfo.fullName}
            </motion.h1>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg sm:text-xl text-gradient font-semibold mb-6"
            >
              {personalInfo.title}
            </motion.div>

            {/* Location */}
            {(personalInfo.location.city || personalInfo.location.province || personalInfo.location.country) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-center justify-center lg:justify-start space-x-2 text-secondary-600 dark:text-white mb-8"
              >
                <MapPin className="w-5 h-5" />
                <span>
                  {[personalInfo.location.city, personalInfo.location.province, personalInfo.location.country]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </motion.div>
            )}

            {/* Summary */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-base text-secondary-700 dark:text-white mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {summary.professionalSummary}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={downloadCV}
                disabled={!hasCVFile}
                className={`flex items-center justify-center space-x-2 ${
                  hasCVFile 
                    ? 'btn-primary' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                }`}
                title={hasCVFile ? 'Download CV' : 'No CV file available'}
              >
                <Download className="w-5 h-5" />
                <span>Download CV</span>
              </button>
              
              <a
                href="#contact"
                className="btn-outline flex items-center justify-center space-x-2"
                onClick={(e) => {
                  e.preventDefault();
                  const contactSection = document.querySelector('#contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Mail className="w-5 h-5" />
                <span>Get In Touch</span>
              </a>
            </motion.div>

            {/* Contact & Social Media Links */}
            {(contactInfo.email || contactInfo.socialMedia.linkedin || contactInfo.socialMedia.github) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="mt-8 flex gap-4 justify-center lg:justify-start"
              >
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center justify-center w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors duration-300 hover:scale-110"
                    title="Email Contact"
                  >
                    <Mail className="w-6 h-6" />
                  </a>
                )}
                
                {contactInfo.socialMedia.linkedin && (
                  <a
                    href={contactInfo.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300 hover:scale-110"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
                
                {contactInfo.socialMedia.github && (
                  <a
                    href={contactInfo.socialMedia.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-colors duration-300 hover:scale-110"
                    title="GitHub Profile"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Image Container */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-full overflow-hidden shadow-strong border-4 border-white"
              >
                <img
                  src={profilePhotoSrc}
                  alt={profilePhotoAlt}
                  className={`w-full h-full ${hasProfilePhoto ? 'object-cover' : 'object-contain p-8 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900'}`}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent" />
              </motion.div>

            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={scrollToAbout}
            className="flex flex-col items-center space-y-2 text-secondary-600 dark:text-white hover:text-primary-600 transition-colors group"
          >
            <span className="text-sm font-medium">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-6 h-6 group-hover:text-primary-600 transition-colors" />
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
