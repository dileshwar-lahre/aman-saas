import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Loyalty from "@/models/Loyalty";

// 1. Customer Scan Par Request Bhejta Hai
export async function POST(req) {
  try {
    const { customerId, restaurantId, customerName } = await req.json();

    if (!customerId || !restaurantId) {
      return NextResponse.json({ success: false, error: "Missing IDs" }, { status: 400 });
    }

    await connectToDatabase();
    let record = await Loyalty.findOne({ customerId, restaurantId });

    if (!record) {
      record = new Loyalty({ customerId, restaurantId, customerName, stampsCount: 0, approvalStatus: "pending" });
    } else {
      record.approvalStatus = "pending";
      record.lastScannedAt = new Date();
    }

    await record.save();
    return NextResponse.json({ success: true, message: "Stamp request sent!", record });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// 2. Owner Approve / Reject Karta Hai
export async function PUT(req) {
  try {
    const { loyaltyId, action } = await req.json(); // action = 'approve' ya 'reject'

    await connectToDatabase();
    const record = await Loyalty.findById(loyaltyId);

    if (!record) return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 });

    if (action === "approve") {
      record.stampsCount = record.stampsCount < 5 ? record.stampsCount + 1 : 0;
      record.approvalStatus = "approved";
    } else {
      record.approvalStatus = "none";
    }

    await record.save();
    return NextResponse.json({ success: true, record });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}