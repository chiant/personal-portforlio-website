import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowUp, Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';
import { ProfileData } from '../../../types';

interface FooterProps {
  profileData: ProfileData;
}

const Footer: React.FC<FooterProps> = ({ profileData }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  // Function to check if a section has data (same logic as Header)
  const hasSectionData = (section: string) => {
    switch (section) {
      case 'about':
        return profileData.coreCompetencies.competencies.length > 0;
      case 'experience':
        return profileData.workExperience.positions.length > 0;
      case 'education':
        return profileData.education.degrees.length > 0;
      case 'certifications':
        return profileData.certifications.certifications.length > 0;
      case 'skills':
        return profileData.technicalSkills.skills.length > 0;
      case 'contact':
        return (profileData.contactInfo.email && profileData.contactInfo.email.trim() !== '') ||
               (profileData.contactInfo.phone && profileData.contactInfo.phone.trim() !== '') ||
               (profileData.personalInfo.location && 
                (profileData.personalInfo.location.city || 
                 profileData.personalInfo.location.province || 
                 profileData.personalInfo.location.country));
      default:
        return false;
    }
  };

  // Generate quick links based on available data
  const quickLinks = [
    { label: 'Competencies', href: '#about', section: 'about' },
    { label: 'Experience', href: '#experience', section: 'experience' },
    { label: 'Education', href: '#education', section: 'education' },
    { label: 'Certifications', href: '#certifications', section: 'certifications' },
    { label: 'Skills', href: '#skills', section: 'skills' },
    { label: 'Contact', href: '#contact', section: 'contact' },
  ].filter(link => hasSectionData(link.section));

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-max">
        {/* Main Footer Content */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold mb-4">
                  {profileData.personalInfo.preferredName || profileData.personalInfo.fullName}
                </h3>
                <p className="text-secondary-300 mb-6 max-w-md leading-relaxed">
                  {profileData.personalInfo.title}
                </p>
                
                {/* Contact Info */}
                <div className="space-y-4 pl-2">
                  <div className="flex items-center space-x-4">
                    <Mail className="w-5 h-5 text-primary-400" />
                    <a
                      href={`mailto:${profileData.contactInfo.email}`}
                      className="text-secondary-300 hover:text-white transition-colors"
                    >
                      {profileData.contactInfo.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Phone className="w-5 h-5 text-primary-400" />
                    <a
                      href={`tel:${profileData.contactInfo.phone}`}
                      className="text-secondary-300 hover:text-white transition-colors"
                    >
                      {profileData.contactInfo.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-5 h-5 text-primary-400" />
                    <span className="text-secondary-300">
                      {profileData.personalInfo.location.city}, {profileData.personalInfo.location.province}, {profileData.personalInfo.location.country}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            {quickLinks.length > 0 && (
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                  <ul className="space-y-4 pl-2">
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleNavClick(link.href)}
                          className="text-secondary-300 hover:text-white transition-colors duration-200"
                        >
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            )}

            {/* Social Media */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-lg font-semibold mb-6">Connect</h4>
                <div className="space-y-4 pl-2">
                  {profileData.contactInfo.socialMedia.linkedin && (
                    <a
                      href={profileData.contactInfo.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4 text-secondary-300 hover:text-white transition-colors duration-200"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  
                  {profileData.contactInfo.socialMedia.github && (
                    <a
                      href={profileData.contactInfo.socialMedia.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-4 text-secondary-300 hover:text-white transition-colors duration-200"
                    >
                      <Github className="w-5 h-5" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 text-secondary-400"
            >
              <span>© {currentYear} {profileData.personalInfo.preferredName || profileData.personalInfo.fullName}. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>and modern web technologies.</span>
            </motion.div>

            {/* Back to Top Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onClick={scrollToTop}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Back to Top</span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
