import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    location: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "restaurant" },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);