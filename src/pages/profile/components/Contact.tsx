import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Linkedin, Github, ExternalLink, CheckCircle } from 'lucide-react';
import { ContactProps } from '../../../types';
import { dataService } from '../../../services/dataService';

const Contact: React.FC<ContactProps> = ({ contactInfo, media }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Don't render if no contact information
  const hasContactInfo = (contactInfo.email && contactInfo.email.trim() !== '') ||
                        (contactInfo.phone && contactInfo.phone.trim() !== '');

  if (!hasContactInfo) {
    return null;
  }

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Save message using data service
      const result = await dataService.saveMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        ipAddress: '', // Could be captured from request in real app
        userAgent: navigator.userAgent
      });

      if (result.success) {
        setIsSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
      } else {
        setSubmitError(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadCV = async () => {
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

  return (
    <section id="contact" className="section-padding bg-secondary-50 dark:bg-secondary-800">
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
              Get In Touch
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-accent-600 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-secondary-600 dark:text-white max-w-2xl mx-auto">
              Ready to discuss opportunities or collaborate on exciting projects? 
              I'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  {/* Email */}
                  {contactInfo.email && (
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900 dark:text-white mb-1">Email</h4>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {contactInfo.phone && (
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900 dark:text-white mb-1">Phone</h4>
                        <a
                          href={`tel:${contactInfo.phone}`}
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}


                  {/* Availability */}
                  {contactInfo.availability && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">
                          {contactInfo.availability}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="card">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
                  Send Me a Message
                </h3>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                      Message Sent Successfully!
                    </h4>
                    <p className="text-secondary-600 dark:text-white">
                      Thank you for reaching out. I'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {submitError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {submitError}
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="What's this about?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-secondary-700 dark:text-white mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Tell me about your project or opportunity..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
