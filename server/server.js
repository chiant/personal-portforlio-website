const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const OpenAI = require('openai');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for large resume text

// Ensure upload directories exist
const uploadDirs = {
  cv: path.join(__dirname, '../upload/cv'),
  photo: path.join(__dirname, '../upload/photo')
};

// Create upload directories if they don't exist
Object.values(uploadDirs).forEach(dir => {
  fs.ensureDirSync(dir);
  console.log(`Ensured directory exists: ${dir}`);
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let fileType = 'cv'; // default
    if (req.route.path.includes('photo')) {
      fileType = 'photo';
    } else if (req.route.path.includes('resume')) {
      fileType = 'cv'; // resume files go to cv directory
    } else if (req.route.path.includes('cv')) {
      fileType = 'cv';
    }
    cb(null, uploadDirs[fileType]);
  },
  filename: function (req, file, cb) {
    let fileType = 'cv'; // default
    if (req.route.path.includes('photo')) {
      fileType = 'photo';
    } else if (req.route.path.includes('resume')) {
      fileType = 'cv'; // resume files go to cv directory
    } else if (req.route.path.includes('cv')) {
      fileType = 'cv';
    }
    const extension = path.extname(file.originalname);
    // Use a temporary filename first, we'll rename it after processing
    const tempFilename = `${fileType}-temp-${Date.now()}${extension}`;
    console.log(`Generated temp filename: ${tempFilename}`);
    cb(null, tempFilename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    let fileType = 'cv'; // default
    if (req.route.path.includes('photo')) {
      fileType = 'photo';
    } else if (req.route.path.includes('resume')) {
      fileType = 'cv'; // resume files are treated as CV files
    } else if (req.route.path.includes('cv')) {
      fileType = 'cv';
    }
    
    if (fileType === 'cv') {
      // Allow CV/Resume files: PDF, DOC, DOCX, TXT
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for CV/Resume. Only PDF, DOC, DOCX, and TXT files are allowed.'));
      }
    } else {
      // Allow photo files: JPEG, JPG, PNG
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for photo. Only JPEG, JPG, and PNG files are allowed.'));
      }
    }
  }
});

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CVBot Backend Server is running' });
});

// CV Upload endpoint
app.post('/api/upload/cv', upload.single('cvFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No CV file uploaded' 
      });
    }

    if (!req.body.endpoint) {
      return res.status(400).json({ 
        success: false, 
        error: 'Endpoint is required' 
      });
    }

    // Rename the file with the correct endpoint
    const extension = path.extname(req.file.originalname);
    const newFilename = `cv-${req.body.endpoint}${extension}`;
    const newPath = path.join(uploadDirs.cv, newFilename);
    
    // Rename the file
    fs.renameSync(req.file.path, newPath);

    const fileInfo = {
      success: true,
      message: 'CV file uploaded successfully',
      file: {
        originalName: req.file.originalname,
        filename: newFilename,
        path: newPath,
        size: req.file.size,
        mimetype: req.file.mimetype,
        endpoint: req.body.endpoint
      }
    };

    console.log('CV uploaded:', fileInfo);
    res.json(fileInfo);

  } catch (error) {
    console.error('CV upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to upload CV file' 
    });
  }
});

// Resume Upload endpoint (for creating new profiles)
app.post('/api/upload/resume', upload.single('resumeFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No resume file uploaded' 
      });
    }

    if (!req.body.endpoint) {
      return res.status(400).json({ 
        success: false, 
        error: 'Endpoint is required' 
      });
    }

    // Rename the file with the correct endpoint
    const extension = path.extname(req.file.originalname);
    const newFilename = `cv-${req.body.endpoint}${extension}`;
    const newPath = path.join(uploadDirs.cv, newFilename);
    
    // Rename the file
    fs.renameSync(req.file.path, newPath);

    const fileInfo = {
      success: true,
      message: 'Resume file uploaded successfully',
      file: {
        originalName: req.file.originalname,
        filename: newFilename,
        path: newPath,
        size: req.file.size,
        mimetype: req.file.mimetype,
        endpoint: req.body.endpoint
      }
    };

    console.log('Resume uploaded:', fileInfo);
    res.json(fileInfo);

  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to upload resume file' 
    });
  }
});

