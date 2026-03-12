# Comprehensive Prompt for v0.app: Course Creation Dashboard Page

Create a full-width, production-ready course creation page for a learning management system dashboard with complete mock data handling and realistic CRUD operations.

## Core Requirements

### Technology Stack
- React with TypeScript
- shadcn/ui components for all UI elements
- Tailwind CSS for styling
- Lucide React icons for all iconography
- React Hook Form for form validation
- Zod for schema validation
- Tiptap or Lexical for rich text editing
- localStorage for data persistence (simulating database)

## Layout Structure

### Main Container
- Full-width layout within dashboard main content area
- Minimum height: 100vh
- Background: neutral gray (bg-gray-50)
- Clean, modern design with proper spacing

---

## Page Architecture

### 1. Top Header Section

**Course Metadata Form:**

Create a card/section, collapseble, will appear the title if this this section is collapse at the top with:
- **Course Title Input**: 
  - Large text input (text-2xl font)
  - Placeholder: "Enter course title..."
  - Required field with validation
  - Real-time character count (max 200 chars)

- **Course Subtitle Input**:
  - Medium text input
  - Placeholder: "Enter course subtitle (optional)..."
  - Character limit: 150 chars

- **Course Description**:
  - Textarea (minimum 4 rows)
  - Placeholder: "Describe what students will learn in this course..."
  - Character limit: 2000 chars
  - Real-time word count display

**Metadata Row (Grid layout - 4 columns, each element should not less than 150px):**
- **Language Dropdown**:
  - Options: French (FR), English (EN), Malagasy (MG)
  - Default: FR
  - Icon: Globe

- **Course Level Dropdown**:
  - Options: Beginner, Intermediate, Advanced, All Levels
  - Default: Beginner
  - Icon: TrendingUp

- **Content Type Dropdown**:
  - Options: Lecture (In-person), Online, Hybrid
  - Default: Hybrid
  - Icon: Monitor

- **Course Status**:
  - Badge display showing current status
  - Options: Draft (gray), Published (green)
  - Toggle button to change status

**Action Buttons (Right side of header):**
- "Save Draft" button (secondary)
- "Preview Course" button (secondary with eye icon)
- "Publish Course" button (primary, disabled if incomplete)

**Horizontal separator** (border-b) below this section

---

### 2. Two-Column Layout

#### LEFT SIDEBAR (min width: 450px, max-width: 550px depending on the content there, Sticky position)

**Course Structure Navigator Card:**

Create a navigable tree structure with:

**Visual Design:**
- White background card with shadow
- Padding: p-4
- Rounded corners: rounded-lg
- Sticky positioning (sticky top-4)
- Max height: calc(100vh - 8rem) with overflow-y-auto

**Tree Structure:**

```
📚 Course Outline
├── 📑 Section 1: Introduction
│   ├── 🎥 Lecture 1.1: Welcome Video
│   │   └── Resources: Video
│   ├── 📄 Lecture 1.2: Course Overview
│   │   └── Resources: Article
│   └── [+ Add Lecture]
├── [+ Add Section]
├── 📑 Section 2: Core Concepts
│   ├── 🎥 Lecture 2.1: Getting Started
│   │   ├── Video
│   │   ├── Quiz
│   │   └── Resources (2)
│   └── [+ Add Lecture]
└── [+ Add Section]
```

**Interaction Patterns:**

1. **Section Item** (each):
   - Collapsible/expandable with chevron icon
   - Drag handle icon (GripVertical) on hover
   - Can be gradded and depending on the order, the order of the section can change
   - Section number badge
   - Section title (editable on click)
   - Action buttons on hover:
     - Edit icon
     - Delete icon (with confirmation)
     - Drag handle
     - border 30% darker
   - Click to select section (shows section editor in right panel)

2. **Lecture Item** (nested under sections):
   - Indented with left border (border-l-2)
   - Type icon (Video, Article, Quiz, etc.)
   - Lecture title (truncated if too long)
   - Duration badge (for videos)
   - Click to select (shows lecture editor in right panel)
   - Hover actions: Edit, Delete, Reorder

**Add Buttons:**
- "Add Section" button at bottom and after last section
  - Style: secondary, full width, with plus icon
  
- "Add Lecture" button after each lecture in a section
  - Style: secondary, smaller, with plus icon
  - Only visible when section is expanded

- "Add Component" dropdown button within each lecture
  - Dropdown menu with options:
    - 🎥 Video
    - 📄 Article  
    - 📝 Quiz
    - 💻 Coding Exercise
    - 📋 Assignment
    - 🎯 Project
    - 📎 Resource (File/Link)
  - Each option shows icon and description on hover
  - each option (icon and title) has their proper color, different one to another

**Empty State:**
- If no sections exist, show:
  - Large "Book" icon (BookOpen)
  - Text: "Start building your course"
  - Description: "Add your first section to begin"
  - Primary "Add First Section" button

---

#### RIGHT CONTENT AREA (Flex: 1, Remaining width)

**Dynamic Content Editor Panel:**

This area changes based on what's selected in the sidebar. Each editor should be in a white card with proper padding.

---

## SECTION EDITOR
a lecture:
- a video is optional for a lecture;
- one lecture can have one article, the goal is to add rich-text lesson for the student (including the possibility to add image or specific data such as math guidance);
- one lecture can have one or multiple ressources;
- one lecture can have a quiz and no other resource type
- one lecture can have a assignment but no other type of resource
- one lecture can have a coding exercise but no other type of resource
- a lecture is auto-saved when the user clicks on save on a ressource type

**When a section is selected or being created:**

```
Card Header:
- Icon: BookOpen
- Title: "Section Details" (or "Edit Section")
- Close button (×) top-right

Form Fields:
├── Section Title*
│   └── Input (required, max 100 chars)
├── Section Description
│   └── Textarea (optional, max 500 chars)
├── Section Order
│   └── Number input (auto-calculated, can override)
└── Actions
    ├── Save Section (primary button)
    ├── Cancel (secondary button)
    └── Delete Section (destructive, far right)
```

---

### VIDEO LECTURE EDITOR

**When creating/editing a video lecture:**

