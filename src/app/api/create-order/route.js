import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST() {
  try {
    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
      key_secret: process.env.RAZORPAY_KEY_SECRET, 
    });

    const rawBaseAmount = 2000;
    const finalPayableIncludingFees = Math.round((rawBaseAmount / 0.98) * 100); 

    const options = {
      amount: finalPayableIncludingFees, 
      currency: "INR",
      receipt: "receipt_pipeline_v3_" + Date.now(),
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount, 
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay Order Generation Failure:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}