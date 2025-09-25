# CVBot Management Console - Testing Guide

## 🚀 Quick Start

1. **Start the backend server:**
   ```bash
   cd server
   npm start
   ```

2. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Main website: `http://localhost:3000/`
   - Management console: `http://localhost:3000/management`
   - Backend API: `http://localhost:3004`

4. **Login credentials:**
   - Username: `admin`
   - Password: `admin123`

## ✅ Test Scenarios

### 1. **Profile Management Testing**

#### Test Multi-Profile Functionality:
1. Go to `/management` and login
2. Navigate to **"Profile Management"** section
3. **Create a new profile manually:**
   - Click "Create New Profile"
   - Select "Create new profile by manual input"
   - Enter name: "Test Profile - Data Engineer"
   - Enter description: "Test profile for data engineering role"
   - Enter endpoint: "test-data-engineer"
   - Click "Create Profile"
4. **Create a profile by uploading resume:**
   - Click "Create New Profile"
   - Select "Create new profile by uploading a resume"
   - Upload a PDF, DOC, or TXT resume file
   - Verify resume parsing and profile creation
5. **Copy an existing profile:**
   - Click "Create New Profile"
   - Select "Create new profile by copying existing profile"
   - Choose an existing profile to copy
   - Verify new profile is created with copied data
6. **Manage existing profiles:**
   - View profile cards with QR codes
   - Test activation/deactivation toggle
   - Edit profile metadata (name, description, endpoint)
   - Delete profiles (with confirmation)

#### Test Profile Data Editing:
1. Select a profile and navigate to **"Personal Info"** editor
2. **Edit personal information:**
   - Change "Full Name" to "Test User"
   - Change "Professional Title" to "Test Engineer"
   - Verify auto-save functionality (no manual save needed)
3. **Test other editors:**
   - Navigate to "Competencies" editor
   - Add/edit core competencies
   - Navigate to "Experience" editor
   - Add/edit work experience entries
   - Navigate to "Education" editor
   - Add/edit education entries
   - Navigate to "Certifications" editor
   - Add/edit certifications
   - Navigate to "Skills" editor
   - Add/edit technical skills
   - Navigate to "Media" editor
   - Upload profile photo and CV document
4. **Verify on profile website:**
   - Go to profile endpoint (e.g., `/test-data-engineer`)
   - Verify all changes are reflected

### 2. **Experience Management Testing**

1. Go to **"Experience"** tab
2. **Add a new position:**
   - Click "Add Position"
   - Fill in all required fields:
     - Job Title: "Senior Test Engineer"
     - Company: "Test Company"
     - Start Date: "2024-01-01"
     - End Date: "2024-12-31"
   - Add achievements:
     - Click "Add Achievement"
     - Fill in title and description
     - Add technologies
   - Add technologies used
   - Click "Save Position"
3. **Edit existing position:**
   - Click edit icon on any position
   - Modify details and save
4. **Delete position:**
   - Click delete icon and confirm
5. **Verify on main website:**
   - Check that changes appear on the main site

### 3. **Education Management Testing**

1. Go to **"Education"** tab
2. **Add a new degree:**
   - Click "Add Degree"
   - Fill in: Degree, Institution, Location, Start/End dates
   - Save
3. **Edit and delete degrees**
4. **Verify on main website**

### 4. **Certifications Management Testing**

1. Go to **"Certifications"** tab
2. **Add a new certification:**
   - Click "Add Certification"
   - Fill in all fields including URLs
   - Select appropriate category
   - Save
3. **Test category filtering and display**
4. **Edit and delete certifications**
5. **Verify on main website**

### 5. **Skills Management Testing**

1. Go to **"Skills"** tab
2. **Add new skills:**
   - Click "Add Skill"
   - Add skills in different categories
   - Include years of experience
   - Save
3. **Test category organization**
4. **Edit and delete skills**
5. **Verify on main website**

### 6. **Advanced Features Testing**

#### Resume Parsing Testing:
1. **Test PDF resume parsing:**
   - Upload a PDF resume file
   - Verify text extraction and parsing
   - Check if profile data is populated correctly
2. **Test DOC/DOCX resume parsing:**
   - Upload a Word document resume
   - Verify text extraction from Word format
   - Check profile data population
3. **Test TXT resume parsing:**
   - Upload a plain text resume
   - Verify text parsing and data extraction
4. **Test LLM integration:**
   - Verify OpenAI API integration
   - Check structured data extraction
   - Test error handling for invalid files

#### QR Code Testing:
1. **Generate QR codes:**
   - View profile cards in management console
   - Verify QR codes are generated for each profile
   - Test QR code scanning with mobile device
