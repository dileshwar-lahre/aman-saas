import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Restaurant from "@/models/Restaurant";

// 1. GET: Fetch All Menu Items
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: "Restaurant ID required" }, { status: 400 });
    }

    await connectToDatabase();
    const restaurant = await Restaurant.findById(restaurantId).select("restaurantName menu location");

    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      restaurantName: restaurant.restaurantName,
      location: restaurant.location,
      menu: restaurant.menu || [],
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: Add New Dish
export async function POST(req) {
  try {
    const { restaurantId, name, price, category } = await req.json();

    if (!restaurantId || !name || !price) {
      return NextResponse.json({ success: false, error: "Name aur Price zaroori hai!" }, { status: 400 });
    }

    await connectToDatabase();
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    restaurant.menu.push({
      name,
      price: Number(price),
      category: category || "Main Course",
      isAvailable: true,
    });

    await restaurant.save();
    return NextResponse.json({ success: true, message: "Dish added successfully!", menu: restaurant.menu });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. PUT: Update/Edit Existing Dish
export async function PUT(req) {
  try {
    const { restaurantId, itemId, name, price, category, isAvailable } = await req.json();

    if (!restaurantId || !itemId) {
      return NextResponse.json({ success: false, error: "IDs missing" }, { status: 400 });
    }

    await connectToDatabase();
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    const itemIndex = restaurant.menu.findIndex((item) => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return NextResponse.json({ success: false, error: "Dish not found" }, { status: 404 });
    }

    // Update details
    if (name) restaurant.menu[itemIndex].name = name;
    if (price) restaurant.menu[itemIndex].price = Number(price);
    if (category) restaurant.menu[itemIndex].category = category;
    if (typeof isAvailable === "boolean") restaurant.menu[itemIndex].isAvailable = isAvailable;

    await restaurant.save();
    return NextResponse.json({ success: true, message: "Dish updated successfully!", menu: restaurant.menu });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 4. DELETE: Remove Dish
export async function DELETE(req) {
  try {
    const { restaurantId, itemId } = await req.json();

    if (!restaurantId || !itemId) {
      return NextResponse.json({ success: false, error: "IDs missing" }, { status: 400 });
    }

    await connectToDatabase();
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    restaurant.menu = restaurant.menu.filter((item) => item._id.toString() !== itemId);
    await restaurant.save();

    return NextResponse.json({ success: true, message: "Dish deleted!", menu: restaurant.menu });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}