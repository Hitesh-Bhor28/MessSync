import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { sendOtpEmail } from "../../../../lib/mailjet/client";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // 2. Generate secure 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // 3. Save OTP in DB (upsert so a user can request it again without duplicates failing uniquely if we set index)
    // Overwriting any previous unexpired OTPs for this email
    await Otp.findOneAndUpdate(
      { email },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // 4. Send the OTP via Mailjet
    try {
      await sendOtpEmail(email, otpCode);
    } catch (mailError: any) {
      // Clean up OTP if email fails so they can retry fully
      await Otp.deleteOne({ email });
      throw mailError;
    }

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (err: any) {
    console.error("OTP send error:", err);
    return NextResponse.json({ message: "Failed to send OTP", error: err.message }, { status: 500 });
  }
}
