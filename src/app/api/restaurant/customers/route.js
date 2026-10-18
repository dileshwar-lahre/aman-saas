import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Loyalty from "@/models/Loyalty";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value || req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized!" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "restaurant" && decoded.role !== "owner") {
      return NextResponse.json({ success: false, error: "Access Denied!" }, { status: 403 });
    }

    await connectToDatabase();
    const restaurantId = decoded.id || decoded.userId;

    // 1. Fetch all loyalty records for this restaurant dynamically
    const records = await Loyalty.find({ restaurantId }).sort({ updatedAt: -1 });

    // 2. Loop through each record and dynamically fetch real-time customer Name & Phone from User model
    const customers = await Promise.all(
      records.map(async (v, index) => {
        let phoneNum = "";
        let dynamicName = v.customerName || "";

        if (v.customerId) {
          try {
            const userDoc = await User.findById(v.customerId);
            if (userDoc) {
              phoneNum = userDoc.phone || userDoc.mobile || userDoc.phoneNumber || "";
              // Agar loyalty record me name nahi tha ya "Valued Customer" tha, toh User table ka real name uthao
              if (!dynamicName || dynamicName === "Valued Customer" || dynamicName.startsWith("Customer")) {
                dynamicName = userDoc.name || dynamicName;
              }
            }
          } catch (err) {
            console.error("Error fetching user details for loyalty record:", err);
          }
        }

        return {
          _id: v._id,
          customerName: dynamicName || `Customer #${index + 1}`,
          customerPhone: phoneNum || "Not Available",
          currentStamp: v.currentStamp || 0,
          totalVisits: v.currentStamp || 1,
          status: v.approvalStatus || v.status || "active",
          lastVisit: v.lastScannedAt || v.updatedAt || new Date()
        };
      })
    );

    return NextResponse.json({ success: true, customers }, { status: 200 });
  } catch (error) {
    console.error("🔥 Customer Visits API Critical Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}