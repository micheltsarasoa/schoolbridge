---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments: ["docs/prd.md", "docs/index.md", "docs/project-overview.md", ".bmad/bmm/docs/project/01. Project Charter.md", ".bmad/bmm/docs/project/02. User Stories & User Cases Documents.md", ".bmad/bmm/docs/project/04. Development Roadmap & Sprint Planning.md"]
workflowType: 'architecture'
lastStep: 7
status: 'complete'
completedAt: '2025-12-18'
project_name: 'schoolbridge'
user_name: 'jms'
date: '2025-12-18'
---

# Architecture Decision Document

## Existing Technical Foundation

Based on the Document Project workflow analysis, the project uses a strong Next.js/TypeScript foundation. Therefore, starter template evaluation is deemed unnecessary, and we will proceed with the existing stack.

### Established Foundation
- **Framework/Language**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Data Layer**: PostgreSQL (Neon) + Prisma 6.19.0
- **State Management**: Zustand

---

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Core Architectural Decisions

### Data Architecture

This section addresses the foundational data modeling necessary to support the Offline-First PWA (2-Tier Sync).

#### Client-Side Persistence Layer
- **Decision:** Dexie.js (v4.0.0+)
- **Rationale:** Dexie provides a robust, high-level API for IndexedDB and strong TypeScript integration. It allows for defining clear data schemas, which is essential when replicating the structure of the Prisma/PostgreSQL models for offline use. This choice balances implementation complexity with data integrity needs.
- **Affects:** Frontend data access, Synchronization logic.

#### Server-Side Sync Metadata
- **Decision:** Robust Hybrid Model
- **Implementation:** Add `clientUpdatedAt` (DateTime) + `isDeleted` (Boolean) + `clientId` (String, UUID) to all Prisma models that require offline synchronization (`StudentProgress`, `Note`, `QuizAttempt`, etc.).
- **Rationale:** This hybrid approach enables reliable delta syncs (using `clientUpdatedAt`), explicit handling of deletions (using `isDeleted`), and necessary metadata (`clientId`) for managing conflict resolution in a 2-tier environment, while remaining forward-compatible with the planned 3-tier system.
- **Affects:** Prisma Schema, API Layer (write operations).

---

### Authentication & Security

This section addresses security mechanisms, focusing on the client-side encryption required for offline data handling.

#### Client-Side Encryption Mechanism
- **Decision:** Web Cryptography API (SubtleCrypto)
- **Rationale:** This native browser API provides the highest level of security assurance and performance for cryptographic operations on the PWA client, leveraging hardware acceleration where available. This is mandatory for protecting sensitive user data (progress, notes, quizzes).
- **Affects:** Frontend data processing, Security library layer.

#### Client-Side Encryption Key Management
- **Decision:** Session-Derived Key (SDK)
- **Implementation:** The encryption key will be derived cryptographically from the active NextAuth session token upon successful login. The key will be stored securely in memory for the duration of the PWA session.
- **Rationale:** This approach securely links the offline data access to the user's current authentication state (SSO), avoiding the need to store the key persistently or require repeated password input.
- **Affects:** Authentication flow, Client-side security layer.

### API & Communication Patterns

This section defines the core protocol for PWA data exchange with the Cloud.

