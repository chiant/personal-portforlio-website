import { ProfileData } from '../types';

// No default profile data - profiles will be created through the management console
export const profileData: ProfileData | null = null;

// Helper functions for data manipulation
// Note: Competencies no longer have categories in the simplified schema
// This function is kept for backward compatibility but returns empty object
export const getCompetenciesByCategory = (competencies: ProfileData['coreCompetencies']['competencies']) => {
  return {};
};

export const getSkillsByCategory = (skills: ProfileData['technicalSkills']['skills']) => {
  const categories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);
  
  return categories;
};

export const getCertificationsByCategory = (certifications: ProfileData['certifications']['certifications']) => {
  const categories = certifications.reduce((acc, cert) => {
    if (!acc[cert.category]) {
      acc[cert.category] = [];
    }
    acc[cert.category].push(cert);
    return acc;
  }, {} as Record<string, typeof certifications>);
  
  return categories;
};

export const getCurrentPosition = (positions: ProfileData['workExperience']['positions']) => {
  return positions.find(position => position.isCurrent) || positions[0];
};

export const getLatestCertifications = (certifications: ProfileData['certifications']['certifications'], limit: number = 3) => {
  return certifications
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, limit);
};

export const getTopSkills = (skills: ProfileData['technicalSkills']['skills'], limit: number = 10) => {
  return skills
    .filter(skill => skill.yearsExperience && skill.yearsExperience >= 5)
    .sort((a, b) => (b.yearsExperience || 0) - (a.yearsExperience || 0))
    .slice(0, limit);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });
};

export const formatDateRange = (startDate: string, endDate: string | null) => {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'Present';
  return `${start} - ${end}`;
};

export const getExperienceYears = (positions: ProfileData['workExperience']['positions']) => {
  const totalMonths = positions.reduce((total, position) => {
    const start = new Date(position.startDate);
    const end = position.endDate ? new Date(position.endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return total + months;
  }, 0);
  
  return Math.round(totalMonths / 12);
};
