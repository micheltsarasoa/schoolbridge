# ClassSchedule Guide

## Overview

The **ClassSchedule** model tracks when classes are scheduled and when they actually occur, enabling teachers to have multiple classes at different times and students to be marked present/absent accordingly.

**Migration**: `20251101140837_add_class_schedule_with_timing`

---

## Data Model

### ClassSchedule Entity

```prisma
model ClassSchedule {
  id                  String   @id @default(uuid())
  classId             String   // FK to Class
  teacherId           String   // FK to User (Teacher)
  dayOfWeek           DayOfWeek // MONDAY through SUNDAY
  plannedStartTime    String   // "HH:MM" format
  plannedDuration     Int      // minutes
  actualStartTime     String?  // "HH:MM" format (nullable)
  actualDuration      Int?     // minutes (nullable)
  createdAt           DateTime
  updatedAt           DateTime
}
```

### Relationships

```
Teacher (User)
    └─ teaches multiple Classes
        └─ has multiple ClassSchedules (one per day of week)
```

---

## Real-World Scenario

### Example: Mr. Johnson's Schedule

```
Teacher: Mr. Johnson (User ID: abc123)

Class: Grade 5-A
├── Monday
│   ├── Planned: 09:00 - 10:00 (60 minutes)
│   ├── Last Actual: 09:05 - 10:05 (65 minutes)
│   └── Students: 25
└── Friday
    ├── Planned: 14:00 - 15:00 (60 minutes)
    ├── Last Actual: 13:55 - 15:00 (65 minutes)
    └── Students: 25

Class: Grade 6-B
└── Wednesday
    ├── Planned: 10:30 - 11:30 (60 minutes)
    ├── Last Actual: 10:30 - 11:25 (55 minutes)
    └── Students: 30
```

---

## Database Schema

### ClassSchedule Fields

| Field | Type | Example | Purpose |
|-------|------|---------|---------|
| `id` | UUID | `550e8400-e29b-41d4-a716-446655440000` | Primary key |
| `classId` | UUID | `class-123` | Links to Class |
| `teacherId` | UUID | `teacher-456` | Links to Teacher |
| `dayOfWeek` | Enum | `MONDAY` | Recurring day |
| `plannedStartTime` | String | `"09:00"` | When class is scheduled to start |
| `plannedDuration` | Int | `60` | Scheduled duration in minutes |
| `actualStartTime` | String | `"09:05"` | When class actually started (optional) |
| `actualDuration` | Int | `65` | How long it actually ran (optional) |
| `createdAt` | DateTime | `2025-11-01T10:00:00Z` | Record creation time |
| `updatedAt` | DateTime | `2025-11-01T14:30:00Z` | Last update time |

---

## Key Features

### 1. Multiple Classes Per Teacher
Teachers can have different classes on different days:
- Teach Grade 5 on Monday/Friday
- Teach Grade 6 on Wednesday
- Teach Grade 7 on Tuesday/Thursday

### 2. Planned vs Actual Timing
Track schedule adherence:
- **Planned**: What the schedule says
- **Actual**: What really happened
- Calculate delays, early starts, duration variations

### 3. Time Format
- Uses `"HH:MM"` format (24-hour)
- Examples: `"09:00"`, `"14:30"`, `"16:45"`

### 4. Duration Tracking
- Planned: Fixed duration (e.g., 60 minutes)
- Actual: Can vary (nullable, set after class)
- Allows monitoring of class duration variations

### 5. Unique Constraint
Each class can have **only one** schedule per day of week:
```sql
@@unique([classId, dayOfWeek])
```
- Class can't be scheduled twice on same day
- Different classes can share same time slots

---

## API Usage Examples

### Create a Class Schedule

```typescript
// Monday 9:00 AM, 60 minutes
const schedule = await prisma.classSchedule.create({
  data: {
    classId: "class-123",
    teacherId: "teacher-456",
    dayOfWeek: "MONDAY",
    plannedStartTime: "09:00",
    plannedDuration: 60,
    // actualStartTime and actualDuration not set yet
  },
});
```

### Get All Schedules for a Teacher

```typescript
const schedules = await prisma.classSchedule.findMany({
  where: {
    teacherId: "teacher-456",
  },
  include: {
    class: true,
  },
  orderBy: [
    { dayOfWeek: "asc" },
    { plannedStartTime: "asc" },
  ],
});
```

