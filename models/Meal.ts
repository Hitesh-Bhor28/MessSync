import mongoose from "mongoose";

const MealSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    meals: {
      breakfast: Boolean,
      lunch: Boolean,
      dinner: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Meal || mongoose.model("Meal", MealSchema);
