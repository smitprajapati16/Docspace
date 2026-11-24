import { describe, it, expect, vi, beforeEach } from "vitest";
import { SharingService } from "../src/services/sharing.service";
import { DocumentService } from "../src/services/document.service";
import { prisma } from "../src/lib/prisma";

vi.mock("../src/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    documentShare: {
      findMany: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("Sharing Service Rules", () => {
  const docId = "doc-share-test";
  const ownerId = "owner-123";
  const nonOwnerId = "non-owner-456";
  const targetEmail = "collaborator@docspace.demo";
  const targetUserId = "collab-user-789";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws error if non-owner attempts to share document", async () => {
    vi.spyOn(DocumentService, "getAccessLevel").mockResolvedValueOnce({
      accessLevel: "EDITOR",
      canEdit: true,
      canShare: false,
      canDelete: false,
      isOwner: false,
    });

    await expect(
      SharingService.shareDocument(docId, nonOwnerId, targetEmail, "VIEWER")
    ).rejects.toThrow("UNAUTHORIZED: Only the document owner can manage sharing");
  });

  it("throws error if owner attempts to share document with themselves", async () => {
    vi.spyOn(DocumentService, "getAccessLevel").mockResolvedValueOnce({
      accessLevel: "OWNER",
      canEdit: true,
      canShare: true,
      canDelete: true,
      isOwner: true,
    });

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: ownerId,
      email: "owner@docspace.demo",
      name: "Owner",
    } as any);

    await expect(
      SharingService.shareDocument(docId, ownerId, "owner@docspace.demo", "EDITOR")
    ).rejects.toThrow("You cannot share a document with yourself as owner");
  });

  it("throws error if target user does not exist in system", async () => {
    vi.spyOn(DocumentService, "getAccessLevel").mockResolvedValueOnce({
      accessLevel: "OWNER",
      canEdit: true,
      canShare: true,
      canDelete: true,
      isOwner: true,
    });

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);

    await expect(
      SharingService.shareDocument(docId, ownerId, "unknown@random.com", "VIEWER")
    ).rejects.toThrow('User with email "unknown@random.com" was not found');
  });

  it("uses upsert to prevent duplicate shares for the same user", async () => {
    vi.spyOn(DocumentService, "getAccessLevel").mockResolvedValueOnce({
      accessLevel: "OWNER",
      canEdit: true,
      canShare: true,
      canDelete: true,
      isOwner: true,
    });

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: targetUserId,
      email: targetEmail,
      name: "Collaborator",
    } as any);

    vi.mocked(prisma.documentShare.upsert).mockResolvedValueOnce({
      id: "share-abc",
      documentId: docId,
      userId: targetUserId,
      permission: "EDITOR",
      createdAt: new Date(),
    } as any);

    const share = await SharingService.shareDocument(docId, ownerId, targetEmail, "EDITOR");

    expect(prisma.documentShare.upsert).toHaveBeenCalledWith({
      where: {
        documentId_userId: {
          documentId: docId,
          userId: targetUserId,
        },
      },
      update: {
        permission: "EDITOR",
      },
      create: {
        documentId: docId,
        userId: targetUserId,
        permission: "EDITOR",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
    expect(share.id).toBe("share-abc");
  });
});
