# 🌉 SchoolBridge

**Tagline:** "Bridging Education Gaps, Online and Offline"

An offline-first school management platform designed for Madagascar and other regions with limited internet connectivity. SchoolBridge connects teachers, students, and parents with robust offline capabilities and seamless synchronization.

## 🎯 Project Overview

SchoolBridge is a Progressive Web App (PWA) that enables schools to function effectively even with poor or intermittent internet connectivity. Built with Next.js 14, TypeScript, and PostgreSQL, it provides comprehensive school management features with a focus on offline-first architecture.

### Key Features

- **Offline-First Architecture**: Full functionality with limited or no internet
- **Multi-Role Support**: Admin, Teacher, Student, and Parent roles with tailored experiences
- **Course Management**: Create, validate, and assign courses with rich content types
- **PWA Capabilities**: Installable app with offline course downloads
- **Parent-Teacher Communication**: Direct messaging and progress tracking
- **Robust Sync**: Delta sync with conflict resolution
- **Multilingual**: French and English support (with Malagasy content)
- **Security**: 2FA, rate limiting, audit logging, RBAC

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Internationalization**: next-intl

### Backend
- **Runtime**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Password Hashing**: bcryptjs

### Infrastructure
- **Hosting**: Vercel
- **Database**: Neon PostgreSQL (EU Central)
- **Monitoring**: (To be configured - Sentry)
- **Testing**: Jest, Playwright, Testing Library

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon credentials configured)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/micheltsarasoa/schoolbridge.git
cd schoolbridge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your-database-connection-string"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secret-here-for-production"

# App Configuration
NODE_ENV="development"
```

**⚠️ Security Note**: Never commit `.env` or `.env.local` files to version control. Use environment variables in production.

### 4. Database Setup

The database schema has already been migrated to Neon PostgreSQL. To reset or re-run migrations:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
schoolbridge/
├── docs/                          # Project documentation
│   ├── 01. Project Charter.md
│   ├── 02. User Stories & Use Cases.md
│   ├── 03. Technical Architecture.md
│   ├── 04. Development Roadmap.md
│   ├── 05. Test Strategy & Procedures.md
│   ├── 06. Implementation Guide.md
│   ├── 07. Complete Database Setup.md
│   └── TODO.md
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── public/                       # Static assets
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   ├── courses/         # Course management
│   │   │   └── sync/            # Offline sync
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── auth/                # Authentication components
│   │   ├── course/              # Course components
│   │   └── parent/              # Parent-specific components
│   ├── lib/                     # Utility functions
│   │   ├── prisma.ts           # Prisma client singleton
│   │   └── utils.ts            # Helper functions
│   ├── hooks/                   # Custom React hooks
│   ├── stores/                  # Zustand stores
│   ├── types/                   # TypeScript types
│   └── generated/prisma/        # Generated Prisma Client
├── .env.local                   # Environment variables (not in git)
├── components.json              # shadcn/ui configuration
├── package.json
├── prisma.config.ts            # Prisma configuration
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

## 🗄️ Database Schema

The database includes models for:

- **User Management**: Users, Accounts, Sessions, Roles
- **School Management**: Schools, SchoolConfig
- **Course System**: Courses, CourseContent, CourseValidation, ContentVersion
- **Progress Tracking**: StudentProgress
- **Communication**: ParentInstruction, ParentInstructionCompletion
- **Notifications**: Notification system
- **Audit**: AuditLog for security tracking

See `prisma/schema.prisma` for the complete schema.

## 📜 Available Scripts

```bash
# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint

# Database
npx prisma generate   # Generate Prisma Client
npx prisma migrate dev # Run migrations
npx prisma studio     # Open database GUI

# Testing (to be configured)
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:e2e      # Run E2E tests
```

## 🔐 Security Features

- **Authentication**: JWT-based with NextAuth.js
- **Password Security**: bcrypt hashing with salt rounds
- **Rate Limiting**: Protection against brute force attacks
- **2FA**: Two-factor authentication for admin roles
- **RBAC**: Role-based access control
- **Audit Logging**: Track all sensitive operations
- **Data Encryption**: At rest and in transit
- **GDPR/COPPA**: Compliance built-in

## 🌍 Internationalization

SchoolBridge supports multiple languages:
- **French** (FR) - Primary
- **English** (EN) - Secondary
- **Malagasy** (MG) - Course content
- **Spanish** (ES) - Course content

## 📱 PWA Features (Coming Soon)

- Installable on Android/iOS devices
- Service Worker with Workbox
- IndexedDB for offline storage
- Background sync
- Push notifications
- Offline course downloads

## 🧪 Testing Strategy

- **Unit Tests**: Jest + Testing Library
- **Integration Tests**: Playwright
- **E2E Tests**: Playwright
- **Load Tests**: k6 / Artillery
- **Accessibility**: axe-core
- **Coverage Goal**: 85%+

## 📊 Development Timeline

**Total Duration**: 28-30 weeks (6-7 months)

### Phase 1: Foundation & Security (Weeks 1-6)
- Infrastructure, authentication, RBAC, monitoring

### Phase 2: Core Features (Weeks 7-14)
- Course management, validation workflow, parent features

### Phase 3: Offline & PWA (Weeks 15-22)
- PWA setup, offline sync, course downloads

### Phase 4: Testing & Launch (Weeks 23-30)
- Testing, security audit, performance, pilot deployment

See `docs/TODO.md` for detailed sprint breakdown.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

[To be determined]

## 📞 Contact

- **Email**: contact@schoolbridge.app
- **Domain**: schoolbridge.app

## 🙏 Acknowledgments

Built for schools in Madagascar and other regions with limited connectivity. Special thanks to educators working in challenging environments.

---

**SchoolBridge** - Bridging Education Gaps, Online and Offline 🌉
