import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

export async function POST(req) {
  try {
    const { name, email, password, otp } = await req.json();

    if (!name || !email || !password || !otp) {
      return NextResponse.json(
        { success: false, error: "Name, Email, Password aur OTP zaroori hain!" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const cleanEmail = email.toLowerCase().trim();

    // Verify OTP
    const otpRecord = await Otp.findOne({ email: cleanEmail, otp });
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "Galat ya expired OTP!" },
        { status: 400 }
      );
    }

    await Otp.deleteMany({ email: cleanEmail });

    // Check existing
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Is email se account pehle se bana hai! Login karein." },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      name,
      email: cleanEmail,
      password, // Password Save
    });

    return NextResponse.json({
      success: true,
      message: "Customer Registered Successfully!",
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Registration Failed: " + error.message },
      { status: 500 }
    );
  }
}