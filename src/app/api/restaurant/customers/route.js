import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Loyalty from "@/models/Loyalty";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value || req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized!" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "restaurant" && decoded.role !== "owner") {
      return NextResponse.json({ success: false, error: "Access Denied!" }, { status: 403 });
    }

    await connectToDatabase();

    // Is restaurant ke saare customer loyalty records fetch karo aur User details populate karo
    const customers = await Loyalty.find({ restaurantId: decoded.id || decoded.userId })
      .populate("customerId", "phone name")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, customers }, { status: 200 });
  } catch (error) {
    console.error("Customer Visits API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}