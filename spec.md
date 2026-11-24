# AJAIA LLC — AI-NATIVE FULL STACK DEVELOPER ASSIGNMENT
# MASTER PRODUCT & ENGINEERING SPECIFICATION

**Project Name:** DocSpace  
**Project Type:** Collaborative Document Management & Editing Platform  
**Assignment:** Ajaia LLC — AI-Native Full Stack Developer  
**Specification Version:** 1.0  
**Development Approach:** Spec-driven, phased implementation  
**Primary Goal:** Deliver a polished, responsive, functional full-stack application within 4–6 hours.

---

# 1. ROLE AND EXPECTATIONS

You are acting as a Senior Full Stack Engineer, Product Designer, and Technical Architect.

Your responsibility is to build a lightweight collaborative document editor inspired by Google Docs.

You must translate this specification into a working, testable, deployable application.

This is not a UI-only exercise.

The application must have:
- A functional frontend.
- A working backend.
- Persistent database storage.
- Authentication or a properly implemented demo login.
- Document ownership.
- Document sharing.
- Rich-text editing.
- File importing.
- Authorization checks.
- Meaningful automated tests.
- Deployment documentation.

## Engineering expectations

Write professional, understandable, maintainable code.

The code should be appropriate for a developer with 1–2 years of professional full-stack development experience.

This means:

1. Use straightforward implementations instead of unnecessarily complicated abstractions.
2. Use TypeScript properly.
3. Avoid excessive use of `any`.
4. Separate UI components, business logic, database access, and validation.
5. Create reusable components when they provide genuine value.
6. Use descriptive variable and function names.
7. Avoid unnecessarily large components.
8. Avoid duplicate business logic.
9. Handle loading, empty, success, and error states.
10. Keep functions small and focused.
11. Add comments where business logic needs explanation.
12. Never introduce abstractions that make debugging harder without a clear benefit.
13. Never put database credentials or secrets in client-side code.
14. Never rely on frontend-only authorization.

Do not write enterprise-level infrastructure for a small assignment. Build a clean modular monolith.

---

# 2. PRODUCT VISION

## Product name

DocSpace

## Product description

DocSpace is a lightweight document workspace that allows users to create, edit, organize, import, and share documents.

It provides a simple document editing experience with an intuitive dashboard.

The product should feel like a real SaaS application rather than a basic CRUD assignment.

## Product positioning

"Your workspace for creating and sharing ideas."

## Target users

- Individuals managing their documents.
- Small teams sharing written information.
- Employees collaborating on internal documentation.
- Users who need a simple document management workspace.

## Core product objectives

1. Make document creation extremely simple.
2. Provide a comfortable rich-text editing experience.
3. Make document ownership and sharing understandable.
4. Ensure documents persist after refresh.
5. Make the interface usable on mobile, tablet, and desktop.
6. Deliver reliable functionality instead of unnecessary features.

---

# 3. TECHNOLOGY STACK

Use the following stack unless an existing repository contains a working equivalent.

## Frontend

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- React Hook Form
- Zod

## Rich-text editor

- Tiptap
- StarterKit
- Underline extension
- Link extension (optional)
- Placeholder extension
- Text alignment (optional)

## Backend

- Next.js Route Handlers
- Server Actions where appropriate
- Server-side business logic
- Centralized validation
- Centralized authorization

## Database

- PostgreSQL
- Neon for hosted database
- Prisma ORM

## Authentication

- Auth.js
- Credentials-based demo login
- Password hashing using bcrypt
- Secure session cookies

## Testing

- Vitest
- Testing Library where appropriate
- Playwright for an optional end-to-end smoke test

## Deployment

- Vercel
- Neon PostgreSQL

## Important rules

- Use compatible stable package versions.
- Do not install unnecessary dependencies.
- Check existing package versions before upgrading.
- Do not replace a working configuration without a reason.
- Use Prisma migrations.
- Keep environment variables in `.env.local`.
- Provide `.env.example` without actual secrets.

---

# 4. IMPLEMENTATION WORKFLOW — STRICT PHASE SYSTEM

This project must be implemented one phase at a time.

Do not attempt to generate the entire application in one massive operation.

Create a `PROGRESS.md` file in the project root.

It must contain:

- Current development phase.
- Completed tasks.
- In-progress tasks.
- Pending tasks.
- Files created or modified.
- Commands executed.
- Test results.
- Known issues.
- Next recommended action.

Use this format:

