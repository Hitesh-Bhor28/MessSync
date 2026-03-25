import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Meal from "@/models/Meal";

export const runtime = "nodejs";

const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const resolveDateKey = (value: string) => {
  if (value === "today") {
    return toLocalDateKey(new Date());
  }
  if (value === "tomorrow") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return toLocalDateKey(tomorrow);
  }
  return value;
};

const isAfterCutoff = (targetDateKey: string) => {
  const now = new Date();
  const todayKey = toLocalDateKey(now);

  if (targetDateKey < todayKey) {
    return "Selections for past dates are closed.";
  }

  if (targetDateKey === todayKey) {
    return "Selections for today are closed.";
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = toLocalDateKey(tomorrow);

  if (targetDateKey === tomorrowKey) {
    const cutoff = new Date();
    cutoff.setHours(22, 0, 0, 0);
    if (now >= cutoff) {
      return "Submission cutoff has passed (10:00 PM).";
    }
  }

  return null;
};

const getEmailFromToken = async (req: Request) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");

  const token = await getAuthToken(req);

  if (!token) {
    return null;
  }

  const decoded = jwt.verify(token, secret) as { email?: string };
  return decoded.email ?? null;
};

export async function GET(req: Request) {
  try {
    const email = await getEmailFromToken(req);
    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    const daysParam = url.searchParams.get("days");
    if (dateParam) {
      const resolvedDate = resolveDateKey(dateParam);

      await connectDB();

      const record = await Meal.findOne({
        email,
        date: resolvedDate,
      }).lean();

      return NextResponse.json({
        date: resolvedDate,
        meals: record?.meals ?? {
          breakfast: false,
          lunch: false,
          dinner: false,
        },
      });
    }

    const parsedDays = Number(daysParam);
    const days = Number.isFinite(parsedDays)
      ? Math.min(Math.max(parsedDays, 1), 30)
      : 7;

    const today = new Date();
    const dateKeys = Array.from({ length: days }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - index);
      return toLocalDateKey(date);
    });

    await connectDB();

    const meals = await Meal.find({
      email,
      date: {
        $in: [...dateKeys, "today"],
      },
    }).lean();

    const mealByDate = new Map<string, { breakfast: boolean; lunch: boolean; dinner: boolean }>();

    for (const record of meals) {
      if (!record?.date || !record?.meals) continue;

      const normalizedDate =
        record.date === "today" ? dateKeys[0] : record.date;

      if (!mealByDate.has(normalizedDate)) {
        mealByDate.set(normalizedDate, {
          breakfast: Boolean(record.meals.breakfast),
          lunch: Boolean(record.meals.lunch),
          dinner: Boolean(record.meals.dinner),
        });
      }
    }

    const history = dateKeys.map((date) => {
      const mealsForDate = mealByDate.get(date);
      return {
        date,
        breakfast: mealsForDate?.breakfast ?? false,
        lunch: mealsForDate?.lunch ?? false,
        dinner: mealsForDate?.dinner ?? false,
        status: mealsForDate ? "submitted" : "missed",
      };
    });

    return NextResponse.json({ history });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error loading meal history" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const email = await getEmailFromToken(req);
    if (!email) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { date, meals } = await req.json();
    const resolvedDate = resolveDateKey(date);

    const cutoffMessage = isAfterCutoff(resolvedDate);
    if (cutoffMessage) {
      return NextResponse.json(
        { message: cutoffMessage },
        { status: 400 }
      );
    }

    await connectDB();

    await Meal.findOneAndUpdate(
      { email, date: resolvedDate },
      { meals },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Meal selection saved" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error saving meals" }, { status: 500 });
  }
}