```
Card Header:
- Icon: Video
- Title: "Video Lecture"
- Lecture type badge

Form Sections:

1. Basic Information:
   ├── Lecture Title* (required)
   ├── Description (textarea)
   └── Order in Section (number, auto-filled)

2. Video Content:
   ├── Video Upload Area
   │   └── Drag-and-drop zone or file picker
   │   └── Accepted formats: MP4, MOV, AVI
   │   └── Progress bar when uploading (simulated)
   ├── OR Video URL
   |   └──(selectable field group (frrom last changelog of shadcn) to choose between upload and url)
   │   └── Input for external video URL (YouTube, Vimeo)
   ├── Duration
   │   └── Time input (HH:MM:SS) or a button :auto-detected
   └── Thumbnail
       └── Image upload (16:9 ratio)

3. Video Settings:
   ├── Default Quality
   │   └── Radio buttons: Low, Medium, High, Ultra
   ├── Offline Optimized
   │   └── Toggle switch
   └── Captions
       └── File upload (.vtt, .srt) - simulated

4. Access Settings:
   ├── Is Preview (Free for everyone)
   │   └── Toggle switch
   ├── Is Free Lecture
   │   └── Toggle switch
   └── Offline Available
       └── Toggle switch (default: on)

5. Advanced:
   └── Download Priority (1-10 slider)

Actions:
├── Save Lecture (primary)
├── Save & Add Another (secondary)
└── Cancel (secondary)
```

---

### ARTICLE LECTURE EDITOR WITH RICH TEXT

**When creating/editing an article:**

#### Rich Text Editor Implementation

**Use Tiptap or similar rich text editor with the following toolbar:**

#### Toolbar Layout (Grouped):

```
[Text Formatting]
├── Bold (Ctrl+B)
├── Italic (Ctrl+I)
├── Underline (Ctrl+U)
├── Strikethrough
└── Code (inline code)

[Typography]
├── Heading 1
├── Heading 2
├── Heading 3
├── Paragraph (default)
└── Blockquote

[Lists]
├── Bullet List
├── Numbered List
├── Checklist
└── Indent/Outdent

[Alignment]
├── Align Left
├── Align Center
├── Align Right
└── Justify

[Insert]
├── Link (Ctrl+K)
├── Image
├── Video (embed URL)
├── Table
├── Code Block (with syntax highlighting)
├── Horizontal Rule
└── Special Characters

[Advanced]
├── Text Color
├── Background Color/Highlight
├── Font Size
└── Clear Formatting

[Table] (appears when in a table)
├── add column right
├── Add row bottom
├── delete actual row
└── delete actual column
```

#### Article Editor Layout:

```
Card Header:
- Icon: FileText
- Title: "Article Lecture"
- Close button (×)

Form Sections:

1. Basic Information:
   ├── Title* (required)
   ├── Description (textarea)
   └── Order in Section (number, auto-filled)

2. Article Content (Main Feature):
   
   Tabs:
   ├── [✏️ Editor] [👁️ Preview] [<> Source Code auto-prettify]
   
   Editor Tab:
   ├── Rich Text Toolbar (as specified above)
   │   └── Sticky toolbar that stays visible when scrolling
   │
   ├── Rich Text Editor Area:
   │   └── Minimum height: 500px
   │   └── Prose styling (max-width for readability)
   │   └── Placeholder: "Start writing your article..."
   │   └── Auto-save indicator
   │   └── Character/word counter
   │
   └── Editor Features:
       ├── Drag and drop images directly into content
       ├── Paste images from clipboard
       ├── Markdown shortcuts (## for h2, ** for bold, etc.)
       ├── Slash commands (/ to open insert menu)
       └── @ mentions (optional for later purpose)
       
  
   Preview Tab:
   └── Rendered HTML preview with article styling
       └── Shows exactly how students will see it
   
   Source Code Tab:
   └── HTML/Markdown source code view
       └── Read-only or editable for advanced users

3. Statistics Panel (below editor):
   ├── Words: [auto-calculated]
   ├── Characters: [auto-calculated]
   ├── Paragraphs: [auto-calculated]
   ├── Estimated Reading Time: [~200 words/min]
   └── Update in real-time as user types

4. Images & Media Management:
   
   Section: "Article Images"
   
   Grid of uploaded images:
   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ [📷]     │  [📷]     │ │ [📷]     | | [+ Add]  |  
   │ img1.png │ │ img2.jpg │ │ img3.png │ │  Image   │
   │ 245 KB   │ │ 1.2 MB   │ │ 890 KB   │ │          │
   │ [Edit]   │ │ [Edit]   │ │ [Edit]   │ │          │
   │ [Delete] │ │ [Delete] │ │ [Delete] │ │          │
   └──────────┘ └──────────┘ └──────────┘ └──────────┘
   
   Click [Edit] opens modal:
   ├── Image preview
   ├── Alt text input (for accessibility)
   ├── Caption input (optional)
   ├── Size adjustment (small, medium, large, original)
   ├── Alignment (left, center, right)
   └── Save/Cancel buttons
   
   Click [+ Add Image] opens file picker or URL input:
   ├── Upload from computer
   ├── Insert from URL
   └── Choose from media library (if available)

5. Embedded Content:
   
   Section: "Embedded Media"
   
   List of embedded videos/iframes:
   ├── YouTube Video: "Introduction to React"
   │   └── [Edit URL] [Remove]
   ├── CodePen: "Interactive Demo"
   │   └── [Edit URL] [Remove]
   └── [+ Add Embedded Content]
       └── Modal with URL input and preview

6. Table of Contents (Optional):
   └── Checkbox: "Auto-generate table of contents from headings"
   └── Shows preview of TOC structure

7. Access Settings:
   ├── Is Preview Lecture (toggle)
   ├── Is Free Lecture (toggle)
   └── Offline Available (toggle, default: on)

Actions:
├── Save Article (primary) (auto-saved after 15 seconds no-activity, or every 5 minutes activity)
├── Save & Continue Editing (secondary)
├── Save & Add Another (secondary)
└── Cancel (secondary)
```

#### Rich Text Editor Technical Requirements:

```typescript
// Tiptap Configuration Example
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    Image.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg',
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 underline hover:text-blue-800',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'border-collapse table-auto w-full',
      },
    }),
    TableRow,
    TableCell,
    TableHeader,
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: 'javascript',
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
    CharacterCount.configure({
      limit: 50000,
    }),
    Placeholder.configure({
      placeholder: 'Start writing your article...',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] max-w-none p-6 border rounded-md',
    },
  },
  onUpdate: ({ editor }) => {
    // Auto-save logic
    // Update word count
    // Update reading time
  },
});
```

#### Editor Toolbar Component Structure (for inspiration - important):

```
Toolbar (Sticky, bg-white, border-b, shadow-sm):

Row 1 (Text Formatting):
[B] [I] [U] [S] [</>] | [H1] [H2] [H3] ["] | [•] [1.] [☐]

Row 2 (Advanced):
[≡≡] [≡≡] [≡≡] [≡≡] | [🔗] [🖼️] [🎥] [▦] [</>] [—] | [A] [⬛] [🗑️]

Each button:
- Icon from Lucide React
- Tooltip on hover
- Active state when applied
- Disabled state when not applicable
- Keyboard shortcut shown in tooltip
```

