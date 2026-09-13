import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { name, email, phone, password, otp } = await req.json();

    if (!name || !email || !phone || !password || !otp) {
      return NextResponse.json(
        { success: false, error: "Name, Email, Phone, Password aur OTP sabhi zaroori hain!" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password kam se kam 6 characters ka hona chahiye!" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);

    // 1. WhatsApp OTP Match Check
    const otpRecord = await Otp.findOne({
      $or: [{ phone: cleanPhone }, { email: cleanEmail }],
      otp: otp.trim(),
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "Galat ya expired OTP! Kripya sahi OTP enter karein." },
        { status: 400 }
      );
    }

    // OTP delete after success
    await Otp.deleteMany({
      $or: [{ phone: cleanPhone }, { email: cleanEmail }],
    });

    // 2. Existing User Check
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Is Email ya Mobile number se account pehle se bana hai! Login karein." },
        { status: 400 }
      );
    }

    // 3. Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create Customer
    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: "customer",
    });

    // 5. Auth Token Generate
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: "customer" },
      process.env.JWT_SECRET || "adyverse_secret_key_customer_node",
      { expiresIn: "30d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Customer Account Successfully Created!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("CUSTOMER REGISTRATION ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Registration Fail: " + error.message },
      { status: 500 }
    );
  }
}