### Get Today's Classes for Teacher

```typescript
const today = new Date();
const dayOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][today.getDay()];

const todaysClasses = await prisma.classSchedule.findMany({
  where: {
    teacherId: "teacher-456",
    dayOfWeek: dayOfWeek,
  },
  include: {
    class: {
      include: {
        students: true,
      },
    },
  },
  orderBy: {
    plannedStartTime: "asc",
  },
});
```

### Update Actual Times After Class

```typescript
await prisma.classSchedule.update({
  where: { id: "schedule-789" },
  data: {
    actualStartTime: "09:05", // Started 5 minutes late
    actualDuration: 65,        // Ran 5 minutes over
  },
});
```

### Get Classes for Attendance Taking

```typescript
// Teacher taking attendance for their current class
const currentTime = "14:35";
const todaySchedule = await prisma.classSchedule.findMany({
  where: {
    teacherId: "teacher-456",
    dayOfWeek: todayDayOfWeek,
  },
  include: {
    class: {
      include: {
        students: true,
        attendances: {
          where: {
            date: {
              gte: new Date().toISOString().split('T')[0],
            },
          },
        },
      },
    },
  },
});
```

---

## Frontend Integration

### Example: Auto-Load Teacher's Classes

```typescript
// Get schedules for today and list them
const getMyTodaysClasses = async (teacherId: string) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

  const schedules = await fetch(`/api/teacher/schedules?dayOfWeek=${today}`);
  return schedules.json();
};

// UI can show:
// - 09:00-10:00: Grade 5-A (25 students)
// - 14:00-15:00: Grade 6-B (30 students)
// - 15:30-16:30: Grade 7-C (28 students)
```

### Example: Attendance by Time

```typescript
// When teacher clicks "Take Attendance"
const selectClass = async (scheduleId: string) => {
  const schedule = await fetch(`/api/schedules/${scheduleId}`).then(r => r.json());

  // Load students for that class
  const students = schedule.class.students;

  // When done, update actual times
  await updateSchedule(scheduleId, {
    actualStartTime: "09:05",
    actualDuration: 65,
  });
};
```

---

## Advantage Over Previous System

### Before (No Schedule)
- ❌ Must manually select class
- ❌ No time-based filtering
- ❌ Can't track schedule adherence
- ❌ Hard to see teacher's full schedule

### After (With ClassSchedule)
- ✅ Auto-filter by current time
- ✅ See all classes for the week
- ✅ Track delays and duration variations
- ✅ Multiple classes at different times
- ✅ Performance analytics

---

## Migration Details

### Created Tables/Types
- `ClassSchedule` table
- `DayOfWeek` enum type

### Modified Tables
- Added `classSchedules` relation to `Class`
- Added `classSchedules` relation to `User` (with label `TeacherSchedules`)

### Constraints
- **Unique**: `(classId, dayOfWeek)` - One schedule per class per day
- **Indexes**: `classId`, `teacherId`, `dayOfWeek` for query performance

---

## Next Steps for Implementation

1. **Create API Route**: `/api/teacher/schedules`
   - List teacher's schedules
   - Filter by day of week
   - Include class and students

2. **Update Attendance Page**:
   - Auto-load schedules for today
   - Show list of classes with times
   - Auto-filter by current time

3. **Add Admin Panel**:
   - Create/edit class schedules
   - View all schedules per teacher
   - Track schedule adherence

4. **Add Dashboard Widgets**:
   - "Your Classes Today"
   - "Next Class In X Minutes"
   - "Schedule for the Week"

---

## Important Notes

1. **Time Format**: Always use "HH:MM" (24-hour format)
   - ✅ "09:00", "14:30", "23:45"
   - ❌ "9:00 AM", "2:30pm"

2. **Duration**: Always in minutes
   - ✅ 60, 90, 45
   - ❌ "1 hour", "1.5 hours"

3. **Actual Times**: Set after class occurs
   - Leave `actualStartTime` and `actualDuration` as `null`
   - Update after attendance is taken

4. **Recurrence**: Current model is weekly recurrence
   - Same schedule every week
   - If need holiday exceptions, create separate table

---

**Created**: 2025-11-01
**Migration**: `20251101140837_add_class_schedule_with_timing`
**Status**: Ready for Implementation ✅
