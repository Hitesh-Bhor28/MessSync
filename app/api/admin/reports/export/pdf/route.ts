import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";
import { getAdminReportsData } from "@/lib/adminReports";

export const runtime = "nodejs";

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

const buildPdf = async (days: number) => {
  const { weeklyData, mealDistribution, wasteComparison } =
    await getAdminReportsData(days);

  const doc = new PDFDocument({ margin: 40, size: "A4" });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  const now = new Date();
  const title = "Weekly Planning Summary";
  doc.fontSize(20).text(title, { align: "left" });
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .fillColor("#6b7280")
    .text(`Generated: ${now.toLocaleString("en-US")}`);
  doc.fillColor("#111827");
  doc.moveDown();

  doc.fontSize(14).text("Weekly Data");
  doc.moveDown(0.4);
  doc.fontSize(10);
  weeklyData.forEach((day) => {
    doc.text(
      `${day.day}: expected ${day.expected}, served ${day.served}, waste ${day.waste}`
    );
  });

  doc.moveDown();
  doc.fontSize(14).text("Meal Distribution");
  doc.moveDown(0.4);
  doc.fontSize(10);
  mealDistribution.forEach((meal) => {
    doc.text(`${meal.name}: ${meal.value}`);
  });

  doc.moveDown();
  doc.fontSize(14).text("Waste Comparison");
  doc.moveDown(0.4);
  doc.fontSize(10);
  wasteComparison.forEach((row) => {
    doc.text(
      `${row.week}: traditional ${row.traditional}, with system ${row.withSystem}`
    );
  });

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
    const daysParam = url.searchParams.get("days");
    const parsedDays = Number(daysParam);
    const days = Number.isFinite(parsedDays)
      ? Math.min(Math.max(parsedDays, 1), 14)
      : 7;

    const buffer = await buildPdf(days);
    const filename = `weekly-report-${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to export PDF" },
      { status: 500 }
    );
  }
}
