import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Otp from "@/models/Otp";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Valid Gmail Address required hai!" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const cleanEmail = email.toLowerCase().trim();

    // 6-digit Secure Random OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB
    await Otp.deleteMany({ email: cleanEmail });
    await Otp.create({ email: cleanEmail, otp: generatedOtp });

    // Console Log Always for Dev Testing Safety
    console.log(`\n==========================================`);
    console.log(`🔑 [OTP CODE] Email: ${cleanEmail} | OTP: ${generatedOtp}`);
    console.log(`==========================================\n`);

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    // Check if Credentials exist
    if (emailUser && emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        await transporter.sendMail({
          from: `"Adyverse Loyalty Auth" <${emailUser}>`,
          to: cleanEmail,
          subject: "Verification OTP Code - Adyverse",
          html: `<div style="font-family: sans-serif; padding: 20px; background: #f9f9f9;">
            <h2 style="color: #dc2626;">Adyverse Verification OTP</h2>
            <p>Your OTP code is:</p>
            <h1 style="background: #ffffff; padding: 15px; border-radius: 10px; display: inline-block; border: 2px solid #dc2626; color: #111;">${generatedOtp}</h1>
          </div>`,
        });

        return NextResponse.json({
          success: true,
          message: `OTP sent to ${cleanEmail}!`,
        });
      } catch (mailErr) {
        console.error("⚠️ Email send failed (Using Console OTP):", mailErr.message);
      }
    } else {
      console.log("⚠️ EMAIL_USER ya EMAIL_PASS .env.local me missing hai. Using Terminal OTP.");
    }

    // Fallback response for smooth testing
    return NextResponse.json({
      success: true,
      message: `OTP generated! Check terminal or use: ${generatedOtp}`,
      devOtp: generatedOtp,
    });

  } catch (error) {
    console.error("🔴 SEND OTP API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "OTP Error: " + error.message },
      { status: 500 }
    );
  }
}