import Link from "next/link";
import {
  FileText,
  ArrowRight,
  FolderOpen,
  Share2,
  Check,
  Eye,
  Edit3,
  User,
  UserCheck,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-[#EAEBE6] selection:text-primary">
      {/* ========================================================================= */}
      {/* STICKY NAVIGATION BAR (stays pinned at top across all scroll positions)   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 shrink-0 border-b border-border bg-surface/95 backdrop-blur-xs">
        <div className="mx-auto flex h-11 sm:h-12 max-w-6xl items-center justify-between px-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-85">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white">
              <FileText className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground">
              DocSpace
            </span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-5">
            <div className="hidden md:flex items-center gap-4 text-xs text-foreground-secondary">
              <a href="#features" className="hover:text-foreground transition-colors">
                Product
              </a>
              <a href="#organization" className="hover:text-foreground transition-colors">
                Features
              </a>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex h-7 sm:h-8 items-center justify-center rounded-md bg-primary px-2.5 sm:px-3 text-xs font-medium text-white transition-colors hover:bg-primary-hover shadow-none"
            >
              Open workspace
            </Link>
          </nav>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION 1: STRICT ONE-SCREEN VIEWPORT HERO (Fits remaining 100svh space)  */}
      {/* ========================================================================= */}
      <section className="h-[calc(100svh-2.75rem)] sm:h-[calc(100svh-3rem)] min-h-[calc(100svh-2.75rem)] sm:min-h-[calc(100svh-3rem)] max-h-[calc(100svh-2.75rem)] sm:max-h-[calc(100svh-3rem)] flex flex-col justify-center border-b border-border relative bg-background overflow-hidden">
        {/* Hero Body */}
        <div className="flex-1 min-h-0 flex items-center justify-center px-3 sm:px-6 lg:px-8 py-3 sm:py-4 overflow-hidden">
          <div className="w-full max-w-6xl mx-auto">
            {/* Desktop & Laptop Layout (1024px+): Balanced Two-Column Grid */}
            <div className="hidden lg:grid grid-cols-12 gap-8 xl:gap-10 items-center">
              {/* Left Column: Product Introduction, Value Prop & Actions (5 cols) */}
              <div className="col-span-5 space-y-3.5 xl:space-y-4 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-secondary">
                  Document Workspace
                </p>

                <h1 className="text-[clamp(1.75rem,2.7vw,2.85rem)] font-semibold tracking-tight text-foreground leading-[1.12]">
                  Everything important, in one workspace.
                </h1>

                <p className="text-xs xl:text-sm text-foreground-secondary leading-relaxed max-w-md">
                  Create thoughtful documents, organize your work, and share ideas with the people who matter.
                </p>

                {/* Primary Action */}
                <div className="pt-1 flex items-center gap-2.5">
                  <Link
                    href="/dashboard"
                    className="inline-flex h-8 xl:h-9 items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 xl:px-4 text-xs font-medium text-white transition-colors hover:bg-primary-hover"
                  >
                    Open your workspace
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Discreet Demo Account Box */}
                <div className="rounded-md border border-border bg-surface p-2.5 xl:p-3 space-y-1.5 max-w-md">
                  <div className="flex items-center justify-between text-[10px] text-foreground-secondary font-medium">
                    <span>DEMO REVIEWER ACCOUNTS</span>
                    <span>Password: <code className="font-mono text-foreground font-semibold">Demo123!</code></span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 rounded border border-border bg-surface-secondary px-2 py-1 text-[11px] text-foreground transition-colors hover:bg-[#EAEBE7]"
                    >
                      <UserCheck className="h-3 w-3 text-primary shrink-0" />
                      <span className="truncate">Demo Owner</span>
                    </Link>
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 rounded border border-border bg-surface-secondary px-2 py-1 text-[11px] text-foreground transition-colors hover:bg-[#EAEBE7]"
                    >
                      <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
                      <span className="truncate">Collaborator</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Realistic Scaled Product Preview (7 cols) */}
              <div className="col-span-7">
                <div className="rounded-lg border border-border bg-surface shadow-md overflow-hidden max-h-[min(480px,60vh)] flex flex-col">
                  {/* Window Chrome Header */}
                  <div className="shrink-0 flex h-8 items-center justify-between border-b border-border bg-surface-secondary px-3 text-xs text-foreground-secondary">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#E0E1DC]" />
                        <div className="h-2.5 w-2.5 rounded-full bg-[#E0E1DC]" />
                        <div className="h-2.5 w-2.5 rounded-full bg-[#E0E1DC]" />
                      </div>
                      <span className="text-[11px] font-medium text-foreground ml-1 truncate max-w-[200px] xl:max-w-xs">
                        Engineering Strategy &amp; Design Notes
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-success font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" /> Saved.
                      </span>
                      <span className="text-foreground-secondary">•</span>
                      <span className="font-semibold text-[#344B40]">Owner</span>
                    </div>
                  </div>

                  {/* Window Body: Mini Sidebar + Editor Preview */}
                  <div className="flex flex-1 min-h-0 divide-x divide-border overflow-hidden">
                    {/* Mini Sidebar */}
                    <div className="hidden xl:flex w-44 flex-col justify-between bg-[#FAFBF9] p-2.5 shrink-0">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 px-1.5 text-xs font-semibold text-foreground">
                          <FileText className="h-3 w-3 text-primary" />
                          <span>DocSpace</span>
                        </div>
                        <div className="space-y-0.5 text-[11px]">
                          <div className="flex items-center gap-1.5 rounded px-1.5 py-1 font-medium bg-surface text-foreground shadow-xs">
                            <FolderOpen className="h-3 w-3 text-primary" />
                            <span>All Documents</span>
                          </div>
                          <div className="flex items-center gap-1.5 rounded px-1.5 py-1 text-foreground-secondary">
                            <User className="h-3 w-3" />
                            <span>My Documents</span>
                          </div>
                          <div className="flex items-center gap-1.5 rounded px-1.5 py-1 text-foreground-secondary">
                            <Share2 className="h-3 w-3" />
                            <span>Shared with me</span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-border pt-1.5 text-[10px] text-foreground-secondary">
                        Demo Owner
                      </div>
                    </div>

                    {/* Editor Canvas Body */}
                    <div className="flex-1 flex flex-col bg-surface overflow-hidden">
                      {/* Editor Toolbar */}
                      <div className="shrink-0 flex items-center gap-1.5 border-b border-border px-4 py-1 text-xs text-foreground-secondary bg-surface">
                        <span className="font-semibold text-foreground px-1 py-0.5 rounded bg-surface-secondary text-[11px]">
                          H1
                        </span>
                        <span className="px-1 py-0.5 rounded text-[11px]">H2</span>
                        <span className="h-3 w-px bg-border mx-0.5" />
                        <span className="font-bold text-foreground px-1 py-0.5 rounded bg-surface-secondary text-[11px]">
                          B
                        </span>
                        <span className="italic px-1 py-0.5 rounded text-[11px]">I</span>
                        <span className="underline px-1 py-0.5 rounded text-[11px]">U</span>
                        <span className="h-3 w-px bg-border mx-0.5" />
                        <span className="px-1 py-0.5 rounded text-[11px]">List</span>
                        <span className="px-1 py-0.5 rounded text-[11px]">Quote</span>
                      </div>

                      {/* Scrollable Content inside Preview Window */}
                      <div className="flex-1 p-5 xl:p-6 overflow-y-auto space-y-3 text-left">
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">
                          Q4 Product Strategy &amp; Design Notes
                        </h2>
                        <p className="text-xs text-foreground-secondary leading-relaxed">
                          DocSpace is built with quiet, editorial aesthetics and full relational persistence. Documents autosave continuously, with strict server-side Viewer and Editor access boundaries.
                        </p>
                        <blockquote className="border-l-2 border-primary pl-2.5 text-xs italic text-foreground-secondary py-0.5">
                          &ldquo;Writing software should get out of the way and let the user think.&rdquo;
                        </blockquote>
                        <div className="space-y-1 text-xs text-foreground-secondary pt-1">
                          <div className="flex items-center gap-1.5">
                            <Check className="h-3 w-3 text-primary shrink-0" />
                            <span>Tiptap rich-text engine with instant autosave</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="h-3 w-3 text-primary shrink-0" />
                            <span>Granular sharing with Viewer &amp; Editor permission policies</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="h-3 w-3 text-primary shrink-0" />
                            <span>Relational PostgreSQL / SQLite database with Prisma ORM</span>
                          </div>
                        </div>
                      </div>

                      {/* Preview Window Status Bar */}
                      <div className="shrink-0 flex items-center justify-between border-t border-border bg-[#FAFBF9] px-4 py-1 text-[10px] text-foreground-secondary">
                        <span>142 words • 918 characters</span>
                        <span>Auto-saved to database</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile & Tablet Layout (< 1024px): Proportional, Compact, Single-Viewport */}
            <div className="lg:hidden flex flex-col justify-center items-center text-center space-y-3 sm:space-y-4 max-w-lg mx-auto w-full">
              {/* Text Header Block */}
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground-secondary">
                  Document Workspace
                </p>
                <h1 className="text-[clamp(1.35rem,5.5vw,2.25rem)] font-semibold tracking-tight text-foreground leading-[1.15]">
                  Everything important, in one workspace.
                </h1>
                <p className="text-xs text-foreground-secondary leading-relaxed max-w-sm mx-auto line-clamp-2 sm:line-clamp-none">
                  Create thoughtful documents, organize your work, and share ideas with the people who matter.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex flex-row items-center justify-center gap-2 w-full sm:w-auto">
                <Link
                  href="/dashboard"
                  className="flex-1 sm:flex-none inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-xs font-medium text-white transition-colors hover:bg-primary-hover shadow-none"
                >
                  Open workspace
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Compact Mobile Product Preview Card */}
              <div className="w-full rounded-lg border border-border bg-surface shadow-xs overflow-hidden max-h-[min(240px,32vh)] flex flex-col text-left">
                {/* Mobile Preview Top Bar */}
                <div className="shrink-0 flex h-7 items-center justify-between border-b border-border bg-surface-secondary px-2.5 text-[10px]">
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <FileText className="h-3 w-3 text-primary shrink-0" />
                    <span className="font-semibold text-foreground truncate">
                      Engineering Strategy &amp; Design Notes
                    </span>
                  </div>
                  <span className="text-success font-medium shrink-0 flex items-center gap-0.5 text-[10px]">
                    <Check className="h-2.5 w-2.5" /> Saved
                  </span>
                </div>

                {/* Mobile Preview Content */}
                <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-1.5 text-xs text-foreground-secondary">
                  <h3 className="text-sm font-semibold text-foreground">
                    Welcome to DocSpace 🚀
                  </h3>
                  <p className="text-[11px] text-foreground-secondary leading-relaxed line-clamp-2">
                    DocSpace is a calm, minimal collaborative document workspace inspired by Google Docs and Notion.
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-foreground">
                    <span className="rounded bg-surface-secondary px-1.5 py-0.5 border border-border">
                      Tiptap Rich-Text
                    </span>
                    <span className="rounded bg-surface-secondary px-1.5 py-0.5 border border-border">
                      Viewer &amp; Editor Roles
                    </span>
                    <span className="rounded bg-surface-secondary px-1.5 py-0.5 border border-border">
                      File Imports
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2+: ALL IN SAME CLEAN WHITE BACKGROUND (bg-surface / #FFFFFF)     */}
      {/* ========================================================================= */}
      <div id="features" className="bg-surface divide-y divide-border">
        {/* Section A: Your work, organized */}
        <section id="organization" className="py-16 sm:py-20 px-4 sm:px-6 bg-surface">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-5 space-y-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Workspace Organization
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  Your work, organized.
                </h2>
                <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                  View documents you own alongside documents shared with you. Filter in real time with instantaneous search, quick tabs, and clear owner indicators.
                </p>
              </div>

              <div className="lg:col-span-7 rounded-lg border border-border bg-[#FAFBF9] p-4 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-border text-[11px] text-foreground-secondary font-medium">
                  <span>Document</span>
                  <span>Access</span>
                </div>
                <div className="flex items-center justify-between py-2 text-xs border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-foreground">Welcome to DocSpace</span>
                  </div>
                  <span className="text-[10px] bg-[#EAEBE6] text-[#344B40] px-1.5 py-0.5 rounded font-semibold">
                    Owner
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 text-xs border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-foreground-secondary" />
                    <span className="font-medium text-foreground">Q4 Product Roadmap</span>
                  </div>
                  <span className="text-[10px] bg-[#E9EFEA] text-[#294B38] px-1.5 py-0.5 rounded font-semibold">
                    Can Edit
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-foreground-secondary" />
                    <span className="font-medium text-foreground">Brand &amp; Design System</span>
                  </div>
                  <span className="text-[10px] bg-surface-secondary text-foreground-secondary border border-border px-1.5 py-0.5 rounded font-medium">
                    Read Only
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section B: A better writing experience */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-surface">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-7 order-2 lg:order-1 rounded-lg border border-border bg-[#FAFBF9] p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-foreground-secondary pb-3 border-b border-border">
                  <span className="font-medium text-foreground">Undo / Redo</span>
                  <span className="h-3 w-px bg-border" />
                  <span>H1 · H2 · H3</span>
                  <span className="h-3 w-px bg-border" />
                  <span>Bold · Italic · Underline</span>
                  <span className="h-3 w-px bg-border" />
                  <span>Lists &amp; Quotes</span>
                </div>
                <p className="text-xs text-foreground-secondary leading-relaxed pt-1">
                  Powered by the modern Tiptap engine, the editor ensures smooth typography, keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+Z), and continuous background autosave so nothing is ever lost.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border text-[11px] text-foreground-secondary">
                  <span>Live Word &amp; Character Counter</span>
                  <span className="text-success font-medium">Saved to Database</span>
                </div>
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2 space-y-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Editor Engine
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  A better writing experience.
                </h2>
                <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                  Focused, responsive, and distraction-free. Write documents with clean hierarchy, formatted blocks, and instantaneous local and remote persistence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section C: Sharing with clarity */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-surface">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-5 space-y-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Access Control
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  Sharing with clarity.
                </h2>
                <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                  Share documents by user email with explicit Viewer and Editor roles. Permissions are strictly enforced on the server to ensure document integrity.
                </p>
              </div>

              <div className="lg:col-span-7 rounded-lg border border-border bg-[#FAFBF9] p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-medium">
                  <span>Share Settings — Role Policies</span>
                  <span className="text-[11px] text-foreground-secondary">Owner Managed</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="rounded border border-border bg-surface p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Edit3 className="h-3.5 w-3.5 text-[#294B38]" />
                      <span>Editor Access</span>
                    </div>
                    <p className="text-[11px] text-foreground-secondary leading-relaxed">
                      Can open, edit content, and update title. Cannot delete the document or change sharing settings.
                    </p>
                  </div>

                  <div className="rounded border border-border bg-surface p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Eye className="h-3.5 w-3.5 text-foreground-secondary" />
                      <span>Viewer Access</span>
                    </div>
                    <p className="text-[11px] text-foreground-secondary leading-relaxed">
                      Can read document content in read-only mode. Toolbar is hidden and editing actions are forbidden.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section D: Import and continue */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-surface">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-7 order-2 lg:order-1 rounded-lg border border-border bg-[#FAFBF9] p-4 sm:p-5 space-y-3">
                <span className="text-xs font-medium text-foreground">Supported File Formats</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                  <div className="rounded border border-border bg-surface py-2.5 px-2 text-xs font-medium shadow-2xs">
                    .md <span className="block text-[10px] text-foreground-secondary mt-0.5">Markdown</span>
                  </div>
                  <div className="rounded border border-border bg-surface py-2.5 px-2 text-xs font-medium shadow-2xs">
                    .docx <span className="block text-[10px] text-foreground-secondary mt-0.5">Word Document</span>
                  </div>
                  <div className="rounded border border-border bg-surface py-2.5 px-2 text-xs font-medium shadow-2xs">
                    .txt <span className="block text-[10px] text-foreground-secondary mt-0.5">Plain Text</span>
                  </div>
                  <div className="rounded border border-border bg-surface py-2.5 px-2 text-xs font-medium shadow-2xs">
                    .json <span className="block text-[10px] text-foreground-secondary mt-0.5">Tiptap Schema</span>
                  </div>
                </div>
                <p className="text-[11px] text-foreground-secondary pt-1">
                  Upload any supported file under 2 MB to automatically convert headings, paragraphs, and lists into an editable DocSpace document.
                </p>
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2 space-y-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Interoperability
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  Import and continue.
                </h2>
                <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                  Bring your existing notes and documentation over with one click. Export anytime back to standard Markdown or plain text.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Restrained Footer */}
      <footer className="py-8 px-4 sm:px-6 bg-surface border-t border-border">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-secondary">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-white">
              <FileText className="h-3 w-3" />
            </div>
            <span className="font-semibold text-foreground">DocSpace</span>
          </div>

          <div className="flex items-center gap-5">
            <a href="#features" className="hover:text-foreground transition-colors">
              Product
            </a>
            <a href="#organization" className="hover:text-foreground transition-colors">
              Features
            </a>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </div>

          <p>© 2026 DocSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
