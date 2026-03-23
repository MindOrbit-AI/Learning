import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { ingestionService, type SourceType } from "@/services/ingestion-service";
import { prisma } from "@mindorbit/db";

const UPLOAD_XP_REWARD = 10;

// Ingestion involves AI summarization and can take 30-60s
export const maxDuration = 60;

const VALID_SOURCE_TYPES: SourceType[] = [
  "pdf",
  "image",
  "youtube",
  "text",
  "url",
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
      const subjectId = (formData.get("subjectId") as string) || undefined;
      const clusterId = (formData.get("clusterId") as string) || undefined;

      if (!file || !sourceType) {
        return NextResponse.json(
          { error: "Missing file or sourceType" },
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
        subjectId: subjectId || undefined,
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

      const { nodeIds, resourceIds } = await ingestionService.processSource(sourceId);
      const resourceId = resourceIds[0] ?? null;
      let xpEarned = 0;
      if (resourceId) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { xp: { increment: UPLOAD_XP_REWARD } },
        });
        xpEarned = UPLOAD_XP_REWARD;
      }
      return NextResponse.json({
        sourceId,
        nodeIds,
        resourceId,
        xpEarned,
        status: "completed",
        message: `Summary, flashcards, and quizzes generated. ${nodeIds.length} concept nodes created.`,
      });
    }

    let body: Record<string, unknown>;
    try {
      const raw = await req.json();
      body = raw && typeof raw === "object" ? raw : {};
    } catch {
      return NextResponse.json(
        { error: "Invalid request body (expected JSON)" },
        { status: 400 }
      );
    }
    const sourceType = (body.sourceType ?? "text") as SourceType;
    const subjectId = (body.subjectId as string) || undefined;
    const clusterId = body.clusterId as string | undefined;
    const sourceUrl = body.sourceUrl as string | undefined;
    const content = body.content as string | undefined;
    if (!VALID_SOURCE_TYPES.includes(sourceType)) {
      return NextResponse.json({ error: "Invalid sourceType" }, { status: 400 });
    }
    if ((sourceType === "youtube" || sourceType === "url") && !sourceUrl) {
      return NextResponse.json(
        { error: `sourceUrl is required for ${sourceType}` },
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
      subjectId: subjectId || undefined,
      clusterId,
      sourceUrl: sourceType === "youtube" || sourceType === "url" ? sourceUrl : undefined,
      content: content,
    });

    const { nodeIds, resourceIds } = await ingestionService.processSource(sourceId);
    const resourceId = resourceIds[0] ?? null;
    let xpEarned = 0;
    if (resourceId) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { xp: { increment: UPLOAD_XP_REWARD } },
      });
      xpEarned = UPLOAD_XP_REWARD;
    }
    return NextResponse.json({
      sourceId,
      nodeIds,
      resourceId,
      xpEarned,
      status: "completed",
      message: `Summary, flashcards, and quizzes generated. ${nodeIds.length} concept nodes created.`,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    console.error("Ingestion upload error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