---


### ENHANCED RESOURCE EDITOR

**When adding a resource (file/link):**

#### Complete Resource Management System

```
Card Header:
- Icon: Paperclip
- Title: "Add Resource"
- Close button (×)

Form Sections:

1. Resource Type Selection (Large cards, select one):

   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │   📄 PDF    │  │ 📊 Document │  │ 🎨 Presentation│
   └─────────────┘  └─────────────┘  └─────────────┘
   
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │ 📈 Spreadsheet│ │  🖼️ Image  │  │ 🎵 Audio    │
   └─────────────┘  └─────────────┘  └─────────────┘
   
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │  📹 Video   │  │ 📦 Archive  │  │ </> Code    │
   └─────────────┘  └─────────────┘  └─────────────┘
   
   ┌─────────────┐
   │ 🔗 External │
   │    Link     │
   └─────────────┘

2. Resource Information:
   
   ├── Resource Title*
   │   └── Text input (required)
   │   └── Placeholder: "e.g., Course Syllabus, Cheat Sheet, Workbook"
   │
   └── Description (optional)
       └── Textarea
       └── Placeholder: "Describe what this resource contains..."

3. File Upload/Link Section (changes based on type):

   FOR FILE TYPES (PDF, Document, Presentation, etc.):
   
   ┌─────────────────────────────────────────────────────┐
   │                                                      │
   │        📁 Drag and drop your file here              │
   │                  or click to browse                 │
   │                                                      │
   │         Accepted formats:                           │
   │         • PDF: .pdf                                 │
   │         • Documents: .doc, .docx, .txt, .rtf       │
   │         • Presentations: .ppt, .pptx, .key         │
   │         • Spreadsheets: .xls, .xlsx, .csv          │
   │         • Images: .jpg, .jpeg, .png, .gif, .svg    │
   │         • Audio: .mp3, .wav, .ogg                  │
   │         • Video: .mp4, .mov, .avi, .webm           │
   │         • Archives: .zip, .rar, .7z, .tar.gz       │
   │         • Code: .js, .py, .java, .cpp, .zip        │
   │                                                      │
   │         Maximum file size: 100 MB                   │
   │                                                      │
   └─────────────────────────────────────────────────────┘
   
   After file selection, show:
   
   ┌─────────────────────────────────────────────────────┐
   │ ✓ Selected File                                      │
   ├─────────────────────────────────────────────────────┤
   │ 📄 course-syllabus.pdf                              │
   │ 2.4 MB • PDF Document                               │
   │                                                      │
   │ [████████████████░░░░] 85% Uploading...            │
   │                                                      │
   │ [Change File] [Remove]                              │
   └─────────────────────────────────────────────────────┘
   
   FOR EXTERNAL LINK:
   
   ├── URL*
   │   └── Text input with validation
   │   └── Placeholder: "https://example.com/resource"
   │   └── Shows preview card when valid URL entered
   │
   └── Link Preview Card:
       ┌──────────────────────────────────────────────┐
       │ [Favicon] Website Title                      │
       │ Brief description from meta tags...          │
       │ example.com                                  │
       └──────────────────────────────────────────────┘

4. Detailed File Information Panel (for uploaded files):

   ├── File Details:
   │   ├── File name: [editable text input]
   │   ├── File size: [auto-calculated, display only]
   │   ├── File type: [display with icon]
   │   ├── Upload date: [auto-filled]
   │   └── File preview (if applicable):
   │       └── PDF: Show first page thumbnail
   │       └── Image: Show image thumbnail
   │       └── Document: Show icon with page count
   │
   └── File Processing Status:
       └── For different file types, show:
           ├── PDF: "✓ 15 pages detected"
           ├── PPTX: "✓ 24 slides detected"
           ├── XLSX: "✓ 3 sheets detected"
           └── Code: "✓ 847 lines of code"

5. Resource Settings:

   ├── Downloadable
   │   └── Toggle switch (default: ON)
   │   └── Help text: "Allow students to download this resource"
   │
   ├── Resource Category (optional)
   │   └── Dropdown:
   │       - Lecture Notes
   │       - Slides
   │       - Workbook/Worksheet
   │       - Reference Material
   │       - Template
   │       - Exercise Files
   │       - Solution Files
   │       - Reading Material
   │       - Supplementary
   │       - Other
   │
   ├── Visibility
   │   └── Radio buttons:
   │       ○ Available immediately
   │       ○ Available after lecture completion
   │       ○ Available after date: [date picker]
   │
   └── File Security (optional):
       ├── Checkbox: "Require completion of previous lectures"
       └── Checkbox: "Watermark with student name" (for PDFs)

6. Preview Section (if applicable):

   PDF Preview:
   ┌─────────────────────────────────────────────────────┐
   │ Page 1 of 15                              [< 1 >]   │
   ├─────────────────────────────────────────────────────┤
   │                                                      │
   │         [PDF page thumbnail preview]                │
   │                                                      │
   └─────────────────────────────────────────────────────┘
   
   Image Preview:
   ┌─────────────────────────────────────────────────────┐
   │ Image Preview                         [Full Screen] │
   ├─────────────────────────────────────────────────────┤
   │                                                      │
   │         [Image preview with zoom controls]          │
   │                                                      │
   └─────────────────────────────────────────────────────┘
   
   Document Preview (DOCX, PPTX, XLSX):
   ┌─────────────────────────────────────────────────────┐
   │ Document Preview                                     │
   ├─────────────────────────────────────────────────────┤
   │ ℹ️ Preview will be generated after upload           │
   │                                                      │
   │ [Icon] filename.docx                                │
   │ Microsoft Word Document • 12 KB                     │
   └─────────────────────────────────────────────────────┘

7. Multiple Resources Management:

   If lecture already has resources, show list:
   
   Current Resources:
   ┌─────────────────────────────────────────────────────┐
   │ 1. 📄 Course Syllabus.pdf (2.4 MB)                  │
   │    [👁️ Preview] [⬇️ Download] [✏️ Edit] [🗑️ Delete]│
   ├─────────────────────────────────────────────────────┤
   │ 2. 📊 Lecture Slides.pptx (5.1 MB)                  │
   │    [👁️ Preview] [⬇️ Download] [✏️ Edit] [🗑️ Delete]│
   ├─────────────────────────────────────────────────────┤
   │ 3. 🔗 Additional Reading                            │
   │    [🔗 Open Link] [✏️ Edit] [🗑️ Delete]            │
   └─────────────────────────────────────────────────────┘
   
   [+ Add Another Resource]

Actions:
├── Add Resource (primary)
├── Add & Continue (add more resources)
└── Cancel (secondary)
```

