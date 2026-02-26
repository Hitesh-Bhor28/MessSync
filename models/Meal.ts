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
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

MealSchema.index({ email: 1, date: 1 }, { unique: true });

export default mongoose.models.Meal || mongoose.model("Meal", MealSchema);