| Phase | Task | Status |
|---|---|---|
| 0 | Repository inspection | Pending |
| 1 | Architecture and setup | Pending |
| 2 | Database and authentication | Pending |
| 3 | UI foundation | Pending |
| 4 | Dashboard | Pending |
| 5 | Document editor | Pending |
| 6 | File import | Pending |
| 7 | Sharing and permissions | Pending |
| 8 | Testing and validation | Pending |
| 9 | Deployment | Pending |
| 10 | Documentation and submission | Pending |

Allowed statuses:

- NOT STARTED
- IN PROGRESS
- COMPLETED
- BLOCKED
- PARTIALLY COMPLETED

## Phase execution rules

At the beginning of each phase:

1. Explain the goal of the phase.
2. List the files that will be created or modified.
3. Explain the implementation approach.
4. Identify dependencies or risks.

During implementation:

1. Implement only the current phase.
2. Follow the existing architecture.
3. Keep code understandable.
4. Test the implementation.

At the end of each phase:

1. Run relevant checks.
2. Fix errors introduced by the phase.
3. Update `PROGRESS.md`.
4. Summarize completed work.
5. Explain anything that remains incomplete.
6. Tell the developer what comes next.

Do not silently skip failed tasks.

Do not claim a test passed unless it actually ran successfully.

If blocked by a missing credential or external service, implement the local functionality where possible and document the blocker.

**Time management:** The assignment has a 4–6 hour timebox. Prioritize the core application and working deployment. Avoid spending excessive time on visual animations, advanced collaboration, or optional enhancements.

---

# 5. PHASE 0 — REPOSITORY INSPECTION

Before changing anything, inspect the entire existing project structure.

Determine:

- Whether this is a new or existing project.
- Which framework is installed.
- Which dependencies already exist.
- Whether a database is configured.
- Whether authentication exists.
- Whether reusable components are available.
- Whether there are existing deployment configurations.
- Whether there are any broken implementations.

Do not blindly overwrite existing code.

If no project exists, initialize the application using the recommended stack.

If a project already exists, adapt the architecture rather than rebuilding unnecessarily.

Create:

- `SPEC.md`
- `PROGRESS.md`

Save this complete specification in `SPEC.md`.

At the end, report the repository findings and implementation plan.

---

# 6. PHASE 1 — PROJECT FOUNDATION

## Objective

Establish a clean, organized, working Next.js application.

## Expected folder structure

Use a structure similar to:

```text
docspace/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── documents/
│   │   │   └── shared/
│   │   ├── api/
│   │   │   ├── documents/
│   │   │   ├── upload/
│   │   │   └── sharing/
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── documents/
│   │   ├── editor/
│   │   └── sharing/
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── validations/
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── services/
│   │   ├── document.service.ts
│   │   ├── sharing.service.ts
│   │   └── user.service.ts
│   │
│   ├── hooks/
│   ├── types/
│   └── middleware.ts
│
├── tests/
│   ├── document.test.ts
│   └── permissions.test.ts
│
├── .env.example
├── .gitignore
├── README.md
├── SPEC.md
├── PROGRESS.md
├── ARCHITECTURE.md
├── AI_WORKFLOW.md
└── SUBMISSION.md
```

Adjust paths to match the installed Next.js version and conventions.

Do not create empty folders or unnecessary files merely to match this example.

## Configuration requirements

- TypeScript strict mode.
- ESLint.
- Tailwind CSS.
- Prisma.
- Environment variable validation.
- Proper path aliases.
- Consistent formatting.

## Expected result

The application should start locally without errors.

Verify:

```bash
npm install
npm run dev
```

---

# 7. PHASE 2 — DATABASE AND AUTHENTICATION

## Objective

Implement persistent data storage and a working user login system.

## Database models

Implement these core entities.

### User

Fields:

- id
- name
- email
- passwordHash
- createdAt
- updatedAt

Email must be unique.

### Document

Fields:

- id
- title
- content
- ownerId
- createdAt
- updatedAt

Requirements:

- Default title: Untitled document.
- Content should store Tiptap JSON.
- Owner must reference a valid user.
- Deleting an owner must be handled through an intentional relational deletion policy.

### DocumentShare

Fields:

- id
- documentId
- userId
- permission
- createdAt

Permissions:

- VIEWER
- EDITOR

Requirements:

- A user cannot receive duplicate shares for the same document.
- Only document owners can manage sharing.
- The document owner always retains full control.
- A shared user must be able to access the document.
- A viewer cannot modify the document.
- An editor can modify the document but cannot change ownership or sharing settings.

Add appropriate database indexes and unique constraints.

Use Prisma relations and migrations.

## Authentication

Implement a simple login flow using Auth.js.

Provide two seeded demo users:

