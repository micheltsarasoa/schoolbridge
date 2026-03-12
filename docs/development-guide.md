# SchoolBridge - Development Guide
 
## Prerequisites
 
- **Node.js**: Version 18+ 
- **Package Manager**: npm (included with Node.js)
- **Database**: PostgreSQL database access (Neon credentials configured)
- **Git**: For version control
 
## Environment Setup
 
### 1. Clone Repository
```bash
git clone https://github.com/micheltsarasoa/schoolbridge.git
cd schoolbridge
```
 
### 2. Install Dependencies
```bash
npm install
```
 
### 3. Environment Variables
Create `.env.local` file in the root directory:
 
```env
# Database
DATABASE_URL="your-neon-postgresql-connection-string"
 
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secret-here-for-production"
 
# Application Environment
NODE_ENV="development"
```
 
**⚠️ Security**: Never commit `.env` or `.env.local` files to version control
 
## Database Setup
 
### Initial Setup
```bash
# Generate Prisma Client
npx prisma generate
 
# Run database migrations
npx prisma migrate dev
 
# Open Prisma Studio (database GUI)
npx prisma studio
```
 
### Development Database Commands
```bash
# Push schema changes without migration
npm run db:push
 
# Create and run new migration
npm run db:migrate  
 
# Generate Prisma client after schema changes
npm run db:generate
 
# Seed database with default data
npm run seed

# Open database GUI
npm run db:studio
```
 
## Development Workflow
 
### Start Development Server
```bash
npm run dev
```
- **Access**: http://localhost:3000
- **Hot Reload**: Automatic code reloading
- **TypeScript**: Real-time type checking
 
### Available Scripts
 
| Script | Command | Purpose |
|--------|---------|---------|
| **Development** | `npm run dev` | Start development server with hot reload |
| **Build** | `npm run build` | Build optimized production bundle |
| **Production** | `npm run start` | Start production server (requires build) |
| **Linting** | `npm run lint` | Run ESLint code quality checks |
 
### Testing Commands
 
| Script | Command | Purpose |
|--------|---------|---------|
| **Unit Tests** | `npm run test` | Run Jest unit tests |
| **Test Watch** | `npm run test:watch` | Run tests in watch mode |
| **E2E Tests** | `npm run test:e2e` | Run Playwright end-to-end tests |
 
## Project Structure - Development Focus
 
### Key Development Directories
 
```
src/
├── app/                            # 🎯 Next.js App Router (main development area)
│   ├── api/                        # Backend API routes
│   │   ├── admin/                  # Admin management APIs
│   │   ├── auth/                   # Authentication & session APIs
│   │   ├── courses/                # Course management APIs
│   │   ├── assignments/            # Assignment APIs
│   │   ├── quizzes/                # Quiz system APIs
│   │   └── progress/               # Progress tracking APIs
│   ├── (auth)/                     # Authentication pages (route group)
│   ├── [role]/                     # Role-based dashboard pages
│   │   ├── admin/                  # Admin interface
│   │   ├── instructor/             # Teacher tools
│   │   ├── student/                # Student learning interface
│   │   └── parent/                 # Parent portal
│   ├── layout.tsx                  # Root layout with providers
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Global styles
├── components/                     # 🧩 React Components
│   ├── ui/                         # shadcn/ui base components
│   ├── auth/                       # Authentication components
│   ├── course/                     # Course-related components
│   ├── admin/                      # Admin interface components
│   ├── instructor/                 # Teacher tools components  
│   ├── student/                    # Student UI components
│   └── parent/                     # Parent portal components
├── lib/                            # 🛠️ Utility Functions
│   ├── auth.ts                     # NextAuth configuration
│   ├── prisma.ts                   # Prisma client singleton
│   ├── utils.ts                    # General utilities
│   └── validations/                # Zod schema validations
├── hooks/                          # Custom React hooks
├── stores/                         # Zustand state management
├── types/                          # TypeScript type definitions
└── generated/                      # Auto-generated code (Prisma)
```
 
## Technology Integration Points
 
### Database Integration
- **Prisma ORM**: Type-safe database access via generated client
- **Schema Location**: `prisma/schema.prisma`
- **Migrations**: Automatic via `prisma migrate dev`
- **Client Generation**: Auto-generated types in `src/generated/prisma/`
 
