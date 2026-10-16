import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Loyalty from "@/models/Loyalty"; // Ya jo bhi model aap customer visits/stamps ke liye use kar rahe ho
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized!" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "restaurant") {
      return NextResponse.json({ success: false, error: "Access Denied!" }, { status: 403 });
    }

    await connectToDatabase();

    // Is restaurant ke saare customer records fetch karo
    const customers = await Loyalty.find({ restaurantId: decoded.id })
      .populate("customerId", "phone name") // Agar customer model linked hai
      .sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, customers }, { status: 200 });
  } catch (error) {
    console.error("Customer Visits API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}