| User | Email | Password |
|---|---|---|
| Demo Owner | owner@docspace.demo | Demo123! |
| Demo Collaborator | collaborator@docspace.demo | Demo123! |

These are demo-only credentials. Hash passwords in the seed process.

Use JWT sessions if appropriate for the credentials-based setup.

Never store plaintext passwords.

## Authentication requirements

- Login.
- Logout.
- Protected dashboard routes.
- Redirect unauthenticated users to login.
- Display the logged-in user's name.
- Secure session handling.
- Validate login inputs.

Provide a seed command.

The demo users must be usable by reviewers after deployment.

## Verification

Test:

- Correct credentials allow login.
- Incorrect credentials are rejected.
- Unauthenticated users cannot access protected routes.
- Both seeded users exist.
- Passwords are hashed.
- Sessions work after refresh.

---

# 8. PHASE 3 — DESIGN SYSTEM AND UI FOUNDATION

## Objective

Create a professional SaaS design system before building the individual screens.

The interface must be mobile-first, responsive, accessible, and visually consistent.

## Design direction

Build a clean, modern productivity SaaS application.

Visual inspiration:

- Google Docs
- Notion
- Linear
- Modern workspace dashboards

Do not directly copy their interfaces.

## Design characteristics

- Minimalist.
- Professional.
- Spacious.
- Clean typography.
- Subtle borders.
- Consistent spacing.
- Rounded but not excessively rounded corners.
- Subtle shadows.
- Clear visual hierarchy.
- Restrained use of accent colors.

## Color palette

Use a light theme as the primary experience.

Suggested tokens:

```css
--background: #F8FAFC;
--surface: #FFFFFF;
--foreground: #172033;
--muted: #64748B;
--border: #E5E7EB;
--primary: #4F46E5;
--primary-hover: #4338CA;
--success: #16A34A;
--danger: #DC2626;
```

Use semantic design tokens rather than hardcoding colors throughout components.

## Typography

Use Inter or Geist.

Typography hierarchy:

- Page heading: 24–30px desktop.
- Section heading: 18–20px.
- Body: 14–16px.
- Secondary information: 12–14px.

## Reusable UI components

Create reusable components where appropriate:

- Button
- Input
- Modal/Dialog
- Dropdown
- Avatar
- Badge
- Tooltip
- Skeleton
- EmptyState
- ErrorState
- LoadingState
- Toast notification
- ConfirmDialog

Use shadcn/ui components where suitable.

Do not recreate components unnecessarily.

## Responsive breakpoints

Support:

- Mobile: 320px–639px.
- Tablet: 640px–1023px.
- Desktop: 1024px–1439px.
- Large desktop: 1440px and above.

## Responsive rules

Mobile:

- Single-column layout.
- Collapsible sidebar.
- Full-width content.
- Touch-friendly controls.
- No horizontal overflow.
- Appropriate mobile editor toolbar.
- Modals should fit the viewport.

Tablet:

- Compact sidebar.
- Efficient content width.
- Responsive document cards.

Desktop:

- Persistent sidebar.
- Main content area.
- Appropriate whitespace.
- Optimized document editing experience.

Test at:

- 375px.
- 390px.
- 768px.
- 1024px.
- 1440px.

Do not treat responsiveness as a final cosmetic task. Build it into each screen.

---

# 9. PHASE 4 — DASHBOARD

## Objective

Build the main document workspace.

Route:

`/dashboard`

## Desktop layout

Use three logical areas:

1. Sidebar.
2. Main content.
3. Optional contextual actions.

### Sidebar

Include:

- DocSpace logo.
- New Document button.
- Home.
- My Documents.
- Shared With Me.
- Recently Edited (can be a filtered view).
- User profile.
- Logout.

### Main dashboard header

Display:

- Greeting.
- Dashboard title.
- Search field.
- Create document action.

Example:

"Good afternoon, Alex"

"Your documents, all in one place."

### Quick action area

Include:

- Create Blank Document.
- Import File.

### Recent documents

Display document cards or rows containing:

- Document title.
- Owner or author.
- Last modified time.
- Shared indicator.
- More actions menu.

### Document categories

Provide filters:

- All Documents.
- Owned by Me.
- Shared With Me.

### Document card actions

- Open.
- Rename.
- Delete.
- Copy link (only if an actual shareable URL is supported; otherwise omit).
- Share.

Use a confirmation dialog before deletion.

## Empty states

When the user has no documents, show:

- A clear illustration or icon.
- "Your workspace is empty."
- Explanation.
- Create your first document CTA.

Do not show an empty white screen.

## Search

Implement search against document titles.

Requirements:

