import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { DocumentService } from "@/services/document.service";
import { updateDocumentSchema } from "@/lib/validations/document";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const document = await DocumentService.getDocumentById(params.id, session.user.id);
    if (!document) {
      return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error(`GET /api/documents/${params.id} error:`, error);
    return NextResponse.json({ error: "Failed to retrieve document" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = updateDocumentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const updated = await DocumentService.updateDocument(params.id, session.user.id, validated.data);
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error(`PATCH /api/documents/${params.id} error:`, error);
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await DocumentService.deleteDocument(params.id, session.user.id);
    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch (error: any) {
    if (error?.message?.startsWith("UNAUTHORIZED")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error(`DELETE /api/documents/${params.id} error:`, error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
