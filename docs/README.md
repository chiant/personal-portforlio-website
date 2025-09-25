# Brian Sun - Professional Portfolio Website

A modern, responsive professional portfolio website built with React, TypeScript, and Tailwind CSS. This project serves as a digital resume for Brian Sun, a Certified Senior Data Scientist, featuring a public-facing portfolio and a private management console for content updates.

## 🚀 Features

### Public Portfolio
- **Modern Design**: Clean, professional UI with smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Interactive Sections**: 
  - Hero section with professional headshot
  - About section with core competencies
  - Experience timeline with detailed achievements
  - Education and certifications showcase
  - Technical skills with proficiency indicators
  - Contact form with validation
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Performance**: Fast loading with optimized images and code splitting

### Management Console
- **Secure Authentication**: Login system for content management
- **Content Management**: Edit personal information, experience, skills, etc.
- **Live Preview**: Preview changes before publishing
- **Data Validation**: JSON schema validation for data integrity
- **Backup & Restore**: Version control and backup capabilities

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **React 18**: Latest React features with hooks and concurrent rendering
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Framer Motion**: Smooth animations and transitions
- **JSON Data Storage**: All content stored in structured JSON format
- **Component Architecture**: Modular, reusable components

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint, Prettier
- **Data**: JSON with TypeScript interfaces

## 📁 Project Structure

```
CVBot/
├── public/                     # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── management/        # Management console components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Hero.tsx          # Hero section
│   │   ├── About.tsx         # About section
│   │   ├── Experience.tsx    # Work experience
│   │   ├── Education.tsx     # Education section
│   │   ├── Certifications.tsx # Certifications
│   │   ├── Skills.tsx        # Technical skills
│   │   ├── Contact.tsx       # Contact form
│   │   ├── Footer.tsx        # Footer
│   │   └── ...
│   ├── data/                 # Data management
│   │   ├── profileData.ts    # Data utilities
│   │   └── profile-data.json # Main data file
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
├── data/                     # JSON data files
│   ├── profile-data.json     # Main profile data
│   └── profile-schema.json   # JSON schema
├── doc/                      # Documents
│   ├── Brian Sun - CV - PDF version.pdf
│   └── Brian Sun - CV - text version.txt
├── image/                    # Images
│   └── profile-photo.jpg
└── PRD.md                   # Product Requirements Document
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CVBot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

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
Access the management console at `/admin` with demo credentials:
- **Username**: admin
- **Password**: admin123

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
