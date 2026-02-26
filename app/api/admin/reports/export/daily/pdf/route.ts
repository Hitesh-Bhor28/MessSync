import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";
import { connectDB } from "@/lib/db";
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

const buildPdf = async (dateKey: string) => {
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

  const expected = {
    breakfast: mealCounts?.breakfast ?? 0,
    lunch: mealCounts?.lunch ?? 0,
    dinner: mealCounts?.dinner ?? 0,
  };

  const served = await ServedMeal.findOne({ date: dateKey }).lean();
  const servedCounts = {
    breakfast: Number(served?.meals?.breakfast ?? 0),
    lunch: Number(served?.meals?.lunch ?? 0),
    dinner: Number(served?.meals?.dinner ?? 0),
  };

  const expectedTotal =
    expected.breakfast + expected.lunch + expected.dinner;
  const servedTotal =
    servedCounts.breakfast + servedCounts.lunch + servedCounts.dinner;
  const wasteTotal = Math.max(expectedTotal - servedTotal, 0);
  const accuracyPercent = expectedTotal
    ? Math.round((servedTotal / expectedTotal) * 100)
    : 0;

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(20).text("Daily Meal Report", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#6b7280");
  doc.text(`Date: ${dateKey}`);
  doc.fillColor("#111827");
  doc.moveDown();

  doc.fontSize(14).text("Expected vs Served");
  doc.moveDown(0.4);
  doc.fontSize(10);
  doc.text(
    `Breakfast: expected ${expected.breakfast}, served ${servedCounts.breakfast}`
  );
  doc.text(
    `Lunch: expected ${expected.lunch}, served ${servedCounts.lunch}`
  );
  doc.text(
    `Dinner: expected ${expected.dinner}, served ${servedCounts.dinner}`
  );
  doc.moveDown();

  doc.fontSize(14).text("Summary");
  doc.moveDown(0.4);
  doc.fontSize(10);
  doc.text(`Total expected: ${expectedTotal}`);
  doc.text(`Total served: ${servedTotal}`);
  doc.text(`Waste: ${wasteTotal}`);
  doc.text(`Accuracy: ${accuracyPercent}%`);

  doc.end();

  return await new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
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

    const buffer = await buildPdf(dateKey);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="daily-report-${dateKey}.pdf"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to export daily report" },
      { status: 500 }
    );
  }
}
