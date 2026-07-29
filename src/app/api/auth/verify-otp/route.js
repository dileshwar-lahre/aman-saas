import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Otp from "@/models/Otp";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email aur OTP zaroori hain!" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const cleanEmail = email.toLowerCase().trim();

    const otpRecord = await Otp.findOne({ email: cleanEmail, otp });
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "Galat ya Expired OTP! Dobara try karein." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP Verified Successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Verification Failed: " + error.message },
      { status: 500 }
    );
  }
}