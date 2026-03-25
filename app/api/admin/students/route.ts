import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const runtime = "nodejs";

const getAdminFromToken = async (req: Request) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");

  const token = await getAuthToken(req);

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
    const email = await getAdminFromToken(req);
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