- Case-insensitive search.
- Search only documents accessible to the logged-in user.
- Show a helpful no-results state.

## Dashboard interactions

All visible actions must work.

Do not create decorative buttons that do nothing.

---

# 10. PHASE 5 — DOCUMENT CREATION AND EDITING

## Objective

Build the core experience of DocSpace.

Route:

`/documents/[id]`

## Document creation

When the user clicks New Document:

1. Create a database record.
2. Assign the logged-in user as owner.
3. Set the default title to Untitled document.
4. Set initial empty Tiptap JSON content.
5. Navigate to the editor.

Never create a fake frontend-only document.

## Document editor layout

### Top navigation

Include:

- Back to dashboard.
- Editable document title.
- Save status.
- Share button.
- User avatar.

### Formatting toolbar

Include:

- Undo.
- Redo.
- Bold.
- Italic.
- Underline.
- Heading 1.
- Heading 2.
- Paragraph.
- Bulleted list.
- Numbered list.
- Text alignment if implemented.

Toolbar buttons must reflect the active editor state.

### Editor area

The editing canvas should:

- Have a comfortable reading width.
- Use an appropriate document-like white surface.
- Support multiline editing.
- Have good typography.
- Preserve spacing between paragraphs.
- Support headings and lists.
- Work on mobile.

Avoid an editor that feels like a plain textarea.

## Tiptap implementation

Use structured JSON content as the primary stored format.

Configure:

- StarterKit.
- Underline.
- Placeholder.
- Link if implemented.
- Other extensions only when required.

Use a reusable editor component.

Suggested component:

`components/editor/document-editor.tsx`

## Auto-save

Implement debounced auto-save.

Expected behavior:

1. User types.
2. Editor updates local state.
3. A debounce timer triggers saving.
4. The server validates the request.
5. The database updates.
6. UI displays Saved.

Suggested debounce:

800–1200 milliseconds.

Save states:

- Saving...
- Saved.
- Unsaved changes.
- Save failed.

Requirements:

- Do not send an API request on every keystroke.
- Avoid unnecessary database writes.
- Handle network failures.
- Prevent older save requests from overwriting newer content.
- Provide a retry mechanism.
- Ensure the latest content is saved before leaving when reasonably possible.

Do not show Saved before the server confirms persistence.

## Rename

Allow editing the document title.

Requirements:

- Inline editing or a small modal.
- Trim whitespace.
- Reject empty titles.
- Set a reasonable maximum length, such as 120 characters.
- Persist immediately.
- Update the dashboard.

## Reopening documents

After saving:

- Refresh the browser.
- Reopen the same document.
- Confirm content and formatting remain intact.

## Authorization

Only:

- The owner.
- Users with an EDITOR share.
- Users with a VIEWER share.

can access the document.

Viewers must receive read-only editor mode.

Unauthenticated or unauthorized users must not see document contents.

---

# 11. PHASE 6 — FILE UPLOAD AND IMPORT

## Objective

Allow users to import files into the document workflow.

Prioritize reliable import over supporting many formats.

## Supported file types

Initially support:

- `.txt`
- `.md`

DOCX import is optional and must not delay the core application.

## User experience

Add an Import File action on the dashboard.

Support:

- File picker.
- Drag and drop if practical.
- Loading state.
- Error feedback.

## Import flow

1. User selects a file.
2. Validate its extension.
3. Validate MIME type where available.
4. Enforce a maximum file size of 2 MB.
5. Read the file contents.
6. Convert plain text or Markdown into editor-compatible content.
7. Create a new document.
8. Set the document owner.
9. Persist the imported content.
10. Navigate to the editor.

## Markdown handling

Preserve:

- Headings.
- Paragraphs.
- Bulleted lists.
- Numbered lists.
- Basic formatting where practical.

Use a maintained Markdown parser and safe conversion approach if needed.

## Error handling

Show clear messages for:

- Unsupported file.
- Empty file.
- File too large.
- Failed import.
- Invalid content.

Never trust a filename or MIME type alone.

Never execute imported HTML or scripts.

## Scope

Do not build a complicated cloud file storage service.

The assignment only requires importing a file into an editable document.

The original file does not need to be retained.

Clearly display supported file formats in the UI and README.

---

# 12. PHASE 7 — DOCUMENT SHARING

## Objective

Implement functional document sharing with clear ownership and permissions.

This is one of the most important assignment requirements.

## Sharing experience

Add a Share button in the editor header.

Clicking it opens a sharing dialog.

The dialog should contain:

- Document title.
- User email input.
- Permission selector.
- Share button.
- List of people with access.

## Share flow

