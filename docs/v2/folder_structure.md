# 🗂️ PROJECT FOLDER STRUCTURE (V2) - SchoolBridge LMS

This document outlines the recommended folder structure for the SchoolBridge V2 project. It is designed to be scalable, maintainable, and to clearly separate concerns, reflecting the complexity of the new LMS and offline-first architecture.

```
.
├── /prisma/
│   ├── schema.prisma         # The single source of truth for the database schema.
│   ├── seed.ts               # Script to seed the database with initial data.
│   └── /seed-data/
│       ├── users.json
│       ├── schools.json
│       ├── courses.json
│       └── ...               # JSON files used by the seed script.
│
├── /public/
│   ├── /icons/               # App icons for PWA manifest.
│   ├── /images/              # General static images.
│   └── manifest.json         # PWA manifest file.
│
├── /src/
│   ├── /app/
│   │   ├── /_trpc/             # Server-side tRPC procedures if used.
│   │   ├── /(api)/             # Group for all backend API routes.
│   │   │   └── /api/
│   │   │       ├── /auth/
│   │   │       ├── /courses/
│   │   │       ├── /enrollments/
│   │   │       ├── /grades/
│   │   │       ├── /users/
│   │   │       ├── /sync/              # Endpoints for client data sync.
│   │   │       └── /server-admin/      # Endpoints for local server management.
│   │   │
│   │   ├── /(dashboard)/       # Group for all authenticated app routes.
│   │   │   ├── /admin/
│   │   │   ├── /instructor/
│   │   │   ├── /student/
│   │   │   ├── /parent/
│   │   │   ├── /settings/
│   │   │   └── page.tsx          # Main dashboard page, redirects based on role.
│   │   │
│   │   ├── /(auth)/            # Group for login, register, etc.
│   │   │   ├── /login/
│   │   │   └── /register/
│   │   │
│   │   ├── layout.tsx          # Root layout of the application.
│   │   └── page.tsx            # Public homepage.
│   │
│   ├── /components/
│   │   ├── /auth/              # Login form, registration form, etc.
│   │   ├── /course/            # Components for course creation, viewing, etc.
│   │   │   ├── /content-types/ # Components for Video, Article, Quiz players.
│   │   │   └── /manage/        # Components for course editor, validation.
│   │   ├── /dashboard/         # Role-specific dashboard widgets.
│   │   ├── /offline/           # Offline status indicators, download manager UI.
│   │   ├── /shared/            # Common components (buttons, cards, layout).
│   │   └── /ui/                # Unstyled components from shadcn/ui.
│   │
│   ├── /hooks/                 # Custom React hooks.
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   └── useSync.ts          # Hook for managing offline sync state.
│   │
│   ├── /lib/
│   │   ├── auth.ts             # Authentication configuration (NextAuth).
│   │   ├── prisma.ts           # Prisma client instance.
│   │   ├── sync.ts             # Core client-side synchronization logic.
│   │   ├── utils.ts            # General utility functions.
│   │   └── zod.ts              # Zod schemas for validation.
│   │
│   ├── /services/              # Core backend business logic.
│   │   ├── course.service.ts
│   │   ├── user.service.ts
│   │   └── sync.service.ts     # Server-side logic for handling sync requests.
│   │
│   ├── /stores/                # Zustand stores for global state.
│   │   ├── auth.store.ts
│   │   └── sync.store.ts       # Manages client-side sync queue and status.
│   │
│   ├── /types/                 # TypeScript type definitions.
│   │   ├── index.ts
│   │   └── prisma.ts           # Types generated from the Prisma schema.
│   │
│   └── /trpc/                  # tRPC setup if chosen for API layer.
│       ├── client.ts
│       ├── context.ts
│       ├── router.ts
│       └── server.ts
│
└── package.json
```

### Key Directory Explanations

-   **`/prisma`**: Contains everything related to the database. The `schema.prisma` file is the most important file in the project, defining all data models. The `seed-data` directory is added to cleanly separate the seed data from the seeding logic.

-   **`/src/app`**: The heart of the Next.js application, using the App Router.
    -   **Route Groups (`(...)`)**: We use route groups to organize the application into logical sections (`api`, `dashboard`, `auth`) without affecting the URL structure.
    -   **/api**: Contains all backend API route handlers. These handlers should be lightweight, responsible only for handling HTTP requests and responses. They call the core business logic from the `/services` directory.
    -   **/dashboard**: Contains all pages and layouts for authenticated users. Sub-folders for each role (`admin`, `instructor`, `parent`, `student`) will contain role-specific pages.
        -   **`/admin/`**: Pages for `ADMIN` roles to manage the platform, schools, users, and system settings.
            - `page.tsx`: Main admin dashboard with system health and stats.
            - `users/page.tsx`: User management interface.
            - `schools/page.tsx`: School management interface.
            - `server-management/page.tsx`: Monitor and configure local `SchoolServer` instances.
            - `audit-logs/page.tsx`: View system audit trails.
        -   **`/instructor/`**: Pages for `INSTRUCTOR` roles to create courses, manage students, and grade work.
            - `page.tsx`: Instructor dashboard with course overviews and pending tasks.
            - `courses/page.tsx`: List of courses taught by the instructor.
            - `courses/create/page.tsx`: Form to create new courses.
            - `courses/[courseId]/edit/page.tsx`: The main course editor.
            - `grades/page.tsx`: The gradebook interface.
        -   **`/parent/`**: Pages for `PARENT` roles to monitor their children's progress.
            - `page.tsx`: Parent dashboard with a summary of all linked children.
            - `children/[childId]/progress/page.tsx`: Detailed progress report for a specific child.
            - `children/[childId]/grades/page.tsx`: View a specific child's grades.
        -   **`/student/`**: Pages for `STUDENT` roles to access courses, track progress, and manage offline content.
            - `page.tsx`: Student dashboard with current courses and assignments.
            - `courses/[courseId]/view/page.tsx`: The main course player/viewer interface.
            - `progress/page.tsx`: Personal progress and analytics page.
            - `offline/page.tsx`: Interface to manage downloaded content and sync status.

-   **`/src/components`**: Contains all React components.
    -   **/ui**: For the base, unstyled components generated by `shadcn/ui`.
    -   **/shared**: For common, project-specific components built using the `ui` components (e.g., `PageLayout`, `DataTable`, `SideNav`).
    -   Other folders are organized by feature/domain (e.g., `/course`, `/auth`).

-   **`/src/lib`**: A critical directory for shared code, configuration, and core client-side logic.
    -   `auth.ts` and `prisma.ts` are for configuring and instantiating third-party libraries.
    -   `sync.ts` is a new, important file that will contain the client's logic for handling offline mutations, queueing, and communicating with the sync API.

-   **`/src/services`**: **(New)** This directory is introduced to separate business logic from the API layer.
    -   Each file corresponds to a data model or domain (e.g., `course.service.ts`).
    -   Functions in these files contain the actual business logic (e.g., how to create a course, how to resolve sync conflicts).
    -   This makes the logic more reusable, testable, and keeps the API route handlers clean.

-   **`/src/stores`**: For client-side global state management using Zustand.
    -   The `sync.store.ts` is particularly important for managing the state of the offline queue, download progress, and the current network status across the entire application.

-   **`/src/types`**: Central location for all TypeScript types, ensuring consistency.

-   **`/src/trpc`**: **(Optional)** Stands for TypeScript Remote Procedure Call. It's a modern alternative to traditional REST APIs. If the team decides to use it, this is where its configuration would live. It offers end-to-end type safety from the backend to the frontend, which is a major advantage. If not used, this directory can be removed.