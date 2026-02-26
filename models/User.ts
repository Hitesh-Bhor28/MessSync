import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      required: true,
      default: "student",
    },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1, createdAt: -1 });

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
