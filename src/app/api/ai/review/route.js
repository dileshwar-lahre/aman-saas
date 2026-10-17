import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GROQ_API_KEY environment variable is missing!" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    // Parse body safely (agar restaurantName ya vibe aaye toh use karo)
    const body = await req.json().catch(() => ({}));
    const { restaurantName, vibe } = body;

    // Har baar naya variation lane ke liye random styles
    const styles = [
      "Focus heavily on the delicious taste, quality, and freshness of the food.",
      "Focus on the cozy ambiance, beautiful lighting, and overall vibe.",
      "Focus on the fast service, polite staff, and welcoming hospitality.",
      "Write a short, punchy 5-star review praising everything from food to service with cool emojis."
    ];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that writes short, catchy, and natural Google reviews for restaurants in Hinglish/English. Keep it under 3-4 sentences with emojis. Make every generation unique."
        },
        {
          role: "user",
          content: `${randomStyle} Write a glowing Google review for a restaurant named "${restaurantName || "this restaurant"}" with a ${vibe || "great food and amazing service"} vibe.`
        }
      ],
      temperature: 1.3, // High temperature for maximum uniqueness
    });

    const generatedReview = completion.choices[0]?.message?.content || "Amazing food and wonderful service! Highly recommend. ⭐⭐⭐⭐⭐";

    return NextResponse.json({ success: true, review: generatedReview }, { status: 200 });
  } catch (error) {
    console.error("Groq AI Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}