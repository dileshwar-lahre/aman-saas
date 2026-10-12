import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { mobile, otp } = await req.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { success: false, error: "Mobile number aur OTP dono zaroori hain!" },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/[^0-9]/g, "").slice(-10);
    const savedOtp = global.whatsappOtpStore?.[cleanMobile];

    if (!savedOtp || savedOtp !== otp.trim()) {
      return NextResponse.json(
        { success: false, error: "Galat ya expired OTP! Dubara check karo." },
        { status: 400 }
      );
    }

    // Clear OTP after successful verification
    delete global.whatsappOtpStore[cleanMobile];

    return NextResponse.json({
      success: true,
      message: "Mobile verified successfully!",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}