1. Owner opens Share.
2. Enters another registered user's email.
3. Selects permission.
4. Clicks Share.
5. Backend finds the user.
6. Backend checks that the requester owns the document.
7. Backend creates or updates the share record.
8. Collaborator can access the document from Shared With Me.

If the user does not exist, display a helpful error.

Do not create arbitrary users from the sharing dialog.

## Permission levels

### Viewer

Can:

- Open document.
- Read content.
- See document title.

Cannot:

- Edit content.
- Rename document.
- Delete document.
- Manage sharing.

### Editor

Can:

- Open document.
- Edit content.
- Rename document only if this is explicitly allowed by the implemented policy; preferably keep renaming owner-only.
- Save document changes.

Cannot:

- Delete document.
- Change ownership.
- Manage sharing permissions.

### Owner

Can:

- Read.
- Edit.
- Rename.
- Delete.
- Share.
- Remove collaborators.
- Change collaborator permissions.

## Sharing dialog details

Display:

- Collaborator name.
- Email.
- Permission badge.
- Change permission action.
- Remove access action.

Only the owner can manage these actions.

## Shared documents dashboard

The collaborator must see the document in:

`/shared`

Display:

- Document title.
- Owner name.
- Permission level.
- Last updated time.

Show a clear Shared badge.

## Authorization implementation

Create centralized functions such as:

- `getDocumentAccess()`
- `canViewDocument()`
- `canEditDocument()`
- `canManageSharing()`
- `canDeleteDocument()`

Use these functions in backend operations.

Do not rely on hidden UI buttons for security.

Every protected operation must verify permissions on the server.

---

# 13. PHASE 8 — BACKEND API AND BUSINESS LOGIC

Implement clean, consistent server operations.

Suggested endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/documents` | List accessible documents |
| POST | `/api/documents` | Create document |
| GET | `/api/documents/[id]` | Fetch document |
| PATCH | `/api/documents/[id]` | Update title/content |
| DELETE | `/api/documents/[id]` | Delete owned document |
| POST | `/api/documents/[id]/share` | Share document |
| GET | `/api/documents/[id]/share` | Get collaborators |
| PATCH | `/api/documents/[id]/share/[shareId]` | Update permission |
| DELETE | `/api/documents/[id]/share/[shareId]` | Remove collaborator |

An equivalent Server Action implementation is acceptable if it keeps the same authorization, validation, and business logic boundaries.

## Backend rules

- Validate all incoming inputs with Zod.
- Authenticate every protected request.
- Check permissions before database modifications.
- Return appropriate HTTP status codes.
- Never expose password hashes.
- Never expose secrets.
- Avoid leaking whether a private document exists to unauthorized users.
- Use Prisma safely.
- Avoid trusting client-provided owner IDs.
- Derive user identity from the authenticated session.

## Error response convention

Use a consistent response shape:

```json
{
  "success": false,
  "message": "You do not have permission to edit this document."
}
```

Successful responses should also follow a consistent structure.

Do not expose raw stack traces to users.

Log useful server-side errors without exposing secrets or document content unnecessarily.

---

# 14. PHASE 9 — QUALITY, VALIDATION AND TESTING

## Objective

Verify the core product functionality.

Do not consider the application finished merely because the frontend renders.

## Automated tests

At minimum, implement meaningful tests covering:

### Test 1: Document permissions

Verify:

- Owner can edit.
- Editor can edit.
- Viewer cannot edit.
- Unauthorized user cannot view.
- Non-owner cannot manage sharing.

### Test 2: Document validation

Verify:

- Valid title accepted.
- Empty title rejected.
- Invalid document content rejected.
- Document access is checked correctly.

### Test 3: Sharing behavior

If time allows, verify:

- Owner can share.
- Duplicate share does not create duplicate records.
- Non-owner cannot share.
- Removing a share revokes access.

Use Vitest.

Write tests for real business logic, not just trivial rendering checks.

## Manual testing checklist

### Authentication

- [ ] Login with owner account.
- [ ] Login with collaborator account.
- [ ] Incorrect password rejected.
- [ ] Logout works.
- [ ] Refresh preserves authenticated session.

### Documents

- [ ] Create a document.
- [ ] Rename document.
- [ ] Edit document.
- [ ] Format text.
- [ ] Create lists.
- [ ] Auto-save works.
- [ ] Refresh preserves content.
- [ ] Reopen saved document.
- [ ] Delete document.

### Import

- [ ] Import TXT.
- [ ] Import Markdown.
- [ ] Reject unsupported file.
- [ ] Reject oversized file.
- [ ] Imported document is editable.

### Sharing

- [ ] Owner shares with collaborator.
- [ ] Collaborator sees shared document.
- [ ] Viewer cannot edit.
- [ ] Editor can edit.
- [ ] Owner removes access.
- [ ] Removed collaborator cannot access the document.

### Responsive UI

- [ ] Mobile dashboard.
- [ ] Mobile document editor.
- [ ] Mobile sharing dialog.
- [ ] Tablet layout.
- [ ] Desktop layout.
- [ ] No horizontal overflow.

### Reliability

- [ ] Loading states.
- [ ] Empty states.
- [ ] Error states.
- [ ] No broken navigation.
- [ ] No critical browser console errors.
- [ ] No critical server errors.

---

# 15. PHASE 10 — DEPLOYMENT

## Objective

Make the application accessible to reviewers through a working public URL.

## Deployment architecture

```text
Reviewer Browser
       |
       v
