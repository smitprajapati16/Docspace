import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with demo users...");

  const passwordHash = await bcrypt.hash("Demo123!", 10);

  // 1. Demo Owner
  const owner = await prisma.user.upsert({
    where: { email: "owner@docspace.demo" },
    update: {
      passwordHash,
      name: "Demo Owner",
    },
    create: {
      email: "owner@docspace.demo",
      name: "Demo Owner",
      passwordHash,
    },
  });
  console.log(`Upserted owner: ${owner.email} (${owner.id})`);

  // 2. Demo Collaborator
  const collaborator = await prisma.user.upsert({
    where: { email: "collaborator@docspace.demo" },
    update: {
      passwordHash,
      name: "Demo Collaborator",
    },
    create: {
      email: "collaborator@docspace.demo",
      name: "Demo Collaborator",
      passwordHash,
    },
  });
  console.log(`Upserted collaborator: ${collaborator.email} (${collaborator.id})`);

  // 3. Demo Initial Documents
  const welcomeDoc = await prisma.document.upsert({
    where: { id: "demo-welcome-doc" },
    update: {},
    create: {
      id: "demo-welcome-doc",
      title: "Welcome to DocSpace",
      content: JSON.stringify({
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Welcome to DocSpace 🚀" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "DocSpace is a lightweight, responsive collaborative document management and editing platform inspired by Google Docs and modern workspace tools.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Key Features" }],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Rich-text editing with Tiptap (headings, lists, formatting, blockquotes)" }],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Granular document sharing (Viewer vs Editor permissions)" }],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "File importing (.txt, .md, .docx, .json)" }],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Persistent storage with PostgreSQL & Prisma" }],
                  },
                ],
              },
            ],
          },
        ],
      }),
      ownerId: owner.id,
    },
  });
  console.log(`Created sample document: ${welcomeDoc.title}`);

  // Share welcome doc with collaborator as EDITOR
  await prisma.documentShare.upsert({
    where: {
      documentId_userId: {
        documentId: welcomeDoc.id,
        userId: collaborator.id,
      },
    },
    update: {
      permission: "EDITOR",
    },
    create: {
      documentId: welcomeDoc.id,
      userId: collaborator.id,
      permission: "EDITOR",
    },
  });
  console.log(`Shared "${welcomeDoc.title}" with collaborator (${collaborator.email})`);

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
