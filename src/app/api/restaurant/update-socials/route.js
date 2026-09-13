import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // Ya jo bhi db path ho
import Restaurant from "@/models/Restaurant";

export async function POST(req) {
  try {
    await connectDB();
    const { restaurantId, googleReviewUrl, instagram, facebook } = await req.json();

    if (!restaurantId) {
      return NextResponse.json({ success: false, message: "Restaurant ID zaroori hai" }, { status: 400 });
    }

    const updated = await Restaurant.findByIdAndUpdate(
      restaurantId,
      {
        $set: {
          "socialLinks.googleReviewUrl": googleReviewUrl || "",
          "socialLinks.instagram": instagram || "",
          "socialLinks.facebook": facebook || ""
        }
      },
      { new: true }
    );

    return NextResponse.json({ success: true, message: "Links successfully save ho gaye!", data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}