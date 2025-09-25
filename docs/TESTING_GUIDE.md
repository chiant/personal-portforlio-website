# CVBot Management Console - Testing Guide

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Main website: `http://localhost:5173/`
   - Management console: `http://localhost:5173/admin`

3. **Login credentials:**
   - Username: `admin`
   - Password: `admin123`

## ✅ Test Scenarios

### 1. **Profile Management Testing**

#### Test Multi-Profile Functionality:
1. Go to `/admin` and login
2. Click on **"Profiles"** tab
3. **Create a new profile:**
   - Click "Create Profile" button
   - Enter name: "Test Profile - Data Engineer"
   - Enter description: "Test profile for data engineering role"
   - Click "Create Profile"
4. **Switch between profiles:**
   - Click "Switch" on the new profile
   - Verify the main website updates with new profile data
   - Switch back to original profile
5. **Duplicate a profile:**
   - Click the copy icon on any profile
   - Verify a new profile is created with "(Copy)" suffix
6. **Delete a profile:**
   - Try to delete the active profile (should be prevented)
   - Delete a non-active profile (should work)

#### Test Profile Data Editing:
1. Go to **"Personal Info"** tab
2. **Edit personal information:**
   - Change "Full Name" to "Test User"
   - Change "Professional Title" to "Test Engineer"
   - Verify "Unsaved Changes" indicator appears
3. **Save changes:**
   - Click "Save Changes" button
   - Verify success message and indicator disappears
4. **Verify on main website:**
   - Go to main website (`/`)
   - Verify changes are reflected

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

### 6. **Message Management Testing**

1. Go to **"Messages"** tab
2. **Submit test messages:**
   - Go to main website (`/`)
   - Scroll to Contact section
   - Fill out and submit contact form
   - Submit multiple test messages
3. **Manage messages:**
   - Go back to admin console
   - View messages in the Messages tab
   - Test search functionality
   - Test status filtering (unread, read, replied, archived)
   - Mark messages as read/replied/archived
   - Delete individual messages
   - Test "Delete All" functionality

### 7. **Data Persistence Testing**

1. **Test localStorage persistence:**
   - Make changes in management console
   - Refresh the page
   - Verify changes are still there
2. **Test profile switching persistence:**
   - Switch to different profile
   - Refresh page
   - Verify correct profile is still active
3. **Test message persistence:**
   - Submit messages
   - Refresh page
   - Verify messages are still there

### 8. **Cross-Platform Testing**

1. **Test on different screen sizes:**
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
2. **Test responsive design:**
   - Verify all forms work on mobile
   - Check navigation works on all sizes
   - Test modal dialogs on mobile

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
1. All forms save data correctly
2. Profile switching works seamlessly
3. Messages are stored and manageable
4. Main website reflects all changes
5. Data persists across page refreshes
6. Responsive design works on all devices
7. No console errors
8. All animations and transitions work smoothly

### 🚨 Failure Indicators:
1. Data not saving
2. Profile switching not working
3. Messages not appearing
4. Main website not updating
5. Data lost on refresh
6. Mobile layout broken
7. Console errors
8. Forms not submitting

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

Profile Management: ✅/❌
Experience Management: ✅/❌
Education Management: ✅/❌
Certifications Management: ✅/❌
Skills Management: ✅/❌
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
- Form submission: < 1 second
- Profile switching: < 500ms
- Message loading: < 1 second
- Mobile responsiveness: 100%
- No memory leaks
- Smooth animations (60fps)
