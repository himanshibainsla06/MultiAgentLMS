"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AssessmentFormProps = {
  initialSubject?: string;
  initialTopic?: string;
};

export default function AssessmentForm({ initialSubject = "", initialTopic = "" }: AssessmentFormProps) {
  const router = useRouter();
  const [subject, setSubject] = useState(initialSubject);
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState("adaptive");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(e: FormEvent) {
    e.preventDefault();
    setBusy(true);

    const response = await fetch("/api/assessments/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ subject, topic, difficulty }),
    });

    const data = await response.json();
    setBusy(false);

    if (!response.ok) {
      setError(data.error);
      return;
    }

    router.push(`/assessment/${data.assessmentId}`);
  }

  return (
    <main className="shell" style={{ maxWidth: 650 }}>
      <form className="card grid" onSubmit={create}>
        <span className="tag">Assessment agent</span>
        <h1>Practice a topic</h1>

        <input
          className="input"
          required
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          className="input"
          required
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <select
          className="input"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="adaptive">Adaptive</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

        <button className="btn" disabled={busy}>
          {busy ? "Assessment generate ho raha hai…" : "Create assessment"}
        </button>
      </form>
    </main>
  );
}
