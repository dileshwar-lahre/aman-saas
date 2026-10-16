import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Restaurant from "@/models/Restaurant";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    // 🛑 FIX: Next.js API route me cookies ko request object se ya await karke nikalte hain
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized! Pehle login karein bhai." },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Sirf restaurant role allow karenge
    if (decoded.role !== "restaurant") {
      return NextResponse.json(
        { success: false, error: "Access denied! Aap restaurant owner nahi hain." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { restaurantName, ownerName, location, socialLinks } = body;

    // Proper Validation
    if (!restaurantName || !ownerName || !location) {
      return NextResponse.json(
        { success: false, error: "Restaurant Name, Owner Name aur Location zaroori hain!" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Database me restaurant find karke update karenge
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      decoded.id,
      {
        restaurantName: restaurantName.trim(),
        ownerName: ownerName.trim(),
        location: location.trim(),
        socialLinks: {
          googleReviewUrl: socialLinks?.googleReviewUrl || "",
          instagram: socialLinks?.instagram || "",
          facebook: socialLinks?.facebook || "",
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedRestaurant) {
      return NextResponse.json(
        { success: false, error: "Restaurant record nahi mila database me!" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "🎉 Restaurant aur Social Links successfully update ho gaye bhai!",
      restaurant: updatedRestaurant,
    });

  } catch (error) {
    console.error("Update Social Error:", error);
    return NextResponse.json(
      { success: false, error: "Server Error: " + error.message },
      { status: 500 }
    );
  }
}