### Authentication Flow
- **NextAuth.js**: OAuth and session management
- **Configuration**: `src/lib/auth.ts`
- **API Routes**: `src/app/api/auth/[...nextauth]/`
- **Protection**: Middleware for route protection
 
### UI Components
- **Base System**: shadcn/ui + Radix UI primitives
- **Configuration**: `components.json`
- **Styling**: Tailwind CSS utility classes
- **Extensions**: Custom components in feature folders
 
### State Management
- **Zustand**: Lightweight state management in `src/stores/`
- **Server State**: React server components + API routes
- **Client State**: Zustand for UI state management
 
## Synchronization Infrastructure
 
### Syncable Entity Structure
All records persisted locally in IndexedDB for eventual synchronization with the server adhere to the `SyncableEntity` interface defined in [`src/lib/sync/db.ts`](src/lib/sync/db.ts:6). This structure ensures that the client can accurately track local changes and resolve conflicts.
 
| Field | Type | Purpose | Enabled By |
|---|---|---|---|
| `clientId` | string | Unique client-generated ID for record identification and conflict detection. | Hybrid Sync |
| `clientUpdatedAt` | Date | Timestamp of the last modification made on the client side. Used for Last-Write-Wins (LWW) conflict resolution. | Hybrid Sync |
| `isDeleted` | boolean | Soft-delete flag for records removed client-side but awaiting server deletion confirmation. | Hybrid Sync |
| `syncVersion` | number (Implied) | Incremental version counter used during server reconciliation to ensure correct ordering of operations. | Sync Versioning Migration |
 
### Hybrid Sync Fields
The fields `clientId`, `clientUpdatedAt`, and `isDeleted` are critical for **Hybrid Synchronization**. This mechanism allows writes (like progress updates or quiz submissions) to occur locally while offline, ensuring that when connectivity is restored, the system can reliably push changes and merge them using LWW based on `clientUpdatedAt`.
 
### Server Reconciliation
The `startSync` action in [`src/stores/useSyncStore.ts`](src/stores/useSyncStore.ts:102) executes the reconciliation protocol. This protocol uses the version and timestamp metadata to determine which records need pushing (new/modified local records) and which records need pulling (new/modified server records since the `lastSuccessfulSync`).
 
## Common Development Tasks
 
### Adding New Features
1. **Database**: Update `prisma/schema.prisma` if needed
2. **API**: Create API route in `src/app/api/[feature]/`
3. **Components**: Add UI components in `src/components/[feature]/`
4. **Pages**: Add page in appropriate role folder `src/app/[role]/`
5. **Types**: Define TypeScript types in `src/types/`
 
### Database Changes
```bash
# 1. Update schema.prisma
# 2. Generate migration
npx prisma migrate dev --name describe-your-change
 
# 3. Update seed data if needed
# Edit files in prisma/seed-data/
 
# 4. Re-seed database
npm run db:seed
```
 
### Component Development
- **Base Components**: Use shadcn/ui components from `src/components/ui/`
- **Feature Components**: Create in appropriate feature folder
- **Styling**: Use Tailwind CSS classes
- **TypeScript**: Leverage strict typing for props and state
 
## Build Process
 
### Development Build
- **Next.js**: Automatic bundling and optimization
- **TypeScript**: Compile-time type checking
- **Tailwind**: CSS compilation and purging
- **Prisma**: Automatic client generation
 
### Production Build
```bash
npm run build
```
- **Optimization**: Automatic code splitting and minification
- **Static Generation**: Pre-rendered pages where possible
- **PWA**: Service worker generation for offline capabilities
 
---
 
## Feature Documentation: US 2.2 Granular Download Selection
 
### Description
User Story US 2.2 implements the foundational server-side and client-side mechanisms to allow students to select specific content items (Course, Section, or individual Lecture/Lesson) for offline download, supporting efficient storage management.
 
### Implementation Details
 
| Component | Path | Description | Changes Made |
|---|---|---|---|
| **API Route (New)** | [`src/app/api/courses/[id]/structure/route.ts`](src/app/api/courses/[id]/structure/route.ts:1) | Provides the course hierarchy (Sections and Lectures) to the client. This route is permissioned for enrolled students, course teachers, and administrators. It includes download-relevant metadata like `sizeBytes` and `offlineAvailable`. | New file created for student-facing API access to course structure. |
| **Client Store Logic** | [`src/stores/useSyncStore.ts`](src/stores/useSyncStore.ts:1) | Extends the synchronization state manager to include an entry point for initiating granular downloads. | Added `enqueueContentDownload(contentType, contentId, quality)` action to trigger download queue population based on high-level content entities. |
 
