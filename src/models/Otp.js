import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // 5 minute me auto-delete ho jayega
  }
);

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);