import { NextResponse } from "next/server";

global.whatsappOtpStore = global.whatsappOtpStore || {};

export async function POST(req) {
  try {
    const { mobile } = await req.json();

    if (!mobile || mobile.length < 10) {
      return NextResponse.json(
        { success: false, error: "10-digit mobile number enter karo!" },
        { status: 400 }
      );
    }

    // 10 digits clean number (jaise tumhare URL me 7000272441 pass tha)
    const cleanMobile = mobile.replace(/[^0-9]/g, "").slice(-10);

    // Dynamic 4-digit OTP (Tumhare template me 4-digit variable '1234' configured hai)
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Verify ke liye in-memory store
    global.whatsappOtpStore[cleanMobile] = generatedOtp;

    console.log(`\n==========================================`);
    console.log(`🔑 [FAST2SMS WHATSAPP] Mobile: ${cleanMobile} | OTP: ${generatedOtp}`);
    console.log(`==========================================`);

    const apiKey =
      process.env.FAST2SMS_API_KEY ||
      "bjideqAtBOPVRvW0gES7Z2csTF5X9L1frMwpNQmGYx4CDyn6l8mVSzpW5qocUekH8lE0QOxaM4AysBwF";

    const targetUrl = `https://www.fast2sms.com/dev/whatsapp?message_id=31494&phone_number_id=1223236064213997&numbers=${cleanMobile}&variables_values=${generatedOtp}`;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: apiKey,
      },
    });

    const data = await res.json();
    console.log("📲 [GATEWAY RESPONSE]:", JSON.stringify(data));

    if (data.return === true || data.status === true) {
      return NextResponse.json({
        success: true,
        message: "WhatsApp OTP delivered successfully!",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: data.message?.[0] || data.message || "Failed to dispatch WhatsApp OTP",
        gateway_data: data,
      },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { mobile, otp } = await req.json();
    const cleanMobile = mobile?.replace(/[^0-9]/g, "").slice(-10);
    const savedOtp = global.whatsappOtpStore?.[cleanMobile];

    if (!savedOtp || savedOtp !== otp?.trim()) {
      return NextResponse.json(
        { success: false, error: "Galat ya expired OTP! Dubara check karo." },
        { status: 400 }
      );
    }

    delete global.whatsappOtpStore[cleanMobile];

    return NextResponse.json({
      success: true,
      message: "Mobile verified successfully!",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}