#### Data Synchronization Protocol
- **Decision:** Custom REST/Delta Endpoint (`/api/sync`)
- **Implementation:** Implement a single, unified Next.js API route that handles both client push (mutations/updates since last sync) and server pull (deltas since client's last sync).
- **Rationale:** Optimizes data usage (NFR) by only transferring changed records. This fits seamlessly into the existing Next.js REST API layer and provides necessary control for conflict handling.
- **Affects:** API Layer, Service Worker, Prisma Queries.

---

### Frontend Architecture (PWA Client)

This section defines how the PWA client will manage offline state and the download queue.

#### Global Synchronization State Management
- **Decision:** Dedicated Zustand Slice (`useSyncStore`)
- **Rationale:** Creating a single, isolated slice ensures clean separation of the complex synchronization state (online status, download queue, encryption key, errors) from feature-specific stores, improving maintainability and component access efficiency.
- **Affects:** Component Layer, State Management.

---

### Infrastructure & Deployment

This section focuses on ensuring the deployment pipeline enforces PWA quality and feature integrity.

#### CI/CD PWA Quality Gate
- **Decision:** Mandatory Lighthouse Audit Gate
- **Implementation:** Enhance GitHub Actions/Vercel pipeline to run a Lighthouse audit and fail the build or PR merge if the PWA score falls below 85 (as per NFR).
- **Rationale:** Enforces the PWA NFR from the PRD, preventing the deployment of incomplete or non-compliant offline functionality.
- **Affects:** CI/CD Pipeline, Quality Assurance process.

---

## Implementation Patterns & Consistency Rules

This section defines implementation patterns and conventions to ensure consistent, compatible code written by multiple AI agents, focusing specifically on the new offline features.

### Naming Patterns

**1. Database Naming (Prisma/PostgreSQL)**
- **Rule:** Use `PascalCase` for Model names (e.g., `StudentProgress`). Use `camelCase` for fields (e.g., `clientUpdatedAt`).
- **Sync Fields:** All syncable models *must* include `clientUpdatedAt`, `isDeleted`, and `clientId`.

**2. API Naming (Next.js Routes)**
- **Rule:** Use **Plural Nouns** for REST endpoints (e.g., `/api/courses`). Use `kebab-case` for file/folder names within `src/app/api`.
- **Sync Endpoint:** The primary delta sync endpoint MUST be designated as `/api/sync`.

**3. Code Naming (TypeScript/React)**
- **Rule:** Use `PascalCase` for React Components and Custom Hooks (e.g., `DownloadButton`, `useSyncStore`). Use `camelCase` for variables, properties, and non-component functions.

### Structure Patterns

**1. Offline/Sync Logic Separation**
- **Rule:** All Dexie initialization, schema definition, encryption handlers, and core sync logic MUST reside within a dedicated new folder: **`src/lib/sync/`**.
- **Service Worker**: Service Worker implementation files must be configured in the Next.js PWA setup.

**2. State Management**
- **Rule:** The primary global state for the offline feature (status, queue) must be encapsulated in the dedicated **`src/stores/useSyncStore.ts`** Zustand slice.

**3. Test Location**
- **Rule:** Unit tests (`*.test.ts`) must be co-located with the implementation file they cover.

### Format Patterns

**1. Data Exchange Formats**
- **Rule:** All JSON payloads (API requests/responses) MUST use `camelCase` for field names.
- **Rule:** All date/time data must be transmitted as **ISO 8601 strings (UTC)**.

**2. API Response Wrapper**
- **Rule:** Maintain existing API response format. For the `/api/sync` endpoint, responses must clearly delineate success status, server timestamp, and the array of changed records.

---

## Project Structure & Boundaries

### Complete Project Directory Structure (Augmented)

This structure is based on the existing Next.js App Router Monolith, augmented with the new folders and files required for the Offline PWA feature.

```
schoolbridge/
├── .github/
│   └── workflows/
│       └── ci.yml             # CI/CD pipeline (Now includes Lighthouse PWA Audit Gate)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   └── sync/
│   │   │       └── route.ts   # 🌐 CUSTOM DELTA SYNC ENDPOINT (/api/sync)
│   │   └── ... (existing Next.js pages)
│   ├── components/
│   │   ├── ui/
│   │   │   └── SyncStatusBanner.tsx # PWA status indicator
│   │   └── sync/
│   │       └── DownloadManager.tsx  # Download queue UI components
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   └── sync/
│   │       ├── crypto.ts          # 🔐 Web Crypto API key derivation/encryption
│   │       ├── db.ts              # IndexedDB schema definition (Dexie.js)
│   │       └── protocol.ts        # Sync sequencing and conflict logic
│   ├── stores/
│   │   └── useSyncStore.ts        # 🗂️ Dedicated Zustand slice for offline state
│   └── ... (existing files)
├── prisma/
│   └── schema.prisma            # Schema requires sync metadata fields (clientUpdatedAt, isDeleted)
└── tests/e2e/                   # E2E tests for sync flow
```

### Architectural Boundaries

**1. Data Boundaries (Prisma ↔ Dexie)**
- **Boundary:** `src/lib/sync/db.ts` and `src/app/api/sync/route.ts`
- **Pattern:** The Dexie schema structure must mirror the essential syncable fields (`id`, `clientUpdatedAt`, `isDeleted`, `clientId`) of the corresponding Prisma models.
- **Access:** Direct Prisma access remains confined to the API layer; the client accesses data exclusively via Dexie/IndexedDB in the PWA context.

**2. API Boundaries (Client ↔ Server)**
- **Boundary:** `/api/sync` endpoint.
- **Pattern:** All client mutations (updates, deletions, creations of offline-enabled data) must be batched and routed ONLY through the `/api/sync` endpoint. Standard CRUD endpoints should be reserved for static/online-only data operations.

**3. Client-Side Security Boundary**
- **Boundary:** `src/lib/sync/crypto.ts`
- **Pattern:** All read/write operations to sensitive IndexedDB fields must pass through the encryption/decryption functions, ensuring the Session-Derived Key (SDK) is used correctly.

### Integration Points

- **Sync Initiation**: `useSyncStore` monitors connection state and triggers fetch to `/api/sync`.
- **Content Versioning**: API returns content version hash/ID for client to check against downloaded content.

---

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All decisions are highly compatible. The Next.js REST API is correctly paired with a robust PWA client layer (Dexie.js, Web Crypto API) to handle the complex delta sync requirement. The choice of Hybrid Sync Metadata ensures the PostgreSQL backend is ready to support the new sync pattern efficiently.

**Pattern Consistency:**
Implementation patterns are strictly aligned with the existing Next.js/TypeScript conventions (e.g., PascalCase for components, dedicated `src/lib/sync` folder). This ensures consistency and prevents AI agent conflict.

**Structure Alignment:**
The augmented project structure clearly demarcates the new architectural components (`src/lib/sync`, `/api/sync`, `useSyncStore.ts`) required for the Offline PWA feature, aligning perfectly with the decisions made.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
All core Offline PWA features (download management, offline consumption, local progress tracking) are supported by the documented structure and decisions (Dexie/WebCrypto/Custom Sync Protocol).

**Non-Functional Requirements Coverage:**
- **Security:** Fully covered by Web Cryptography API and Session-Derived Key.
- **Performance:** Addressed by Dexie local access and Custom Delta Sync protocol.
- **Scalability:** The Hybrid Sync Metadata design is confirmed to be forward-compatible with the required 3-tier sync architecture (deferring the School Server implementation).

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical architectural decisions (Data, Security, API, Frontend, CI/CD) are finalized, providing a complete blueprint for implementation.

**Gap Analysis Results**

**Critical Gaps:** None found. The architecture is ready for implementation.

**Important Gaps (Deferred Implementation Details):**
- **Specific Conflict Resolution:** Detailed logic beyond "last-write-wins" for merging complex data types (e.g., quiz answers vs content updates) needs definition during the Dev/Epics phase.
- **Media Chunking Protocol:** The technical mechanism for chunking large file downloads for interruption recovery needs precise definition during implementation to meet robustness requirements.

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION
**Confidence Level:** High (All critical components, security, and sync protocol are defined and validated).

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions and implementation patterns exactly as documented.
- Refer to this document for all architectural questions regarding the Offline PWA feature.

**First Implementation Priority:**
- Update Prisma Schema with Hybrid Sync Metadata (`clientUpdatedAt`, `isDeleted`, `clientId`).

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements (FRs):**
The primary focus is the **Offline-First Student Learning Experience** (PWA MVP). Key FRs include granular course download management, offline content consumption (video, articles, auto-gradable quizzes), local progress tracking, and 2-tier data synchronization (PWA ↔ Cloud).

**Non-Functional Requirements (NFRs):**
- **Performance:** Local load speed <2 seconds; optimized delta sync.
- **Security:** Client-side encryption for sensitive user data (progress, notes) in IndexedDB.
- **Scalability:** Must support storing ~10 courses per device and be architecturally prepared for a future 3-tier sync model (PWA ↔ School Server ↔ Cloud).
- **Reliability:** 99% sync success rate.

**Scale & Complexity:**
- Primary domain: Full-Stack/Data Intensive
- Complexity level: High (Offline/Sync/Multi-tenancy)
- Estimated architectural components: Significant modifications to the Data, API, and Presentation layers are required to support offline data structure and synchronization logic.

### Technical Constraints & Dependencies

- **Existing Monolith**: New sync logic must integrate cleanly into the existing Next.js App Router structure.
- **Data Layer Modification**: Existing Prisma schema requires non-breaking modifications to support content versioning and sync metadata (e.g., dirty flags, last synced).
- **API Adaptation**: Existing course/progress APIs must be modified to handle delta data transfer for efficient synchronization.

### Cross-Cutting Concerns Identified

- **Synchronization Logic**: Managing data consistency and integrity between the IndexedDB client and the PostgreSQL cloud database.
- **Client-Side Security**: Secure handling of local user data (encryption) and RBAC enforcement in an offline context.
- **Media Delivery**: Efficiently downloading and storing large media files (videos) at multiple quality levels.

---

## Offline Architecture: PWA MVP Deep Dive

This section provides the detailed technical implementation architecture for the core Offline-First capabilities, building upon the initial high-level decisions regarding Dexie.js, Web Crypto, and the custom synchronization protocol.

### 1. PWA Service Worker (SW) Design

The Service Worker is the backbone of the PWA, responsible for managing network requests, caching, and background synchronization queues.

#### 1.1 Responsibilities & Lifecycle

| Function | Responsibility | Caching Strategy |
| :--- | :--- | :--- |
| **App Shell Caching** | Cache core static assets (JS, CSS, HTML) and framework dependencies for immediate loading. | **Stale-While-Revalidate**: Serve from cache instantly, update cache in background. |
| **Course Content Caching** | Store downloaded course structure, articles, and associated read-only data. | **Cache-First**: Ensure instant access to content when offline. |
| **Media Caching** | Handles explicit background download and storage of large media files (videos, high-res resources) using the Cache API. | **Selective/Manual**: Only cache when explicitly requested by the student via the Download Manager UI. |
| **Offline Mutations Queue** | Listens for failed network requests (POST/PUT/DELETE) to the `/api/sync` endpoint when offline. | **Queue and Retry**: Uses the native `BackgroundSync` API to queue the mutation payloads and automatically retry when connectivity is regained. |
| **Connection Status** | Provides real-time network status feedback to the main application thread for display (e.g., `SyncStatusBanner.tsx`). | N/A |

#### 1.2 Implementation Notes
The SW will be implemented using a Next.js PWA plugin (e.g., `next-pwa` or similar build-time tool) to ensure proper integration with the App Router and webpack asset paths.

---

### 2. IndexedDB Schema Definition (Dexie.js)

The local data layer is managed by Dexie.js, providing a structured, encrypted persistence solution. The schema mirrors the necessary structure from the server-side Prisma models, augmented with synchronization metadata.

**Database Name:** `SchoolBridgeOfflineDB`
**Key Syncable Models:** Requires fields for synchronization (`++id`, `clientId`, `clientUpdatedAt`, `isDeleted`). Sensitive fields (e.g., `Note.content`, `QuizAttempt.answers`) must be stored encrypted using `src/lib/sync/crypto.ts`.

| Store Name | Primary Key | Indexes | Content Description | Syncable? |
| :--- | :--- | :--- | :--- | :--- |
| `courses` | `++id` | `&courseId` | Static course metadata, structure, and current server version identifier. | Read-Only (Content) |
| `courseContent` | `++id` | `courseId, lessonId` | Content data (rich text, quiz definitions, media metadata). | Read-Only (Content) |
| **`studentProgress`** | `++id` | `&clientId, courseId, lessonId` | User progress (completion, time spent). Encrypted. | **Yes** (Push/Pull) |
| **`notes`** | `++id` | `&clientId, courseId` | Student notes and bookmarks. Encrypted. | **Yes** (Push/Pull) |
| **`quizAttempts`** | `++id` | `&clientId, quizId` | Attempt details, local scores, and answers. Encrypted. | **Yes** (Push/Pull) |
| `downloadQueue` | `++id` | `contentId, status, priority` | Queue for background downloads of large content (videos, resources). | Local State Only |
| `offlineContent` | `++id` | `&contentId, localPath` | Metadata about locally stored files and content paths. | Local State Only |
| `offlineSyncs` | `++id` | `deviceId, userId` | Stores the last successful sync timestamp for delta tracking. | Local State Only |

---

### 3. 2-Tier Delta Synchronization Architecture

Synchronization is handled by a dedicated, batched **Push-Pull** mechanism routed through the custom `/api/sync` endpoint, ensuring minimal data transfer (delta sync) and robust conflict handling.

#### 3.1 Synchronization Data Flow

The entire sync sequence is triggered by the `useSyncStore` when connectivity is detected (automatic BackgroundSync) or manually (Manual Sync Trigger).

```mermaid
graph TD
    A[Client PWA - Offline] -->|User Mutation (Progress, Note)| B(IndexedDB: Save Record);
    B --> C{IndexedDB: Set clientUpdatedAt};
    C --> D[BackgroundSync API: Queue /api/sync Request];
    
    %% --- PUSH Phase ---
    subgraph PUSH (Mutation Upload)
        D --> E[Check Network Status];
        E -->|Online| F[Client: Batch Dirty Records (clientUpdatedAt > lastSync)];
        F --> G{Encrypt & POST to /api/sync};
        G --> H[Server: Validate and Process Batch];
        H --> I{Server: Conflict Check LWW};
        I --> J[Server: Update DB / Set Server clientUpdatedAt];
    end
    
    %% --- PULL Phase ---
    subgraph PULL (Deltas Download)
        J --> K[Server: Identify Deltas (Records updated since Client's lastSync)];
        K --> L[Server Response: New Records & Course Version IDs];
        L --> M[Client: Decrypt & Apply Updates to IndexedDB];
        M --> N[Client: Update lastSyncTimestamp];
        N --> O[Client: Notify if Course Version ID Changed (US 4.4)];
    end
    
    O --> P[Client PWA - Online/Synced];
```

#### 3.2 Conflict Resolution: Last-Write-Wins (LWW)

The MVP mandates a simple **Last-Write-Wins (LWW)** strategy, enforced by comparing the UTC timestamp fields during the PUSH phase.

1.  **Server Check:** When the server receives a mutation (via PUSH), it compares the incoming `clientUpdatedAt` timestamp against the current server-side record's timestamp.
2.  **Decision:**
    *   **Client Wins:** If the client's timestamp is newer, the server accepts the mutation and updates the record, setting the server's sync timestamp to the incoming value.
    *   **Server Wins:** If the client's timestamp is older or equal, the mutation is silently discarded (Server Data Wins).
3.  **Client Correction:** The client's stale record will be overwritten by the server's correct (newer) version during the PULL phase. This ensures data consistency on the client without complex merge logic for the MVP.