Vercel Deployment
       |
       v
Next.js Application
       |
       v
Prisma ORM
       |
       v
Neon PostgreSQL
```

## Deployment checklist

1. Prepare the production database.
2. Configure production environment variables.
3. Run Prisma migrations.
4. Seed demo users.
5. Build the Next.js application.
6. Deploy to Vercel.
7. Verify the deployed application.
8. Test authentication.
9. Test document creation.
10. Test sharing with two different accounts.
11. Test persistence after refresh.

## Environment variables

Create `.env.example`.

Include placeholders for:

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
```

Use the exact environment variable names required by the chosen Auth.js version and deployment configuration.

Never commit actual secrets.

## Deployment reliability

Do not claim deployment is successful until the public URL has been tested.

If Vercel or Neon configuration requires manual action:

- Explain what is needed.
- Provide the exact configuration steps.
- Continue with all work that can be completed locally.
- Never invent a deployed URL.

---

# 16. OPTIONAL ENHANCEMENTS

Only implement optional features after the core requirements work.

Priority order:

1. Improved editor experience.
2. Document activity timestamps.
3. Markdown export.
4. Document sorting.
5. Better mobile toolbar.
6. Real-time presence indicators.
7. Version history.

Do not implement WebSocket-based real-time collaboration within the initial timebox.

Do not sacrifice core functionality for optional enhancements.

---

# 17. PRODUCT DESIGN DETAILS

The design must look like a credible productivity SaaS product.

## Screen A — Login

Route: `/login`

Design:

- Clean split-screen desktop layout.
- Branding area.
- Login form.
- Email field.
- Password field.
- Login button.
- Demo account information.
- Mobile-friendly single-column layout.

Avoid excessive decorative elements.

## Screen B — Dashboard

Route: `/dashboard`

Include:

- Sidebar navigation.
- Greeting.
- Create document button.
- Import button.
- Search.
- Recent documents.
- Owned and shared document filters.
- User profile.

Document cards should be visually consistent.

## Screen C — Document editor

Route: `/documents/[id]`

Include:

- Top navigation.
- Document title.
- Save status.
- Share button.
- Formatting toolbar.
- Main editing canvas.
- Read-only mode for viewers.

The editor should receive the most attention because it is the central product experience.

## Screen D — Shared documents

Route: `/shared`

Include:

- Shared documents.
- Owner name.
- Permission badge.
- Last modified date.
- Open action.

## Screen E — Sharing dialog

Include:

- Email input.
- Permission dropdown.
- Share action.
- Collaborator list.
- Access removal.
- Permission management.

## Visual consistency

All screens must share:

- The same spacing system.
- The same typography.
- The same buttons.
- The same border styles.
- The same color tokens.
- The same interaction patterns.

Avoid inconsistent component styles between pages.

---

# 18. CODE QUALITY AND MAINTAINABILITY RULES

This section is mandatory.

## Component architecture

Create reusable components based on actual repeated UI patterns.

Good examples:

- `DashboardSidebar`
- `DashboardHeader`
- `DocumentCard`
- `DocumentList`
- `DocumentEditor`
- `EditorToolbar`
- `ShareDialog`
- `UserAvatar`
- `SaveStatus`

Avoid creating a separate component for every small HTML element.

## Service architecture

Keep business logic out of large React components.

Example:

```text
services/
  document.service.ts
  sharing.service.ts
  user.service.ts
```

Services should handle operations such as:

- Creating documents.
- Retrieving accessible documents.
- Updating document content.
- Renaming documents.
- Deleting documents.
- Sharing documents.
- Managing permissions.

## Validation architecture

Keep Zod schemas in:

```text
lib/validations/
```

Do not duplicate the same validation logic across multiple API endpoints.

## Database architecture

Keep Prisma client initialization in one place.

