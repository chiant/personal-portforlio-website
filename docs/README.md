# CVBot - Multi-Profile Portfolio Management System

A comprehensive multi-profile portfolio management system built with React, TypeScript, and Node.js. CVBot enables users to create, manage, and maintain multiple professional profiles from a single interface, featuring advanced capabilities including resume parsing, QR code generation, and hierarchical content management.

## 🚀 Features

### Multi-Profile Portfolio System
- **Endpoint-Based Routing**: Unique URLs for each profile (e.g., `/brian-sun-ds`, `/data-engineer`)
- **Dynamic Profile Loading**: Automatic profile switching based on URL endpoints
- **QR Code Generation**: Automatic QR codes for easy profile sharing
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **SEO Optimized**: Meta tags, Open Graph, and structured data for each profile
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Performance**: Fast loading with optimized images and code splitting

### Hierarchical Management Console
- **Secure Authentication**: Login system with 60-minute session timeout
- **Hierarchical Navigation**: Organized tree structure for easy navigation
- **Multi-Profile Management**: Create, edit, activate/deactivate, and delete profiles
- **Advanced Profile Creation**: Manual input, resume upload, or copy existing profiles
- **Auto-save Functionality**: Real-time data persistence without manual saves
- **Content Management**: Comprehensive editors for all profile sections
- **File Management**: Upload, organize, and manage profile photos and CV documents
- **Message Management**: View and manage visitor messages with filtering

### Advanced Technical Features
- **Resume Parsing**: Multi-format support (PDF, DOC, DOCX, TXT) with LLM integration
- **File Management**: Physical file storage with organized directory structure
- **Session Management**: Activity-based timeout with warning system
- **TypeScript**: Full type safety and better development experience
- **React 18**: Latest React features with hooks and concurrent rendering
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Framer Motion**: Smooth animations and transitions
- **JSON Data Storage**: All content stored in structured JSON format
- **Component Architecture**: Modular, reusable components with hierarchical organization

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **File Processing**: Multer, pdf-parse, OpenAI API
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **QR Codes**: qrcode library
- **Build Tool**: Vite
- **Linting**: ESLint, Prettier
- **Data**: JSON with TypeScript interfaces
- **Routing**: React Router DOM

## 📁 Project Structure

```
CVBot/
├── config/                   # Configuration files
│   ├── vite.config.ts       # Vite configuration
│   ├── tsconfig.json        # TypeScript configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── postcss.config.js    # PostCSS configuration
├── docs/                     # Documentation
│   ├── PRD.md              # Product Requirements Document
│   ├── README.md           # Project documentation
│   ├── TESTING_GUIDE.md    # Testing guide
│   └── samples/            # Sample files
├── public/                   # Static assets
│   └── icons/              # SVG icons
├── server/                   # Backend server
│   ├── server.js           # Express server
│   ├── package.json        # Server dependencies
│   └── upload/             # File upload directories
│       ├── cv/             # CV documents
│       └── photo/          # Profile photos
├── src/
│   ├── app/                # Main application
│   │   ├── App.tsx         # Root component
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── pages/              # Page components
│   │   ├── profile/        # Profile page components
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── components/ # Profile display components
│   │   │   └── shared/     # Shared profile components
│   │   └── management/     # Management console
│   │       ├── ManagementPage.tsx
│   │       ├── LoginPage.tsx
│   │       └── components/ # Management components
│   ├── services/           # Service layer
│   │   ├── dataService.ts  # Data management
│   │   ├── fileUploadService.ts # File operations
│   │   └── resumeParserService.ts # Resume parsing
│   ├── types/              # TypeScript definitions
│   └── utils/              # Utility functions
├── upload/                  # User uploads
│   ├── cv/                 # CV documents
│   └── photo/              # Profile photos
├── unused/                  # Archived files
└── data/                    # JSON data files
    └── profile-schema.json  # Data schema
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (for resume parsing feature)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chiant/personal-portforlio-website.git
   cd CVBot
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the server directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3004
   ```

5. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

6. **Start the frontend development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Main website: `http://localhost:3000`
   - Management console: `http://localhost:3000/management`
   - Backend API: `http://localhost:3004`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 📊 Data Management

### JSON Data Structure
All portfolio content is stored in `data/profile-data.json` following a structured schema defined in `data/profile-schema.json`. This approach provides:

- **Separation of Concerns**: Content separated from presentation
- **Easy Updates**: Modify content without touching code
- **Type Safety**: TypeScript interfaces ensure data consistency
- **Validation**: JSON schema validation for data integrity

### Management Console
Access the management console at `/management` with demo credentials:
- **Username**: admin
- **Password**: admin123

**Features:**
- Create new profiles manually or by uploading resumes
- Manage multiple profiles with activation/deactivation
- Edit all profile content with auto-save functionality
- Upload and manage profile photos and CV documents
- View and manage visitor messages
- Generate QR codes for profile sharing

## 🎨 Customization

### Styling
- **Colors**: Modify `tailwind.config.js` for custom color schemes
- **Typography**: Update font families in the config
- **Components**: Customize component styles in `src/index.css`

### Content
- **Profile Data**: Edit `data/profile-data.json`
- **Images**: Replace images in the `image/` directory
- **Documents**: Update CV files in the `doc/` directory

### Features
- **Sections**: Add/remove sections by modifying `App.tsx`
- **Components**: Create new components in `src/components/`
- **Animations**: Customize animations using Framer Motion

## 🔧 Configuration

### Environment Variables
Create a `.env` file for environment-specific settings:

```env
VITE_APP_TITLE="Brian Sun - Portfolio"
VITE_APP_DESCRIPTION="Professional portfolio website"
VITE_APP_URL="https://briansun-portfolio.com"
```

### Build Configuration
Modify `vite.config.ts` for build settings:

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- **WCAG 2.1 AA Compliant**
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Meets accessibility standards
- **Focus Management**: Clear focus indicators

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `dist/` directory can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Use GitHub Actions
- **AWS S3**: Upload to S3 bucket with static hosting

### Environment Setup
1. Set up your hosting platform
2. Configure custom domain (optional)
3. Set up analytics (Google Analytics, etc.)
4. Configure SSL certificate

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Image Optimization**: WebP format with fallbacks
- **Code Splitting**: Lazy loading for better performance
- **Caching**: Proper cache headers for static assets

## 🔒 Security

- **Input Validation**: All form inputs validated
- **XSS Protection**: React's built-in XSS protection
- **HTTPS**: SSL/TLS encryption
- **Authentication**: Secure login system for management console

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Brian Sun**
- Email: sun.gsm@hotmail.com
- Phone: (647)226-4508
- LinkedIn: [Brian Sun](https://www.linkedin.com/in/brian-sun-data-scientist/)
- Location: Greater Toronto Area, ON, Canada

## 🙏 Acknowledgments

- **Design Inspiration**: Modern portfolio designs and best practices
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion for smooth interactions
- **Styling**: Tailwind CSS for utility-first styling
- **Framework**: React and TypeScript for robust development

---

**Built with ❤️ by Brian Sun**
