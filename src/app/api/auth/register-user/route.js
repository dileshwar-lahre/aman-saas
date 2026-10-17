import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { name, phone, password } = await req.json();

    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: "Name, Phone aur Password sabhi zaroori hain!" },
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
    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);

    // Cross-Role Duplicate Check
    const existingUser = await User.findOne({ phone: cleanPhone });
    const existingRestaurant = await Restaurant.findOne({ phone: cleanPhone });

    if (existingUser || existingRestaurant) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Is Mobile number se account pehle se registered hai! Kripya Login karein." 
        },
        { status: 400 }
      );
    }

    // Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Customer User (Bina Email ke)
    const newUser = await User.create({
      name: name.trim(),
      phone: cleanPhone,
      password: hashedPassword,
      role: "customer",
    });

    // Auth Token Generate
    const token = jwt.sign(
      { id: newUser._id, phone: newUser.phone, role: "customer" },
      process.env.JWT_SECRET || "adyverse_secret_key_customer_node",
      { expiresIn: "30d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Customer Account Successfully Created!",
      user: {
        id: newUser._id,
        name: newUser.name,
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