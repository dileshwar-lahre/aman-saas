import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized! Pehle Login karo." },
        { status: 401 }
      );
    }

    const tokenSecret = process.env.JWT_SECRET || "adyverse_secret_key_123456";
    const decoded = jwt.verify(token, tokenSecret);

    await connectToDatabase();
    
    // Logged-in restaurant ka pure document fetch karo
    const restaurant = await Restaurant.findById(decoded.id).select("-password");

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant nahi mila!" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      restaurant,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Profile Fetch Error: " + error.message },
      { status: 500 }
    );
  }
}