// Photo Upload endpoint
app.post('/api/upload/photo', upload.single('photoFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No photo file uploaded' 
      });
    }

    if (!req.body.endpoint) {
      return res.status(400).json({ 
        success: false, 
        error: 'Endpoint is required' 
      });
    }

    // Rename the file with the correct endpoint
    const extension = path.extname(req.file.originalname);
    const newFilename = `photo-${req.body.endpoint}${extension}`;
    const newPath = path.join(uploadDirs.photo, newFilename);
    
    // Rename the file
    fs.renameSync(req.file.path, newPath);

    const fileInfo = {
      success: true,
      message: 'Photo uploaded successfully',
      file: {
        originalName: req.file.originalname,
        filename: newFilename,
        path: newPath,
        size: req.file.size,
        mimetype: req.file.mimetype,
        endpoint: req.body.endpoint
      }
    };

    console.log('Photo uploaded:', fileInfo);
    res.json(fileInfo);

  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to upload photo file' 
    });
  }
});

// File download endpoint
app.get('/api/files/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    
    if (!['cv', 'photo'].includes(type)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid file type' 
      });
    }

    const filePath = path.join(uploadDirs[type], filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    // Get file extension to determine content type
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream'; // default
    
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    } else if (ext === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (ext === '.doc') {
      contentType = 'application/msword';
    } else if (ext === '.txt') {
      contentType = 'text/plain';
    }

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    
    // Check if download is forced via query parameter
    const forceDownload = req.query.download === 'true';
    
    // For PDFs, set Content-Disposition based on download parameter
    // For other files, always set to attachment to force download
    if (ext === '.pdf' && !forceDownload) {
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }

    // Send the file
    res.sendFile(filePath);

  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to serve file' 
    });
  }
});

// List files endpoint
app.get('/api/files/:type', (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['cv', 'photo'].includes(type)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid file type' 
      });
    }

    const files = fs.readdirSync(uploadDirs[type]).map(filename => {
      const filePath = path.join(uploadDirs[type], filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    });

    res.json({
      success: true,
      files
    });

  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to list files' 
    });
  }
});

// Copy files endpoint
app.post('/api/copy-files', (req, res) => {
  try {
    const { sourceEndpoint, targetEndpoint } = req.body;
    
    if (!sourceEndpoint || !targetEndpoint) {
      return res.status(400).json({ 
        success: false, 
        error: 'Source and target endpoints are required' 
      });
    }

    const copiedFiles = [];

    // Copy CV file if it exists
    const cvFiles = fs.readdirSync(uploadDirs.cv);
    const sourceCVFile = cvFiles.find(file => file.startsWith(`cv-${sourceEndpoint}.`));
    
    if (sourceCVFile) {
      const sourceCVPath = path.join(uploadDirs.cv, sourceCVFile);
      const extension = path.extname(sourceCVFile);
      const targetCVFilename = `cv-${targetEndpoint}${extension}`;
      const targetCVPath = path.join(uploadDirs.cv, targetCVFilename);
      
      fs.copyFileSync(sourceCVPath, targetCVPath);
      copiedFiles.push({
        type: 'cv',
        originalFilename: sourceCVFile,
        newFilename: targetCVFilename,
        size: fs.statSync(targetCVPath).size
      });
      
      console.log(`Copied CV file: ${sourceCVFile} -> ${targetCVFilename}`);
    }

    // Copy photo file if it exists
    const photoFiles = fs.readdirSync(uploadDirs.photo);
    const sourcePhotoFile = photoFiles.find(file => file.startsWith(`photo-${sourceEndpoint}.`));
    
    if (sourcePhotoFile) {
      const sourcePhotoPath = path.join(uploadDirs.photo, sourcePhotoFile);
      const extension = path.extname(sourcePhotoFile);
      const targetPhotoFilename = `photo-${targetEndpoint}${extension}`;
      const targetPhotoPath = path.join(uploadDirs.photo, targetPhotoFilename);
      
      fs.copyFileSync(sourcePhotoPath, targetPhotoPath);
      copiedFiles.push({
        type: 'photo',
        originalFilename: sourcePhotoFile,
        newFilename: targetPhotoFilename,
        size: fs.statSync(targetPhotoPath).size
      });
      
      console.log(`Copied photo file: ${sourcePhotoFile} -> ${targetPhotoFilename}`);
    }

    res.json({
      success: true,
      message: `Copied ${copiedFiles.length} file(s) from ${sourceEndpoint} to ${targetEndpoint}`,
      copiedFiles
    });

  } catch (error) {
    console.error('Copy files error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to copy files' 
    });
  }
});

