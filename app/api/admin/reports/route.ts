import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getAdminReportsData } from "@/lib/adminReports";

export const runtime = "nodejs";

const getAdminFromToken = async () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const decoded = jwt.verify(token, secret) as {
    email?: string;
    role?: string;
  };

  if (decoded.role !== "admin") return null;
  return decoded.email ?? null;
};

export async function GET(req: Request) {
  try {
    const email = await getAdminFromToken();
    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const daysParam = url.searchParams.get("days");
    const parsedDays = Number(daysParam);
    const days = Number.isFinite(parsedDays)
      ? Math.min(Math.max(parsedDays, 1), 14)
      : 7;

    const data = await getAdminReportsData(days);

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to load weekly reports" },
      { status: 500 }
    );
  }
}
