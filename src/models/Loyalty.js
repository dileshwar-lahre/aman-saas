import mongoose from "mongoose";

const LoyaltySchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true }, // Customer ID or Unique Fingerprint
    customerName: { type: String, default: "Valued Guest" },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    currentStamp: { type: Number, default: 1 }, // 1 to 6
    approvalStatus: { type: String, enum: ["none", "pending", "approved", "rejected"], default: "none" },
    currentOfferText: { type: String, default: "" },
    cycleStartedAt: { type: Date, default: Date.now }, // 1-Month Validity Tracker
    lastScannedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Loyalty || mongoose.model("Loyalty", LoyaltySchema);