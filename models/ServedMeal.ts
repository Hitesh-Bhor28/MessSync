import mongoose from "mongoose";

const ServedMealSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
    },
    meals: {
      breakfast: { type: Number, default: 0 },
      lunch: { type: Number, default: 0 },
      dinner: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.ServedMeal ||
  mongoose.model("ServedMeal", ServedMealSchema);
