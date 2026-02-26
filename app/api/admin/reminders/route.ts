import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Meal from "@/models/Meal";

export const runtime = "nodejs";

const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const resolveDateKey = (value: string | null) => {
  if (!value || value === "today") {
    return toLocalDateKey(new Date());
  }
  if (value === "tomorrow") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return toLocalDateKey(tomorrow);
  }
  return value;
};

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

export async function POST(req: Request) {
  try {
    const email = await getAdminFromToken();
    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    const dateKey = resolveDateKey(dateParam);

    await connectDB();

    const students = await User.find({ role: "student" })
      .select("email name")
      .lean();

    const submitted = await Meal.find({ date: dateKey })
      .select("email")
      .lean();

    const submittedEmails = new Set(
      submitted.map((item) => item.email)
    );

    const pendingStudents = students.filter(
      (student) => !submittedEmails.has(student.email)
    );

    if (!process.env.SMTP_HOST) {
      return NextResponse.json(
        {
          message:
            "SMTP settings missing. Configure SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/SMTP_FROM.",
          pending: pendingStudents.length,
        },
        { status: 400 }
      );
    }

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const from = process.env.SMTP_FROM || process.env.SMTP_USER || "";
    const bcc = pendingStudents.map((student) => student.email);

    if (bcc.length === 0) {
      return NextResponse.json({
        message: "No pending students to remind.",
        pending: 0,
      });
    }

    await transporter.sendMail({
      from,
      to: from,
      bcc,
      subject: "MessSync: Meal selection reminder",
      text: `Please submit your meal selection for ${dateKey}. Deadline is 10:00 PM today.`,
    });

    return NextResponse.json({
      message: "Reminders sent.",
      pending: pendingStudents.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to send reminders" },
      { status: 500 }
    );
  }
}