#### File Type Specific Features:

**For PDF Files:**
- Show page count
- Generate thumbnail of first page
- Optional: Extract text for searchability
- Watermarking option

**For Office Documents (DOCX, XLSX, PPTX):**
- Show document metadata (pages/slides/sheets)
- File size and type
- Conversion to PDF option
- Preview thumbnail

**For Presentations (PPTX, KEY):**
- Slide count
- Thumbnail of first slide
- Option to convert to PDF

**For Spreadsheets (XLSX, CSV):**
- Sheet count
- Row/column count preview
- Data preview (first few rows)

**For Images:**
- Dimensions display
- Format and size
- Thumbnail preview
- Image optimization option

**For Archives (ZIP, RAR):**
- List contents
- Show total size
- Number of files inside
- Option to extract and show files

**For Code Files:**
- Syntax highlighting in preview
- Line count
- Language detection
- Format/prettify option

---

### QUIZ EDITOR
The Pattern:
- Card A (Top): Question Configuration (Stem, Points, Timer, Media) — Standard across all types.
- Card B (Bottom): Interaction Module — Changes dynamically based on Question Type.
- Card C (Optional/Bottom): Feedback & Logic — For your Hints/Explanations.

  1. Global Layout & Architecture
    - Framework: A fixed-height.

    - Grid: 3-column layout (though visually 2 primary zones).
      * Top Bar: Global context and actions (Height ~64px).
      * Left Sidebar: Question navigation and management (Width ~280-320px).
      * Main Content: Dynamic editing canvas (Flex-grow).

  2. Top Navigation Bar (Global Context)
    - Function: Manages the state of the entire quiz unit.

    - Elements:
      - Back Navigation: Arrow icon (returns to Course Overview).
      - Title Input: Inline editable text field ("UI Design Fundamentals & Best Practice") with auto-save capability.
      - Status Indicator: Dynamic text ("Edited Just now") triggered by distinct events (onBlur, onChange).
      - Action:
        * save (disk icon): 

  3. Left Sidebar (Question Navigator)
    - Component Type: Sortable List (Vertical).

    - Header:
      - Counter: QUESTION({count}).
      - Add Action: + button to append a new question to the array.

    - List Item (Card):
      - State: Selected items have a distinct border/shadow and active background color.
      - Content:
        * Index number (1, 2, 3...).
        * Truncated Question Title.
        * Question Type Badge (e.g., "Multiple choice").

      - Interaction:
        * Drag & Drop: Users must be able to reorder questions.
        * Context Menu: "Three dots" for Duplicate or Delete.
      - Footer: Fixed entry for "Result Screen" configuration.

  4. Main Canvas Variations (Interaction Modules) 
    - Variant A: Multiple Choice (Single Select)
        * Header: "Answer Options"
        * Layout: Vertical Stack of list items.
        * Row Component:
           - Left: Radio Button (Interactive). Clicking this marks the row as the correct_answer. Only one can be active.
           - Center: Text Input (Placeholder: "Option 1"). Auto-focus on creation.
           - Right:
               ** Image Icon: To upload an image for this specific answer option.
               ** Trash Icon: Delete option (Hover state).

        * Footer Action:
          + Add Option (Button, Outline style).
          + Shuffle Options (Checkbox): If checked, students see options in random order.

    - Variant B: Multiple Answer (Multi-Select)
        * Header: "Answer Options"
        * Layout: Vertical Stack.
        * Row Component:
          - Left: Checkbox (Square). Clicking toggles selection. Multiple can be active.
          - Center: Text Input.
          - Right: Image Icon, Trash Icon.

        * Settings Header (Inside this card):
          - Partial Credit: Toggle Switch.
            - Logic: If ON, user gets points for every correct checkbox minus incorrect ones.
            - Label: "Allow Partial Credit".

    - Variant C: True / False
        * Header: "Correct Answer"
        * Layout: Horizontal Split (Two large clickable cards).
        * Card 1 (True):
          - Fixed Text: "TRUE"
          - Visual: When selected, turns Green with a Checkmark icon.
        * Card 2 (False):
          - Fixed Text: "FALSE"
          - Visual: When selected, turns Red (or Brand Color) with a Checkmark icon.
        * Note: No "Add Option" or delete buttons allowed here.

    - Variant D: Ordering (Sequence)
        * Header: "Set Correct Order"
        * Instruction Text: "Arrange the items in the correct sequence. These will be shuffled for the student."
        * Row Component:
          - Left: Drag Handle (Six dots icon). Cursor changes to grab.
          - Center: Text Input (Content of the step).
          - Right: Trash Icon.
        * Interaction:
          - User drags rows up/down to define the "Correct" logic (Index 0 to Index N).
          - Animation: Smooth toggle (CSS transform: translate) when dropping items.

    - Variant E: Fill in the Blank (Cloze Test)
        * Core Logic: This module requires a synchronized state between the text editor and the answer list. Every time a "Blank" is created in the text, it is assigned a unique Index ID (1, 2, 3...).
        1. Header & Global Controls
            - Header: Standard Card Header with Title ("Fill in the Blank") and Type Icon.
            - Top Controls:
                * Required: Toggle Switch (Green = Active).
                * Settings Menu: Context dots for specific block settings (e.g., "Case sensitive?").
        2. The "Cloze" Editor (Rich Text Canvas)
            - Interaction:
                * User types a full sentence (e.g., "The sky is blue and the grass is green.").
                * Trigger: User highlights a word (e.g., "blue") -> A tooltip appears: "Create Blank".

            - Tokenization State (The "Blank"):
                * Once clicked, the text "blue" transforms into an inline Token.

                * Visual Style:
                    + Background: Soft Pink (bg-pink-100).
                    + Border: Pink Outline (border-pink-300).
                    + The Index Badge: A small, circular number badge (e.g., ①) appears inside the token, positioned just before or above the word.
                * Logic: The first blank created gets index #1, the second #2, etc.

        3. Answer Logic & Mapping (The Bottom Section)
            * Header: "Answer Keys & Distractors"
            * Layout: A dynamic list of "Answer Chips."
            * Group A: Correct Answers (Mapped)
              - Auto-generated: When a word is turned into a blank in the editor, a corresponding Answer Chip automatically appears here.
              - Visual Style: Pink background (matching the token).
              - The Association: The chip must display the matching Index Number (e.g., 1) clearly on the left side of the chip to link it visually to the blank in the paragraph.
              - Content: The text inside the chip is editable (e.g., if the user wants to accept synonyms, though standard Cloze usually matches the exact text).

          * Group B: Distractors (Unmapped)
            - Definition: False options provided to confuse the student.
            - Action: Button + Add Distractor.
            - Visual Style: Gray background (bg-gray-100), dashed border.
            - No Index: These chips do not have a number, indicating they do not belong to any specific slot in the sentence.

        4. Visual Reference for Developer
            * Text View: "The sky is [1] blue and the grass is [2] green."
            * Answer View:
              - [1] blue (Pink - Linked)
              - [2] green (Pink - Linked)
              - red (Gray - Distractor)
              - yellow (Gray - Distractor)


  5. Feedback & Meta-Data (The "Footer" Card)
      Applies to all question types. Located below the Interaction Module.

      * Structure: Accordion/Collapsible Card.
        - Collapsed State: Label "Feedback, Hints & Explanations" + Chevron Down.
        - Expanded State: Reveals three rich text areas.

      * Fields:
        1. Hint Text:
          - Label: "Hint (Optional)"
          - Input: Text area. Shown to student if they get stuck (if LMS settings allow).

        2. Correct Feedback:
          - Label: "Feedback for Correct Answer"
          - Input: Rich Text (allows bold/italic). Shown after successful submission.

        3. Incorrect Feedback:
          - Label: "Feedback for Incorrect Answer"
          - Input: Rich Text. Shown after failed submission.

  6. Visual Style Guidelines (CSS)
    - Typography: Sans-serif (likely Inter or Roboto). High readability.
    - Color Palette:
        * Background: Light Gray (#F4F6F8).
        * Cards: White (#FFFFFF).
        * Primary Action: Purple/Indigo (#6C5DD3 or similar).
        * Accents: Soft Pink for selection tags.
    - Spacing: Comfortable padding (likely 24px inside cards, 16px gaps between elements).


### CODING EXERCISE EDITOR

**When creating/editing a coding exercise:**

```
Card Header:
- Icon: Code
- Title: "Coding Exercise"
- Close button (×)

Form Sections:

1. Basic Information:
   ├── Exercise Title*
   ├── Instructions (rich textarea)
   └── Programming Language
       └── Dropdown: JavaScript, Python, Java, C++, Ruby, Go, etc.

2. Code Setup:
   ├── Starter Code
   │   └── Code editor with syntax highlighting
   │   └── Line numbers, auto-indent
   │   └── Placeholder code for students
   │
   ├── Expected Output
   │   └── Textarea (what the correct solution should produce)
   │
   └── Solution Code (hidden from students)
       └── Code editor with syntax highlighting

3. Test Cases:
   
   For each test case:
   ├── Test Case Card:
   │   ├── Input (textarea or JSON editor)
   │   ├── Expected Output (textarea)
   │   ├── Is Hidden (toggle - hidden test cases)
   │   ├── Points (number)
   │   └── Delete button
   │
   └── [+ Add Test Case] button

4. Exercise Settings:
   ├── Max Submissions
   │   └── Number input (0 = unlimited)
   ├── Allow Submission
   │   └── Toggle (enable/disable submissions)
   └── Hints
       └── List of hints (add/remove)
       └── [+ Add Hint] button

Actions:
├── Save Exercise (primary)
├── Test Code (secondary - runs test cases)
└── Cancel (secondary)
```

---

### ASSIGNMENT EDITOR

**When creating/editing an assignment:**

```
Card Header:
- Icon: ClipboardList
- Title: "Assignment"
- Close button (×)

Form Sections:

1. Basic Information:
   ├── Assignment Title*
   ├── Description (textarea)
   └── Detailed Instructions (rich text editor)

2. Submission Settings:
   ├── Allowed File Types
   │   └── Multi-select checkboxes:
   │       ☐ PDF (.pdf)
   │       ☐ Word Documents (.doc, .docx)
   │       ☐ PowerPoint (.ppt, .pptx)
   │       ☐ Excel (.xls, .xlsx)
   │       ☐ Images (.jpg, .png, .gif)
   │       ☐ Archives (.zip, .rar)
   │       ☐ Code files (.js, .py, .java, .cpp, etc.)
   │       ☐ Text files (.txt, .md)
   │
   ├── Max File Size (MB)
   │   └── Number input (default: 10MB)
   │   └── Slider: 1MB to 100MB
   │
   ├── Max Number of Files
   │   └── Number input (default: 5, 0 = unlimited)
   │
   └── Due Date
       └── Date & Time picker (optional)
       └── Toggle: "Set due date"

3. Grading Rubric:
   
   Rubric Builder:
   ├── Criterion 1:
   │   ├── Criterion Name (text input)
   │   ├── Description (textarea)
   │   ├── Max Points (number)
   │   ├── Drag handle (reorder)
   │   └── [Delete] button
   │
   ├── Criterion 2: [same structure]
   │
   └── [+ Add Criterion] button
   
   OR
   
   └── [Upload Rubric JSON] button
   
   Total Points: [auto-calculated from rubric or manual input]

4. Assignment Settings:
   ├── Late Submission Policy
   │   └── Radio buttons:
   │       ○ Not allowed
   │       ○ Allowed with penalty (% per day)
   │       ○ Allowed without penalty
   │
   ├── Peer Review
   │   └── Toggle: "Enable peer review"
   │   └── Number of peers to review (if enabled)
   │
   └── Resubmission
       └── Toggle: "Allow resubmission"
       └── Max resubmissions (if allowed)

Actions:
├── Save Assignment (primary)
├── Save & Add Another (secondary)
└── Cancel (secondary)
```

---


### PROJECT EDITOR

**When creating/editing a project:**

```
Card Header:
- Icon: FolderKanban
- Title: "Project"
- Close button (×)

Form Sections:

1. Project Overview:
   ├── Project Title*
   ├── Description (rich textarea)
   └── Complexity Level
       └── Dropdown: Beginner, Intermediate, Advanced, Expert

2. Technical Details:
   ├── Technologies/Tools
   │   └── Tag input (add/remove tags)
   │   └── Examples: React, Node.js, MongoDB, Docker
   │   └── Auto-suggest from common technologies
   │
   └── Learning Objectives
       └── List editor:
           ├── Objective 1 (text input)
           ├── Objective 2 (text input)
           ├── [Drag handle to reorder]
           └── [+ Add Objective] button

3. Project Milestones:
   
   For each milestone:
   ├── Milestone Card (collapsible):
   │   ├── Milestone Number badge
   │   ├── Milestone Title (text input)
   │   ├── Description (textarea)
   │   ├── Due Date (optional date picker)
   │   ├── Deliverables (list):
   │   │   └── [+ Add Deliverable]
   │   ├── Completion Percentage (slider 0-100%)
   │   └── Actions: [Drag] [Delete]
   │
   └── [+ Add Milestone] button

4. Submission Guidelines:
   ├── What to Submit (rich text editor)
   ├── Submission Format (textarea)
   │   └── Example: "GitHub repository link, README, demo video"
   ├── Evaluation Criteria (textarea)
   └── Grading Rubric (similar to Assignment)

5. Resources & Support:
   ├── Starter Files/Template
   │   └── File upload or GitHub repo link
   ├── Reference Materials (list of links)
   └── Support Resources (tutorials, documentation links)

Actions:
├── Save Project (primary)
├── Save & Add Another (secondary)
└── Cancel (secondary)
```

---

## Data Structure & State Management

### Mock Data Schema (localStorage-based)

```typescript
// Main course structure stored in localStorage
interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  language: 'FR' | 'EN' | 'MG';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
  contentType: 'LECTURE' | 'ONLINE' | 'HYBRID';
  status: 'DRAFT' | 'PUBLISHED';
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;
  lectures: Lecture[];
}

interface Lecture {
  id: string;
  title: string;
  description?: string;
  type: 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'CODING_EXERCISE' | 'ASSIGNMENT' | 'PROJECT';
  order: number;
  duration?: number;
  isPreview: boolean;
  isFree: boolean;
  offlineAvailable: boolean;
  
  // Type-specific data
  video?: VideoData;
  article?: ArticleData;
  quiz?: QuizData;
  codingExercise?: CodingExerciseData;
  assignment?: AssignmentData;
  project?: ProjectData;
  resources?: Resource[];
}

interface VideoData {
  url?: string;
  thumbnail?: string;
  duration?: number;
  defaultQuality: 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';
  offlineOptimized: boolean;
  captions?: string;
}

interface ArticleData {
  content: string; // HTML from rich text editor
  contentHtml: string; // Rendered HTML
  contentJson?: any; // Tiptap JSON format
  estimatedReadingTime?: number;
  wordCount?: number;
  images?: ArticleImage[];
  embeddedMedia?: EmbeddedMedia[];
}

interface ArticleImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  size: number;
  width?: number;
  height?: number;
}

interface EmbeddedMedia {
  id: string;
  type: 'youtube' | 'vimeo' | 'codepen' | 'iframe';
  url: string;
  title?: string;
}

interface QuizData {
  title?: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  attemptsAllowed: number;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showCorrectAnswers: boolean;
  showCorrectAnswersAfter: string;
  questions: Question[];
}

interface Question {
  id: string;
  order: number;
  type: 'MULTIPLE_CHOICE' | 'MULTIPLE_ANSWER' | 'TRUE_FALSE' | 'FILL_BLANK' | 'ORDERING';
  question: string;
  questionHtml?: string; // For rich text questions
  points: number;
  options?: string[];
  correctAnswer?: boolean | string | string[];
  acceptedAnswers?: string[];
  orderingItems?: string[];
  explanation?: string;
  hint?: string;
  partialCredit: boolean;
}

interface CodingExerciseData {
  title?: string;
  instructions: string;
  starterCode?: string;
  language: string;
  expectedOutput?: string;
  testCases: TestCase[];
  hints: string[];
  solution?: string;
  allowSubmission: boolean;
  maxSubmissions?: number;
}

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  points: number;
}

interface AssignmentData {
  title?: string;
  description?: string;
  instructions: string;
  instructionsHtml?: string;
  allowedFileTypes: string[];
  maxFileSize?: number;
  maxFiles?: number;
  dueDate?: string;
  rubric?: RubricCriterion[];
  lateSubmissionPolicy: 'not_allowed' | 'with_penalty' | 'without_penalty';
  latePenaltyPercent?: number;
  allowResubmission: boolean;
  maxResubmissions?: number;
}

interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  order: number;
}

interface ProjectData {
  title?: string;
  description: string;
  complexity: string;
  technologies: string[];
  learningObjectives: string[];
  milestones: Milestone[];
  submissionGuidelines?: string;
  evaluationCriteria?: string;
  starterFiles?: string;
  referenceLinks?: string[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  deliverables: string[];
  order: number;
  completionPercentage?: number;
}

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  category?: string;
  fileSize?: number;
  fileSizeFormatted?: string;
  url?: string;
  fileName?: string;
  fileType?: string;
  pageCount?: number;
  downloadable: boolean;
  visibility: 'immediate' | 'after_completion' | 'after_date';
  visibilityDate?: string;
  uploadedAt: string;
}

type ResourceType = 
  | 'PDF' 
  | 'DOCUMENT' 
  | 'PRESENTATION' 
  | 'SPREADSHEET' 
  | 'IMAGE' 
  | 'AUDIO' 
  | 'VIDEO' 
  | 'ARCHIVE' 
  | 'CODE' 
  | 'EXTERNAL_LINK' 
  | 'TEXT';
```

---

## State Management Implementation

### Required React Hooks:

```typescript
// Main course state
const [course, setCourse] = useState<Course | null>(null);

// UI state
const [selectedSection, setSelectedSection] = useState<string | null>(null);
const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
const [editorMode, setEditorMode] = useState<'section' | 'lecture' | null>(null);
const [isCreatingNew, setIsCreatingNew] = useState(false);

// Form state for current editor
const [currentFormData, setCurrentFormData] = useState<any>(null);

// Sidebar state
const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
const [expandedLectures, setExpandedLectures] = useState<Set<string>>(new Set());

// Loading and save states
const [isSaving, setIsSaving] = useState(false);
const [lastSaved, setLastSaved] = useState<Date | null>(null);
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

// File upload states
const [uploadingFiles, setUploadingFiles] = useState<Map<string, number>>(new Map());
const [uploadedFiles, setUploadedFiles] = useState<Map<string, File>>(new Map());
```

---

## CRUD Operations to Implement

### 1. Course Operations:

```typescript
// Initialize or load course from localStorage
const initializeCourse = () => {
  const savedCourse = localStorage.getItem('course_draft');
  if (savedCourse) {
    setCourse(JSON.parse(savedCourse));
  } else {
    const newCourse: Course = {
      id: generateId(),
      title: '',
      language: 'FR',
      level: 'BEGINNER',
      contentType: 'HYBRID',
      status: 'DRAFT',
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCourse(newCourse);
  }
};

// Save course to localStorage
const saveCourse = () => {
  if (course) {
    localStorage.setItem('course_draft', JSON.stringify({
      ...course,
      updatedAt: new Date().toISOString()
    }));
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    // Show success toast
  }
};

// Auto-save every 30 seconds if there are changes
useEffect(() => {
  if (hasUnsavedChanges) {
    const autoSaveTimer = setTimeout(() => {
      saveCourse();
    }, 30000);
    return () => clearTimeout(autoSaveTimer);
  }
}, [hasUnsavedChanges]);

// Update course metadata
const updateCourseMetadata = (field: string, value: any) => {
  setCourse(prev => ({
    ...prev!,
    [field]: value,
    updatedAt: new Date().toISOString()
  }));
  setHasUnsavedChanges(true);
};
```

### 2. Section Operations:

```typescript
// Add new section
const addSection = () => {
  const newSection: Section = {
    id: generateId(),
    title: `Section ${course!.sections.length + 1}`,
    description: '',
    order: course!.sections.length + 1,
    lectures: []
  };
  
  setCourse(prev => ({
    ...prev!,
    sections: [...prev!.sections, newSection]
  }));
  
  setSelectedSection(newSection.id);
  setEditorMode('section');
  setIsCreatingNew(true);
  setHasUnsavedChanges(true);
};

// Update section
const updateSection = (sectionId: string, updates: Partial<Section>) => {
  setCourse(prev => ({
    ...prev!,
    sections: prev!.sections.map(section =>
      section.id === sectionId
        ? { ...section, ...updates }
        : section
    )
  }));
  setHasUnsavedChanges(true);
};

// Delete section
const deleteSection = (sectionId: string) => {
  if (confirm('Are you sure you want to delete this section and all its lectures?')) {
    setCourse(prev => ({
      ...prev!,
      sections: prev!.sections
        .filter(s => s.id !== sectionId)
        .map((s, index) => ({ ...s, order: index + 1 }))
    }));
    setSelectedSection(null);
    setHasUnsavedChanges(true);
  }
};

// Reorder sections
const reorderSections = (startIndex: number, endIndex: number) => {
  setCourse(prev => {
    const sections = Array.from(prev!.sections);
    const [removed] = sections.splice(startIndex, 1);
    sections.splice(endIndex, 0, removed);
    
    return {
      ...prev!,
      sections: sections.map((s, index) => ({ ...s, order: index + 1 }))
    };
  });
  setHasUnsavedChanges(true);
};
```

### 3. Lecture Operations:

```typescript
// Add new lecture to a section
const addLecture = (sectionId: string, type: LectureType) => {
  const section = course!.sections.find(s => s.id === sectionId);
  if (!section) return;
  
  const newLecture: Lecture = {
    id: generateId(),
    title: `New ${type} Lecture`,
    description: '',
    type,
    order: section.lectures.length + 1,
    isPreview: false,
    isFree: false,
    offlineAvailable: true,
    resources: []
  };
  
  // Initialize type-specific data
  switch (type) {
    case 'VIDEO':
      newLecture.video = {
        defaultQuality: 'MEDIUM',
        offlineOptimized: false
      };
      break;
    case 'ARTICLE':
      newLecture.article = {
        content: '',
        contentHtml: '',
        wordCount: 0,
        images: [],
        embeddedMedia: []
      };
      break;
    case 'QUIZ':
      newLecture.quiz = {
        passingScore: 70,
        attemptsAllowed: 3,
        shuffleQuestions: false,
        shuffleAnswers: false,
        showCorrectAnswers: true,
        showCorrectAnswersAfter: 'submission',
        questions: []
      };
      break;
    case 'CODING_EXERCISE':
      newLecture.codingExercise = {
        instructions: '',
        language: 'javascript',
        testCases: [],
        hints: [],
        allowSubmission: true
      };
      break;
    case 'ASSIGNMENT':
      newLecture.assignment = {
        instructions: '',
        allowedFileTypes: ['PDF'],
        maxFileSize: 10,
        maxFiles: 5,
        lateSubmissionPolicy: 'not_allowed',
        allowResubmission: false
      };
      break;
    case 'PROJECT':
      newLecture.project = {
        description: '',
        complexity: 'intermediate',
        technologies: [],
        learningObjectives: [],
        milestones: []
      };
      break;
  }
  
  updateSection(sectionId, {
    lectures: [...section.lectures, newLecture]
  });
  
  setSelectedLecture(newLecture.id);
  setSelectedSection(sectionId);
  setEditorMode('lecture');
  setIsCreatingNew(true);
};

// Update lecture
const updateLecture = (sectionId: string, lectureId: string, updates: Partial<Lecture>) => {
  setCourse(prev => ({
    ...prev!,
    sections: prev!.sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            lectures: section.lectures.map(lecture =>
              lecture.id === lectureId
                ? { ...lecture, ...updates }
                : lecture
            )
          }
        : section
    )
  }));
  setHasUnsavedChanges(true);
};

// Delete lecture
const deleteLecture = (sectionId: string, lectureId: string) => {
  if (confirm('Are you sure you want to delete this lecture?')) {
    const section = course!.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    updateSection(sectionId, {
      lectures: section.lectures
        .filter(l => l.id !== lectureId)
        .map((l, index) => ({ ...l, order: index + 1 }))
    });
    
    setSelectedLecture(null);
  }
};
```

### 4. Resource Operations:

```typescript
// Add resource to lecture
const addResource = (sectionId: string, lectureId: string, resourceData: Partial<Resource>) => {
  const section = course!.sections.find(s => s.id === sectionId);
  const lecture = section?.lectures.find(l => l.id === lectureId);
  
  if (!lecture) return;
  
  const newResource: Resource = {
    id: generateId(),
    title: resourceData.title || 'Untitled Resource',
    description: resourceData.description,
    type: resourceData.type!,
    category: resourceData.category,
    fileSize: resourceData.fileSize,
    fileSizeFormatted: resourceData.fileSize ? formatFileSize(resourceData.fileSize) : undefined,
    url: resourceData.url,
    fileName: resourceData.fileName,
    fileType: resourceData.fileType,
    pageCount: resourceData.pageCount,
    downloadable: resourceData.downloadable ?? true,
    visibility: resourceData.visibility || 'immediate',
    visibilityDate: resourceData.visibilityDate,
    uploadedAt: new Date().toISOString()
  };
  
  updateLecture(sectionId, lectureId, {
    resources: [...(lecture.resources || []), newResource]
  });
};

// Update resource
const updateResource = (
  sectionId: string,
  lectureId: string,
  resourceId: string,
  updates: Partial<Resource>
) => {
  const section = course!.sections.find(s => s.id === sectionId);
  const lecture = section?.lectures.find(l => l.id === lectureId);
  
  if (!lecture) return;
  
  updateLecture(sectionId, lectureId, {
    resources: lecture.resources?.map(r =>
      r.id === resourceId ? { ...r, ...updates } : r
    )
  });
};

// Delete resource
const deleteResource = (sectionId: string, lectureId: string, resourceId: string) => {
  if (confirm('Are you sure you want to delete this resource?')) {
    const section = course!.sections.find(s => s.id === sectionId);
    const lecture = section?.lectures.find(l => l.id === lectureId);
    
    if (!lecture) return;
    
    updateLecture(sectionId, lectureId, {
      resources: lecture.resources?.filter(r => r.id !== resourceId)
    });
  }
};

// Simulate file upload
const simulateFileUpload = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const fileId = generateId();
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += 10;
      setUploadingFiles(prev => new Map(prev).set(fileId, progress));
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploadingFiles(prev => {
          const newMap = new Map(prev);
          newMap.delete(fileId);
          return newMap;
        });
        
        // Store file in memory (in real app, this would upload to server)
        setUploadedFiles(prev => new Map(prev).set(fileId, file));
        
        // Return mock URL
        resolve(`/uploads/${fileId}/${file.name}`);
      }
    }, 200);
  });
};
```

---

## Helper Functions:

```typescript
// Generate unique IDs
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format duration
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Calculate reading time
const calculateReadingTime = (text: string): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};

// Count words
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Get icon for lecture type
const getLectureIcon = (type: LectureType) => {
  switch (type) {
    case 'VIDEO': return Video;
    case 'ARTICLE': return FileText;
    case 'QUIZ': return HelpCircle;
    case 'CODING_EXERCISE': return Code;
    case 'ASSIGNMENT': return ClipboardList;
    case 'PROJECT': return FolderKanban;
    default: return FileText;
  }
};

// Get icon for resource type
const getResourceIcon = (type: ResourceType) => {
  switch (type) {
    case 'PDF': return FileText;
    case 'DOCUMENT': return FileText;
    case 'PRESENTATION': return Presentation;
    case 'SPREADSHEET': return Table;
    case 'IMAGE': return Image;
    case 'AUDIO': return Music;
    case 'VIDEO': return Video;
    case 'ARCHIVE': return Archive;
    case 'CODE': return Code;
    case 'EXTERNAL_LINK': return Link;
    case 'TEXT': return FileText;
    default: return File;
  }
};

// Get badge color for status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'DRAFT': return 'bg-gray-100 text-gray-800';
    case 'PUBLISHED': return 'bg-green-100 text-green-800';
    case 'ARCHIVED': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Extract text from HTML (for rich text editor)
const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};
```

---

## Validation Rules

### Form Validations with Zod:

```typescript
import { z } from 'zod';

const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  subtitle: z.string().max(150).optional(),
  description: z.string().min(10).max(2000),
  language: z.enum(['FR', 'EN', 'MG']),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']),
  contentType: z.enum(['LECTURE', 'ONLINE', 'HYBRID']),
});

const sectionSchema = z.object({
  title: z.string().min(3, 'Section title must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
});

const lectureBaseSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
});

const resourceSchema = z.object({
  title: z.string().min(1, 'Resource title is required'),
  type: z.enum(['PDF', 'DOCUMENT', 'PRESENTATION', 'SPREADSHEET', 'IMAGE', 'AUDIO', 'VIDEO', 'ARCHIVE', 'CODE', 'EXTERNAL_LINK', 'TEXT']),
  url: z.string().url().optional(),
  fileName: z.string().optional(),
});

const quizSchema = z.object({
  passingScore: z.number().min(0).max(100),
  timeLimit: z.number().min(0).optional(),
  attemptsAllowed: z.number().min(0),
  questions: z.array(z.object({
    question: z.string().min(1, 'Question text is required'),
    points: z.number().min(1),
  })).min(1, 'Quiz must have at least one question'),
});
```

---

## UI Components & Empty States

### Empty States:

**No Sections:**
```
Center the following in the right content area:
┌─────────────────────────────────────┐
│                                     │
│         📚 (BookOpen Icon)          │
│                                     │
│     Start Building Your Course      │
│                                     │
│  Create sections to organize your   │
│  course content. Each section can   │
│  contain multiple lectures.         │
│                                     │
│      [+ Add First Section]          │
│                                     │
└─────────────────────────────────────┘
```

**No Lectures in Section:**
```
In sidebar under empty section:
  💡 No lectures yet
  [+ Add First Lecture]
```

**No Resources:**
```
In resource list:
  📎 No additional resources
  [+ Add Resource]
```

**No Questions in Quiz:**
```
┌─────────────────────────────────────┐
│      ❓ (HelpCircle Icon)           │
│    No Questions Added Yet           │
│  Add your first question to start   │
│  building your quiz.                │
│      [+ Add First Question]         │
└─────────────────────────────────────┘
```

---

## Toast Notifications

Implement notifications for:

**Success:**
- "✓ Course saved successfully"
- "✓ Section added"
- "✓ Lecture created"
- "✓ Resource uploaded"
- "✓ Question added"
- "✓ Changes auto-saved"

**Errors:**
- "✗ Failed to save course"
- "✗ Please fill in all required fields"
- "✗ Invalid file format"
- "✗ File size exceeds maximum limit"

**Warnings:**
- "⚠ You have unsaved changes"
- "⚠ This action cannot be undone"

---

## Styling Guidelines

### Color Palette: (an example)
```css
Primary: #2563eb (blue-600)
Secondary: #4b5563 (gray-600)
Success: #16a34a (green-600)
Warning: #ca8a04 (yellow-600)
Danger: #dc2626 (red-600)
Background: #f9fafb (gray-50)
Card: #ffffff
Border: #e5e7eb (gray-200)
```

### Typography:
```css
Page title: text-3xl font-bold
Section headers: text-xl font-semibold
Card titles: text-lg font-semibold
Form labels: text-sm font-medium
Body text: text-sm
Helper text: text-xs text-gray-500
```

### Spacing:
```css
Section gap: space-y-6
Form gap: space-y-4
Card padding: p-6
Sidebar padding: p-4
```

---

## Final Requirements

### Must Include:
✅ Full course metadata form
✅ Collapsible sidebar navigation
✅ All lecture type editors
✅ **Rich text editor for articles (Tiptap/Lexical)**
✅ **Complete resource management with file types**
✅ Resource upload simulation
✅ CRUD operations
✅ localStorage persistence
✅ Auto-save (30s)
✅ Form validation (Zod)
✅ Toast notifications
✅ Loading states
✅ Empty states
✅ Drag-and-drop reordering
✅ Confirmation dialogs
✅ Keyboard shortcuts (Ctrl+S)
✅ Responsive design
✅ TypeScript typing
✅ shadcn/ui components
✅ Lucide React icons
✅ Clean, production-ready code

**Generate this as a complete, working React application with proper TypeScript typing, modern React practices, and a professional, intuitive UI.**