// LLM Resume Parsing endpoint
app.post('/api/parse-resume-llm', async (req, res) => {
  try {
    const { resumeText, endpoint, config } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Resume text is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured'
      });
    }

    console.log('Starting LLM resume parsing...');
    console.log('Resume text length:', resumeText.length);
    console.log('Using model:', config?.model || 'gpt-4o-mini');

    // Load the profile schema
    const schemaPath = path.join(__dirname, '../data/profile-schema.json');
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    // Create the prompt for the LLM
    const prompt = `You are an expert resume parser. Parse the following resume text and extract structured data according to the provided JSON schema.

IMPORTANT INSTRUCTIONS:
1. Return ONLY valid JSON that matches the schema structure
2. Use null for missing optional fields
3. For dates, use YYYY-MM-DD format
4. For arrays, return empty arrays [] if no data is found
5. Be as accurate as possible with the data extraction
6. If a field is required but not found in the resume, make a reasonable inference or use a default value
7. For the endpoint field in metadata, use: "${endpoint || 'default'}"

JSON SCHEMA:
${JSON.stringify(schema, null, 2)}

RESUME TEXT TO PARSE:
${resumeText}

Return the parsed data as valid JSON:`;

    const completion = await openai.chat.completions.create({
      model: config?.model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume parser that extracts structured data from resumes. Always return valid JSON that matches the provided schema.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: config?.temperature || 0.1,
      max_tokens: config?.maxTokens || 4000,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    console.log('LLM response received, length:', responseText.length);

    // Parse the JSON response
    let parsedData;
    try {
      // Clean the response to extract JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      parsedData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response:', responseText);
      throw new Error('Failed to parse LLM response as JSON');
    }

    // Add metadata if missing
    if (!parsedData.metadata) {
      parsedData.metadata = {};
    }
    
    parsedData.metadata = {
      ...parsedData.metadata,
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      created: new Date().toISOString(),
      updatedBy: 'LLM Parser',
      tags: parsedData.metadata.tags || [],
      endpoint: endpoint || 'default'
    };

    // Ensure media structure exists
    if (!parsedData.media) {
      parsedData.media = {
        profilePhoto: {
          url: '',
          alt: 'Profile photo'
        },
        documents: {
          cvPdf: {
            url: '',
            filename: ''
          }
        }
      };
    }

    console.log('LLM parsing completed successfully');
    console.log('Parsed data structure:', Object.keys(parsedData));

    res.json({
      success: true,
      data: parsedData,
      model: config?.model || 'gpt-4o-mini',
      tokensUsed: completion.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('LLM parsing error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to parse resume with LLM'
    });
  }
});

