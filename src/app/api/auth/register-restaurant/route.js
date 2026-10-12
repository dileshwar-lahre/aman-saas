import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const {
      restaurantName,
      ownerName,
      phone,
      location,
      password,
      otp,
    } = await req.json();

    if (
      !restaurantName ||
      !ownerName ||
      !phone ||
      !location ||
      !password ||
      !otp
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant ki sabhi details, Phone aur OTP zaroori hain!",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password kam se kam 6 characters ka hona chahiye!",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);

    // 1. Check if Restaurant already exists with this phone number
    const existingRestaurant = await Restaurant.findOne({ phone: cleanPhone });

    if (existingRestaurant) {
      return NextResponse.json(
        {
          success: false,
          error: "⚠️ Ye WhatsApp number pehle se registered hai! Kripya Login karein.",
          isAlreadyRegistered: true, // Frontend pe redirect ke liye flag
        },
        { status: 400 }
      );
    }

    // 2. Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create New Restaurant
    const newRestaurant = await Restaurant.create({
      restaurantName: restaurantName.trim(),
      ownerName: ownerName.trim(),
      phone: cleanPhone,
      email: `${cleanPhone}@restaurant.com`,
      location: location.trim(),
      password: hashedPassword,
      role: "restaurant",
    });

    // 4. JWT Auth Token Generate
    const token = jwt.sign(
      {
        id: newRestaurant._id,
        phone: newRestaurant.phone,
        role: "restaurant",
      },
      process.env.JWT_SECRET || "adyverse_secret_key_restaurant_node",
      {
        expiresIn: "30d",
      }
    );

    const response = NextResponse.json({
      success: true,
      message: "Restaurant Registered Successfully!",
      restaurant: {
        id: newRestaurant._id,
        restaurantName: newRestaurant.restaurantName,
        ownerName: newRestaurant.ownerName,
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
      {
        success: false,
        error: "Registration Fail: " + error.message,
      },
      { status: 500 }
    );
  }
}