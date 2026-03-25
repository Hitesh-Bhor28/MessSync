import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password, role, otp } = await req.json();

    if (!name || !email || !password || !otp) {
      return NextResponse.json(
        { message: "All fields including OTP are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await Otp.deleteOne({ email });

    return NextResponse.json({
      message: "Signup successful",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Signup failed" },
      { status: 500 }
    );
  }
}
