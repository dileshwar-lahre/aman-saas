import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Restaurant from "@/models/Restaurant";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: "Missing restaurantId" }, { status: 400 });
    }

    await connectToDatabase();
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, restaurant }, { status: 200 });
  } catch (error) {
    console.error("Public Restaurant API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}