### Feature Documentation: US 2.3 Pre-Download Storage Indicator
 
### Description
User Story US 2.3 provides students with the estimated storage requirement before a download starts, enabling proactive storage management. This builds on the granular selection (US 2.2) to provide size estimates for courses, sections, or individual lectures.
 
### Implementation Details
 
| Component | Path | Description | Changes Made |
|---|---|---|---|
| **API Enhancement** | [`src/app/api/courses/[id]/structure/route.ts`](src/app/api/courses/[id]/structure/route.ts:1) | Updated data selection to expose `Course.totalSizeBytes` to the client for full course size estimates, alongside `Lecture.sizeBytes` for granular estimates. | Added `totalSizeBytes` to course selection. |
| **Client Store Logic** | [`src/stores/useSyncStore.ts`](src/stores/useSyncStore.ts:1) | Implements the core logic for size estimation and display before download initiation. | Added `estimatedDownloadSize` state field and implemented `calculateDownloadEstimate` action (simulated) to derive size based on selected content and quality. Updated `enqueueContentDownload` to use this estimate. Corrected a Dexie type error (`.or().count()` chain) in `checkDownloadQueue`. |
| **Type Fixes** | Multiple Dynamic Routes | Addressed inconsistent typing issues in Next.js dynamic API route handlers. | Unified parameter signature from destructured `{ params }` to `context: { params }` structure in `src/app/api/admin/school-settings/[schoolId]/route.ts`, `src/app/api/admin/users/[userId]/unlock/route.ts`, and `src/app/api/schools/[schoolId]/route.ts`. |
 
### Feature Documentation: US 2.4 Media Download Notification
 
### Description
User Story US 2.4 ensures students are notified when a course selection involves large media (videos/resources) that requires bulk download handling separate from core content, typically to allow for user control over bandwidth and storage consumption.
 
### Implementation Details
 
| Component | Path | Description | Changes Made |
|---|---|---|---|
| **Client Store Logic** | [`src/stores/useSyncStore.ts`](src/stores/useSyncStore.ts:1) | The `enqueueContentDownload` action includes placeholder logic to detect and simulate a notification for bulk media download when a full course is selected. | Added simulation logic within `enqueueContentDownload` to log a warning notification if `contentType` is 'course'. |
 
### Feature Documentation: US 2.5 Selectable Video Quality for Download
 
### Description
User Story US 2.5 allows students to select the quality (e.g., High/Medium/Low) for downloadable course videos, enabling them to manage storage consumption and bandwidth usage during bulk downloads.
 
### Implementation Details
 
| Component | Path | Description | Changes Made |
|---|---|---|---|
| **API Enhancement** | [`src/app/api/courses/[id]/structure/route.ts`](src/app/api/courses/[id]/structure/route.ts:1) | Extended the course structure endpoint to include `Video.contentVariants` (quality, size, URL, resolution) for lectures of type VIDEO, providing the necessary options for quality selection on the client side. | Added nested select for `lecture.video.contentVariants` in the GET handler. |
 
### Feature Documentation: US 2.6 Background and Resume Downloads
 
### Description
User Story US 2.6 ensures that content downloads continue uninterrupted in the background and can automatically resume if connection is lost and subsequently regained, preventing learning interruption due to network instability.
 
### Implementation Details
 
| Component | Path | Description | Changes Made |
|---|---|---|---|
| **Client Store Logic** | [`src/stores/useSyncStore.ts`](src/stores/useSyncStore.ts:1) | Added the core action to simulate the re-initiation of pending and paused downloads, leveraging the persistent state stored in IndexedDB. | Added `resumeDownloads` action which checks queue status and simulates restarting the download workers when connectivity allows. |
 
### Feature Documentation: US 2.7 Storage Management Dashboard
 
### Description
User Story US 2.7 introduces core functionality for a storage management dashboard, allowing students to monitor used local space and manually delete downloaded content to free up storage.
 
### Implementation Details
 
