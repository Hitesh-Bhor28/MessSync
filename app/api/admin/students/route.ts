import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

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

export async function GET() {
  try {
    const email = await getAdminFromToken();
    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const students = await User.find({ role: "student" })
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      students: students.map((student) => ({
        name: student.name,
        email: student.email,
        role: student.role,
        createdAt: student.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to load students" },
      { status: 500 }
    );
  }
}
