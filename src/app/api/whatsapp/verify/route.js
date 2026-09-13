import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { mobile, otp } = body;

    if (!mobile || !otp) {
      return NextResponse.json({ success: false, error: "Mobile number aur OTP dono zaroori hain!" }, { status: 400 });
    }

    const apiKey = "bjideqAtBOPVRvW0gES7Z2csTF5X9L1frMwpNQmGYx4CDyn6l8mVSzpW5qocUekH8lE0QOxaM4AysBwF";

    const response = await fetch('https://www.fast2sms.com/dev/otp/verify', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        "mobile": mobile,
        "otp": otp
      })
    });

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}