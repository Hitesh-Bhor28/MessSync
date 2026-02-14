import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Meal from "@/models/Meal";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    await connectDB();

    // 🔐 Get token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");

    const decoded = jwt.verify(token, secret) as {
      email: string;
    };

    // 👤 Get user
    const user = await User.findOne({
      email: decoded.email,
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 🍽 Get meals
    const todayMeal = await Meal.findOne({
      email: decoded.email,
      date: "today",
    });

    const tomorrowMeal = await Meal.findOne({
      email: decoded.email,
      date: "tomorrow",
    });

    const todayMeals = todayMeal?.meals || {
      breakfast: false,
      lunch: false,
      dinner: false,
    };

    const tomorrowMeals = tomorrowMeal?.meals || {
      breakfast: false,
      lunch: false,
      dinner: false,
    };

    // 📊 Calculate stats (simple version)
    const weeklyMealsCount = await Meal.countDocuments({
      email: decoded.email,
    });

    const savedMealsCount =
      Object.values(todayMeals).filter((m) => m === false).length;

    const participation =
      Math.round(
        (
          Object.values(todayMeals).filter(Boolean).length /
          3
        ) * 100
      ) || 0;

    return NextResponse.json({
      name: user.name,
      email: user.email,
      todayMeals,
      tomorrowMeals,
      stats: {
        weeklyMeals: weeklyMealsCount,
        savedMeals: savedMealsCount,
        participation,
      },
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
