import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();
    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error("JWT_SECRET missing");

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
    }

    await connectDB();

    let user = await User.findOne({ email });

    // 🔥 AUTO REGISTER (if not exists)
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        email,
        password: hashedPassword,
        role,
      });
    } else {
      // 🔐 Check password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
      }
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      secret,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      role: user.role,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Auth error" },
      { status: 500 }
    );
  }
}
