import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Otp from "@/models/Otp";
import { sendOtpEmail } from "@/lib/nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name, restaurantName, ownerName, role } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Gmail address required hai!" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const cleanEmail = email.toLowerCase().trim();

    // 6-digit OTP Generate
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save in DB
    await Otp.deleteMany({ email: cleanEmail });
    await Otp.create({ email: cleanEmail, otp: generatedOtp });

    // Send Email
    await sendOtpEmail({
      email: cleanEmail,
      otp: generatedOtp,
      name,
      restaurantName,
      ownerName,
      role,
    });

    return NextResponse.json({
      success: true,
      message: `OTP email (${cleanEmail}) par bhej diya gaya hai! Valid for 10 minutes.`,
    });
  } catch (error) {
    console.error("🔴 SEND OTP API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Email Error: " + error.message },
      { status: 500 }
    );
  }
}