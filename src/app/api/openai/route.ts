import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in .env.local
});

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Call OpenAI API using the SDK
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use "gpt-4" or "gpt-3.5-turbo"
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: query }],
      max_tokens: 100,
    });

    return NextResponse.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json({ error: "Failed to fetch response from OpenAI" }, { status: 500 });
  }
}
