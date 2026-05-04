import "./globals.css";

export const metadata = {
  title: "Monstah AI Voice Cloner — Clone Any Voice Instantly",
  description:
    "Upload a voice sample and generate speech in any cloned voice using OmniVoice AI. Free, open-source, zero-shot voice cloning powered by Hugging Face.",
  keywords: "voice cloner, AI voice, text to speech, voice clone, OmniVoice, Monstah AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-mesh" />
        {children}
      </body>
    </html>
  );
}
