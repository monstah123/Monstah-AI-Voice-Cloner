import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey") || process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ElevenLabs API key is required." },
        { status: 401 }
      );
    }

    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: `Failed to fetch voices: ${errorData?.detail?.message || "Unknown error"}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ voices: data.voices });
  } catch (error) {
    console.error("Voices fetch error:", error);
    return NextResponse.json(
      { error: `Failed to fetch voices: ${error.message}` },
      { status: 500 }
    );
  }
}
