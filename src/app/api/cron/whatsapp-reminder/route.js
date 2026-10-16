import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Loyalty from "@/models/Loyalty";

export async function GET(req) {
  try {
    // Security check for cron secret (optional but recommended)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // 24 hours (1 day) pehle ki date nikalo
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Wo records find karo jinka last claim kal hua tha
    const eligibleUsers = await Loyalty.find({
      lastClaimDate: { $gte: yesterday,$lt: today },
      approvalStatus: "approved"
    }).populate("customerId", "phone name");

    for (const record of eligibleUsers) {
      const phone = record.customerId?.phone || record.customerPhone;
      const name = record.customerId?.name || record.customerName || "Guest";

      if (phone) {
        // Yahan aap apna WhatsApp API provider (jaise Interakt, WATI, Meta Cloud API, ya Twilio) integrate kar sakte hain
        await sendWhatsAppMessage(phone, name);
      }
    }

    return NextResponse.json({ success: true, message: `Reminders sent to ${eligibleUsers.length} users.` });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// WhatsApp Send Helper Function (Meta Cloud API / WATI / Interakt etc.)
async function sendWhatsAppMessage(phone, name) {
  const messageData = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: {
      body: `Hello ${name}! 🎉 Aapka naya scratch card unlock ho gaya hai. Aaj hi restaurant visit karein aur agla stamp claim karein!`
    }
  };

  // Example for Meta Cloud API (Aap apne whatsapp service ke hisab se endpoint daal sakte hain)
  /*
  await fetch(`https://graph.facebook.com/v17.0/${process.env.WA_PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.WA_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(messageData)
  });
  */
}