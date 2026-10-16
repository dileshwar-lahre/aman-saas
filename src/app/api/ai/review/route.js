import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req) {
  try {
    // 🛑 Runtime par check karega, build time par error nahi aayega
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GROQ_API_KEY environment variable is missing!" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    const { restaurantName, vibe } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that writes short, catchy, and natural Google reviews for restaurants in Hinglish/English. Keep it under 3-4 sentences with emojis."
        },
        {
          role: "user",
          content: `Write a glowing Google review for a restaurant named "${restaurantName || "this restaurant"}" with a ${vibe || "great food and amazing service"} vibe.`
        }
      ],
      temperature: 1.2,
    });

    const generatedReview = completion.choices[0]?.message?.content || "Amazing food and wonderful service! Highly recommend. ⭐⭐⭐⭐⭐";

    return NextResponse.json({ success: true, review: generatedReview }, { status: 200 });
  } catch (error) {
    console.error("Groq AI Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}