Do not instantiate multiple Prisma clients unnecessarily.

Use appropriate relations, indexes, and unique constraints.

## State management

Prefer:

- React state for local UI state.
- Server Components for server-rendered data.
- Small custom hooks for reusable client-side behavior.

Do not introduce Redux or another global state library unless a genuine requirement emerges.

## Error handling

Every important operation should handle:

- Invalid inputs.
- Unauthorized access.
- Missing records.
- Database failures.
- Network failures.

## Naming conventions

Use:

- PascalCase for React components.
- camelCase for functions and variables.
- UPPER_SNAKE_CASE for constants.
- Descriptive filenames.

Avoid cryptic abbreviations.

## Debugging requirements

When fixing a bug:

1. Identify the root cause.
2. Explain the issue.
3. Identify affected files.
4. Make the smallest reasonable fix.
5. Run the relevant test.
6. Verify that the fix does not break related functionality.
7. Update PROGRESS.md if the implementation status changes.

Never randomly rewrite large sections of working code to fix a small issue.

---

# 19. AI-NATIVE WORKFLOW REQUIREMENTS

The assignment specifically evaluates practical AI usage.

Create `AI_WORKFLOW.md`.

Document the following:

## AI tools used

Record the actual tools used, for example:

- Google Antigravity.
- ChatGPT.
- Other tools only if genuinely used.

## Where AI helped

Explain how AI accelerated:

- Architecture planning.
- Component implementation.
- Database schema design.
- Validation.
- Testing.
- Debugging.
- Documentation.

## What was reviewed or changed

Record at least two real examples of AI-generated output that was reviewed, modified, or rejected.

Do not invent examples.

## Verification

Explain how correctness was checked through:

- Code inspection.
- Manual testing.
- Automated tests.
- Browser testing.
- Production deployment verification.

Do not claim that AI-generated code is automatically correct.

The developer remains responsible for all code.

---

# 20. ARCHITECTURE DOCUMENTATION

Create `ARCHITECTURE.md`.

Include:

1. Product overview.
2. Technology stack.
3. Application architecture.
4. Folder structure.
5. Database schema.
6. Authentication flow.
7. Document creation and editing flow.
8. Auto-save mechanism.
9. File import flow.
10. Sharing and authorization logic.
11. Deployment architecture.
12. Important tradeoffs.
13. Future improvements.

Explain why a modular monolith was selected instead of microservices.

Explain why Tiptap JSON is used instead of plain text.

Explain why real-time collaboration was deferred.

Keep the document concise and understandable.

---

# 21. README REQUIREMENTS

Create a complete `README.md`.

It must include:

- Product name.
- Description.
- Features.
- Tech stack.
- Screenshots section.
- Prerequisites.
- Installation.
- Environment configuration.
- Database setup.
- Prisma migrations.
- Database seeding.
- Development server.
- Production build.
- Testing commands.
- Demo credentials.
- Supported import formats.
- Deployment instructions.
- Known limitations.

Example local setup:

```bash
git clone <repository-url>
cd docspace

npm install

cp .env.example .env.local

npx prisma generate
npx prisma migrate dev
npx prisma db seed

npm run dev
```

Adjust commands to the actual project configuration.

---

# 22. FINAL SUBMISSION REQUIREMENTS

Create `SUBMISSION.md`.

The file must list exactly what is included.

Use this structure:

```markdown
# Ajaia LLC Assignment Submission

## Product
DocSpace

## Live Application
[Deployment URL]

## Source Code
[Repository URL]

## Demo Accounts

Owner:
Email: owner@docspace.demo
Password: Demo123!

Collaborator:
Email: collaborator@docspace.demo
Password: Demo123!

## Deliverables

- [x] Source code
- [x] README.md
- [x] ARCHITECTURE.md
- [x] AI_WORKFLOW.md
- [x] SUBMISSION.md
- [x] Live deployment
- [x] Walkthrough video link
- [x] Screenshots

## Completed Features

List actual completed features.

## Partially Completed Features

List actual incomplete features.

## Known Limitations

List known limitations.

## Future Improvements

Explain what would be implemented with another 2–4 hours.
```

Do not use checked boxes for items that are not actually complete.

Create `VIDEO_URL.txt` containing the actual walkthrough URL once it exists.

Do not invent a video URL.

---

# 23. WALKTHROUGH VIDEO PREPARATION

Prepare the product so that a 3–5 minute walkthrough is straightforward.

Recommended recording sequence:

**0:00–0:30 — Introduction**

- Introduce DocSpace.
- Explain the problem it solves.
- Briefly introduce the technology stack.

