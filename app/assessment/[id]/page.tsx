import { notFound } from "next/navigation";
import AssessmentRunner from "@/components/assessment-runner";
import { requireUser } from "@/lib/supabase/server";

export default async function AssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const { client, user } = await requireUser();
        const { data: assessment, error } = await client.from("assessments")
            .select("id,title,subject_name,topic_name,difficulty")
            .eq("id", id).eq("user_id", user.id).maybeSingle();
        if (error || !assessment) return notFound();
        const { data: questions, error: questionError } = await client.from("assessment_questions")
            .select("id,question,type,options,position").eq("assessment_id", id)
            .order("position", { ascending: true });
        if (questionError || !questions?.length) return notFound();
        return <main className="shell" style={{ maxWidth: 820 }}><section className="grid">
            <div><span className="tag">Assessment</span><h1>{assessment.title}</h1><p className="muted">{assessment.subject_name} · {assessment.topic_name} · {assessment.difficulty}</p></div>
            <AssessmentRunner assessmentId={id} questions={questions as { id: string; question: string; type: string; options: string[] | null }[]} />
        </section></main>;
    } catch { return notFound(); }
}
