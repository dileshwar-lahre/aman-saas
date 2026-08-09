import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Loyalty from "@/models/Loyalty";
import Restaurant from "@/models/Restaurant";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json({ success: false, error: "Customer ID missing" }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch all loyalty records for this customer
    const records = await Loyalty.find({ customerId }).populate({
      path: "restaurantId",
      model: Restaurant,
      select: "restaurantName ownerName location loyaltyOffers menu googleReviewUrl socialLinks",
    });

    return NextResponse.json({
      success: true,
      scannedRestaurants: records,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}