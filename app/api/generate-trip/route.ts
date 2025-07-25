import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const genAI = new GoogleGenerativeAI(process.env.GEMENI_API_KEY!);
  try {
    const body = await req.json();
    const {
      destination,
      startDate,
      endDate,
      tripType,
      budgetLevel,
      numberOfTravelers,
      email,
    } = body;
    if (
      !destination ||
      !tripType ||
      !budgetLevel ||
      !startDate ||
      !endDate ||
      !email ||
      numberOfTravelers <= 0
    ) {
      return NextResponse.json(
        { Message: "All Fields are not available" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    if (user.noOfTrials < 1) {
      return NextResponse.json(
        { message: "No more free trials left!" },
        { status: 402 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Create a personalized travel itinerary for ${numberOfTravelers} people visiting ${destination} from ${startDate} to ${endDate}. The trip type is ${tripType}, with a ${budgetLevel} budget. Provide a day-wise plan with activities and suggestions in less than 40 words.`;

    const result = await model.generateContent(prompt);

    const response = result.response;

    const text = response.text();

    const updatedTrials = await prisma.user.update({
      where: {
        email,
      },
      data: {
        noOfTrials: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ data: text, trials: updatedTrials.noOfTrials }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Some error while getting the response from gemini model" },
      { status: 500 }
    );
  }
}
