import { prisma } from "@/lib/prisma";
import { RolePermission } from "@/types";

export type UserAccessLevel = "OWNER" | "EDITOR" | "VIEWER" | "NONE";

export interface DocumentAccessResult {
  accessLevel: UserAccessLevel;
  canEdit: boolean;
  canShare: boolean;
  canDelete: boolean;
  isOwner: boolean;
}

export class DocumentService {
  /**
   * Determine the user's access level for a specific document.
   */
  static async getAccessLevel(documentId: string, userId: string): Promise<DocumentAccessResult> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        shares: {
          where: { userId },
        },
      },
    });

    if (!document) {
      return {
        accessLevel: "NONE",
        canEdit: false,
        canShare: false,
        canDelete: false,
        isOwner: false,
      };
    }

    if (document.ownerId === userId) {
      return {
        accessLevel: "OWNER",
        canEdit: true,
        canShare: true,
        canDelete: true,
        isOwner: true,
      };
    }

    const share = document.shares[0];
    if (share) {
      const isEditor = share.permission === "EDITOR";
      const perm: UserAccessLevel = isEditor ? "EDITOR" : "VIEWER";
      return {
        accessLevel: perm,
        canEdit: isEditor,
        canShare: false,
        canDelete: false,
        isOwner: false,
      };
    }

    return {
      accessLevel: "NONE",
      canEdit: false,
      canShare: false,
      canDelete: false,
      isOwner: false,
    };
  }

  /**
   * List documents accessible to a user (both owned and shared).
   */
  static async getUserDocuments(userId: string) {
    const [owned, shared] = await Promise.all([
      prisma.document.findMany({
        where: { ownerId: userId },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
          shares: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.documentShare.findMany({
        where: { userId },
        include: {
          document: {
            include: {
              owner: {
                select: { id: true, name: true, email: true },
              },
              shares: {
                include: {
                  user: { select: { id: true, name: true, email: true } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const formattedOwned = owned.map((doc) => ({
      ...doc,
      userPermission: "OWNER" as const,
    }));

    const formattedShared = shared.map((s) => ({
      ...s.document,
      userPermission: (s.permission === "EDITOR" ? "EDITOR" : "VIEWER") as RolePermission,
    }));

    return {
      owned: formattedOwned,
      shared: formattedShared,
      all: [...formattedOwned, ...formattedShared].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    };
  }

  /**
   * Retrieve a single document if the user has access.
   */
  static async getDocumentById(documentId: string, userId: string) {
    const access = await this.getAccessLevel(documentId, userId);
    if (access.accessLevel === "NONE") {
      return null;
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        shares: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!document) return null;

    return {
      ...document,
      userPermission: access.accessLevel,
      permissions: access,
    };
  }

  /**
   * Create a new document.
   */
  static async createDocument(userId: string, data: { title?: string; content?: string }) {
    return prisma.document.create({
      data: {
        title: data.title?.trim() || "Untitled document",
        content: data.content || JSON.stringify({
          type: "doc",
          content: [{ type: "paragraph", content: [] }],
        }),
        ownerId: userId,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Update document (Owner or Editor).
   */
  static async updateDocument(
    documentId: string,
    userId: string,
    data: { title?: string; content?: string }
  ) {
    const access = await this.getAccessLevel(documentId, userId);
    if (!access.canEdit) {
      throw new Error("UNAUTHORIZED: You do not have permission to edit this document");
    }

    return prisma.document.update({
      where: { id: documentId },
      data: {
        ...(data.title !== undefined ? { title: data.title.trim() } : {}),
        ...(data.content !== undefined ? { content: data.content } : {}),
      },
    });
  }

  /**
   * Delete document (Owner only).
   */
  static async deleteDocument(documentId: string, userId: string) {
    const access = await this.getAccessLevel(documentId, userId);
    if (!access.canDelete) {
      throw new Error("UNAUTHORIZED: Only the document owner can delete this document");
    }

    return prisma.document.delete({
      where: { id: documentId },
    });
  }
}
