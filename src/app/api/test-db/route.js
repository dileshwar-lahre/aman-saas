import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({
      success: true,
      message: "🎉 Adyverse MongoDB Database Connection Live!",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Database Connection Failed: " + error.message,
      },
      { status: 500 }
    );
  }
}