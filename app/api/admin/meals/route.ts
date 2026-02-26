import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

    const [mealCounts] = await Meal.aggregate([
      { $match: { date: dateKey } },
      {
        $group: {
          _id: null,
          breakfast: { $sum: { $cond: ["$meals.breakfast", 1, 0] } },
          lunch: { $sum: { $cond: ["$meals.lunch", 1, 0] } },
          dinner: { $sum: { $cond: ["$meals.dinner", 1, 0] } },
        },
      },
    ]);

    const breakfastCount = mealCounts?.breakfast ?? 0;
    const lunchCount = mealCounts?.lunch ?? 0;
    const dinnerCount = mealCounts?.dinner ?? 0;

    return NextResponse.json({
      date: dateKey,
      breakfastCount,
      lunchCount,
      dinnerCount,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to load meal counts" },
      { status: 500 }
    );
  }
}
