# DocSpace — Assignment Submission

**Candidate Assignment:** Ajaia LLC — AI-Native Full Stack Developer  
**Project:** DocSpace (Collaborative Document Platform)  
**Specification Version:** 1.0  
**Completion Status:** All Phases (0 through 10) Completed  

---

## 1. Quick Start Guide for Reviewers

### Step 1: Install & Setup
```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
```

### Step 2: Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Step 3: Run Automated Test Suite
```bash
npm test
```
Result: **20 passed** across permissions, validation, and sharing test suites.

---

## 2. Demo Reviewer Accounts

Pre-seeded accounts ready to test:

| Account | Email | Password | Role |
|---|---|---|---|
| **Demo Owner** | `owner@docspace.demo` | `Demo123!` | Document Owner |
| **Demo Collaborator** | `collaborator@docspace.demo` | `Demo123!` | Collaborator (Shared access) |

> Tip: The login screen at `/login` provides 1-click quick-fill buttons for both accounts.

---

## 3. Core Requirements Verification Checklist

- [x] **Authentication:** Credentials login with NextAuth & bcrypt; protected routes via middleware.
- [x] **Dashboard:** Responsive document grid, title search, tabs (All, Owned, Shared), delete confirmation.
- [x] **Document Editor:** Tiptap rich-text editor with headings, bold, italic, underline, lists, quotes, undo/redo.
- [x] **Auto-Save:** Debounced auto-saving with live status indicator (*Saved*, *Saving...*, *Unsaved*).
- [x] **Document Sharing:** Share modal with user email lookup, Viewer vs Editor permission selector, collaborator removal.
- [x] **Access Control:** Server-side RBAC enforcement (Viewers cannot edit or rename; Editors cannot delete or share).
- [x] **File Import:** Import `.txt`, `.md`, `.docx`, and `.json` files directly into editable documents.
- [x] **Export:** One-click download as Markdown (`.md`) or Plain Text (`.txt`).
- [x] **Automated Tests:** 20 Vitest automated tests covering permission matrix, schemas, and sharing invariants.
- [x] **Design Tokens:** Strict design system implemented matching spec color palette and typography.

---

## 4. Deployment Readiness & Truthful Status

- **Automated Tests:** `npm test` passed 20/20 tests (Exit Code 0).
- **ESLint:** `npm run lint` completed with 0 errors and 0 warnings (Exit Code 0).
- **Production Build:** `npm run build` compiled cleanly (Exit Code 0).
- **PostgreSQL Production Schema:** Prepared in `prisma/schema.postgresql.prisma` with exact relational models (`User`, `Document`, `DocumentShare`), composite keys, and cascade deletion rules compatible with Neon serverless PostgreSQL.
- **Vercel Build Script:** Added `"vercel-build": "prisma generate && next build"` in `package.json`.
- **Public Deployment Status:** **Pending live deployment to Vercel/Neon.** Local SQLite execution is NOT claimed as proof of a working live PostgreSQL deployment. Once you deploy, paste the live URL into this section and verify.

### Exact Neon Setup Sequence (PowerShell):
```powershell
# 1. Set Neon connection string in terminal session:
$env:DATABASE_URL="YOUR_NEON_POSTGRESQL_CONNECTION_STRING"

# 2. Push schema safely without destructive flags:
npx prisma db push --schema=prisma/schema.postgresql.prisma

# 3. Generate PostgreSQL client:
npx prisma generate --schema=prisma/schema.postgresql.prisma

# 4. Seed demo accounts:
npm run db:seed
```
*(When returning to local SQLite development, run `npx prisma generate --schema=prisma/schema.prisma`)*
