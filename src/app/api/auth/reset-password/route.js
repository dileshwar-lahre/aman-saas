import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";
import Otp from "@/models/Otp";

export async function POST(req) {
  try {
    const { email, password, otp, role } = await req.json();

    if (!email || !password || !otp || !role) {
      return NextResponse.json(
        { success: false, error: "Sabhi details zaroori hain!" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const cleanEmail = email.toLowerCase().trim();

    // 1. Verify OTP
    const otpRecord = await Otp.findOne({ email: cleanEmail, otp });
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "Galat ya Expired OTP!" },
        { status: 400 }
      );
    }

    // 2. Find Account & Update Password
    let account = null;
    if (role === "customer") {
      account = await User.findOne({ email: cleanEmail });
    } else {
      account = await Restaurant.findOne({ email: cleanEmail });
    }

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Is email se account nahi mila!" },
        { status: 404 }
      );
    }

    account.password = password;
    await account.save();

    // 3. Delete used OTP
    await Otp.deleteMany({ email: cleanEmail });

    return NextResponse.json({
      success: true,
      message: "Password successfully updated! Ab login karein.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Reset Password Error: " + error.message },
      { status: 500 }
    );
  }
}