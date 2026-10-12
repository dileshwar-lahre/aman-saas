import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";

export async function POST(req) {
  try {
    const { phone, password, role } = await req.json();

    const cleanPhone = phone ? phone.replace(/[^0-9]/g, "").slice(-10) : "";

    if (!cleanPhone || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Sabhi details zaroori hain!" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find Account & Update Password directly using phone 
    // (Kyunki OTP already step 2 par verify ho chuka hai)
    let account = null;
    if (role === "customer") {
      account = await User.findOne({ phone: cleanPhone });
    } else {
      account = await Restaurant.findOne({ phone: cleanPhone });
    }

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Is mobile number se account nahi mila!" },
        { status: 404 }
      );
    }

    account.password = password;
    await account.save();

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