
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Restaurant from "@/models/Restaurant";

// GET: Fetch existing offers
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant ID zaroori hai!",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const restaurant = await Restaurant.findById(restaurantId).select(
      "loyaltyOffers restaurantName"
    );

    if (!restaurant) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant nahi mila!",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      loyaltyOffers: restaurant.loyaltyOffers || {},
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT: Update loyalty offers
export async function PUT(req) {
  try {
    const { restaurantId, loyaltyOffers } = await req.json();

    if (!restaurantId || !loyaltyOffers) {
      return NextResponse.json(
        {
          success: false,
          error: "Details missing hain!",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant nahi mila!",
        },
        { status: 404 }
      );
    }

    restaurant.loyaltyOffers = {
      stamp1: loyaltyOffers.stamp1 || "",
      stamp2: loyaltyOffers.stamp2 || "",
      stamp3: loyaltyOffers.stamp3 || "",
      stamp4: loyaltyOffers.stamp4 || "",
      stamp5: loyaltyOffers.stamp5 || "",
      reward6th: loyaltyOffers.reward6th || "",
    };

    await restaurant.save();

    return NextResponse.json({
      success: true,
      message: "Loyalty Offers updated successfully!",
      loyaltyOffers: restaurant.loyaltyOffers,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}