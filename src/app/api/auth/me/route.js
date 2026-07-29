import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No active session found" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({
      success: true,
      user: decoded,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid or Expired Session" },
      { status: 401 }
    );
  }
}