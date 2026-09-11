import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";

export default async function AssessmentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    try {
        const { client, user } = await requireUser();

        const { data: assessment, error: assessmentError } = await client
            .from("assessments")
            .select("id,title,subject_name,topic_name,difficulty")
            .eq("id", id)
            .eq("user_id", user.id)
            .maybeSingle();

        if (assessmentError || !assessment) {
            return notFound();
        }

        const { data: questions, error: questionError } = await client
            .from("assessment_questions")
            .select(
                "id,question,type,options,correct_answer,explanation,difficulty,concept,position",
            )
            .eq("assessment_id", id)
            .order("position", { ascending: true });

        if (questionError) {
            return notFound();
        }

        const rows = questions ?? [];

        return (
            <main className="shell" style={{ maxWidth: 820 }}>
                <section className="card grid">
                    <span className="tag">Assessment</span>
                    <h1>{assessment.title}</h1>
                    <p className="muted">
                        {assessment.subject_name} · {assessment.topic_name} · {assessment.difficulty}
                    </p>

                    <div className="grid" style={{ gap: 14 }}>
                        {rows.map((question, index) => (
                            <article className="card" key={question.id}>
                                <div className="grid" style={{ gap: 8 }}>
                                    <p className="muted">
                                        Question {index + 1} · {question.type}
                                    </p>
                                    <h3>{question.question}</h3>

                                    {(question.options as Array<string> | null)?.map(
                                        (option, optionIndex) => (
                                            <label
                                                className="muted"
                                                key={`${question.id}-${optionIndex}`}
                                                style={{ display: "block" }}
                                            >
                                                <input
                                                    type="radio"
                                                    name={question.id}
                                                    disabled
                                                    style={{ marginRight: 8 }}
                                                />
                                                {option}
                                            </label>
                                        ),
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        );
    } catch {
        return notFound();
    }
}
