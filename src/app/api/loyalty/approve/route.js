import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Loyalty from "@/models/Loyalty";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: "Restaurant ID zaroori hai!" }, { status: 400 });
    }

    await connectToDatabase();
    
    const pendingRequests = await Loyalty.find({ restaurantId, approvalStatus: "pending" })
      .populate("customerId", "phone name")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, pendingRequests }, { status: 200 });
  } catch (error) {
    console.error("GET Pending Requests Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { loyaltyId, action } = await req.json();

    await connectToDatabase();
    const record = await Loyalty.findById(loyaltyId).populate("customerId", "phone name");

    if (!record) {
      return NextResponse.json({ success: false, error: "Record nahi mila!" }, { status: 404 });
    }

    if (action === "approve") {
      record.approvalStatus = "approved";
      record.lastClaimDate = new Date();

      // Agar 6th reward complete ho gaya hai aur owner ne approve kiya, toh cycle reset karke wapas 1 par le aao
      if (record.currentStamp >= 6) {
        record.currentStamp = 1;
        record.cycleStartedAt = new Date();
      } else {
        record.currentStamp += 1;
      }
    } else {
      record.approvalStatus = "rejected";
    }

    await record.save();

    return NextResponse.json({
      success: true,
      message: action === "approve" ? "Stamp successfully approve ho gaya!" : "Request reject kar di gayi.",
      record,
    });
  } catch (error) {
    console.error("PUT Approval Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}