import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Meal from "@/models/Meal";
import ServedMeal from "@/models/ServedMeal";

export interface WeeklyDatum {
  day: string;
  expected: number;
  served: number;
  waste: number;
}

export interface DistributionDatum {
  name: string;
  value: number;
  color: string;
}

export interface WasteDatum {
  week: string;
  traditional: number;
  withSystem: number;
}

const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export async function getAdminReportsData(days: number) {
  await connectDB();

  const totalStudents = await User.countDocuments({
    role: "student",
  });

  const today = new Date();
  const maxDays = Math.max(days, 28);
  const allDateKeys = Array.from({ length: maxDays }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (maxDays - 1 - index));
    return toLocalDateKey(date);
  });

  const dateKeys = allDateKeys.slice(-days);

  const aggregates = await Meal.aggregate([
    { $match: { date: { $in: allDateKeys } } },
    {
      $group: {
        _id: "$date",
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

  const aggregateByDate = new Map<
    string,
    { breakfast: number; lunch: number; dinner: number }
  >();

  for (const entry of aggregates) {
    aggregateByDate.set(entry._id, {
      breakfast: entry.breakfast ?? 0,
      lunch: entry.lunch ?? 0,
      dinner: entry.dinner ?? 0,
    });
  }

  const servedEntries = await ServedMeal.find({
    date: { $in: allDateKeys },
  })
    .select("date meals")
    .lean();

  const servedByDate = new Map<
    string,
    { breakfast: number; lunch: number; dinner: number }
  >();

  for (const entry of servedEntries) {
    servedByDate.set(entry.date, {
      breakfast: Number(entry.meals?.breakfast ?? 0),
      lunch: Number(entry.meals?.lunch ?? 0),
      dinner: Number(entry.meals?.dinner ?? 0),
    });
  }

  const weeklyData: WeeklyDatum[] = dateKeys.map((dateKey) => {
    const counts = aggregateByDate.get(dateKey) ?? {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
    };

    const expected = counts.breakfast + counts.lunch + counts.dinner;
    const servedCounts = servedByDate.get(dateKey);
    const served = servedCounts
      ? servedCounts.breakfast + servedCounts.lunch + servedCounts.dinner
      : expected;
    const waste = Math.max(expected - served, 0);

    const dayLabel = new Date(dateKey).toLocaleDateString("en-US", {
      weekday: "short",
    });

    return {
      day: dayLabel,
      expected,
      served,
      waste,
    };
  });

  const totalBreakfast = weeklyData.reduce((sum, _, index) => {
    const counts = aggregateByDate.get(dateKeys[index]) ?? {
      breakfast: 0,
    };
    return sum + counts.breakfast;
  }, 0);

  const totalLunch = weeklyData.reduce((sum, _, index) => {
    const counts = aggregateByDate.get(dateKeys[index]) ?? {
      lunch: 0,
    };
    return sum + counts.lunch;
  }, 0);

  const totalDinner = weeklyData.reduce((sum, _, index) => {
    const counts = aggregateByDate.get(dateKeys[index]) ?? {
      dinner: 0,
    };
    return sum + counts.dinner;
  }, 0);

  const mealDistribution: DistributionDatum[] = [
    { name: "Breakfast", value: totalBreakfast, color: "#f97316" },
    { name: "Lunch", value: totalLunch, color: "#eab308" },
    { name: "Dinner", value: totalDinner, color: "#6366f1" },
  ];

  const weeks = 4;
  const wasteComparison: WasteDatum[] = Array.from(
    { length: weeks },
    (_, index) => {
      const endDate = new Date(today);
      endDate.setDate(today.getDate() - index * 7);

      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);

      const weekKeys = Array.from({ length: 7 }, (_, dayIndex) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + dayIndex);
        return toLocalDateKey(date);
      });

      const weekTotal = weekKeys.reduce((sum, key) => {
        const counts = aggregateByDate.get(key) ?? {
          breakfast: 0,
          lunch: 0,
          dinner: 0,
        };
        const servedCounts = servedByDate.get(key);
        const servedTotal = servedCounts
          ? servedCounts.breakfast + servedCounts.lunch + servedCounts.dinner
          : counts.breakfast + counts.lunch + counts.dinner;
        return sum + servedTotal;
      }, 0);

      const traditional = totalStudents * 3 * 7;

      return {
        week: `Week ${weeks - index}`,
        traditional,
        withSystem: weekTotal,
      };
    }
  ).reverse();

  return {
    weeklyData,
    mealDistribution,
    wasteComparison,
  };
}
