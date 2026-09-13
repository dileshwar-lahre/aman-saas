import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { mobile } = body;

    if (!mobile) {
      return NextResponse.json({ success: false, error: "Mobile number zaroori hai!" }, { status: 400 });
    }

    const apiKey = "bjideqAtBOPVRvW0gES7Z2csTF5X9L1frMwpNQmGYx4CDyn6l8mVSzpW5qocUekH8lE0QOxaM4AysBwF";

    // Resend ki jagah seedha Fast2SMS ka 'send' endpoint hit karenge taki 100% naya OTP generate ho kar jaye
    const response = await fetch('https://www.fast2sms.com/dev/otp/send', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        "otp_id": "20fdddfd3a",
        "mobile": mobile,
        "variables_values": "2"
      })
    });

    const data = await response.json();

    return NextResponse.json({ success: true, message: "Naya OTP successfully bhej diya gaya hai!", data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}