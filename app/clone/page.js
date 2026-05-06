"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [resultAudio, setResultAudio] = useState(null);
  const [status, setStatus] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [cloneMode, setCloneMode] = useState("new"); // "new" or "existing"
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.75);
  const [styleExaggeration, setStyleExaggeration] = useState(0.0);
  const [targetLanguage, setTargetLanguage] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
   const [history, setHistory] = useState([]);
   const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);



  const handleDeleteHistoryItem = (id) => {
    if (confirmDeleteId === id) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };



  // Fetch voices on mount
  useEffect(() => {
    fetch(`/api/voices`)
      .then(res => res.json())
      .then(data => {
        if (data.voices) setVoices(data.voices);
      })
      .catch(err => console.error("Failed to fetch voices", err));
  }, []);

  // File upload handlers
  const handleFileSelect = (file) => {
    if (!file) return;
    const validTypes = ["audio/wav", "audio/mp3", "audio/mpeg", "audio/ogg", "audio/webm", "audio/m4a", "audio/x-m4a", "audio/mp4"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|ogg|webm|m4a)$/i)) {
      setStatus({ type: "error", message: "Please upload a valid audio file (WAV, MP3, OGG, M4A, WebM)" });
      return;
    }
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setStatus({ type: "success", message: `Voice sample loaded: ${file.name}` });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  }, []);

  const removeFile = () => {
    setAudioFile(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
  };

  // Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "voice-recording.webm", { type: "audio/webm" });
        handleFileSelect(file);
        stream.getTracks().forEach((t) => t.stop());
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch (err) {
      setStatus({ type: "error", message: "Microphone access denied. Please allow mic access." });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // AI Enhance Script
  const handleEnhance = async () => {
    if (!text.trim()) {
      setStatus({ type: "error", message: "Please enter some text first." });
      return;
    }
    // Note: We allow empty key here to fall back to server-side GEMINI_API_KEY
    
    setIsEnhancing(true);
    setStatus({ type: "info", message: "✨ AI is rewriting your script to be viral..." });
    
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setText(data.text);
      setStatus({ type: "success", message: "✨ Script enhanced successfully!" });
    } catch (e) {
      setStatus({ type: "error", message: e.message || "Failed to enhance script" });
    }
    setIsEnhancing(false);
  };

  // Generate cloned voice
  const handleGenerate = async () => {
    if (cloneMode === "new" && !audioFile) {
      setStatus({ type: "error", message: "Please upload a voice sample." });
      return;
    }
    if (cloneMode === "existing" && !selectedVoice) {
      setStatus({ type: "error", message: "Please select an existing voice." });
      return;
    }
    if (!text.trim()) {
      setStatus({ type: "error", message: "Please enter text to generate." });
      return;
    }

    // Note: We allow empty key here to fall back to server-side ELEVENLABS_API_KEY

    setIsGenerating(true);
    setResultAudio(null);
    setStatus({ type: "info", message: "🔮 Cloning voice and generating audio with ElevenLabs..." });

    const formData = new FormData();
    formData.append("text", text.trim());
    formData.append("stability", stability);
    formData.append("similarity", similarity);
    formData.append("style", styleExaggeration);
    if (targetLanguage) formData.append("targetLang", targetLanguage);
    
    if (cloneMode === "new") {
      formData.append("audio", audioFile);
    } else {
      formData.append("voiceId", selectedVoice);
    }
    


    try {
      const res = await fetch("/api/clone", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Generation failed." });
        setIsGenerating(false);
        return;
      }

      // Convert base64 audio to blob URL
      const audioBytes = Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0));
      const blob = new Blob([audioBytes], { type: data.contentType });
      const url = URL.createObjectURL(blob);
      
      let srtUrl = null;
      if (data.srt) {
        const srtBlob = new Blob([data.srt], { type: "text/plain" });
        srtUrl = URL.createObjectURL(srtBlob);
      }

      const resultObj = { id: Date.now(), url, srtUrl, contentType: data.contentType, text: text, lang: targetLanguage };
      setResultAudio(resultObj);
      setHistory((prev) => [resultObj, ...prev]);

      setStatus({ type: "success", message: "✅ Voice cloned successfully!" });
      setIsGenerating(false);
    } catch (err) {
      setStatus({ type: "error", message: "Network error. Please check your connection and try again." });
      setIsGenerating(false);
    }
  };

  return (
    <main className="app-container">
      {/* Back Button */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-start" }}>
        <Link 
          href="/" 
          style={{ textDecoration: "none", color: "var(--text-muted)", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "20px", border: "1px solid var(--border-glass)", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        >
          ← Back to Landing Page
        </Link>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-badge">
          <span className="dot" />
          Powered by ElevenLabs
        </div>
        <h1>Monstah Voice Cloner</h1>
        <p>Upload a voice sample, type your text, and generate speech in any cloned voice instantly.</p>
      </header>



      {/* Recording Tips */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        marginBottom: "24px",
        padding: "20px 24px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        backdropFilter: "blur(10px)",
      }}>
        {[
          {
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12v-2" />
                <line x1="19" y1="12" x2="19" y2="12" />
                <line x1="13" y1="22" x2="11" y2="22" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            ),
            title: "Avoid noisy environments",
            desc: "Background sounds interfere with recording quality results.",
          },
          {
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            ),
            title: "Check microphone quality",
            desc: "Try external units or headphone mics for better audio capture.",
          },
          {
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            ),
            title: "Use consistent equipment",
            desc: "Don't change recording equipment between samples.",
          },
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{
              width: "36px", height: "36px",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(138,43,226,0.15)",
              border: "1px solid rgba(138,43,226,0.25)",
              borderRadius: "10px",
              color: "rgba(200,150,255,0.9)",
            }}>
              {tip.icon}
            </div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "white", lineHeight: "1.3" }}>
              {tip.title}
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>
              {tip.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="steps-grid">
        {/* Step 1: Voice Selection */}
        <div className="glass-card" style={{ animationDelay: "0.1s" }}>
          <div className="step-header">
            <div className="step-number">1</div>
            <div>
              <div className="step-title">Choose a Voice</div>
              <div className="step-subtitle">Upload a new sample or use an existing ElevenLabs voice</div>
            </div>
          </div>

          <div className="voice-tabs" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button 
              className={`tab-btn ${cloneMode === "new" ? "active" : ""}`}
              onClick={() => setCloneMode("new")}
              style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: cloneMode === "new" ? "rgba(255,255,255,0.1)" : "transparent", color: "white", cursor: "pointer" }}
            >
              🎙️ New Instant Clone
            </button>
            <button 
              className={`tab-btn ${cloneMode === "existing" ? "active" : ""}`}
              onClick={() => setCloneMode("existing")}
              style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: cloneMode === "existing" ? "rgba(255,255,255,0.1)" : "transparent", color: "white", cursor: "pointer" }}
            >
              📚 My Library
            </button>
          </div>

          {cloneMode === "new" ? (
            <>
              <div
                className={`upload-zone ${dragOver ? "dragover" : ""} ${audioFile ? "has-file" : ""}`}
                onClick={() => !audioFile && fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  style={{ display: "none" }}
                />
                {audioFile ? (
                  <div className="file-info">
                    <span style={{ fontSize: "24px" }}>🎵</span>
                    <span className="name">{audioFile.name}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                      ({(audioFile.size / 1024).toFixed(0)} KB)
                    </span>
                    <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeFile(); }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">🎙️</div>
                    <div className="upload-label">Drop audio file here or click to browse</div>
                    <div className="upload-hint">WAV, MP3, OGG, M4A, WebM • Max 10MB</div>
                  </>
                )}
              </div>

              {audioUrl && (
                <div style={{ marginTop: "12px" }}>
                  <audio controls src={audioUrl} className="audio-player" />
                </div>
              )}

              <div className="record-section">
                <span className="or-divider">— or —</span>
                <button
                  className={`record-btn ${isRecording ? "recording" : ""}`}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  <span className="record-dot" />
                  {isRecording ? `Stop Recording (${formatTime(recordingTime)})` : "Record Voice"}
                </button>
              </div>
            </>
          ) : (
            <div className="existing-voices-section">
              {voices.length > 0 ? (
                <select 
                  value={selectedVoice} 
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "15px" }}
                >
                  <option value="">-- Select a voice from your library --</option>
                  {voices.map(voice => (
                    <option key={voice.voice_id} value={voice.voice_id}>
                      {voice.name} {voice.category ? `(${voice.category})` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ padding: "20px", textAlign: "center", background: "rgba(255,255,255,0.05)", borderRadius: "8px", color: "var(--text-muted)" }}>
                  Loading voices from ElevenLabs...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Text Input */}
        <div className="glass-card" style={{ animationDelay: "0.2s" }}>
          <div className="step-header">
            <div className="step-number">2</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div>
                <div className="step-title">Enter Your Text</div>
                <div className="step-subtitle">Type or paste the text you want spoken in the cloned voice</div>
              </div>
              <button 
                onClick={handleEnhance} 
                disabled={isEnhancing || !text.trim()}
                style={{ background: "linear-gradient(45deg, #FF00FF, #8A2BE2)", color: "white", border: "none", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold", cursor: "pointer", opacity: (!text.trim() || isEnhancing) ? 0.5 : 1 }}
              >
                {isEnhancing ? "✨ Enhancing..." : "✨ Make it Viral"}
              </button>
            </div>
          </div>

          <div className="text-area-wrapper">
            <textarea
              className="text-area"
              placeholder="Type or paste the text you want spoken in the cloned voice...&#10;&#10;Example: Hey, what's up! This is my cloned voice speaking. Pretty wild, right?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={5000}
            />
            <span className="char-count">{text.length}/5000</span>
          </div>

          <div className="advanced-settings-toggle" onClick={() => setShowAdvanced(!showAdvanced)} style={{ marginTop: "15px", cursor: "pointer", color: "var(--primary)", fontSize: "14px", fontWeight: "600", transition: "all 0.2s" }}>
            {showAdvanced ? "▼ Hide Advanced Settings" : "▶ Show Advanced Settings & Translation"}
          </div>

          {showAdvanced && (
            <div className="advanced-settings" style={{ marginTop: "15px", padding: "18px", background: "rgba(0,0,0,0.15)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "var(--text-color)", fontWeight: "500" }}>
                  🌐 Auto-Translate To (Optional)
                </label>
                <select 
                  value={targetLanguage} 
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.05)", color: "white" }}
                >
                  <option value="">Do Not Translate (Keep Original Text)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="hi">Hindi</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="zh-CN">Chinese (Simplified)</option>
                  <option value="ar">Arabic</option>
                  <option value="ru">Russian</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "var(--text-color)" }}>
                  <span>🎚️ Stability (More Variable ← → More Stable)</span>
                  <span style={{color: "var(--primary)"}}>{Math.round(stability * 100)}%</span>
                </label>
                <input type="range" min="0" max="1" step="0.05" value={stability} onChange={(e) => setStability(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "var(--primary)" }} />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "var(--text-color)" }}>
                  <span>🎛️ Similarity (Standard ← → Ultra Clone)</span>
                  <span style={{color: "var(--primary)"}}>{Math.round(similarity * 100)}%</span>
                </label>
                <input type="range" min="0" max="1" step="0.05" value={similarity} onChange={(e) => setSimilarity(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "var(--primary)" }} />
              </div>

              <div>
                <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "var(--text-color)" }}>
                  <span>🎭 Style Exaggeration (None ← → High)</span>
                  <span style={{color: "var(--primary)"}}>{Math.round(styleExaggeration * 100)}%</span>
                </label>
                <input type="range" min="0" max="1" step="0.05" value={styleExaggeration} onChange={(e) => setStyleExaggeration(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "var(--primary)" }} />
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Generate */}
        <div className="glass-card" style={{ animationDelay: "0.3s" }}>
          <div className="step-header">
            <div className="step-number">3</div>
            <div>
              <div className="step-title">Generate Cloned Voice</div>
              <div className="step-subtitle">Click below to generate speech in the cloned voice</div>
            </div>
          </div>

          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating || (!audioFile && cloneMode === "new") || (!selectedVoice && cloneMode === "existing") || !text.trim()}
          >
            {isGenerating ? (
              <>
                <span className="spinner" />
                Cloning Voice...
              </>
            ) : (
              <>🔮 Generate Cloned Voice</>
            )}
          </button>

          {/* Status */}
          {status && (
            <div className={`status-bar ${status.type}`} style={{ marginTop: "16px" }}>
              {status.message}
            </div>
          )}

          {/* Result */}
          {resultAudio && (
            <div className="audio-result" style={{ marginTop: "20px", background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <div className="audio-result-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <div className="audio-result-title" style={{ fontWeight: "600" }}>
                  <span className="icon">🎧</span>
                  Cloned Voice Output
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  {resultAudio.srtUrl && (
                    <a href={resultAudio.srtUrl} download="monstah-subtitles.srt" className="download-btn" style={{ background: "rgba(255,255,255,0.1)", color: "white", padding: "8px 12px", borderRadius: "6px", textDecoration: "none", fontSize: "13px" }}>
                      ⬇ Subtitles (.srt)
                    </a>
                  )}
                  <a href={resultAudio.url} download="monstah-cloned-voice.mp3" className="download-btn" style={{ background: "var(--primary)", color: "white", padding: "8px 12px", borderRadius: "6px", textDecoration: "none", fontSize: "13px" }}>
                    ⬇ Audio (.mp3)
                  </a>
                </div>
              </div>
              <audio controls src={resultAudio.url} className="audio-player" style={{ width: "100%" }} />
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      {history.length > 1 && (
        <div className="glass-card" style={{ marginTop: "20px" }}>
          <h3 style={{ marginBottom: "15px", fontSize: "18px" }}>📚 Recent Generations</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {history.slice(1).map((item, idx) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ flex: 1, marginRight: "15px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "14px", color: "var(--text-color)" }}>
                  "{item.text.substring(0, 60)}{item.text.length > 60 ? "..." : ""}" {item.lang && <span style={{fontSize:"11px", background:"#333", padding:"2px 6px", borderRadius:"4px"}}>Translated</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <audio controls src={item.url} style={{ height: "30px", width: "150px" }} />
                  {item.srtUrl && (
                    <a href={item.srtUrl} download={`subtitles-${idx}.srt`} title="Download Subtitles" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>📝</a>
                  )}
                  <a href={item.url} download={`audio-${idx}.mp3`} title="Download Audio" style={{ color: "white", textDecoration: "none", fontSize: "18px" }}>⬇️</a>
                  
                  <button 
                    onClick={() => handleDeleteHistoryItem(item.id)}
                    style={{ 
                      background: confirmDeleteId === item.id ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.05)", 
                      border: confirmDeleteId === item.id ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)", 
                      color: confirmDeleteId === item.id ? "#fff" : "var(--text-muted)", 
                      borderRadius: "6px", 
                      padding: "4px 8px", 
                      cursor: "pointer", 
                      fontSize: "12px", 
                      transition: "all 0.2s",
                      marginLeft: "5px"
                    }}
                  >
                    {confirmDeleteId === item.id ? "Are you sure?" : "🗑️"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>
          Built with 🔥 by{" "}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            Monstah AI
          </a>{" "}
          • Powered by{" "}
          <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer">
            ElevenLabs API
          </a>
        </p>
      </footer>
    </main>
  );
}
