import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Loyalty from "@/models/Loyalty";
import Restaurant from "@/models/Restaurant";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectToDatabase();

    const token = req.cookies.get("token")?.value || req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized! Please login." }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customerId = decoded.userId || decoded.id;
    const customerPhone = decoded.phone || decoded.mobile || "";
    const customerName = decoded.name || decoded.fullName || "WhatsApp Guest";

    const { restaurantId } = await req.json();
    if (!restaurantId) {
      return NextResponse.json({ success: false, error: "Missing restaurant ID" }, { status: 400 });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    let record = await Loyalty.findOne({ customerId, restaurantId });

    // ⏱️ 12-Hours Cooldown Check (Agar pehle se record hai aur approvalStatus approved hai)
    if (record && record.approvalStatus === "approved" && record.lastClaimDate) {
      const hoursPassed = (Date.now() - new Date(record.lastClaimDate).getTime()) / (1000 * 60 * 60);
      if (hoursPassed < 12) {
        const remainingHours = Math.ceil(12 - hoursPassed);
        return NextResponse.json(
          { success: false, error: `⏳ Cooldown Active: Please wait ${remainingHours} more hours before claiming your next stamp!` },
          { status: 400 }
        );
      }
    }

    // 1-Month Expiry Check
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    if (record && Date.now() - new Date(record.cycleStartedAt).getTime() > thirtyDaysInMs) {
      record.currentStamp = 1;
      record.cycleStartedAt = new Date();
    }

    if (!record) {
      record = new Loyalty({
        customerId,
        customerPhone,
        customerName,
        restaurantId,
        currentStamp: 1,
        cycleStartedAt: new Date(),
      });
    } else {
      record.customerPhone = customerPhone || record.customerPhone;
      record.customerName = customerName || record.customerName;
    }

    const stampKey = record.currentStamp === 6 ? "reward6th" : `stamp${record.currentStamp}`;
    const offerText = restaurant.loyaltyOffers?.[stampKey] || "Special Discount";

    record.approvalStatus = "pending";
    record.currentOfferText = offerText;
    record.lastScannedAt = new Date();

    await record.save();

    return NextResponse.json({
      success: true,
      message: "Request sent to Owner!",
      record,
    });
  } catch (error) {
    console.error("Loyalty POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId || !customerId) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    await connectToDatabase();
    const record = await Loyalty.findOne({ customerId, restaurantId });
    return NextResponse.json({ success: true, record });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}