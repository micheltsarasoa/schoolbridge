# SchoolBridge Project Context - Claude Code

**Last Updated**: November 2, 2025
**Project**: SchoolBridge Admin Panel
**Tech Stack**: Next.js 16, React, TypeScript, Prisma, shadcn/ui, Tailwind CSS

## Key Admin Features

### 1. User Management (`/admin/users`)
- Server-side paginated table
- Create/Read/Update/Delete users
- Roles: ADMIN, EDUCATIONAL_MANAGER, TEACHER, STUDENT, PARENT
- Student-to-class assignment
- Real-time data prefetch on edit
- Dark/light mode support

### 2. URL Role Filtering (`/admin/users?role=STUDENT`)
- Filter by role via query parameter
- Dynamic page titles
- Sidebar highlighting (only active filter)
- Supports: STUDENT, TEACHER, PARENT, ADMIN, EDUCATIONAL_MANAGER

### 3. Bulk User Import (`/admin/users/bulk-import`)
- CSV and JSON format support
- Download sample templates
- Drag-drop file upload
- Real-time validation
- Progress indicator
- Detailed error reporting

## Key Teacher Features

### 4. Course Creation from Templates (`/teacher/courses/create-from-template`)
- Upload `.course.md` template files
- Markdown + YAML frontmatter format
- Supports all content types: LESSON, TEXT, VIDEO, PDF, INTERACTIVE, QUIZ, ASSIGNMENT
- Automatic parsing and validation
- Preview before import
- Creates full course structure with content, quizzes, assignments

## UI Components & Icons

**shadcn/ui Latest**: Card, Button, Input, Alert, Badge, Dialog, Select, Checkbox, Tabs, Progress
**lucide-react**: Upload, Download, AlertCircle, CheckCircle2, Loader2, FileText, FileJson, MoreHorizontal, Plus, Trash2, ChevronDown, Users, Settings

## CSV/JSON Import Schema

**CSV Columns**: name (req), email (req), phone (opt), role (req), isActive (opt)
**JSON Structure**: `{users: [{name, email, phone, role, isActive}]}`
**Valid Roles**: STUDENT, TEACHER, PARENT, ADMIN, EDUCATIONAL_MANAGER

## API Endpoints

- `GET/POST /api/admin/users` - Paginated list (query: page, limit, role, status, search)
- `GET/PUT/DELETE /api/admin/users/[userId]` - User operations
- `POST /api/admin/users/bulk-import` - Import CSV/JSON
- `GET /api/admin/classes` - Available classes
- `POST /api/teacher/courses/import` - Import from `.course.md` template (planned)

## Important: Always Remember

1. **Always use latest shadcn/ui components** - Never create custom UI
2. **Always support dark mode** - Use `dark:` prefix in Tailwind
3. **Always use shadcn icons** - Use lucide-react for all icons
4. **Server-side pagination** - Never fetch all users at once
5. **Responsive design** - Mobile-first with md/lg breakpoints
6. **withAdmin middleware** - All admin endpoints require it
7. **Validation** - Validate all user inputs on client AND server
8. **Error handling** - Return detailed error messages with row numbers
9. **Type safety** - Use TypeScript interfaces for all data
10. **Dark mode** - Test all features in both light and dark modes

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── users/
│   │   │   ├── page.tsx (Main users page with filtering)
│   │   │   └── bulk-import/
│   │   │       └── page.tsx (Bulk import page)
│   │   └── layout.tsx (Admin layout with sidebar)
│   ├── api/
│   │   └── admin/
│   │       └── users/
│   │           ├── route.ts (GET/POST)
│   │           ├── [userId]/route.ts (GET/PUT/DELETE)
│   │           ├── bulk-import/route.ts (POST)
│   │           └── classes/route.ts (GET)
├── components/
│   └── admin/
│       ├── UserTable.tsx
│       ├── EditUserModal.tsx
│       └── UserDetailsDialog.tsx
└── lib/
    └── auth-utils.ts (withAdmin middleware)
```

## Common Tasks

**Add new role**: Update Prisma schema → migrate → update ROLES array → update sidebar
**Add filter**: Update API where clause → update UserTable → update page UI
**Modify CSV schema**: Update validation → update API → update docs → update templates
**Create course template**: Copy `course_template.md` → fill metadata and content → upload to teacher interface
**Add new content type**: Update Prisma ContentType enum → update parser → update template guide → add example

## Course Template System

**Template Location**: `docs/templates/`
**Format**: Markdown (`.course.md`) with YAML frontmatter
**Supported Content Types**: LESSON, TEXT, VIDEO, PDF, INTERACTIVE, QUIZ, ASSIGNMENT
**Files Available**:
- `TEMPLATE_GUIDE.md` - Complete teacher guide
- `course_template.md` - Blank template to copy
- `example_simple.course.md` - 30-minute simple course
- `example_complex.course.md` - 3-week intermediate course
- `example_advanced.course.md` - 4-week advanced course with projects

**Key Features**:
- YAML frontmatter for course metadata
- Markdown content sections
- Quiz builder with multiple question types
- Assignment support with due dates
- Content timing controls (appear/disappear after seconds)
- Offline access flags
- Full integration with Prisma schema

## Testing Checklist

- [ ] CSV upload (valid/invalid)
- [ ] JSON upload (both formats)
- [ ] Duplicate detection
- [ ] Role validation
- [ ] File validation
- [ ] Pagination
- [ ] URL filtering
- [ ] Sidebar highlighting
- [ ] Dark mode
- [ ] Mobile responsive
- [ ] Data prefetch
- [ ] Error handling

