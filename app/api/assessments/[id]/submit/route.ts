import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError } from "@/lib/api";
import { requireUser } from "@/lib/supabase/server";

const bodySchema = z.object({
    answers: z.array(z.object({ questionId: z.string().uuid(), answer: z.string().max(4000) })),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = bodySchema.parse(await req.json());
        const { client, user } = await requireUser();
        const { data: assessment, error: assessmentError } = await client.from("assessments")
            .select("subject_name,topic_name").eq("id", id).eq("user_id", user.id).maybeSingle();
        if (assessmentError) throw assessmentError;
        if (!assessment) return NextResponse.json({ error: "Assessment was not found." }, { status: 404 });

        const { data: questions, error } = await client.from("assessment_questions")
            .select("id,correct_answer,concept").eq("assessment_id", id);
        if (error) throw error;
        if (!questions?.length) return NextResponse.json({ error: "Assessment has no questions." }, { status: 404 });

        const submitted = new Map(body.answers.map((answer) => [answer.questionId, answer.answer.trim()]));
        const graded = questions.map((question) => {
            const answer = submitted.get(question.id) ?? "";
            return { question_id: question.id, submitted_answer: answer, is_correct: answer.toLowerCase() === question.correct_answer.trim().toLowerCase(), concept: question.concept };
        });
        const correct = graded.filter((answer) => answer.is_correct).length;
        const score = Math.round((correct / questions.length) * 100);
        const { data: attempt, error: attemptError } = await client.from("assessment_attempts")
            .insert({ user_id: user.id, assessment_id: id, score, total_questions: questions.length, correct_answers: correct, completed_at: new Date().toISOString() }).select().single();
        if (attemptError) throw attemptError;
        const { error: answerError } = await client.from("assessment_answers").insert(graded.map((answer) => ({ ...answer, attempt_id: attempt.id })));
        if (answerError) throw answerError;

        const { data: current, error: performanceError } = await client.from("performance_records")
            .select("average_score,attempt_count").eq("user_id", user.id).eq("topic_name", assessment.topic_name).maybeSingle();
        if (performanceError) throw performanceError;
        const attemptCount = (current?.attempt_count ?? 0) + 1;
        const averageScore = Math.round((((Number(current?.average_score) || 0) * (attemptCount - 1)) + score) / attemptCount);
        const { error: updateError } = await client.from("performance_records").upsert({
            user_id: user.id, subject_name: assessment.subject_name, topic_name: assessment.topic_name,
            average_score: averageScore, last_score: score, attempt_count: attemptCount, updated_at: new Date().toISOString(),
        }, { onConflict: "user_id,topic_name" });
        if (updateError) throw updateError;
        return NextResponse.json({ attemptId: attempt.id, score, correct, total: questions.length, weakConcepts: [...new Set(graded.filter((answer) => !answer.is_correct).map((answer) => answer.concept))] });
    } catch (error) { return apiError(error); }
}
