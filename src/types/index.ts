// Profile data types based on the JSON schema
export interface PersonalInfo {
  fullName: string;
  preferredName: string;
  title: string;
  location: {
    city: string;
    province: string;
    country: string;
  };
  pronouns?: string;
  languages?: Array<{
    language: string;
    proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
  }>;
}

export interface Summary {
  professionalSummary: string;
}

export interface Competency {
  name: string;
  yearsExperience?: number;
}

export interface CoreCompetencies {
  competencies: Competency[];
}

export interface Achievement {
  title: string;
  description: string;
  technologies?: string[];
}

export interface WorkPosition {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  achievements: Achievement[];
  technologies?: string[];
  teamSize?: number;
  reportingTo?: string;
}

export interface WorkExperience {
  positions: WorkPosition[];
}

export interface EducationDegree {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Education {
  degrees: EducationDegree[];
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  category: 'Data Science and AI' | 'Data Engineering' | 'Business Intelligence and Reporting' | 'Programming Languages' | 'Cloud Platforms' | 'Other';
  credentialId: string;
  verificationUrl: string;
  badgeUrl: string;
  description: string;
}

export interface Certifications {
  certifications: Certification[];
}

export interface TechnicalSkill {
  name: string;
  category: 'Programming Languages' | 'Data Science & ML' | 'Cloud Platforms' | 'Databases' | 'Tools & Frameworks' | 'Operating Systems' | 'Other';
  yearsExperience?: number;
}

export interface TechnicalSkills {
  skills: TechnicalSkill[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  socialMedia: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  preferredContactMethod: 'email' | 'phone' | 'linkedin';
  availability?: string;
}

export interface Media {
  profilePhoto: {
    url: string;
  };
  documents: {
    cvPdf: {
      url: string;
      filename: string;
      lastUpdated?: string;
      description?: string; // Used for custom download filename
    };
  };
}

export interface Metadata {
  version: string;
  lastUpdated: string;
  created: string;
  updatedBy: string;
  tags: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  settings: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    analytics: {
      googleAnalytics?: string;
      hotjar?: string;
    };
  };
}

export interface ProfileData {
  personalInfo: PersonalInfo;
  summary: Summary;
  coreCompetencies: CoreCompetencies;
  workExperience: WorkExperience;
  education: Education;
  certifications: Certifications;
  technicalSkills: TechnicalSkills;
  contactInfo: ContactInfo;
  media: Media;
  metadata: Metadata;
}

// Component prop types
export interface SectionProps {
  data: ProfileData;
}

export interface HeroProps {
  personalInfo: PersonalInfo;
  summary: Summary;
  media: Media;
}

export interface AboutProps {
  summary: Summary;
  coreCompetencies: CoreCompetencies;
}

export interface ExperienceProps {
  workExperience: WorkExperience;
}

export interface EducationProps {
  education: Education;
}

export interface CertificationsProps {
  certifications: Certifications;
}

export interface SkillsProps {
  technicalSkills: TechnicalSkills;
}

export interface ContactProps {
  contactInfo: ContactInfo;
  media: Media;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Theme types
export type Theme = 'light' | 'dark' | 'auto';

// Animation types
export interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

// Component Props types
export interface HeroProps {
  personalInfo: PersonalInfo;
  summary: Summary;
  media: Media;
  contactInfo: ContactInfo;
}

export interface ContactProps {
  contactInfo: ContactInfo;
  media: Media;
}

export interface AboutProps {
  coreCompetencies: CoreCompetencies;
}

export interface ExperienceProps {
  workExperience: WorkExperience;
}

export interface EducationProps {
  education: Education;
}

export interface CertificationsProps {
  certifications: Certifications;
}

export interface SkillsProps {
  technicalSkills: TechnicalSkills;
}

// Visitor Message types
export interface VisitorMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  ipAddress?: string;
  userAgent?: string;
}

export interface MessageStorage {
  messages: VisitorMessage[];
  lastUpdated: string;
}

// Multi-Profile Management types
export interface ProfileMetadata {
  id: string;
  name: string;
  description: string;
  endpoint: string; // URL endpoint for this profile (e.g., "brian-sun", "data-scientist")
  isActive: boolean; // Whether this profile is accessible via its endpoint
  created: string;
  lastUpdated: string;
  cvPdfPath?: string;
  cvPdfFilename?: string;
}

export interface MultiProfileConfig {
  profiles: ProfileMetadata[];
  lastUpdated: string;
}

// Data Service types
export interface DataServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SaveProfileResponse {
  success: boolean;
  profileId: string;
  message: string;
}

export interface SaveMessageResponse {
  success: boolean;
  messageId: string;
  message: string;
}
