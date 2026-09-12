"use client";

import { FormEvent, useState } from "react";

type Question = {
    id: string;
    question: string;
    type: string;
    options: string[] | null;
};

export default function AssessmentRunner({
    assessmentId,
    questions,
}: {
    assessmentId: string;
    questions: Question[];
}) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [result, setResult] = useState<{
        score: number;
        correct: number;
        total: number;
        weakConcepts: string[];
    }>();
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        setError("");
        try {
            const response = await fetch(`/api/assessments/${assessmentId}/submit`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    answers: questions.map((question) => ({
                        questionId: question.id,
                        answer: answers[question.id] ?? "",
                    })),
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error ?? "Could not submit assessment.");
            setResult(data);
        } catch (submissionError) {
            setError(submissionError instanceof Error ? submissionError.message : "Could not submit assessment.");
        } finally {
            setBusy(false);
        }
    }

    if (result) {
        return <section className="card grid" aria-live="polite">
            <span className="tag">Assessment complete</span>
            <h2>{result.score}% · {result.correct}/{result.total} correct</h2>
            <p className="muted">Your progress record has been updated and will guide adaptive practice.</p>
            {result.weakConcepts.length > 0 && <p><strong>Review next:</strong> {result.weakConcepts.join(", ")}</p>}
        </section>;
    }

    return <form className="grid" onSubmit={submit}>
        {questions.map((question, index) => <article className="card" key={question.id}>
            <p className="muted">Question {index + 1} · {question.type}</p>
            <h3>{question.question}</h3>
            {question.type === "mcq" ? <div className="grid" style={{ gap: 8, marginTop: 12 }}>
                {(question.options ?? []).map((option) => <label key={option}>
                    <input type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))} /> {option}
                </label>)}
            </div> : <textarea className="input" rows={4} required value={answers[question.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Write your answer" />}
        </article>)}
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
        <button className="btn" disabled={busy}>{busy ? "Submitting…" : "Submit assessment"}</button>
    </form>;
}
