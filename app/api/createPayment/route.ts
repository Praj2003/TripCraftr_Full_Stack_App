import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, plan, email, amount } = body;

  try {
    const payment = await prisma.subscription.create({
      data: {
        id: id,
        plan: plan,
        userEmail: email,
        amount: amount,
        isActive: true,
      },
    });

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        noOfTrials: amount,
      },
    });

    return NextResponse.json(
      {
        message: "Payment created successfully",
        data: payment,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error creating payment:", err);
    return NextResponse.json(
      {
        message: "Failed to create payment",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const plan = searchParams.get("plan");

  try {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userEmail: email || "",
        plan: plan || "",
      },
    });

    if (subscription) {
      return NextResponse.json(
        { message: "Subscription Found", subStatus: subscription.isActive },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No subscription found for this user", subStatus: false },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        message: "Failed to fetch subscription status",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { email, plan } = body;

  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userEmail: email || "",
        plan: plan || "",
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { message: "No subscription found for this user" },
        { status: 404 }
      );
    }

    await prisma.subscription.delete({
      where: {
        id: subscription.id,
      },
    });

    await prisma.user.update({
      where: {
        email: email || "",
      },
      data: {
        noOfTrials: {
          decrement: subscription.amount,
        },
      },
    });

    return NextResponse.json(
      { message: "Subscription deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to delete subscription",
      },
      { status: 500 }
    );
  }
}
