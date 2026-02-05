import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password, role } = await req.json();

  // demo logic (same as Akshay's early repos)
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password required" },
      { status: 400 }
    );
  }

  const token = jwt.sign(
    { email, role },
    "MESS_SYNC_SECRET",
    { expiresIn: "1d" }
  );

  return NextResponse.json({
    message: "Login successful",
    token,
    role,
  });
}
