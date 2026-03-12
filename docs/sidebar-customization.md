# Customizable Sidebar Architecture

This document outlines the architecture for the customizable sidebar feature, including the database schema, JSON structure, and API design.

## 1. Database Schema

The `SidebarConfiguration` model is added to the `prisma/schema.prisma` file to store the sidebar configuration for each school.

```prisma
model SidebarConfiguration {
  id                String   @id @default(uuid())
  schoolId          String   @unique @map("school_id")
  configuration     Json     @map("configuration")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  clientUpdatedAt   DateTime @updatedAt @map("client_updated_at")
  isDeleted         Boolean  @default(false) @map("is_deleted")
  clientId          String   @default(cuid()) @map("client_id")

  school School @relation(fields: [schoolId], references: [id], onDelete: Cascade)

  @@map("sidebar_configurations")
}
```

The `School` model is updated to include a one-to-one relationship with the `SidebarConfiguration` model:

```prisma
model School {
  // ...
  sidebarConfiguration SidebarConfiguration?
  // ...
}
```

## 2. JSON Structure

The `configuration` field in the `SidebarConfiguration` model will store a JSON object that defines the structure and content of the sidebar.

### Example JSON Structure

```json
{
  "items": [
    {
      "id": "dashboard",
      "type": "link",
      "label": "Dashboard",
      "icon": "HomeIcon",
      "href": "/dashboard",
      "roles": ["ADMIN", "TEACHER", "STUDENT", "PARENT"]
    },
    {
      "id": "courses",
      "type": "link",
      "label": "Courses",
      "icon": "BookOpenIcon",
      "href": "/courses",
      "roles": ["TEACHER", "STUDENT"]
    },
    {
      "type": "divider",
      "roles": ["ADMIN", "TEACHER", "STUDENT", "PARENT"]
    },
    {
      "id": "admin",
      "type": "group",
      "label": "Admin",
      "icon": "CogIcon",
      "roles": ["ADMIN"],
      "children": [
        {
          "id": "users",
          "type": "link",
          "label": "Users",
          "href": "/admin/users"
        },
        {
          "id": "settings",
          "type": "link",
          "label": "Settings",
          "href": "/admin/settings"
        }
      ]
    }
  ]
}
```

### JSON Schema Definition

*   **items** `(array)`: An array of sidebar items.
    *   **id** `(string)`: A unique identifier for the item.
    *   **type** `(string)`: The type of item. Can be `link`, `divider`, or `group`.
    *   **label** `(string, optional)`: The display text for the item.
    *   **icon** `(string, optional)`: The name of the icon to display.
    *   **href** `(string, optional)`: The URL for `link` items.
    *   **roles** `(array)`: An array of user roles that can see this item.
    *   **children** `(array, optional)`: For `group` items, an array of child `link` items.

## 3. API Design

The following API endpoints will be used to manage the sidebar configuration.

### Endpoints

*   **`GET /api/admin/schools/{schoolId}/sidebar`**
    *   **Description:** Retrieves the sidebar configuration for a specific school.
    *   **Authentication:** `ADMIN`, `SUPER_ADMIN`
    *   **Response:** The `configuration` JSON object.

*   **`PUT /api/admin/schools/{schoolId}/sidebar`**
    *   **Description:** Creates or updates the sidebar configuration for a specific school.
    *   **Authentication:** `ADMIN`, `SUPER_ADMIN`
    *   **Request Body:** The `configuration` JSON object.
    *   **Response:** The updated `configuration` JSON object.

### Payloads

#### `GET /api/admin/schools/{schoolId}/sidebar`

**Response (200 OK):**

```json
{
  "items": [
    // ... sidebar items
  ]
}
```

#### `PUT /api/admin/schools/{schoolId}/sidebar`

**Request Body:**

```json
{
  "items": [
    // ... sidebar items
  ]
}
```

**Response (200 OK):**

```json
{
  "items": [
    // ... updated sidebar items
  ]
}