"use client";
<<<<<<< HEAD
import {useEffect,useState} from "react"; import {useRouter} from "next/navigation";
type Question={id:string;question:string;type:"mcq"|"short"|"long";options:string[];concept:string;position:number};type Assessment={id:string;title:string;topic_name:string;difficulty:string;assessment_questions:Question[]};
export default function AssessmentRunner({id}:{id:string}){const [assessment,setAssessment]=useState<Assessment>();const [answers,setAnswers]=useState<Record<string,string>>({});const [index,setIndex]=useState(0);const [error,setError]=useState("");const [submitting,setSubmitting]=useState(false);const router=useRouter(); useEffect(()=>{fetch(`/api/assessments/${id}`).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error);setAssessment(d.assessment)}).catch(e=>setError(e.message))},[id]);if(error)return <main className="shell"><p className="card">{error}</p></main>;if(!assessment)return <main className="shell"><p className="card">Loading your assessment…</p></main>;const questions=[...assessment.assessment_questions].sort((a,b)=>a.position-b.position);const q=questions[index];async function submit(){setSubmitting(true);const r=await fetch(`/api/assessments/${id}/submit`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({answers:Object.entries(answers).map(([questionId,answer])=>({questionId,answer}))})});const d=await r.json();setSubmitting(false);if(!r.ok){setError(d.error);return}sessionStorage.setItem(`result:${id}`,JSON.stringify(d));router.push(`/assessment/${id}/result`)}return <main className="shell" style={{maxWidth:820}}><div className="card"><span className="tag">{assessment.difficulty} · {assessment.topic_name}</span><h1>{assessment.title}</h1><p className="muted">Question {index+1} of {questions.length}</p><div style={{height:6,background:"#e2e8f0",borderRadius:9}}><div style={{height:6,width:`${(index+1)/questions.length*100}%`,background:"#4f46e5",borderRadius:9}}/></div><h2 style={{marginTop:28}}>{q.question}</h2>{q.type==="mcq"?<div className="grid">{q.options.map(option=><label className="card" key={option} style={{padding:12,cursor:"pointer"}}><input type="radio" name={q.id} checked={answers[q.id]===option} onChange={()=>setAnswers({...answers,[q.id]:option})}/> {option}</label>)}</div>:<textarea className="input" rows={q.type==="long"?8:4} value={answers[q.id]??""} onChange={e=>setAnswers({...answers,[q.id]:e.target.value})} placeholder="Write your answer…"/>}<div style={{display:"flex",justifyContent:"space-between",marginTop:24}}><button className="btn secondary" disabled={index===0} onClick={()=>setIndex(index-1)}>Previous</button>{index===questions.length-1?<button className="btn" disabled={submitting} onClick={submit}>{submitting?"Evaluating…":"Submit assessment"}</button>:<button className="btn" onClick={()=>setIndex(index+1)}>Next</button>}</div></div></main>}
=======

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
>>>>>>> main
