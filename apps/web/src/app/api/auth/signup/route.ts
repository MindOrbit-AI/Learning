import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@mindorbit/db";
import { allocateUniqueReferralCode, attachReferralFromCode } from "@/services/referral-service";

const signUpSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  ref: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, ref: refBody } = signUpSchema.parse(body);
    const cookieStore = await cookies();
    const refCookie = cookieStore.get("mindorbit_ref")?.value;
    const ref = refBody ?? refCookie ?? undefined;

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const referralCode = await allocateUniqueReferralCode();
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        planTier: "FREE",
        subscriptionStatus: "INACTIVE",
        referralCode,
      },
    });

    await attachReferralFromCode(user.id, ref);

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Sign up failed" }, { status: 500 });
  }
}