2. **QR code functionality:**
   - Scan QR code and verify it opens correct profile URL
   - Test QR code display and sizing

#### File Management Testing:
1. **Upload profile photos:**
   - Upload various image formats (JPG, PNG)
   - Verify file naming conventions
   - Test file storage in upload/photo directory
2. **Upload CV documents:**
   - Upload PDF, DOC, DOCX files
   - Verify file naming conventions
   - Test file storage in upload/cv directory
3. **File operations:**
   - Test file viewing (PDF viewer)
   - Test file downloading
   - Test file removal with confirmation

### 7. **Message Management Testing**

1. Go to **"Message Management"** section
2. **Submit test messages:**
   - Go to any profile page (e.g., `/brian-sun-ds`)
   - Scroll to Contact section
   - Fill out and submit contact form
   - Submit multiple test messages
3. **Manage messages:**
   - Go back to management console
   - View messages in the Message Management section
   - Test search functionality
   - Test status filtering (unread, read, replied, archived)
   - Mark messages as read/replied/archived
   - Delete individual messages
   - Test "Delete All" functionality

### 8. **Data Persistence Testing**

1. **Test localStorage persistence:**
   - Make changes in management console
   - Refresh the page
   - Verify changes are still there
2. **Test profile data persistence:**
   - Create new profiles
   - Edit profile data
   - Refresh page
   - Verify all data is preserved
3. **Test message persistence:**
   - Submit messages
   - Refresh page
   - Verify messages are still there
4. **Test session management:**
   - Login to management console
   - Test 60-minute session timeout
   - Test 5-minute warning dialog
   - Test session extension functionality

### 9. **Cross-Platform Testing**

1. **Test on different screen sizes:**
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
2. **Test responsive design:**
   - Verify all forms work on mobile
   - Check navigation works on all sizes
   - Test modal dialogs on mobile
   - Test QR code scanning on mobile devices
3. **Test endpoint-based routing:**
   - Access different profile endpoints
   - Test invalid endpoint handling
   - Verify profile switching via URL

## 🐛 Common Issues to Check

### Potential Issues:
1. **Form validation:** Ensure required fields are validated
2. **Date handling:** Check date inputs work correctly
3. **Modal responsiveness:** Verify modals work on mobile
4. **Data synchronization:** Ensure main website updates when profile changes
5. **Error handling:** Test with invalid data inputs
6. **Loading states:** Verify loading indicators work
7. **Unsaved changes:** Test unsaved changes tracking

### Browser Compatibility:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📊 Expected Results

### ✅ Success Criteria:
1. All profile creation methods work (manual, resume upload, copy)
2. Multi-profile management functions correctly
3. Auto-save functionality works for all editors
4. Resume parsing extracts data accurately
5. QR codes generate and function properly
6. File upload and management works correctly
7. Endpoint-based routing functions properly
8. Session management works as expected
9. Messages are stored and manageable
10. Data persists across page refreshes
11. Responsive design works on all devices
12. No console errors
13. All animations and transitions work smoothly

### 🚨 Failure Indicators:
1. Profile creation failing
2. Resume parsing not working
3. QR codes not generating
4. File uploads failing
5. Auto-save not functioning
6. Session timeout issues
7. Endpoint routing not working
8. Data not persisting
9. Messages not appearing
10. Mobile layout broken
11. Console errors
12. Forms not submitting

## 🔧 Debugging Tips

1. **Check browser console** for JavaScript errors
2. **Check localStorage** in browser dev tools
3. **Verify network requests** in Network tab
4. **Test with different data** to find edge cases
5. **Check responsive design** at different breakpoints

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________
Browser: ___________
Device: ___________

Profile Creation (Manual): ✅/❌
Profile Creation (Resume Upload): ✅/❌
Profile Creation (Copy): ✅/❌
Profile Management: ✅/❌
Resume Parsing: ✅/❌
QR Code Generation: ✅/❌
File Management: ✅/❌
Auto-save Functionality: ✅/❌
Session Management: ✅/❌
Endpoint Routing: ✅/❌
Message Management: ✅/❌
Data Persistence: ✅/❌
Responsive Design: ✅/❌

Issues Found:
- Issue 1: ___________
- Issue 2: ___________
- Issue 3: ___________

Overall Status: ✅ PASS / ❌ FAIL
```

## 🎯 Performance Expectations

- Page load time: < 3 seconds
- Profile creation: < 5 seconds
- Resume parsing: < 30 seconds
- File upload: < 10 seconds
- Auto-save: < 1 second
- Profile switching: < 500ms
- QR code generation: < 1 second
- Message loading: < 1 second
- Mobile responsiveness: 100%
- No memory leaks
- Smooth animations (60fps)
