import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Loyalty from "@/models/Loyalty";
import Restaurant from "@/models/Restaurant";

export async function POST(req) {
  try {
    const { customerId, customerName, restaurantId } = await req.json();

    if (!customerId || !restaurantId) {
      return NextResponse.json({ success: false, error: "Missing required details" }, { status: 400 });
    }

    await connectToDatabase();
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    let record = await Loyalty.findOne({ customerId, restaurantId });

    // 1-Month Expiry Check (Reset to Stamp 1 if 30 days passed)
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    if (record && Date.now() - new Date(record.cycleStartedAt).getTime() > thirtyDaysInMs) {
      record.currentStamp = 1;
      record.cycleStartedAt = new Date();
    }

    if (!record) {
      record = new Loyalty({
        customerId,
        customerName: customerName || "Guest User",
        restaurantId,
        currentStamp: 1,
        cycleStartedAt: new Date(),
      });
    }

    // Determine current offer based on stamp
    const stampKey = record.currentStamp === 6 ? "reward6th" : `stamp${record.currentStamp}`;
    const offerText = restaurant.loyaltyOffers?.[stampKey] || "Special Discount";

    record.approvalStatus = "pending";
    record.currentOfferText = offerText;
    record.lastScannedAt = new Date();

    await record.save();

    return NextResponse.json({
      success: true,
      message: "Request sent to Owner!",
      record,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: Check Current Live Claim Status
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const restaurantId = searchParams.get("restaurantId");

    await connectToDatabase();
    const record = await Loyalty.findOne({ customerId, restaurantId });
    return NextResponse.json({ success: true, record });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}