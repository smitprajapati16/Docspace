import { describe, it, expect, vi, beforeEach } from "vitest";
import { DocumentService } from "../src/services/document.service";
import { prisma } from "../src/lib/prisma";

// Mock prisma client for unit tests
vi.mock("../src/lib/prisma", () => ({
  prisma: {
    document: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    documentShare: {
      findMany: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("Document Access & Permissions", () => {
  const docId = "doc-123";
  const ownerId = "user-owner";
  const editorId = "user-editor";
  const viewerId = "user-viewer";
  const strangerId = "user-stranger";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("grants OWNER full edit, share, and delete rights", async () => {
    vi.mocked(prisma.document.findUnique).mockResolvedValueOnce({
      id: docId,
      ownerId: ownerId,
      title: "Design Spec",
      content: "{}",
      createdAt: new Date(),
      updatedAt: new Date(),
      shares: [],
    } as any);

    const access = await DocumentService.getAccessLevel(docId, ownerId);

    expect(access.accessLevel).toBe("OWNER");
    expect(access.canEdit).toBe(true);
    expect(access.canShare).toBe(true);
    expect(access.canDelete).toBe(true);
    expect(access.isOwner).toBe(true);
  });

  it("grants EDITOR edit rights, but forbids share and delete", async () => {
    vi.mocked(prisma.document.findUnique).mockResolvedValueOnce({
      id: docId,
      ownerId: ownerId,
      title: "Design Spec",
      content: "{}",
      createdAt: new Date(),
      updatedAt: new Date(),
      shares: [
        {
          id: "share-1",
          documentId: docId,
          userId: editorId,
          permission: "EDITOR",
          createdAt: new Date(),
        },
      ],
    } as any);

    const access = await DocumentService.getAccessLevel(docId, editorId);

    expect(access.accessLevel).toBe("EDITOR");
    expect(access.canEdit).toBe(true);
    expect(access.canShare).toBe(false);
    expect(access.canDelete).toBe(false);
    expect(access.isOwner).toBe(false);
  });

  it("grants VIEWER read-only rights and forbids edit, share, and delete", async () => {
    vi.mocked(prisma.document.findUnique).mockResolvedValueOnce({
      id: docId,
      ownerId: ownerId,
      title: "Design Spec",
      content: "{}",
      createdAt: new Date(),
      updatedAt: new Date(),
      shares: [
        {
          id: "share-2",
          documentId: docId,
          userId: viewerId,
          permission: "VIEWER",
          createdAt: new Date(),
        },
      ],
    } as any);

    const access = await DocumentService.getAccessLevel(docId, viewerId);

    expect(access.accessLevel).toBe("VIEWER");
    expect(access.canEdit).toBe(false);
    expect(access.canShare).toBe(false);
    expect(access.canDelete).toBe(false);
    expect(access.isOwner).toBe(false);
  });

  it("returns NONE for unauthorized stranger who has no share record", async () => {
    vi.mocked(prisma.document.findUnique).mockResolvedValueOnce({
      id: docId,
      ownerId: ownerId,
      title: "Design Spec",
      content: "{}",
      createdAt: new Date(),
      updatedAt: new Date(),
      shares: [],
    } as any);

    const access = await DocumentService.getAccessLevel(docId, strangerId);

    expect(access.accessLevel).toBe("NONE");
    expect(access.canEdit).toBe(false);
    expect(access.canShare).toBe(false);
    expect(access.canDelete).toBe(false);
    expect(access.isOwner).toBe(false);
  });

  it("throws unauthorized error if VIEWER attempts to update document", async () => {
    vi.mocked(prisma.document.findUnique).mockResolvedValueOnce({
      id: docId,
      ownerId: ownerId,
      title: "Design Spec",
      content: "{}",
      createdAt: new Date(),
      updatedAt: new Date(),
      shares: [
        {
          id: "share-2",
          documentId: docId,
          userId: viewerId,
          permission: "VIEWER",
          createdAt: new Date(),
        },
      ],
    } as any);

    await expect(
      DocumentService.updateDocument(docId, viewerId, { title: "Hacked" })
    ).rejects.toThrow("UNAUTHORIZED: You do not have permission to edit this document");
  });

  it("throws unauthorized error if EDITOR attempts to delete document", async () => {
    vi.mocked(prisma.document.findUnique).mockResolvedValueOnce({
      id: docId,
      ownerId: ownerId,
      title: "Design Spec",
      content: "{}",
      createdAt: new Date(),
      updatedAt: new Date(),
      shares: [
        {
          id: "share-1",
          documentId: docId,
          userId: editorId,
          permission: "EDITOR",
          createdAt: new Date(),
        },
      ],
    } as any);

    await expect(DocumentService.deleteDocument(docId, editorId)).rejects.toThrow(
      "UNAUTHORIZED: Only the document owner can delete this document"
    );
  });
});