**0:30–1:20 — Dashboard**

- Show the dashboard.
- Create a document.
- Explain document organization.

**1:20–2:10 — Editing**

- Demonstrate rich-text formatting.
- Rename the document.
- Show save status.
- Refresh and verify persistence.

**2:10–2:50 — File import**

- Import a Markdown or TXT file.
- Show the generated editable document.

**2:50–3:40 — Sharing**

- Share a document with the collaborator account.
- Open the second account.
- Show Shared With Me.
- Demonstrate viewer/editor permissions.

**3:40–4:30 — Engineering decisions**

- Explain the architecture.
- Show database persistence.
- Mention automated tests.
- Explain the AI-assisted development process.
- Explain intentionally deferred features.

Keep the recording natural and concise.

---

# 24. PRIORITY MATRIX

This determines what must be built first.

| Priority | Feature | Requirement |
|---|---|---|
| P0 | Application setup | Mandatory |
| P0 | Database persistence | Mandatory |
| P0 | Authentication | Mandatory |
| P0 | Document creation | Mandatory |
| P0 | Document editing | Mandatory |
| P0 | Document saving | Mandatory |
| P0 | File import | Mandatory |
| P0 | Document sharing | Mandatory |
| P0 | Access permissions | Mandatory |
| P0 | Responsive design | Mandatory |
| P0 | Automated test | Mandatory |
| P0 | Deployment | Mandatory |
| P1 | Better editor toolbar | Important |
| P1 | Search and filters | Important |
| P1 | Error and empty states | Important |
| P1 | Documentation | Mandatory for submission |
| P2 | Markdown export | Optional |
| P2 | Version history | Optional |
| P2 | Real-time collaboration | Deferred |

Do not start P2 tasks while any P0 feature is incomplete.

---

# 25. ACCEPTANCE CRITERIA

The application is considered ready for submission only when the following end-to-end workflow works.

## Primary reviewer workflow

1. Reviewer opens the live application.
2. Reviewer logs in using the owner demo account.
3. Reviewer sees the dashboard.
4. Reviewer creates a document.
5. Reviewer writes content.
6. Reviewer formats text using the toolbar.
7. Reviewer renames the document.
8. Reviewer waits for the Saved status.
9. Reviewer refreshes the page.
10. Document content remains intact.
11. Reviewer imports a TXT or Markdown file.
12. Reviewer shares a document with the collaborator.
13. Reviewer logs out.
14. Reviewer logs in using the collaborator account.
15. Collaborator sees the shared document.
16. Collaborator can open it.
17. Viewer permission prevents editing, or editor permission allows it.
18. Owner removes access.
19. Collaborator can no longer access that document.

This workflow is the most important demonstration of the application.

Do not sacrifice this workflow to implement optional features.

---

# 26. FINAL INSTRUCTIONS TO THE AI AGENT

Follow these instructions throughout the project.

1. Read this entire specification before implementation.
2. Inspect the existing repository before changing files.
3. Create and maintain PROGRESS.md.
4. Work in sequential phases.
5. Never implement the entire application in one uncontrolled generation.
6. Keep the UI polished and professional.
7. Make every screen responsive.
8. Use reusable components sensibly.
9. Write maintainable TypeScript.
10. Keep the backend secure.
11. Validate all inputs.
12. Enforce permissions server-side.
13. Persist all required data in PostgreSQL.
14. Test the core functionality.
15. Fix errors before moving forward.
16. Document incomplete features honestly.
17. Avoid unnecessary dependencies.
18. Avoid overengineering.
19. Prioritize a working deployment.
20. Stay within the assignment's 4–6 hour timebox.

## Communication protocol

After every phase, respond using:

### Phase completed
What was implemented.

### Files created or modified
List important files and their purpose.

### Verification
Commands and tests actually executed, with results.

### Current status
Completed, partially completed, or blocked.

### Pending work
What remains.

### Next phase
What you intend to implement next.

Do not overwhelm the developer with every line of generated code. Explain the important implementation decisions and point to the relevant files.

If something fails, explain why and fix it before continuing.

If the developer asks a debugging question, prioritize understanding the existing implementation instead of rewriting it.

## START HERE

**Begin with PHASE 0 — REPOSITORY INSPECTION.**

Do not start implementing the entire application immediately.

First inspect the project, identify the existing environment, save this specification as SPEC.md, create PROGRESS.md, and report the implementation plan.

Then proceed phase by phase.

**Final objective: Deliver a polished, fully responsive, genuinely functional DocSpace application that demonstrates sound full-stack engineering and product judgment within the Ajaia LLC assignment timebox.**