| Component | Path | Description | Changes Made |
|---|---|---|---|
| **Client Store State** | [`src/stores/useSyncStore.ts`](src/stores/useSyncStore.ts:1) | Added state and actions required for displaying storage metrics and managing deletion requests from the UI. | Added `usedStorageBytes` state field. Implemented `checkUsedStorage` (to simulate calculating total used space) and `deleteDownloadedContent` (to simulate freeing space for selected content). |
 
### Feature Documentation: US 3.1 Offline Content Access (Text/Images)
 
### Description
User Story US 3.1 enables students to view downloaded article content (rich text) and embedded static images even when their device is offline. This relies on local cache storage (IndexedDB) for content access.
 
### Implementation Details
 
| Component | Path | Description | Changes Made |
|---|---|---|---|
| **Content Fetcher Utility (New)** | [`src/lib/sync/content-fetcher.ts`](src/lib/sync/content-fetcher.ts:1) | Implements the core logic for fetching content, prioritizing the local IndexedDB cache if the application detects it is offline. | New file created with `fetchContent(contentId)` function to simulate offline-first content retrieval. |
 
### Feature Documentation: US 3.2 Offline Video Playback
 
### Description
User Story US 3.2 enables seamless video playback with full controls when the student is offline, provided the video content was previously downloaded. This functionality relies on resolving video URLs to the locally cached content.
 
### Implementation Details
 
| Component | Path | Description | Changes Made |
|---|---|---|---|
| **Content Fetcher Utility** | [`src/lib/sync/content-fetcher.ts`](src/lib/sync/content-fetcher.ts:1) | Added a function to resolve the video URL for a specific video ID and quality, checking the local cache first before falling back to the network URL (if online). | Added `resolveVideoUrl(videoId, requestedQuality)` function to simulate offline video access. |
 
### Feature Documentation: US 3.3 Offline Quiz and Auto-Gradable Assignment Completion
 
### Description
User Story US 3.3 allows students to complete quizzes and auto-gradable assignments while offline. The attempt and answer data are stored locally and marked for synchronization upon regaining connectivity.
 
### Implementation Details
 
| Component | Path | Description | Changes Made |
|---|---|---|---|
| **IndexedDB Schema** | [`src/lib/sync/db.ts`](src/lib/sync/db.ts:1) | Updated the `QuizAttempt` interface to accurately store necessary data for offline submission, including `attemptNumber`, `answers`, and `status`. | Modified `QuizAttempt` structure to support local answer storage. |
| **Client Store Logic** | [`src/stores/useSyncStore.ts`](src/stores/useSyncStore.ts:1) | Added the core action responsible for persisting quiz/assignment answers to the local database. | Implemented `submitOfflineQuizAttempt(quizId, attemptNumber, answers)` to save a `QuizAttempt` to Dexie for later push synchronization. |
 
### Feature Documentation: US 3.4 Local Progress Tracking
 
### Description
User Story US 3.4 ensures that all student progress metrics (completion percentage, time spent, last activity) are accurately tracked and persisted locally (via IndexedDB) while the user is offline, marking these records for later synchronization.
 
### Implementation Details
 
| Component | Path | Description | Changes Made |
|---|---|---|---|
| **IndexedDB Schema** | [`src/lib/sync/db.ts`](src/lib/sync/db.ts:1) | Updated the `StudentProgress` syncable entity definition to correctly align with the local storage requirements for tracking progress offline. | Updated `StudentProgress` interface to include necessary fields, and updated Dexie store indexing for `studentProgress`. |
| **Client Store Logic** | [`src/stores/useSyncStore.ts`](src/stores/useSyncStore.ts:1) | Added the action responsible for persisting progress updates to the local database, ensuring consistency with `clientId` and `clientUpdatedAt`. | Implemented `updateLocalProgress(courseId, lessonId, newProgressData)` action to handle upserting progress records in `db.studentProgress`. |
 
### Feature Documentation: US 3.6 Offline Note Taking and Bookmarking
 
### Description
User Story US 3.6 ensures that students can create notes and set bookmarks linked to specific content while offline, storing this user-generated content locally for later synchronization.
 
### Implementation Details
 
| Component | Path | Description | Changes Made |
|---|---|---|---|
| **IndexedDB Schema** | [`src/lib/sync/db.ts`](src/lib/sync/db.ts:1) | Updated the `Note` syncable entity definition to include local tracking fields (`clientId`, `clientUpdatedAt`, `isDeleted`). | Updated `Note` interface definition to inherit from `SyncableEntity` and ensured Dexie store indexing is present. |
| **Client Store Logic** | [`src/stores/useSyncStore.ts`](src/stores/useSyncStore.ts:1) | Added an action to save notes locally, ensuring proper structure for later sync. | Implemented placeholder logic for saving notes locally to `db.notes`. |
 
