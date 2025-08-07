# CILG Lexicon - Academic Legal Research Platform

A modern, full-stack web application for academic legal research and content management, built with React, TypeScript, and Supabase.

## 🚀 Features

- **Academic Content Management**: Blog posts, research articles, and legal resources
- **Dynamic Image Management**: Advanced image upload, optimization, and management system
- **Admin Dashboard**: Comprehensive admin interface for content moderation and management
- **Team Management**: Member profiles and team page management
- **Email Integration**: Automated email notifications and communication
- **Responsive Design**: Mobile-first approach with modern UI components
- **Real-time Updates**: Live content updates with Supabase integration
- **Authentication**: Role-based access control and user management

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern component library
- **Radix UI** - Headless UI primitives
- **Framer Motion** - Animation library
- **React Router** - Client-side routing

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Primary database
- **Row Level Security** - Data security
- **Edge Functions** - Serverless functions

### Additional Libraries
- **TanStack React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icon library
- **Recharts** - Data visualization

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cilg-lexicon.git
cd cilg-lexicon

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with your Supabase credentials
cp .env.example .env.local

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Database Setup

The project uses Supabase with the following main tables:
- `blog_posts` - Blog articles and research content
- `team_members` - Team member profiles
- `settings` - Application settings and configuration
- `hero_images` - Dynamic hero image management
- `dynamic_images` - General image management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── lib/                # Utility functions and services
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── data/               # Static data and types
└── assets/             # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ using modern web technologies for academic excellence.
