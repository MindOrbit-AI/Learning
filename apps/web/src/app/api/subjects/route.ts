import { NextResponse } from "next/server";
import { prisma } from "@mindorbit/db";

export async function GET() {
  const subjects = await prisma.subject.findMany({
    select: { id: true, title: true },
  });
  return NextResponse.json({ subjects });
}
