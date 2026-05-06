import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { text, mode, geminiApiKey: providedKey } = await request.json();
    const geminiApiKey = providedKey || process.env.GEMINI_API_KEY;

    if (!text || !geminiApiKey) {
      return NextResponse.json({ error: "Text and Gemini API Key are required" }, { status: 400 });
    }

    const shortPrompt = `Rewrite the following text to be a highly engaging, viral hook for a short-form video (TikTok/Reels/Shorts). Keep it punchy, conversational, and attention-grabbing. Return ONLY the rewritten text without quotes, without markdown, and without extra commentary. \n\nOriginal Text: ${text}`;

    const longPrompt = `You are a viral content scriptwriter. Take the following topic or text and transform it into a complete 60-90 second viral video script. Structure it with:

1. HOOK (first 3 seconds) — A jaw-dropping opening line that stops the scroll. Use curiosity, shock, or controversy.
2. BUILD-UP (15-20 seconds) — Set the context. Make the viewer invested with a mini story or surprising facts.
3. CORE VALUE (30-40 seconds) — Deliver the main content. Use short punchy sentences. Add dramatic pauses (marked with ...). Make it conversational like talking to a friend.
4. EMOTIONAL PAYOFF (10 seconds) — Hit them with the "wow" moment or key takeaway.
5. CTA (5 seconds) — End with a call-to-action that drives engagement (follow, comment, share).

Rules:
- Write in a natural, spoken voice (not robotic or formal)
- Use power words: "insane", "nobody talks about", "here's the truth", "watch this"
- Keep sentences short. One idea per sentence.
- Add "..." for dramatic pauses where the speaker should pause
- Return ONLY the script text, no section labels, no markdown, no commentary

Original Topic/Text: ${text}`;

    const prompt = mode === "long" ? longPrompt : shortPrompt;

    const modelsToTry = ["gemini-3.0-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];
    let lastError = null;

    for (const model of modelsToTry) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: mode === "long" ? 0.8 : 0.7,
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
