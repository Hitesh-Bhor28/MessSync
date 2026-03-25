import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import ServedMeal from "@/models/ServedMeal";

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

export async function GET(req: Request) {
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

    const served = await ServedMeal.findOne({ date: dateKey }).lean();

    return NextResponse.json({
      date: dateKey,
      meals: served?.meals ?? {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to load served counts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const email = await getAdminFromToken(req);
    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { date, meals } = await req.json();
    const dateKey = resolveDateKey(date);

    await connectDB();

    await ServedMeal.findOneAndUpdate(
      { date: dateKey },
      {
        meals: {
          breakfast: Number(meals?.breakfast ?? 0),
          lunch: Number(meals?.lunch ?? 0),
          dinner: Number(meals?.dinner ?? 0),
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Served counts saved" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to save served counts" },
      { status: 500 }
    );
  }
}
