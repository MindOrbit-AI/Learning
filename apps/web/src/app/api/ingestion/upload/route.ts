import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { ingestionService, type SourceType } from "@/services/ingestion-service";

const VALID_SOURCE_TYPES: SourceType[] = [
  "pdf",
  "image",
  "youtube",
  "text",
];

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const sourceType = formData.get("sourceType") as string;
      const subjectId = formData.get("subjectId") as string;
      const clusterId = (formData.get("clusterId") as string) || undefined;

      if (!file || !sourceType || !subjectId) {
        return NextResponse.json(
          { error: "Missing file, sourceType, or subjectId" },
          { status: 400 }
        );
      }
      if (!VALID_SOURCE_TYPES.includes(sourceType as SourceType)) {
        return NextResponse.json({ error: "Invalid sourceType" }, { status: 400 });
      }
      if (sourceType !== "pdf" && sourceType !== "image") {
        return NextResponse.json(
          { error: "File upload supports PDF and image (JPEG/PNG/WebP). Use JSON for YouTube/text." },
          { status: 400 }
        );
      }
      if (sourceType === "image") {
        const mimeType = file.type;
        if (!IMAGE_MIME_TYPES.includes(mimeType)) {
          return NextResponse.json(
            { error: "Image must be JPEG, PNG, or WebP" },
            { status: 400 }
          );
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadData: Parameters<typeof ingestionService.uploadSource>[1] = {
        sourceType: sourceType as "pdf" | "image",
        subjectId,
        clusterId,
        fileBuffer: buffer,
      };
      if (sourceType === "image") {
        (uploadData as { fileMimeType?: string }).fileMimeType = file.type;
      }
      const sourceId = await ingestionService.uploadSource(session.user.id, uploadData);

      if (!sourceId) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
      }

      const { nodeIds } = await ingestionService.processSource(sourceId);
      return NextResponse.json({
        sourceId,
        nodeIds,
        status: "completed",
        message: `Summary, flashcards, and quizzes generated. ${nodeIds.length} concept nodes created.`,
      });
    }

    const body = await req.json();
    const sourceType = (body.sourceType ?? "text") as SourceType;
    const subjectId = body.subjectId as string;
    const clusterId = body.clusterId as string | undefined;
    const sourceUrl = body.sourceUrl as string | undefined;
    const content = body.content as string | undefined;

    if (!subjectId) {
      return NextResponse.json(
        { error: "subjectId is required" },
        { status: 400 }
      );
    }
    if (!VALID_SOURCE_TYPES.includes(sourceType)) {
      return NextResponse.json({ error: "Invalid sourceType" }, { status: 400 });
    }
    if (sourceType === "youtube" && !sourceUrl) {
      return NextResponse.json(
        { error: "sourceUrl is required for YouTube" },
        { status: 400 }
      );
    }
    if (
      sourceType === "text" &&
      !content
    ) {
      return NextResponse.json(
        { error: "content is required for text" },
        { status: 400 }
      );
    }

    const sourceId = await ingestionService.uploadSource(session.user.id, {
      sourceType,
      subjectId,
      clusterId,
      sourceUrl: sourceType === "youtube" ? sourceUrl : undefined,
      content: content,
    });

    const { nodeIds } = await ingestionService.processSource(sourceId);
    return NextResponse.json({
      sourceId,
      nodeIds,
      status: "completed",
      message: `Summary, flashcards, and quizzes generated. ${nodeIds.length} concept nodes created.`,
    });
  } catch (e) {
    console.error("Ingestion upload error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 500 }
    );
  }
}
