# SchoolBridge - Project Overview

## Executive Summary

SchoolBridge is an offline-first school management platform and Learning Management System (LMS) designed specifically for Madagascar and regions with limited internet connectivity. Built as a Progressive Web App (PWA) using Next.js 14, TypeScript, and PostgreSQL, it provides comprehensive educational management capabilities with robust offline functionality.

## Project Classification

- **Project Name**: SchoolBridge  
- **Project Type**: Web Application (Monolithic)
- **Architecture Type**: Offline-first PWA with multi-tenant LMS
- **Repository Structure**: Single repository (monolith)
- **Primary Language**: TypeScript

## Technology Stack Summary

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 16.0.1 | Full-stack React framework with App Router |
| **Language** | TypeScript | 5.x | Type-safe JavaScript development |
| **Runtime** | React | 19.2.0 | Frontend UI library |
| **Database** | PostgreSQL | - | Primary data store (Neon hosting) |
| **ORM** | Prisma | 6.19.0 | Database client and schema management |
| **Authentication** | NextAuth.js | 5.0.0-beta.30 | OAuth and session management |
| **Styling** | Tailwind CSS | 4.1.16 | Utility-first CSS framework |
| **UI Components** | shadcn/ui + Radix UI | Various | Component library and primitives |
| **State Management** | Zustand | 5.0.8 | Client-side state management |
| **Internationalization** | next-intl | 4.4.0 | Multi-language support |
| **Forms** | React Hook Form | 7.66.0 | Form validation and handling |
| **Rich Text** | TipTap | 3.10.7 | WYSIWYG editor for content creation |
| **Testing** | Jest + Playwright | 30.2.0 / 1.57.0 | Unit and E2E testing |
| **Security** | bcryptjs | 3.0.2 | Password hashing |
| **Monitoring** | Sentry | 10.22.0 | Error tracking and performance |

## Architecture Pattern

**Component-Based Architecture** with layered organization:
- **Presentation Layer**: React components with shadcn/ui
- **API Layer**: Next.js API routes  
- **Business Logic**: Service layer with Prisma ORM
- **Data Layer**: PostgreSQL with comprehensive schema

## Repository Structure

**Type**: Monolithic application
**Organization**: Next.js App Router structure with feature-based modules
**Key Directories**: 
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React UI components organized by feature
- `prisma/` - Database schema, migrations, and seed data
- `docs/` - Project documentation and requirements

## Getting Started

1. **Prerequisites**: Node.js 18+, PostgreSQL database access
2. **Installation**: `npm install`
3. **Database**: `npx prisma generate && npx prisma migrate dev`
4. **Development**: `npm run dev`
5. **Access**: http://localhost:3000

## Key Features

- **Multi-Role Support**: Admin, Teacher, Student, Parent with tailored dashboards
- **Comprehensive LMS**: Course creation, content management, progress tracking
- **Offline-First**: PWA with offline course downloads and sync
- **Multi-Tenant**: School isolation with dedicated configuration
- **Security**: 2FA, RBAC, audit logging, rate limiting
- **Multilingual**: French, English, Malagasy content support

---

*Generated on 2025-12-16 by BMad Method Document Project Workflow*