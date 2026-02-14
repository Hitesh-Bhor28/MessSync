import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Meal from "@/models/Meal";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, secret) as { email?: string };

    if (!decoded.email) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { date, meals } = await req.json();

    await connectDB();

    await Meal.findOneAndUpdate(
      { email: decoded.email, date },
      { meals },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Meal selection saved" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error saving meals" }, { status: 500 });
  }
}
