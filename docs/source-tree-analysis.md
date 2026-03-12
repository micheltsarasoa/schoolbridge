# SchoolBridge - Source Tree Analysis

## Directory Structure with Annotations

```
schoolbridge/
├── .bmad/                          # BMad Method configuration and workflows
│   ├── bmm/                        # BMM module configs and workflows
│   │   ├── agents/                 # AI agent configurations
│   │   ├── docs/project/           # Project documentation (Charter, User Stories, Roadmap)
│   │   └── workflows/              # Workflow definitions and templates
│   └── core/                       # Core BMad configuration
├── .github/                        # GitHub Actions CI/CD workflows
├── docs/                           # Generated project documentation (BMM output)
├── prisma/                         # Database layer
│   ├── schema.prisma              # Database schema definition
│   ├── migrations/                # Database migration files
│   ├── seed.ts                   # Database seed script
│   ├── seeds/                    # Specialized seed scripts (courses, etc.)
│   ├── scripts/                  # Database utility scripts
│   └── seed-data/                # JSON data files for seeding
├── public/                         # Static assets served by Next.js
│   ├── *.svg                     # Icon assets
├── scripts/                        # Project utility scripts
│   └── check-db.ts               # Database validation script
├── src/                            # 🎯 MAIN APPLICATION SOURCE
│   ├── app/                        # Next.js App Router (entry point)
│   │   ├── api/                    # 🌐 API ROUTES (backend functionality)
│   │   │   ├── admin/              # Admin-specific endpoints
│   │   │   │   ├── classes/        # Class management API
│   │   │   │   ├── reports/        # Admin reporting API
│   │   │   │   ├── schools/        # School configuration API
│   │   │   │   └── users/          # User management API
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   │   └── [...nextauth]/  # NextAuth.js routes
│   │   │   ├── assignments/        # Assignment management API
│   │   │   ├── attendance/         # Attendance tracking API
│   │   │   ├── classes/            # Class operations API
│   │   │   ├── courses/            # Course management API
│   │   │   ├── notifications/      # Notification system API
│   │   │   ├── profile/            # User profile API
│   │   │   ├── progress/           # Learning progress API
│   │   │   ├── quizzes/            # Quiz system API
│   │   │   ├── register/           # User registration API
│   │   │   ├── schedules/          # Scheduling API
│   │   │   └── schools/            # School data API
│   │   ├── (auth)/                 # 🔐 AUTHENTICATION PAGES (grouped route)
│   │   │   ├── error/              # Auth error handling
│   │   │   ├── login/              # Login page
│   │   │   ├── onboarding/         # User onboarding flow
│   │   │   ├── register/           # Registration pages
│   │   │   └── verify-email/       # Email verification
│   │   ├── [role]/                 # 👥 ROLE-BASED DASHBOARDS (dynamic routes)
│   │   │   ├── admin/              # Admin dashboard and features
│   │   │   ├── instructor/         # Teacher dashboard and tools
│   │   │   ├── parent/             # Parent portal
│   │   │   └── student/            # Student learning interface
│   │   ├── favicon.ico             # Site favicon
│   │   ├── global-error.tsx        # Global error boundary
│   │   ├── globals.css             # Global CSS styles
│   │   ├── layout.tsx              # 🏛️ ROOT LAYOUT (app shell)
│   │   └── page.tsx                # 🏠 LANDING PAGE (entry point)
│   ├── components/                 # 🧩 REACT COMPONENTS (reusable UI)
│   │   ├── ui/                     # shadcn/ui base components
│   │   ├── admin/                  # Admin-specific components
│   │   ├── auth/                   # Authentication components
│   │   ├── course/                 # Course-related components
│   │   ├── instructor/             # Teacher tools components
│   │   ├── parent/                 # Parent portal components
│   │   ├── student/                # Student interface components
│   │   └── charts/                 # Data visualization components
│   ├── lib/                        # 🛠️ UTILITY FUNCTIONS
│   │   ├── auth.ts                 # Authentication utilities
│   │   ├── prisma.ts               # Prisma client singleton
│   │   ├── utils.ts                # General utility functions
│   │   └── validations/            # Zod schema validations
│   ├── hooks/                      # 🪝 CUSTOM REACT HOOKS
│   ├── stores/                     # 🗂️ ZUSTAND STATE STORES
│   ├── types/                      # 📝 TYPESCRIPT TYPE DEFINITIONS
│   └── generated/                  # 🤖 AUTO-GENERATED CODE
│       └── prisma/                 # Generated Prisma client
├── test-results/                   # Playwright test output
├── tests/                          # Test files (E2E with Playwright)
├── .env.example                    # Environment variables template
├── components.json                 # shadcn/ui configuration
├── next.config.ts                  # 🎯 NEXT.JS CONFIGURATION (entry config)
├── package.json                    # 📦 PROJECT MANIFEST (dependency management)
├── playwright.config.ts            # E2E testing configuration
├── postcss.config.mjs              # PostCSS configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # 🎯 TYPESCRIPT CONFIGURATION
└── sentry.*.config.ts              # Sentry monitoring configuration
```

## Critical Folders Explanation

### 🎯 **Entry Points**
- **`src/app/layout.tsx`**: Root application shell and providers
- **`src/app/page.tsx`**: Landing page and initial routing logic  
- **`next.config.ts`**: Next.js configuration with PWA and internationalization
- **`package.json`**: Project dependencies and build scripts

### 🌐 **API Architecture** (`src/app/api/`)
- **RESTful Design**: Organized by resource with nested routes
- **Role-Based Endpoints**: Admin-specific APIs separated under `/admin/`
- **Feature Modules**: Clear separation by domain (auth, courses, quizzes, etc.)
- **NextAuth Integration**: Authentication handled via `[...nextauth]` dynamic route

### 👥 **Frontend Architecture** (`src/app/[role]/`)
- **Role-Based Routing**: Dynamic routes for different user dashboards
- **Component Organization**: Feature-based component structure in `src/components/`
- **UI System**: shadcn/ui base components with custom extensions

### 🗄️ **Data Layer** (`prisma/`)
- **Schema-Driven**: Single source of truth in `schema.prisma`
- **Migration Management**: Versioned database changes
- **Rich Seed Data**: Comprehensive test data in JSON format
- **Utility Scripts**: Database maintenance and validation tools

### 🛠️ **Development Infrastructure**
- **Type Safety**: Full TypeScript integration with strict mode
- **Testing**: Unit tests (Jest) and E2E tests (Playwright)
- **Code Quality**: ESLint configuration and pre-commit hooks
- **Monitoring**: Sentry integration for error tracking

## Architecture Highlights

- **Offline-First Design**: PWA capabilities with service worker and local caching
- **Multi-Tenant**: School-based data isolation
- **Component-Based UI**: Modular React components with consistent design system  
- **API-First**: Clean separation between frontend and backend logic
- **Type-Safe**: End-to-end TypeScript for development safety

---

*Generated on 2025-12-16 by BMad Method - Quick Scan Analysis*