import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
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

export async function POST(req: Request) {
  try {
    const email = await getAdminFromToken(req);
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
      .select("email name expoPushToken")
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

    const messages = pendingStudents
      .map((s) => s.expoPushToken)
      .filter((token) => token && token.startsWith("ExponentPushToken"))
      .map((token) => ({
        to: token,
        sound: "default",
        title: "MessSync Reminder",
        body: `Don't forget to lock in your meals for ${dateKey} before 10:00 PM!`,
        data: { route: "meals" },
      }));

    if (messages.length > 0) {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });

      if (!response.ok) {
        console.error("Expo Push Warning:", await response.text());
      }
    }

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
