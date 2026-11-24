import { prisma } from "@/lib/prisma";
import { RolePermission } from "@/types";
import { DocumentService } from "./document.service";

export class SharingService {
  /**
   * Get all users with whom a document is shared.
   */
  static async getDocumentShares(documentId: string, userId: string) {
    const access = await DocumentService.getAccessLevel(documentId, userId);
    if (access.accessLevel === "NONE") {
      throw new Error("UNAUTHORIZED: You cannot view shares for this document");
    }

    return prisma.documentShare.findMany({
      where: { documentId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Share document with another user by email. Only owner can share.
   */
  static async shareDocument(
    documentId: string,
    ownerId: string,
    targetEmail: string,
    permission: RolePermission
  ) {
    const access = await DocumentService.getAccessLevel(documentId, ownerId);
    if (!access.canShare) {
      throw new Error("UNAUTHORIZED: Only the document owner can manage sharing");
    }

    const normalizedEmail = targetEmail.toLowerCase().trim();
    const targetUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!targetUser) {
      throw new Error(`User with email "${normalizedEmail}" was not found`);
    }

    if (targetUser.id === ownerId) {
      throw new Error("You cannot share a document with yourself as owner");
    }

    // Upsert share record
    return prisma.documentShare.upsert({
      where: {
        documentId_userId: {
          documentId,
          userId: targetUser.id,
        },
      },
      update: {
        permission,
      },
      create: {
        documentId,
        userId: targetUser.id,
        permission,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Remove share access for a user. Only owner can remove.
   */
  static async removeShare(documentId: string, ownerId: string, targetUserId: string) {
    const access = await DocumentService.getAccessLevel(documentId, ownerId);
    if (!access.canShare) {
      throw new Error("UNAUTHORIZED: Only the document owner can manage sharing");
    }

    return prisma.documentShare.delete({
      where: {
        documentId_userId: {
          documentId,
          userId: targetUserId,
        },
      },
    });
  }

  /**
   * Update share permission (VIEWER <-> EDITOR).
   */
  static async updateSharePermission(
    documentId: string,
    ownerId: string,
    targetUserId: string,
    permission: RolePermission
  ) {
    const access = await DocumentService.getAccessLevel(documentId, ownerId);
    if (!access.canShare) {
      throw new Error("UNAUTHORIZED: Only the document owner can manage sharing");
    }

    return prisma.documentShare.update({
      where: {
        documentId_userId: {
          documentId,
          userId: targetUserId,
        },
      },
      data: {
        permission,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
