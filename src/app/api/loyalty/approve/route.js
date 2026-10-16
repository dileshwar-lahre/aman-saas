import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Loyalty from "@/models/Loyalty";

// GET: Fetch All Pending Requests for Logged-In Restaurant with Customer Info
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: "Restaurant ID zaroori hai!" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Pending requests fetch karte waqt customer details populate/include kar rahe hain
    const pendingRequests = await Loyalty.find({ restaurantId, approvalStatus: "pending" })
      .populate("customerId", "phone name")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, pendingRequests }, { status: 200 });
  } catch (error) {
    console.error("GET Pending Requests Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Approve (Right) or Reject (Cut) with Visitor Tracking & Daily Lock
export async function PUT(req) {
  try {
    const { loyaltyId, action } = await req.json(); // action = 'approve' or 'reject'

    await connectToDatabase();
    const record = await Loyalty.findById(loyaltyId).populate("customerId", "phone name");

    if (!record) {
      return NextResponse.json({ success: false, error: "Record nahi mila!" }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🛑 Daily Claim Restriction Check
    if (record.lastClaimDate) {
      const lastDate = new Date(record.lastClaimDate);
      lastDate.setHours(0, 0, 0, 0);
      if (lastDate.getTime() === today.getTime() && action === "approve" && record.approvalStatus === "approved") {
        return NextResponse.json({ 
          success: false, 
          error: "Yeh customer aaj ka stamp already claim kar chuka hai!" 
        }, { status: 400 });
      }
    }

    if (action === "approve") {
      record.approvalStatus = "approved";
      record.lastClaimDate = new Date(); // Aaj ki timestamp save kar di taaki duplicate claim na ho

      // If approved, move to next stamp. If 6th reward approved -> reset cycle to Stamp 1
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