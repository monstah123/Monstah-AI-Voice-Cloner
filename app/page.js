"use client";

import Link from 'next/link';

export default function LandingPage() {
  const playHoverSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Ignore audio errors
    }
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", color: "white", fontFamily: "system-ui, -apple-system, sans-serif", overflowX: "hidden" }}>

      {/* Navbar */}
      <nav className="navbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="navbar-logo" style={{ fontSize: "24px", fontWeight: "900", letterSpacing: "-1px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>👾</span> Monstah AI
        </div>
        <Link href="/clone" style={{ background: "linear-gradient(45deg, #FF00FF, #8A2BE2)", padding: "10px 24px", borderRadius: "30px", color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "14px", transition: "all 0.3s ease", boxShadow: "0 0 20px rgba(255,0,255,0.3)" }}>
          Launch App
        </Link>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 20px", textAlign: "center", position: "relative" }}>

        {/* Background glow effects */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(138,43,226,0.15) 0%, rgba(0,0,0,0) 70%)", zIndex: -1, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "60%", left: "20%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(255,0,255,0.1) 0%, rgba(0,0,0,0) 70%)", zIndex: -1, pointerEvents: "none" }} />

        <div style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", padding: "8px 16px", borderRadius: "30px", fontSize: "13px", fontWeight: "600", marginBottom: "30px", backdropFilter: "blur(10px)", display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00FF00", boxShadow: "0 0 10px #00FF00" }} />
          v3.0 — Full Script Mode is live
        </div>

        <h1 style={{ fontSize: "clamp(48px, 6vw, 80px)", fontWeight: "900", lineHeight: "1.1", marginBottom: "20px", letterSpacing: "-2px", maxWidth: "900px" }}>
          The Ultimate <span style={{ background: "linear-gradient(45deg, #FF00FF, #8A2BE2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Voice Cloning</span> Suite for Creators.
        </h1>

        <p style={{ fontSize: "clamp(18px, 2vw, 22px)", color: "var(--text-muted)", maxWidth: "700px", marginBottom: "40px", lineHeight: "1.6" }}>
          Instantly clone any voice with studio-grade fidelity. Generate full viral scripts with AI, auto-sync subtitles, translate into 11+ languages, and build your personal voice library — all in one dashboard.
        </p>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/clone" style={{ background: "white", color: "black", padding: "16px 40px", borderRadius: "30px", textDecoration: "none", fontWeight: "bold", fontSize: "16px", transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: "10px" }}>
            Start Cloning <span style={{ fontSize: "20px" }}>→</span>
          </Link>
          <a href="#features" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "16px 40px", borderRadius: "30px", textDecoration: "none", fontWeight: "bold", fontSize: "16px", transition: "all 0.3s ease", backdropFilter: "blur(10px)" }}>
            View Features
          </a>
        </div>
      </main>

      {/* Clone Tiers Section */}
      <section style={{ padding: "80px 20px 0", position: "relative" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "10px", letterSpacing: "-0.5px" }}>Two Ways to Clone</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>Choose the method that fits your workflow</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {/* Instant Clone */}
            <div onMouseEnter={playHoverSound} onTouchStart={playHoverSound} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "16px", padding: "32px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #8A2BE2, #FF00FF)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <span style={{ fontSize: "28px" }}>⚡</span>
                <h3 style={{ fontSize: "20px", fontWeight: "700" }}>Instant Voice Clone</h3>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6", marginBottom: "16px" }}>
                Clone your voice with only <strong style={{ color: "#c4b5fd" }}>10 seconds</strong> of audio. Quick, easy, and perfect for short-form content and testing.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(124,58,237,0.1)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", color: "#c4b5fd" }}>
                🎙️ Upload or Record
              </div>
            </div>

            {/* Professional Clone */}
            <div onMouseEnter={playHoverSound} onTouchStart={playHoverSound} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: "16px", padding: "32px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #f59e0b, #ef4444)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <span style={{ fontSize: "28px" }}>🏆</span>
                <h3 style={{ fontSize: "20px", fontWeight: "700" }}>Professional Voice Clone</h3>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6", marginBottom: "16px" }}>
                Create the most realistic digital replica. Requires at least <strong style={{ color: "#fcd34d" }}>30 minutes</strong> of clean audio for studio-grade results.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(245,158,11,0.1)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", color: "#fcd34d" }}>
                🎧 Maximum Fidelity
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "100px 20px", background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <h2 style={{ fontSize: "42px", fontWeight: "800", marginBottom: "15px", letterSpacing: "-1px" }}>Built for Viral Content</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>Everything you need to automate your faceless channels and audio content in one powerful dashboard.</p>
          </div>

          <div className="landing-feature-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>

            {/* Feature 1 */}
            <div className="feature-card" onMouseEnter={playHoverSound} onTouchStart={playHoverSound} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>🎙️</div>
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "15px" }}>Studio-Grade Cloning</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "15px" }}>Powered by the ElevenLabs API. Upload a sample or record directly in-app, then instantly clone the voice. Save your best clones to your personal voice library for one-click reuse.</p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card" onMouseEnter={playHoverSound} onTouchStart={playHoverSound} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>✨</div>
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "15px" }}>AI Viral Script Generator</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "15px" }}>Powered by Google Gemini. Two modes: <strong>Quick Hook</strong> for punchy short-form openers, and <strong>Full Script</strong> for complete 60-90 second viral video scripts with hooks, story beats, and CTAs.</p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card" onMouseEnter={playHoverSound} onTouchStart={playHoverSound} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>🎬</div>
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "15px" }}>Auto-Synced Subtitles</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "15px" }}>Never sync text manually again. The app automatically extracts exact word-level timestamps and generates a ready-to-use <code>.srt</code> file for your video editor.</p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card" onMouseEnter={playHoverSound} onTouchStart={playHoverSound} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>🌐</div>
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "15px" }}>11+ Language Translation</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "15px" }}>Auto-translate your script into Spanish, French, German, Italian, Portuguese, Hindi, Japanese, Korean, Chinese, Arabic, or Russian — then generate the speech in one click.</p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card" onMouseEnter={playHoverSound} onTouchStart={playHoverSound} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>💾</div>
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "15px" }}>Save to Voice Library</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "15px" }}>Clone once, reuse forever. Save your best voice clones to your personal ElevenLabs library with custom names. Switch between voices instantly from the My Library tab.</p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card" onMouseEnter={playHoverSound} onTouchStart={playHoverSound} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>🎛️</div>
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "15px" }}>Advanced Voice Controls</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "15px" }}>Fine-tune your audio with precision sliders. Adjust stability for emotion, similarity for exact voice matching, and style exaggeration for extra flair.</p>
            </div>

            {/* Feature 7 */}
            <div className="feature-card" onMouseEnter={playHoverSound} onTouchStart={playHoverSound} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>📋</div>
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "15px" }}>One-Click Copy & Export</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "15px" }}>Copy your AI-generated scripts to clipboard instantly. Download your cloned audio and subtitle files with a single click. Session history keeps every generation logged.</p>
            </div>

            {/* Feature 8 */}
            <div className="feature-card" onMouseEnter={playHoverSound} onTouchStart={playHoverSound} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>🔴</div>
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "15px" }}>In-App Voice Recorder</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "15px" }}>No external tools needed. Record your voice sample directly in the browser with the built-in recorder. Works on desktop and mobile — just tap record and start talking.</p>
            </div>

            {/* Feature 9 */}
            <div className="feature-card" onMouseEnter={playHoverSound} onTouchStart={playHoverSound} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>📱</div>
              <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "15px" }}>Works on Any Device</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.6", fontSize: "15px" }}>Fully responsive across Mac, Windows, iPhone, and Android. No downloads, no installs — just open the link and start creating from any browser, anywhere.</p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "100px 20px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "100%", background: "radial-gradient(circle, rgba(138,43,226,0.1) 0%, rgba(0,0,0,0) 50%)", zIndex: -1, pointerEvents: "none" }} />
        <h2 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "30px", letterSpacing: "-1px" }}>Ready to create?</h2>
        <Link href="/clone" style={{ display: "inline-block", background: "linear-gradient(45deg, #FF00FF, #8A2BE2)", padding: "20px 50px", borderRadius: "40px", color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "18px", transition: "all 0.3s ease", boxShadow: "0 10px 30px rgba(138,43,226,0.4)" }}>
          Open Monstah Cloner
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: "40px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", color: "var(--text-muted)", fontSize: "14px" }}>
        <p>© 2026 Monstah AI. Powered by ElevenLabs and Google Gemini.</p>
      </footer>
    </div>
  );
}
