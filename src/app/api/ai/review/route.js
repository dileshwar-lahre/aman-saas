import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Groq client initialize karo API key ke sath
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { restaurantName, vibe } = await req.json();

    // Groq LLM (Llama 3) ko prompt bhej rahe hain review generate karne ke liye
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
      temperature: 0.7,
    });

    const generatedReview = completion.choices[0]?.message?.content || "Amazing food and wonderful service! Highly recommend. ⭐⭐⭐⭐⭐";

    return NextResponse.json({ success: true, review: generatedReview }, { status: 200 });
  } catch (error) {
    console.error("Groq AI Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}