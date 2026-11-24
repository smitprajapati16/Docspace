import { describe, it, expect } from "vitest";
import {
  createDocumentSchema,
  updateDocumentSchema,
  shareDocumentSchema,
} from "../src/lib/validations/document";
import { loginSchema } from "../src/lib/validations/auth";

describe("Validation Schemas", () => {
  describe("createDocumentSchema", () => {
    it("accepts valid title and content", () => {
      const result = createDocumentSchema.safeParse({
        title: "Product Roadmap Q4",
        content: JSON.stringify({ type: "doc", content: [] }),
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Product Roadmap Q4");
      }
    });

    it("applies default title if none provided", () => {
      const result = createDocumentSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Untitled document");
      }
    });

    it("rejects empty string title", () => {
      const result = createDocumentSchema.safeParse({ title: "   " });
      expect(result.success).toBe(false);
    });
  });

  describe("shareDocumentSchema", () => {
    it("accepts valid email and VIEWER permission", () => {
      const result = shareDocumentSchema.safeParse({
        email: "collaborator@docspace.demo",
        permission: "VIEWER",
      });
      expect(result.success).toBe(true);
    });

    it("accepts valid email and EDITOR permission", () => {
      const result = shareDocumentSchema.safeParse({
        email: "collaborator@docspace.demo",
        permission: "EDITOR",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email address", () => {
      const result = shareDocumentSchema.safeParse({
        email: "not-an-email",
        permission: "VIEWER",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid permission role", () => {
      const result = shareDocumentSchema.safeParse({
        email: "collab@docspace.demo",
        permission: "ADMIN",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("accepts valid email and password >= 6 characters", () => {
      const result = loginSchema.safeParse({
        email: "owner@docspace.demo",
        password: "Demo123!",
      });
      expect(result.success).toBe(true);
    });

    it("rejects password shorter than 6 characters", () => {
      const result = loginSchema.safeParse({
        email: "owner@docspace.demo",
        password: "123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects malformed email", () => {
      const result = loginSchema.safeParse({
        email: "invalid-user",
        password: "Demo123!",
      });
      expect(result.success).toBe(false);
    });
  });
});
