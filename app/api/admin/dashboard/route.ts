import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Meal from "@/models/Meal";
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

const percentChange = (current: number, previous: number) => {
  if (!previous) return 0;
  return Math.round(((current - previous) / previous) * 100);
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

export async function GET(req: Request) {
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

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const responses = await Meal.countDocuments({
      date: dateKey,
    });

    const [mealCounts] = await Meal.aggregate([
      { $match: { date: dateKey } },
      {
        $group: {
          _id: null,
          breakfast: {
            $sum: { $cond: ["$meals.breakfast", 1, 0] },
          },
          lunch: {
            $sum: { $cond: ["$meals.lunch", 1, 0] },
          },
          dinner: {
            $sum: { $cond: ["$meals.dinner", 1, 0] },
          },
        },
      },
    ]);

    const breakfast = mealCounts?.breakfast ?? 0;
    const lunch = mealCounts?.lunch ?? 0;
    const dinner = mealCounts?.dinner ?? 0;

    const tomorrowDate = new Date(dateKey);
    tomorrowDate.setDate(tomorrowDate.getDate() - 7);
    const lastWeekKey = toLocalDateKey(tomorrowDate);

    const [lastWeekCounts] = await Meal.aggregate([
      { $match: { date: lastWeekKey } },
      {
        $group: {
          _id: null,
          breakfast: {
            $sum: { $cond: ["$meals.breakfast", 1, 0] },
          },
          lunch: {
            $sum: { $cond: ["$meals.lunch", 1, 0] },
          },
          dinner: {
            $sum: { $cond: ["$meals.dinner", 1, 0] },
          },
        },
      },
    ]);

    const lastBreakfast = lastWeekCounts?.breakfast ?? 0;
    const lastLunch = lastWeekCounts?.lunch ?? 0;
    const lastDinner = lastWeekCounts?.dinner ?? 0;

    const totalMeals = breakfast + lunch + dinner;
    const avgAttendance = totalStudents
      ? Math.round((totalMeals / (totalStudents * 3)) * 100)
      : 0;

    const pending = Math.max(totalStudents - responses, 0);

    const served = await ServedMeal.findOne({ date: dateKey }).lean();

    return NextResponse.json({
      date: dateKey,
      totalStudents,
      responses,
      avgAttendance,
      pending,
      served: served?.meals ?? {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
      },
      mealCounts: {
        breakfast,
        lunch,
        dinner,
      },
      meals: {
        breakfast: {
          count: breakfast,
          total: totalStudents,
          percentage: totalStudents
            ? Math.round((breakfast / totalStudents) * 100)
            : 0,
          change: percentChange(breakfast, lastBreakfast),
        },
        lunch: {
          count: lunch,
          total: totalStudents,
          percentage: totalStudents
            ? Math.round((lunch / totalStudents) * 100)
            : 0,
          change: percentChange(lunch, lastLunch),
        },
        dinner: {
          count: dinner,
          total: totalStudents,
          percentage: totalStudents
            ? Math.round((dinner / totalStudents) * 100)
            : 0,
          change: percentChange(dinner, lastDinner),
        },
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to load admin dashboard" },
      { status: 500 }
    );
  }
}
