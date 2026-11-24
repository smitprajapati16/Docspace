# DocSpace

> **Your workspace for creating and sharing ideas.**

DocSpace is a collaborative document management and rich-text editing platform built with Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Prisma ORM, Auth.js (NextAuth), and Tiptap.

---

## Key Features

- **Intuitive Dashboard:** Organize personal notes, imported files, and team collaborations. Filter by All, Owned by me, or Shared with me.
- **Rich-Text Editor (Tiptap):** Fast formatting with headings (H1-H3), bold, italic, underline, bulleted lists, numbered lists, blockquotes, horizontal rules, and history undo/redo.
- **Auto-Save & Status Indicators:** Debounced autosaving with live status feedback (*Saving...*, *Saved*, *Unsaved changes*), live word and character counters.
- **Collaborative Sharing & Permissions:** Granular access management with **Owner**, **Editor** (can edit content & title), and **Viewer** (read-only) roles enforced on both client and server.
- **File Importing:** Seamlessly import `.txt`, `.md`, `.docx`, and `.json` documents directly into editable rich-text pages.
- **Document Export:** Instant export to Markdown (`.md`) and Plain Text (`.txt`).
- **Demo Reviewer Accounts:** Ready-to-test seeded accounts with 1-click login autofill.
- **Automated Test Suite:** 20+ unit and integration tests powered by Vitest verifying authorization, validation, and sharing logic.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) & React 18 |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS & Lucide React |
| **Database** | SQLite (Zero-config local development) / PostgreSQL (Neon ready for production) |
| **ORM** | Prisma ORM 5.22 |
| **Authentication** | NextAuth.js (Credentials provider with bcrypt password hashing) |
| **Editor** | Tiptap (StarterKit, Underline, Placeholder) |
| **Testing** | Vitest |

---

## Demo Reviewer Credentials

| User | Email | Password | Role |
|---|---|---|---|
| **Demo Owner** | `owner@docspace.demo` | `Demo123!` | Document Owner & Full Access |
| **Demo Collaborator** | `collaborator@docspace.demo` | `Demo123!` | Shared Collaborator (Editor/Viewer) |

> On the login page, you can click the quick-fill buttons to immediately populate these credentials.

---

## Getting Started Locally

### 1. Prerequisites
- Node.js `v18+` or `v20+` (Tested on Node `v24`)
- npm or pnpm

### 2. Installation
```bash
git clone <repo-url>
cd docspace
npm install
```

### 3. Setup Database & Seed Demo Users
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing

Run the automated test suite:
```bash
npm test
```
Runs 20 unit and integration tests covering:
- Document permission rules (Owner, Editor, Viewer access boundaries)
- Zod input validation schemas
- Sharing rules (preventing non-owner shares, duplicate shares, self-sharing)

---

## Production Deployment (Vercel & Neon)

### 1. Provision Neon PostgreSQL
Create a free database on [Neon](https://neon.tech) and copy your connection string.

### 2. Run Database Setup (PowerShell)
```powershell
# Set your Neon connection string in your current terminal session:
$env:DATABASE_URL="YOUR_NEON_POSTGRESQL_CONNECTION_STRING"

# Push the schema safely to Neon (no destructive flags needed on fresh database):
npx prisma db push --schema=prisma/schema.postgresql.prisma

# Generate the PostgreSQL Prisma Client:
npx prisma generate --schema=prisma/schema.postgresql.prisma

# Seed demo accounts and initial shared document:
npm run db:seed
```

> **Note:** Generating the PostgreSQL client updates your local `@prisma/client`. When returning to local SQLite development, simply regenerate the SQLite client:
> ```bash
> npx prisma generate --schema=prisma/schema.prisma
> ```

### 3. Deploy to Vercel
1. Import your repository into [Vercel](https://vercel.com).
2. Set Environment Variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `NEXTAUTH_SECRET`: A secure 32+ character random string.
   - `NEXTAUTH_URL`: Your production Vercel URL (e.g. `https://docspace-xyz.vercel.app`).
3. Deploy! Vercel automatically runs `"vercel-build": "prisma generate --schema=prisma/schema.postgresql.prisma && next build"`.
