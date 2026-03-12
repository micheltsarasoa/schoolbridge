# SchoolBridge - Project Documentation Index

## Project Overview

- **Type:** monolithic web application
- **Primary Language:** TypeScript
- **Architecture:** Component-based with offline-first PWA design

## Quick Reference

- **Tech Stack:** Next.js 16 + React 19 + TypeScript + PostgreSQL + Prisma
- **Entry Point:** src/app/layout.tsx (root layout) & src/app/page.tsx (landing)
- **Architecture Pattern:** Layered monolith with API routes and component hierarchy

## Generated Documentation

- [Project Overview](./project-overview.md) - Executive summary and tech stack details
- [Source Tree Analysis](./source-tree-analysis.md) - Annotated directory structure and critical folders
- [Development Guide](./development-guide.md) - Setup instructions and development workflow
- [Architecture](./architecture.md) _(To be generated)_
- [Component Inventory](./component-inventory.md) _(To be generated)_
- [API Contracts](./api-contracts.md) _(To be generated)_
- [Data Models](./data-models.md) _(To be generated)_

## Existing Project Documentation

- [README.md](../README.md) - Main project documentation with comprehensive setup and overview
- [Project Charter v2](./.bmad/bmm/docs/project/01.%20Project%20Charter.md) - Vision, scope, and success criteria for LMS implementation
- [User Stories & Use Cases](./.bmad/bmm/docs/project/02.%20User%20Stories%20&%20User%20Cases%20Documents.md) - Detailed user requirements and scenarios  
- [Development Roadmap](./.bmad/bmm/docs/project/04.%20Development%20Roadmap%20&%20Sprint%20Planning.md) - Timeline and sprint breakdown

## Technical Reports

- [Course Builder Improvements](../COURSE_BUILDER_IMPROVEMENTS.md) - Enhancement documentation
- [Deployment Checklist](../DEPLOYMENT_CHECKLIST.md) - Production deployment procedures
- [GitHub Setup](../GITHUB_SETUP.md) - Repository configuration guide
- [Report Generation Complete](../REPORT_GENERATION_COMPLETE.md) - Analysis completion summary

## Getting Started

### For Developers
1. **Prerequisites**: Install Node.js 18+, ensure PostgreSQL database access
2. **Setup**: Clone repository, run `npm install`
3. **Database**: Configure `.env.local` with DATABASE_URL, run `npx prisma migrate dev`
4. **Development**: Start with `npm run dev`, access at http://localhost:3000

### For AI-Assisted Development
- **Primary Reference**: Start with this index.md for project context
- **Architecture Context**: Use [Project Overview](./project-overview.md) for high-level understanding
- **Code Structure**: Reference [Source Tree Analysis](./source-tree-analysis.md) for navigation
- **Development Setup**: Follow [Development Guide](./development-guide.md) for environment configuration

### Key Project Context
- **Mission**: Offline-first educational platform for Madagascar and regions with limited connectivity
- **Architecture**: Multi-tenant LMS with PWA capabilities and local school server infrastructure
- **Current Phase**: Foundation development with comprehensive user management and course system

---

*Master index generated on 2025-12-16 by BMad Method Document Project Workflow*

**Note**: This documentation provides comprehensive project context for future development phases, requirements analysis, and AI-assisted development workflows.