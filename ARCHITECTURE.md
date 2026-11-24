# DocSpace — System Architecture

## 1. High-Level Architecture

DocSpace follows a clean, modular monolith architecture built on Next.js 14 App Router:

```text
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│   • Next.js App Router (React Server & Client Components)   │
│   • Tiptap Rich-Text Editor & Toolbar                       │
│   • Tailwind CSS & Lucide UI Primitives                     │
└──────────────┬───────────────────────────────▲──────────────┘
               │ HTTP Requests                 │ JSON
               ▼                               │
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Backend                        │
│   • Middleware (Session verification & Route protection)    │
│   • API Route Handlers (/api/documents, /api/sharing, etc.) │
│   • Service Layer (DocumentService, SharingService)         │
│   • Centralized Zod Validation & Permission Guards          │
└──────────────┬───────────────────────────────▲──────────────┘
               │ Prisma Queries                │
               ▼                               │
┌─────────────────────────────────────────────────────────────┐
│                        Database                             │
│   • SQLite (Zero-config local development: dev.db)          │
│   • PostgreSQL (Neon hosted database for production)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Data Models & Relational Schema

### Users (`users`)
- `id` (String, cuid): Primary key
- `name` (String): Display name
- `email` (String, unique): User login email
- `passwordHash` (String): Salted bcrypt hash
- `createdAt` / `updatedAt`: Timestamps

### Documents (`documents`)
- `id` (String, cuid): Primary key
- `title` (String, default "Untitled document")
- `content` (String, default empty Tiptap doc schema)
- `ownerId` (String): Foreign key referencing `users.id` (onDelete: Cascade)
- `createdAt` / `updatedAt`: Timestamps

### Document Shares (`document_shares`)
- `id` (String, cuid): Primary key
- `documentId` (String): Foreign key referencing `documents.id` (onDelete: Cascade)
- `userId` (String): Foreign key referencing `users.id` (onDelete: Cascade)
- `permission` (String: "VIEWER" | "EDITOR")
- `createdAt`: Timestamp
- **Unique Constraint:** `@@unique([documentId, userId])` to prevent duplicate shares.

---

## 3. Authorization & Security Model

DocSpace adheres to a strict server-enforced permission model. Frontend controls (such as disabled buttons or hidden menus) are treated solely as UX enhancements; all operations are strictly validated on the backend:

| Action | Owner | Editor | Viewer | Unauthorized |
|---|:---:|:---:|:---:|:---:|
| Read Document | Allowed | Allowed | Allowed | 404 / 403 Forbidden |
| Edit Content | Allowed | Allowed | 403 Forbidden | 403 Forbidden |
| Rename Document | Allowed | Allowed | 403 Forbidden | 403 Forbidden |
| Delete Document | Allowed | 403 Forbidden | 403 Forbidden | 403 Forbidden |
| Share Document | Allowed | 403 Forbidden | 403 Forbidden | 403 Forbidden |
| Remove Collaborator | Allowed | 403 Forbidden | 403 Forbidden | 403 Forbidden |

### Service Layer Centralization
All authorization checks are centralized in `DocumentService.getAccessLevel()`:
```ts
const access = await DocumentService.getAccessLevel(documentId, userId);
// Returns: { accessLevel, canEdit, canShare, canDelete, isOwner }
```
This guarantees consistent permission enforcement across all API route handlers and test suites.

---

## 4. File Import Pipeline

When importing files (`.txt`, `.md`, `.docx`, `.json`):
1. Client validates MIME type and file extension.
2. File size is checked to enforce the 2MB ceiling.
3. Content is parsed:
   - Markdown: Headings, bullet lists, bold/italic nodes are mapped into Tiptap JSON.
   - DOCX: Extracted via `mammoth` parser.
   - TXT: Split into paragraph nodes.
4. Document is persisted via `POST /api/documents` with the authenticated user as owner.
5. User is redirected to `/documents/[id]`.
