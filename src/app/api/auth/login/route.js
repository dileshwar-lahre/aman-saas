
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, Password aur Role zaroori hain!",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const cleanEmail = email.toLowerCase().trim();

    let account = null;

    if (role === "customer") {
      account = await User.findOne({ email: cleanEmail });
    } else {
      account = await Restaurant.findOne({ email: cleanEmail });
    }

    if (!account) {
      return NextResponse.json(
        {
          success: false,
          error: `Is email se koi ${
            role === "customer" ? "Customer" : "Restaurant"
          } registered nahi hai!`,
        },
        { status: 404 }
      );
    }

    if (account.password !== password) {
      return NextResponse.json(
        {
          success: false,
          error: "Galat Password! Dobara try karein.",
        },
        { status: 400 }
      );
    }

    // Create JWT Token (Valid for 30 Days)
    const tokenPayload = {
      id: account._id,
      email: account.email,
      role,
      name: role === "customer" ? account.name : account.ownerName,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const response = NextResponse.json({
      success: true,
      message: "🎉 Login Successful!",
      user: tokenPayload,
    });

    // Set Token in Secure HttpOnly Cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Login Error: " + error.message,
      },
      { status: 500 }
    );
  }
}
