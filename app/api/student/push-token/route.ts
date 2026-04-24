import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PUT(req: Request) {
  try {
    const token = await getAuthToken(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");

    const decoded = jwt.verify(token, secret) as { email?: string };
    if (!decoded?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { expoPushToken } = body;

    if (!expoPushToken) {
      return NextResponse.json({ message: "Token missing" }, { status: 400 });
    }

    await connectDB();
    
    await User.findOneAndUpdate(
      { email: decoded.email },
      { expoPushToken }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Push Token Save Error:", err);
    return NextResponse.json(
      { message: "Failed to save push token" },
      { status: 500 }
    );
  }
}
