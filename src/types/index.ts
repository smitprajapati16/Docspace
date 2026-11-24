export type RolePermission = "VIEWER" | "EDITOR";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface DocumentSummary {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  shares?: {
    id: string;
    userId: string;
    permission: RolePermission;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
  userPermission?: "OWNER" | "EDITOR" | "VIEWER";
}

export interface DocumentDetail extends DocumentSummary {
  content: string;
}
