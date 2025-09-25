import { ProfileData } from '../types';

export interface ParsedResumeData {
  personalInfo: {
    fullName?: string;
    preferredName?: string;
    title?: string;
    location?: {
      city?: string;
      province?: string;
      country?: string;
    };
    pronouns?: string;
    languages?: Array<{
      language: string;
      proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
    }>;
  };
  summary: {
    professionalSummary?: string;
  };
  workExperience: {
    positions: Array<{
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string | null;
      isCurrent: boolean;
      description: string;
      achievements: Array<{
        description: string;
        impact?: string;
      }>;
      technologies?: string[];
      teamSize?: number;
      reportingTo?: string;
    }>;
  };
  education: {
    degrees: Array<{
      degree: string;
      field: string;
      institution: string;
      location: string;
      startDate: string;
      endDate: string | null;
      isCurrent: boolean;
      gpa?: string;
      honors?: string[];
      relevantCoursework?: string[];
    }>;
  };
  certifications: {
    certifications: Array<{
      name: string;
      issuer: string;
      issueDate: string;
      expiryDate?: string;
      credentialId?: string;
      credentialUrl?: string;
    }>;
  };
  technicalSkills: {
    skills: Array<{
      category: string;
      skills: string[];
      yearsExperience?: number;
    }>;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    socialMedia: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      website?: string;
    };
    preferredContactMethod: 'email' | 'phone' | 'linkedin';
    availability?: string;
  };
}

class ResumeParserService {
  private parseTextContent(text: string): ParsedResumeData {
    console.log('Parsing text content, length:', text.length);
    console.log('First 500 characters:', text.substring(0, 500));
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    console.log('Total lines after filtering:', lines.length);
    
    const parsedData: ParsedResumeData = {
      personalInfo: {},
      summary: {},
      workExperience: { positions: [] },
      education: { degrees: [] },
      certifications: { certifications: [] },
      technicalSkills: { skills: [] },
      contactInfo: {
        socialMedia: {},
        preferredContactMethod: 'email'
      }
    };

    // Extract email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
      parsedData.contactInfo.email = emailMatch[0];
    }

    // Extract phone number
    const phoneMatch = text.match(/(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/);
    if (phoneMatch) {
      parsedData.contactInfo.phone = phoneMatch[0];
    }

    // Extract LinkedIn URL
    const linkedinMatch = text.match(/https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/);
    if (linkedinMatch) {
      parsedData.contactInfo.socialMedia.linkedin = linkedinMatch[0];
    }

    // Extract GitHub URL
    const githubMatch = text.match(/https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?/);
    if (githubMatch) {
      parsedData.contactInfo.socialMedia.github = githubMatch[0];
    }

    // Extract name (usually the first line or first few words)
    if (lines.length > 0) {
      const firstLine = lines[0];
      // Check if first line looks like a name (contains letters, spaces, and possibly hyphens)
      if (/^[A-Za-z\s\-\.]+$/.test(firstLine) && firstLine.length < 50) {
        parsedData.personalInfo.fullName = firstLine;
        parsedData.personalInfo.preferredName = firstLine;
      }
    }

    // Extract title/position (usually after name)
    for (let i = 1; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      if (line.length > 10 && line.length < 100 && 
          (line.toLowerCase().includes('engineer') || 
           line.toLowerCase().includes('developer') || 
           line.toLowerCase().includes('analyst') || 
           line.toLowerCase().includes('manager') || 
           line.toLowerCase().includes('director') ||
           line.toLowerCase().includes('specialist'))) {
        parsedData.personalInfo.title = line;
        break;
      }
    }

    // Extract location
    const locationKeywords = ['toronto', 'vancouver', 'montreal', 'calgary', 'ottawa', 'canada', 'ontario', 'british columbia', 'quebec', 'alberta'];
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      for (const keyword of locationKeywords) {
        if (lowerLine.includes(keyword)) {
          parsedData.personalInfo.location = {
            city: this.extractCity(line),
            province: this.extractProvince(line),
            country: 'Canada'
          };
          break;
        }
      }
      if (parsedData.personalInfo.location) break;
    }

