"use client";

import { useState } from "react";

export default function MentorPanel({ initialRecommendation }: { initialRecommendation?: string }) {
    const [recommendation, setRecommendation] = useState(initialRecommendation ?? "");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    async function analyse() {
        setBusy(true); setError("");
        try {
            const response = await fetch("/api/mentor/analyse", { method: "POST" });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error ?? "Could not create guidance.");
            setRecommendation(data.recommendation);
        } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not create guidance."); }
        finally { setBusy(false); }
    }
    return <section className="card grid"><span className="tag">Mentor agent</span><h1>Your next study step</h1>
        <p className="muted">Generate evidence-based guidance from your completed assessments.</p>
        {recommendation && <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{recommendation}</div>}
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
        <button className="btn" onClick={analyse} disabled={busy}>{busy ? "Analysing progress…" : recommendation ? "Refresh guidance" : "Get mentor guidance"}</button>
    </section>;
}
