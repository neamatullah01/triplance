import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

const SYSTEM_PROMPT = `You are **Triplance AI**, a friendly and knowledgeable travel assistant for the Triplance platform — a full-stack travel social & booking platform.

Your job is to:
- Help travelers discover amazing destinations and travel packages
- Answer questions about how Triplance works (booking, payments, reviews, social feed)
- Give travel tips, packing advice, visa info, and destination highlights
- Suggest popular destinations when asked
- Guide users through the booking process

Platform context:
- Triplance has Travel Agencies that list packages with itineraries, prices, and available dates
- Travelers can browse packages, book trips, make payments, and leave reviews after completing trips
- There's a social feed where travelers and agencies share posts, photos, and travel stories
- Users can follow each other, like and comment on posts
- Agencies need admin approval before they can list packages

Keep your answers concise, warm, and helpful. Use emojis sparingly for friendliness. Format with markdown when it helps readability (bullet points, bold text). Never reveal that you are powered by Gemini or any specific AI model — just say you're Triplance AI.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Build the Gemini API request
    const geminiMessages = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })
    );

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response right now. Please try again!";

    return NextResponse.json({ message: aiText });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json(
      { error: "Something went wrong with the AI assistant" },
      { status: 500 }
    );
  }
}
