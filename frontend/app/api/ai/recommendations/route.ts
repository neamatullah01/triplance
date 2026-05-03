import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

const SYSTEM_PROMPT = `You are a travel recommendation engine for Triplance, a travel social & booking platform.

Given a user's query or general context, suggest 3-4 travel destinations/experiences that would appeal to travelers. For each recommendation:
- Give a catchy title
- Write a 1-2 sentence compelling description
- Suggest what type of traveler would enjoy it (adventure, relaxation, culture, family, etc.)

Format your response as valid JSON array with objects containing: "title", "description", "type", "emoji".
Example: [{"title":"Bali Sunrise Trek","description":"Wake up to breathtaking views atop Mount Batur.","type":"Adventure","emoji":"🌋"}]

ONLY output the JSON array. No markdown, no code fences, no explanation.`;

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json();

    const userMessage = context
      ? `Based on this user interest: "${context}", suggest travel destinations.`
      : "Suggest trending travel destinations for this season that would appeal to a variety of travelers.";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            topP: 0.9,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini recommendations error:", await response.text());
      return NextResponse.json({ recommendations: getFallback() });
    }

    const data = await response.json();
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    try {
      // Clean potential markdown fences from response
      const cleaned = aiText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const recommendations = JSON.parse(cleaned);
      return NextResponse.json({ recommendations });
    } catch {
      console.error("Failed to parse AI recommendations, using fallback");
      return NextResponse.json({ recommendations: getFallback() });
    }
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json({ recommendations: getFallback() });
  }
}

function getFallback() {
  return [
    {
      title: "Santorini Sunset Escape",
      description: "Experience the world-famous sunset views over the Aegean Sea from whitewashed cliffside villages.",
      type: "Relaxation",
      emoji: "🌅",
    },
    {
      title: "Swiss Alps Adventure",
      description: "Hike through pristine alpine meadows and ride scenic trains through breathtaking mountain passes.",
      type: "Adventure",
      emoji: "🏔️",
    },
    {
      title: "Kyoto Cultural Journey",
      description: "Wander through ancient temples, bamboo forests, and traditional tea houses in Japan's cultural heart.",
      type: "Culture",
      emoji: "⛩️",
    },
    {
      title: "Maldives Ocean Retreat",
      description: "Stay in overwater villas and snorkel crystal-clear lagoons teeming with marine life.",
      type: "Relaxation",
      emoji: "🏝️",
    },
  ];
}
