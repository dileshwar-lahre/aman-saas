import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    location: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "restaurant" },
    googleReviewUrl: { type: String, default: "" },

    // 🎟️ Owner Configurable Stamps & 6th Reward Offers
    loyaltyOffers: {
      stamp1: { type: String, default: "5% OFF on Main Course" },
      stamp2: { type: String, default: "Free Welcome Drink" },
      stamp3: { type: String, default: "10% OFF on Bill" },
      stamp4: { type: String, default: "Free Dessert" },
      stamp5: { type: String, default: "15% OFF Combo" },
      reward6th: { type: String, default: "🎉 FREE Super Meal / 50% OFF Reward!" },
    },

    menu: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, default: "Main Course" },
        isAvailable: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);