// PDF Resume Parsing with LLM endpoint
app.post('/api/parse-pdf-llm', async (req, res) => {
  try {
    const { pdfBuffer, endpoint, config } = req.body;

    if (!pdfBuffer) {
      return res.status(400).json({
        success: false,
        error: 'PDF buffer is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured'
      });
    }

    console.log('Starting PDF parsing with LLM...');
    console.log('PDF buffer size (base64):', pdfBuffer.length);
    console.log('Using model:', config?.model || 'gpt-4o-mini');

    // Convert base64 buffer to Buffer
    let buffer;
    try {
      buffer = Buffer.from(pdfBuffer, 'base64');
      console.log('Converted buffer size (bytes):', buffer.length);
    } catch (bufferError) {
      console.error('Buffer conversion error:', bufferError);
      return res.status(400).json({
        success: false,
        error: 'Failed to convert base64 buffer: ' + bufferError.message
      });
    }
    
    // Extract text from PDF
    let resumeText = '';
    try {
      const pdfData = await pdfParse(buffer);
      resumeText = pdfData.text;
      console.log('Extracted text length:', resumeText.length);
      console.log('First 200 characters:', resumeText.substring(0, 200));
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      return res.status(400).json({
        success: false,
        error: 'Failed to extract text from PDF: ' + pdfError.message
      });
    }

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        error: 'No readable text found in PDF'
      });
    }

    // Load the profile schema
    const schemaPath = path.join(__dirname, '../data/profile-schema.json');
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    // Create the prompt for the LLM
    const prompt = `You are an expert resume parser. Parse the following resume text extracted from a PDF and extract structured data according to the provided JSON schema.

IMPORTANT INSTRUCTIONS:
1. Return ONLY valid JSON that matches the schema structure
2. Use null for missing optional fields
3. For dates, use YYYY-MM-DD format
4. For arrays, return empty arrays [] if no data is found
5. Be as accurate as possible with the data extraction
6. If a field is required but not found in the resume, make a reasonable inference or use a default value
7. For the endpoint field in metadata, use: "${endpoint || 'default'}"
8. The text was extracted from a PDF, so there might be formatting artifacts - ignore them and focus on the content

JSON SCHEMA:
${JSON.stringify(schema, null, 2)}

RESUME TEXT TO PARSE:
${resumeText}

Return the parsed data as valid JSON:`;

    const completion = await openai.chat.completions.create({
      model: config?.model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume parser that extracts structured data from resumes. Always return valid JSON that matches the provided schema. Handle PDF text extraction artifacts gracefully.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: config?.temperature || 0.1,
      max_tokens: config?.maxTokens || 4000,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    console.log('LLM response received, length:', responseText.length);

    // Parse the JSON response
    let parsedData;
    try {
      // Clean the response to extract JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      parsedData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response:', responseText);
      throw new Error('Failed to parse LLM response as JSON');
    }

    // Add metadata if missing
    if (!parsedData.metadata) {
      parsedData.metadata = {};
    }
    
    parsedData.metadata = {
      ...parsedData.metadata,
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      created: new Date().toISOString(),
      updatedBy: 'LLM PDF Parser',
      tags: parsedData.metadata.tags || [],
      endpoint: endpoint || 'default'
    };

    // Ensure media structure exists
    if (!parsedData.media) {
      parsedData.media = {
        profilePhoto: {
          url: '',
          alt: 'Profile photo'
        },
        documents: {
          cvPdf: {
            url: '',
            filename: ''
          }
        }
      };
    }

    console.log('PDF LLM parsing completed successfully');
    console.log('Parsed data structure:', Object.keys(parsedData));

    res.json({
      success: true,
      data: parsedData,
      model: config?.model || 'gpt-4o-mini',
      tokensUsed: completion.usage?.total_tokens || 0,
      extractedTextLength: resumeText.length
    });

  } catch (error) {
    console.error('PDF LLM parsing error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to parse PDF with LLM'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CVBot Backend Server running on port ${PORT}`);
  console.log(`📁 Upload directories:`);
  console.log(`   CV: ${uploadDirs.cv}`);
  console.log(`   Photo: ${uploadDirs.photo}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
