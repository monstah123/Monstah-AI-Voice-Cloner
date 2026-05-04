import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { text, geminiApiKey } = await request.json();

    if (!text || !geminiApiKey) {
      return NextResponse.json({ error: "Text and Gemini API Key are required" }, { status: 400 });
    }

    const modelsToTry = ["gemini-3.0-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
    let lastError = null;

    for (const model of modelsToTry) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Rewrite the following text to be a highly engaging, viral hook for a short-form video (TikTok/Reels/Shorts). Keep it punchy, conversational, and attention-grabbing. Return ONLY the rewritten text without quotes, without markdown, and without extra commentary. \n\nOriginal Text: ${text}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        const enhancedText = data.candidates[0].content.parts[0].text.trim();
        return NextResponse.json({ text: enhancedText });
      } else {
        lastError = data.error?.message || "Gemini API Error";
        // If it's an API key error, don't keep trying models
        if (response.status === 400 && lastError.includes("API key")) {
           break;
        }
        console.log(`Model ${model} failed:`, lastError);
      }
    }

    // If all models fail
    return NextResponse.json({ error: lastError || "All Gemini models failed" }, { status: 500 });

  } catch (error) {
    console.error("Enhance error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
