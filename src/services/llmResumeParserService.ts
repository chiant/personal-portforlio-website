import { ProfileData } from '../types';

interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'local';
  model: string;
  temperature: number;
  maxTokens: number;
  apiKey?: string;
}

interface LLMParseResponse {
  success: boolean;
  data?: ProfileData;
  error?: string;
}

class LLMResumeParserService {
  private config: LLMConfig;

  constructor() {
    // Default configuration - can be overridden
    this.config = {
      provider: 'openai',
      model: 'gpt-4o-mini',
      temperature: 0.1,
      maxTokens: 4000
    };
  }

  /**
   * Configure the LLM settings
   */
  configure(config: Partial<LLMConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Parse resume text using LLM API
   */
  async parseResumeWithLLM(resumeText: string, endpoint: string): Promise<LLMParseResponse> {
    try {
      console.log('Starting LLM-based resume parsing...');
      console.log('Resume text length:', resumeText.length);
      console.log('Using model:', this.config.model);

      const response = await fetch('http://localhost:3004/api/parse-resume-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          endpoint,
          config: this.config
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM parsing failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'LLM parsing failed');
      }

      console.log('LLM parsing completed successfully');
      return {
        success: true,
        data: result.data
      };

    } catch (error) {
      console.error('LLM resume parsing error:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * Parse resume file using LLM
   */
  async parseResume(file: File, endpoint: string): Promise<ProfileData> {
    console.log('LLMResumeParserService.parseResume called with:', file.name, file.type);

    // Handle PDF files directly with backend parsing
    if (file.type === 'application/pdf') {
      return await this.parsePDFWithLLM(file, endpoint);
    }

    // For other file types, extract text first then parse
    const text = await this.extractTextFromFile(file);
    
    // Parse with LLM
    const result = await this.parseResumeWithLLM(text, endpoint);
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to parse resume with LLM');
    }

    return result.data;
  }

  /**
   * Extract text from various file types
   */
  private async extractTextFromFile(file: File): Promise<string> {
    const fileType = file.type;
    
    if (fileType === 'text/plain') {
      return await this.extractTextFromTextFile(file);
    } else if (fileType === 'application/pdf') {
      return await this.extractTextFromPDF(file);
    } else if (fileType.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      return await this.extractTextFromWordDocument(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  /**
   * Extract text from plain text file
   */
  private async extractTextFromTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text && text.trim().length > 0) {
          resolve(text);
        } else {
          reject(new Error('Empty or invalid text file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }

  /**
   * Parse PDF file directly with LLM (bypasses text extraction step)
   */
  private async parsePDFWithLLM(file: File, endpoint: string): Promise<ProfileData> {
    try {
      console.log('Parsing PDF directly with LLM...');
      
      // Convert file to base64 buffer (handle large files efficiently)
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      
      // Convert to base64 in chunks to avoid call stack overflow
      let binaryString = '';
      const chunkSize = 8192; // Process in 8KB chunks
      for (let i = 0; i < buffer.length; i += chunkSize) {
        const chunk = buffer.slice(i, i + chunkSize);
        binaryString += String.fromCharCode(...chunk);
      }
      const base64Buffer = btoa(binaryString);
      
      console.log('PDF buffer size:', base64Buffer.length);
      console.log('Original file size:', file.size, 'bytes');
      console.log('Base64 encoded size:', base64Buffer.length, 'characters');
      
      // Send to backend for PDF parsing with LLM
      const response = await fetch('http://localhost:3004/api/parse-pdf-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfBuffer: base64Buffer,
          endpoint: endpoint,
          config: this.config
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`PDF parsing failed: ${response.status} ${response.statusText} - ${errorData.error}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'PDF parsing failed');
      }

      console.log('PDF LLM parsing completed successfully');
      console.log('Extracted text length:', result.extractedTextLength);
      console.log('Tokens used:', result.tokensUsed);
      
      return result.data;
      
    } catch (error) {
      console.error('PDF LLM parsing error:', error);
      throw new Error(`Failed to parse PDF with LLM: ${(error as Error).message}`);
    }
  }

  /**
   * Extract text from PDF file (fallback method - not used for direct PDF parsing)
   */
  private async extractTextFromPDF(file: File): Promise<string> {
    // This method is now only used as a fallback
    // PDF files are handled directly by parsePDFWithLLM
    throw new Error('PDF parsing should use parsePDFWithLLM method directly. Please use the resume upload feature.');
  }

  /**
   * Extract text from Word document (basic implementation)
   */
  private async extractTextFromWordDocument(file: File): Promise<string> {
    // For now, throw an error suggesting text conversion
    // In a production environment, you'd use a proper Word document parser
    throw new Error('Word document parsing not yet implemented. Please convert your Word document to a text file (.txt) for best results.');
  }

  /**
   * Get current configuration
   */
  getConfig(): LLMConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const llmResumeParserService = new LLMResumeParserService();
export default llmResumeParserService;