    // Extract summary (look for sections like "Summary", "About", "Profile")
    let summaryStart = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('summary') || line.includes('about') || line.includes('profile') || line.includes('objective')) {
        summaryStart = i + 1;
        break;
      }
    }

    if (summaryStart !== -1) {
      const summaryLines = [];
      for (let i = summaryStart; i < Math.min(summaryStart + 5, lines.length); i++) {
        if (lines[i].length > 20) {
          summaryLines.push(lines[i]);
        }
      }
      if (summaryLines.length > 0) {
        parsedData.summary.professionalSummary = summaryLines.join(' ');
      }
    }

    // Extract work experience
    this.extractWorkExperience(lines, parsedData);

    // Extract education
    this.extractEducation(lines, parsedData);

    // Extract certifications
    this.extractCertifications(lines, parsedData);

    // Extract technical skills
    this.extractTechnicalSkills(lines, parsedData);

    console.log('Parsed data result:', {
      personalInfo: parsedData.personalInfo,
      summary: parsedData.summary,
      workExperience: parsedData.workExperience.positions.length + ' positions',
      education: parsedData.education.degrees.length + ' degrees',
      certifications: parsedData.certifications.certifications.length + ' certifications',
      skills: parsedData.technicalSkills.skills.length + ' skill categories',
      contactInfo: parsedData.contactInfo
    });

    return parsedData;
  }

  private extractCity(locationLine: string): string {
    const cities = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Mississauga', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'];
    for (const city of cities) {
      if (locationLine.toLowerCase().includes(city.toLowerCase())) {
        return city;
      }
    }
    return '';
  }

  private extractProvince(locationLine: string): string {
    const provinces = ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island'];
    for (const province of provinces) {
      if (locationLine.toLowerCase().includes(province.toLowerCase())) {
        return province;
      }
    }
    return '';
  }

  private extractWorkExperience(lines: string[], parsedData: ParsedResumeData): void {
    let experienceStart = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('experience') || line.includes('employment') || line.includes('work history')) {
        experienceStart = i + 1;
        break;
      }
    }

    if (experienceStart === -1) return;

    const experienceLines = lines.slice(experienceStart);
    let currentPosition: any = null;

    for (let i = 0; i < experienceLines.length; i++) {
      const line = experienceLines[i];
      
      // Check if this line looks like a job title and company
      if (this.isJobTitleLine(line)) {
        if (currentPosition) {
          parsedData.workExperience.positions.push(currentPosition);
        }
        
        const { title, company, location, dates } = this.parseJobTitleLine(line);
        currentPosition = {
          title,
          company,
          location: location || '',
          startDate: dates.start || '',
          endDate: dates.end,
          isCurrent: dates.isCurrent || false,
          description: '',
          achievements: [],
          technologies: []
        };
      } else if (currentPosition && line.length > 20) {
        // This might be a description or achievement
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          currentPosition.achievements.push({
            description: line.substring(1).trim()
          });
        } else {
          currentPosition.description += (currentPosition.description ? ' ' : '') + line;
        }
      }
    }

    if (currentPosition) {
      parsedData.workExperience.positions.push(currentPosition);
    }
  }

  private isJobTitleLine(line: string): boolean {
    // Check if line contains common job title keywords
    const jobKeywords = ['engineer', 'developer', 'analyst', 'manager', 'director', 'specialist', 'consultant', 'lead', 'senior', 'junior'];
    const lowerLine = line.toLowerCase();
    return jobKeywords.some(keyword => lowerLine.includes(keyword)) && line.length < 100;
  }

  private parseJobTitleLine(line: string): { title: string; company: string; location?: string; dates: { start?: string; end?: string | null; isCurrent?: boolean } } {
    // Simple parsing - this could be enhanced
    const parts = line.split('|').map(p => p.trim());
    const title = parts[0] || '';
    const company = parts[1] || '';
    const location = parts[2];
    
    // Extract dates (very basic)
    const dateMatch = line.match(/(\d{4})\s*[-–]\s*(\d{4}|present|current)/i);
    const dates = {
      start: dateMatch ? dateMatch[1] : '',
      end: dateMatch ? (dateMatch[2].toLowerCase().includes('present') || dateMatch[2].toLowerCase().includes('current') ? null : dateMatch[2]) : null,
      isCurrent: dateMatch ? (dateMatch[2].toLowerCase().includes('present') || dateMatch[2].toLowerCase().includes('current')) : false
    };

    return { title, company, location, dates };
  }

  private extractEducation(lines: string[], parsedData: ParsedResumeData): void {
    let educationStart = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('education') || line.includes('academic')) {
        educationStart = i + 1;
        break;
      }
    }

    if (educationStart === -1) return;

    const educationLines = lines.slice(educationStart);
    let currentDegree: any = null;

    for (let i = 0; i < educationLines.length; i++) {
      const line = educationLines[i];
      
      if (this.isEducationLine(line)) {
        if (currentDegree) {
          parsedData.education.degrees.push(currentDegree);
        }
        
        const { degree, field, institution, location, dates } = this.parseEducationLine(line);
        currentDegree = {
          degree,
          field,
          institution,
          location: location || '',
          startDate: dates.start || '',
          endDate: dates.end,
          isCurrent: dates.isCurrent || false,
          gpa: '',
          honors: [],
          relevantCoursework: []
        };
      }
    }

    if (currentDegree) {
      parsedData.education.degrees.push(currentDegree);
    }
  }

  private isEducationLine(line: string): boolean {
    const educationKeywords = ['bachelor', 'master', 'phd', 'diploma', 'certificate', 'degree', 'university', 'college'];
    const lowerLine = line.toLowerCase();
    return educationKeywords.some(keyword => lowerLine.includes(keyword));
  }

  private parseEducationLine(line: string): { degree: string; field: string; institution: string; location?: string; dates: { start?: string; end?: string | null; isCurrent?: boolean } } {
    // Simple parsing - this could be enhanced
    const parts = line.split('|').map(p => p.trim());
    const degree = parts[0] || '';
    const field = parts[1] || '';
    const institution = parts[2] || '';
    const location = parts[3];
    
    const dateMatch = line.match(/(\d{4})\s*[-–]\s*(\d{4}|present|current)/i);
    const dates = {
      start: dateMatch ? dateMatch[1] : '',
      end: dateMatch ? (dateMatch[2].toLowerCase().includes('present') || dateMatch[2].toLowerCase().includes('current') ? null : dateMatch[2]) : null,
      isCurrent: dateMatch ? (dateMatch[2].toLowerCase().includes('present') || dateMatch[2].toLowerCase().includes('current')) : false
    };

    return { degree, field, institution, location, dates };
  }

  private extractCertifications(lines: string[], parsedData: ParsedResumeData): void {
    let certStart = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('certification') || line.includes('certificate') || line.includes('license')) {
        certStart = i + 1;
        break;
      }
    }

    if (certStart === -1) return;

    const certLines = lines.slice(certStart);
    for (const line of certLines) {
      if (line.length > 10 && line.length < 100) {
        const dateMatch = line.match(/(\d{4})/);
        parsedData.certifications.certifications.push({
          name: line,
          issuer: '',
          issueDate: dateMatch ? dateMatch[1] : '',
          credentialId: '',
          credentialUrl: ''
        });
      }
    }
  }

  private extractTechnicalSkills(lines: string[], parsedData: ParsedResumeData): void {
    let skillsStart = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('skill') || line.includes('technology') || line.includes('technical')) {
        skillsStart = i + 1;
        break;
      }
    }

    if (skillsStart === -1) return;

    const skillsLines = lines.slice(skillsStart);
    const allSkills: string[] = [];

    for (const line of skillsLines) {
      // Split by common separators
      const skills = line.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0);
      allSkills.push(...skills);
    }

    if (allSkills.length > 0) {
      parsedData.technicalSkills.skills.push({
        category: 'Technical Skills',
        skills: allSkills.slice(0, 20), // Limit to first 20 skills
        yearsExperience: 0
      });
    }
  }

  private extractTextFromWordDocument(arrayBuffer: ArrayBuffer): string {
    // Enhanced approach to extract text from Word documents (.docx files)
    try {
      const uint8Array = new Uint8Array(arrayBuffer);
      let text = '';
      
      // Convert to string to search for XML patterns
      const binaryString = Array.from(uint8Array)
        .map(byte => String.fromCharCode(byte))
        .join('');
      
      console.log('Binary string length:', binaryString.length);
      
      // Look for XML text content patterns in .docx files with more comprehensive regex
      const xmlPatterns = [
        /<w:t[^>]*>([^<]+)<\/w:t>/g,
        /<w:t>([^<]+)<\/w:t>/g,
        /<t[^>]*>([^<]+)<\/t>/g,
        /<text[^>]*>([^<]+)<\/text>/g
      ];
      
      let foundText = false;
      for (const pattern of xmlPatterns) {
        const matches = binaryString.match(pattern);
        if (matches && matches.length > 0) {
          console.log(`Found ${matches.length} matches with pattern:`, pattern.source);
          matches.forEach(match => {
            const textContent = match.replace(pattern, '$1');
            if (textContent && textContent.trim() && textContent.length > 1) {
              text += textContent + ' ';
              foundText = true;
            }
          });
          if (foundText) break;
        }
      }
      
      // If XML extraction didn't work, try to find readable text sequences
      if (!foundText) {
        console.log('XML extraction failed, trying to find readable text sequences...');
        
        // Look for sequences of readable characters
        const readableTextRegex = /[A-Za-z][A-Za-z0-9\s@.\-,()]{10,}/g;
        const readableMatches = binaryString.match(readableTextRegex);
        
        if (readableMatches && readableMatches.length > 0) {
          console.log(`Found ${readableMatches.length} readable text sequences`);
          readableMatches.forEach(match => {
            if (match.trim().length > 10) {
              text += match.trim() + ' ';
            }
          });
        }
      }
      
      // If still no text, try a more aggressive approach
      if (!text.trim()) {
        console.log('Trying aggressive text extraction...');
        let currentWord = '';
        
        for (let i = 0; i < uint8Array.length; i++) {
          const char = String.fromCharCode(uint8Array[i]);
          
          if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z') || 
              (char >= '0' && char <= '9') || char === '@' || char === '.' || char === '-') {
            currentWord += char;
          } else if (char === ' ' || char === '\n' || char === '\r' || char === '\t') {
            if (currentWord.length > 2) {
              text += currentWord + ' ';
            }
            currentWord = '';
          } else {
            if (currentWord.length > 2) {
              text += currentWord + ' ';
            }
            currentWord = '';
          }
        }
        
        // Add the last word if it exists
        if (currentWord.length > 2) {
          text += currentWord;
        }
      }
      
      // Clean up the extracted text
      text = text
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
      
      console.log('Final extracted text length:', text.length);
      console.log('Extracted text from Word document:', text.substring(0, 500) + '...');
      
      // Check if we only extracted file structure metadata (common issue with .docx files)
      const isMetadataOnly = text.includes('document.xml') || text.includes('footnotes.xml') || 
                            text.includes('endnotes.xml') || text.includes('settings.xml');
      
      if (!text || text.length < 20 || isMetadataOnly) {
        throw new Error('Unable to extract readable content from this Word document. The parser is only extracting file structure metadata. Please convert your resume to a plain text file (.txt) for best results.');
      }
      
      return text;
    } catch (error) {
      console.error('Word document extraction error:', error);
      throw new Error('Failed to extract text from Word document: ' + (error as Error).message);
    }
  }

  private extractTextFromPDF(arrayBuffer: ArrayBuffer): string {
    // Basic PDF text extraction - this is a simplified approach
    // For production use, consider using a proper PDF parsing library
    try {
      const uint8Array = new Uint8Array(arrayBuffer);
      let text = '';
      
      // Convert binary data to string and look for text content
      for (let i = 0; i < uint8Array.length - 1; i++) {
        const char = String.fromCharCode(uint8Array[i]);
        // Look for readable text patterns in PDF
        if ((char >= ' ' && char <= '~') || char === '\n' || char === '\r') {
          text += char;
        }
      }
      
      // Clean up extracted text
      text = text
        .replace(/[^\w\s@.\-,()]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return text;
    } catch (error) {
      throw new Error('Failed to extract text from PDF document');
    }
  }

  async parseResume(file: File): Promise<ParsedResumeData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          let content: string;
          
          if (file.type === 'text/plain') {
            content = e.target?.result as string;
          } else if (file.type === 'application/pdf') {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            content = this.extractTextFromPDF(arrayBuffer);
          } else if (file.type.includes('word') || file.type.includes('document')) {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            content = this.extractTextFromWordDocument(arrayBuffer);
          } else {
            reject(new Error('Unsupported file type. Please use PDF, DOC, DOCX, or TXT files.'));
            return;
          }
          
          if (!content || content.trim().length === 0) {
            reject(new Error('No readable text found in the document. Please ensure the file contains text content.'));
            return;
          }
          
          const parsedData = this.parseTextContent(content);
          resolve(parsedData);
        } catch (error) {
          reject(new Error('Failed to parse resume content: ' + (error as Error).message));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else if (file.type === 'application/pdf' || file.type.includes('word') || file.type.includes('document')) {
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('Unsupported file type. Please use PDF, DOC, DOCX, or TXT files.'));
      }
    });
  }

  mergeWithEmptyProfile(parsedData: ParsedResumeData, emptyProfile: ProfileData): ProfileData {
    const mergedProfile = { ...emptyProfile };

    // Merge personal info
    if (parsedData.personalInfo.fullName) {
      mergedProfile.personalInfo.fullName = parsedData.personalInfo.fullName;
      mergedProfile.personalInfo.preferredName = parsedData.personalInfo.preferredName || parsedData.personalInfo.fullName;
    }
    if (parsedData.personalInfo.title) {
      mergedProfile.personalInfo.title = parsedData.personalInfo.title;
    }
    if (parsedData.personalInfo.location) {
      mergedProfile.personalInfo.location = {
        ...mergedProfile.personalInfo.location,
        ...parsedData.personalInfo.location
      };
    }

    // Merge summary
    if (parsedData.summary.professionalSummary) {
      mergedProfile.summary.professionalSummary = parsedData.summary.professionalSummary;
    }

    // Merge work experience
    if (parsedData.workExperience.positions.length > 0) {
      mergedProfile.workExperience.positions = parsedData.workExperience.positions;
    }

    // Merge education
    if (parsedData.education.degrees.length > 0) {
      mergedProfile.education.degrees = parsedData.education.degrees;
    }

    // Merge certifications
    if (parsedData.certifications.certifications.length > 0) {
      mergedProfile.certifications.certifications = parsedData.certifications.certifications;
    }

    // Merge technical skills
    if (parsedData.technicalSkills.skills.length > 0) {
      mergedProfile.technicalSkills.skills = parsedData.technicalSkills.skills;
    }

    // Merge contact info
    if (parsedData.contactInfo.email) {
      mergedProfile.contactInfo.email = parsedData.contactInfo.email;
    }
    if (parsedData.contactInfo.phone) {
      mergedProfile.contactInfo.phone = parsedData.contactInfo.phone;
    }
    if (parsedData.contactInfo.socialMedia.linkedin) {
      mergedProfile.contactInfo.socialMedia.linkedin = parsedData.contactInfo.socialMedia.linkedin;
    }
    if (parsedData.contactInfo.socialMedia.github) {
      mergedProfile.contactInfo.socialMedia.github = parsedData.contactInfo.socialMedia.github;
    }

    return mergedProfile;
  }
}

export const resumeParserService = new ResumeParserService();
