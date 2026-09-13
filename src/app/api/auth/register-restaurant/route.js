import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { restaurantName, ownerName, email, phone, location, password, otp } =
      await req.json();

    if (
      !restaurantName ||
      !ownerName ||
      !email ||
      !phone ||
      !location ||
      !password ||
      !otp
    ) {
      return NextResponse.json(
        { success: false, error: "Restaurant ki sabhi details, Phone aur OTP zaroori hain!" },
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
        { success: false, error: "Galat ya expired OTP! Sahi OTP enter karein." },
        { status: 400 }
      );
    }

    // OTP delete after success
    await Otp.deleteMany({
      $or: [{ phone: cleanPhone }, { email: cleanEmail }],
    });

    // 2. Existing Restaurant Duplicate Check
    const existingRestaurant = await Restaurant.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (existingRestaurant) {
      return NextResponse.json(
        { success: false, error: "Is Email ya Phone number se Restaurant pehle se registered hai!" },
        { status: 400 }
      );
    }

    // 3. Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create Restaurant
    const newRestaurant = await Restaurant.create({
      restaurantName: restaurantName.trim(),
      ownerName: ownerName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      location: location.trim(),
      password: hashedPassword,
      role: "restaurant",
    });

    // 5. JWT Auth Token Generate
    const token = jwt.sign(
      { id: newRestaurant._id, email: newRestaurant.email, role: "restaurant" },
      process.env.JWT_SECRET || "adyverse_secret_key_restaurant_node",
      { expiresIn: "30d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Restaurant Registered Successfully!",
      restaurant: {
        id: newRestaurant._id,
        restaurantName: newRestaurant.restaurantName,
        ownerName: newRestaurant.ownerName,
        email: newRestaurant.email,
        phone: newRestaurant.phone,
        location: newRestaurant.location,
        role: newRestaurant.role,
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
    console.error("RESTAURANT REGISTRATION ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Registration Fail: " + error.message },
      { status: 500 }
    );
  }
}