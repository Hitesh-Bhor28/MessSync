import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { getAdminReportsData } from "@/lib/adminReports";

export const runtime = "nodejs";

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

const csvEscape = (value: string | number) => {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
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
    const daysParam = url.searchParams.get("days");
    const parsedDays = Number(daysParam);
    const days = Number.isFinite(parsedDays)
      ? Math.min(Math.max(parsedDays, 1), 14)
      : 7;

    const { weeklyData, mealDistribution, wasteComparison } =
      await getAdminReportsData(days);

    const lines: string[] = [];
    lines.push("Weekly Data");
    lines.push("day,expected,served,waste");
    for (const day of weeklyData) {
      lines.push(
        [
          csvEscape(day.day),
          csvEscape(day.expected),
          csvEscape(day.served),
          csvEscape(day.waste),
        ].join(",")
      );
    }

    lines.push("");
    lines.push("Meal Distribution");
    lines.push("name,value");
    for (const meal of mealDistribution) {
      lines.push([csvEscape(meal.name), csvEscape(meal.value)].join(","));
    }

    lines.push("");
    lines.push("Waste Comparison");
    lines.push("week,traditional,withSystem");
    for (const row of wasteComparison) {
      lines.push(
        [
          csvEscape(row.week),
          csvEscape(row.traditional),
          csvEscape(row.withSystem),
        ].join(",")
      );
    }

    const filename = `weekly-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to export CSV" },
      { status: 500 }
    );
  }
}
