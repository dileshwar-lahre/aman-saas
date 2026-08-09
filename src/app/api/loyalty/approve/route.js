import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Loyalty from "@/models/Loyalty";

// GET: Fetch All Pending Requests for Logged-In Restaurant
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    await connectToDatabase();
    const pendingRequests = await Loyalty.find({ restaurantId, approvalStatus: "pending" });

    return NextResponse.json({ success: true, pendingRequests });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Approve (Right) or Reject (Cut)
export async function PUT(req) {
  try {
    const { loyaltyId, action } = await req.json(); // action = 'approve' or 'reject'

    await connectToDatabase();
    const record = await Loyalty.findById(loyaltyId);

    if (!record) {
      return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 });
    }

    if (action === "approve") {
      record.approvalStatus = "approved";
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
      message: action === "approve" ? "Approved!" : "Rejected!",
      record,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}