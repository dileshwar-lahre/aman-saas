import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized! Login required." },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectToDatabase();

    let profileData = null;

    if (decoded.role === "restaurant") {
      profileData = await Restaurant.findById(decoded.id).select("-password");
    } else {
      profileData = await User.findById(decoded.id).select("-password");
    }

    if (!profileData) {
      return NextResponse.json(
        { success: false, error: "Profile not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      role: decoded.role,
      profile: profileData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Profile Fetch Error: " + error.message },
      { status: 500 }
    );
  }
}