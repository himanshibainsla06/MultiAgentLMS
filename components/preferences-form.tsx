"use client";

import { FormEvent, useState } from "react";
type Preferences = { tutor_name: string; mentor_name: string; learning_style: "beginner" | "normal" | "exam" | "deep"; preferred_difficulty: "easy" | "medium" | "hard" | "adaptive" };
export default function PreferencesForm({ initial }: { initial: Preferences }) {
    const [preferences, setPreferences] = useState(initial); const [status, setStatus] = useState(""); const [busy, setBusy] = useState(false);
    async function save(event: FormEvent) { event.preventDefault(); setBusy(true); setStatus(""); try { const response = await fetch("/api/preferences", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(preferences) }); const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Could not save settings."); setPreferences(data.preferences); setStatus("Settings saved."); } catch (error) { setStatus(error instanceof Error ? error.message : "Could not save settings."); } finally { setBusy(false); } }
    return <form className="card grid" onSubmit={save}><span className="tag">Preferences</span><h1>Personalise your workspace</h1>
        <label>Tutor name<input className="input" value={preferences.tutor_name} onChange={(event) => setPreferences({ ...preferences, tutor_name: event.target.value })} /></label>
        <label>Mentor name<input className="input" value={preferences.mentor_name} onChange={(event) => setPreferences({ ...preferences, mentor_name: event.target.value })} /></label>
        <label>Learning style<select className="input" value={preferences.learning_style} onChange={(event) => setPreferences({ ...preferences, learning_style: event.target.value as Preferences["learning_style"] })}><option value="beginner">Beginner</option><option value="normal">Normal</option><option value="exam">Exam</option><option value="deep">Deep dive</option></select></label>
        <label>Preferred difficulty<select className="input" value={preferences.preferred_difficulty} onChange={(event) => setPreferences({ ...preferences, preferred_difficulty: event.target.value as Preferences["preferred_difficulty"] })}><option value="adaptive">Adaptive</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></label>
        {status && <p className="muted">{status}</p>}<button className="btn" disabled={busy}>{busy ? "Saving…" : "Save settings"}</button>
    </form>;
}
