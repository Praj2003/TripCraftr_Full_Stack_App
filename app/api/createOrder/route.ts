import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount } = body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
      },
      { status: 500 }
    );
  }
}
