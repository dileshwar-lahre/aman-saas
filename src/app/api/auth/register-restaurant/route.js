import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import Otp from "@/models/Otp";

export async function POST(req) {
  try {
    const { restaurantName, ownerName, email, location, password, otp } = await req.json();

    if (!restaurantName || !ownerName || !email || !location || !password || !otp) {
      return NextResponse.json(
        { success: false, error: "Sabhi details aur OTP zaroori hain!" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const cleanEmail = email.toLowerCase().trim();

    const otpRecord = await Otp.findOne({ email: cleanEmail, otp });
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "Galat ya expired OTP!" },
        { status: 400 }
      );
    }

    await Otp.deleteMany({ email: cleanEmail });

    const existing = await Restaurant.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Is email se Restaurant pehle se registered hai!" },
        { status: 400 }
      );
    }

    const newRestaurant = await Restaurant.create({
      restaurantName,
      ownerName,
      email: cleanEmail,
      location,
      password,
    });

    return NextResponse.json({
      success: true,
      message: "Restaurant Registered Successfully!",
      restaurant: newRestaurant,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Registration Failed: " + error.message },
      { status: 500 }
    );
  }
}