---
 
## 3. Detailed Use Cases
 
### Use Case 1: Full Offline Learning Cycle
 
-   **Actors:** Student (Fara), School Admin (Mrs. Duval)
-   **Scenario:** Fara's school has a local SchoolBridge server. Her home has no internet.
-   **Steps:**
172 |     1.  **At School (Online):** Fara logs into the SchoolBridge PWA on her tablet via the school's WiFi. The app connects to the local `SchoolServer`.
173 |     2.  She navigates to her "History - Grade 7" course and adds the entire course to her `DownloadQueue`.
174 |     3.  The PWA downloads all course content (videos in `LOW` quality as per her preference, articles, quiz definitions) from the `SchoolServer` and stores it in `OfflineContent` on her device.
175 |     4.  **At Home (Offline):** Fara opens the PWA. It works seamlessly. She watches two video lectures and reads an article. Her `LectureProgress` is saved locally.
176 |     5.  She takes a 10-question quiz. Her `QuizAttempt`, including her answers and score, is created and stored locally.
177 |     6.  **Back at School (Online):** Fara connects to the school's WiFi. The PWA detects the connection and initiates a sync.
178 |     7.  Her `LectureProgress` and `QuizAttempt` data are pushed to the local `SchoolServer`.
179 |     8.  The `SchoolServer` later syncs this new data to the cloud, and Fara's teacher can now see her completed work.
180 | 
181 | ### Use Case 2: Course Creation and Validation
182 | 
183 | -   **Actors:** Instructor (Mr. Jean), Educational Manager (Dr. Rakoto)
184 | -   **Scenario:** Mr. Jean wants to create a new course on "Introduction to Algebra".
185 | -   **Steps:**
186 |     1.  **Creation:** Mr. Jean creates a new `Course`, setting its status to `DRAFT`. He adds 5 `Sections`.
187 |     2.  He populates the sections with 10 video `Lectures`, 5 `Articles`, and 3 `Quizzes`.
188 |     3.  **Submission:** Once complete, he changes the course status to "Ready for Review". This triggers a `CourseValidation` entry with a `PENDING` status and notifies Dr. Rakoto.
189 |     4.  **Review:** Dr. Rakoto reviews the entire course. He finds a mistake in one of the quizzes.
190 |     5.  He sets the validation status to `CHANGES_REQUESTED` and adds a comment: "Please correct Question 3 in the 'Linear Equations' quiz."
191 |     6.  **Revision:** Mr. Jean receives a notification, corrects the quiz question, and resubmits the course for validation.
192 |     7.  **Approval:** Dr. Rakoto reviews the change and sets the validation status to `APPROVED`. The course `status` is automatically changed to `PUBLISHED`, making it available for student enrollment.
193 | 
194 | ---
195 | 
196 | ## 4. Non-Functional Requirements (V2)
197 | 
198 | -   **Performance:**
199 |     -   Client-side database queries (in IndexedDB) must complete in <50ms.
200 |     -   Initial PWA load time on a cached, repeat visit should be <1.5 seconds.
201 |     -   The UI must remain responsive while background sync is in progress.
202 | -   **Scalability:**
203 |     -   The system must support 500 concurrent users connected to a single `SchoolServer`.
204 |     -   The cloud infrastructure must support 50+ `SchoolServer` instances syncing simultaneously.
205 | -   **Reliability:**
206 |     -   The local `SchoolServer` must have an uptime of 99.9%.
207 |     -   Data sync conflict resolution must handle 99% of cases automatically. A manual resolution path must exist for the remaining 1%.
208 | -   **Data & Storage:**
209 |     -   Video content should be compressed and offered in at least three `ContentQuality` variants (low, medium, high).
210 |     -   The application should provide clear feedback on device storage usage for offline content.
211 | -   **Security:**
212 |     -   All data stored in the client-side `OfflineContent` cache must be encrypted.
213 |     -   Strict data isolation must be enforced between schools (multi-tenancy).
214 | 
215 | ---
216 | 
217 | 🏗️ **Next Document:** TECHNICAL ARCHITECTURE DOCUMENT (V2)
