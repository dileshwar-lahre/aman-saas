import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export async function POST(req) {
  try {
    // 🛑 FIX: Razorpay ko function ke andar initialize kiya taaki build error na aaye
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const body = await req.json();
    const { action, planId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Agar action verify hai toh payment verify karenge
    if (action === 'verify') {
      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = shasum.digest('hex');

      if (digest === razorpay_signature) {
        return NextResponse.json({ status: 'success', message: 'Payment successfully verify ho gaya aur subscription active ho gaya bhai!' }, { status: 200 });
      } else {
        return NextResponse.json({ status: 'failure', message: 'Invalid signature! Payment match nahi hua.' }, { status: 400 });
      }
    }

    let amountInPaise = 0;
    let planName = '';

    if (planId === 'monthly') {
      amountInPaise = 999 * 100; // ₹999 for 1 month
      planName = 'Monthly Plan';
    } else if (planId === 'half_yearly') {
      amountInPaise = 4995 * 100; // 6 months (1 month free, pay for 5)
      planName = '6 Months Plan (1 Month Free)';
    } else if (planId === 'yearly') {
      amountInPaise = 9990 * 100; // 12 months (2 months free, pay for 10)
      planName = '12 Months Plan (2 Months Free)';
    } else {
      return NextResponse.json({ error: 'Invalid plan select kiya hai bhai!' }, { status: 400 });
    }

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${planId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ order, planName }, { status: 200 });

  } catch (error) {
    console.error('Razorpay API Error:', error);
    return NextResponse.json({ error: 'Kuch gadbad ho gayi server par!' }, { status: 500 });
  }
}