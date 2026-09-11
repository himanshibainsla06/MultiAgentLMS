import {NextResponse} from "next/server";
import {z} from "zod";
import {requireUser} from "@/lib/supabase/server";
import {apiError} from "@/lib/api";
const bodySchema=z.object({answers:z.array(z.object({questionId:z.string().uuid(),answer:z.string().max(4000)}))});
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}) {
 try { const {id}=await params; const body=bodySchema.parse(await req.json()); const {client,user}=await requireUser();
 const {data:assessment,error:assessmentError}=await client.from("assessments").select("topic_name,subject_name").eq("id",id).eq("user_id",user.id).single(); if(assessmentError||!assessment) throw new Error("Assessment was not found");
 const {data:questions,error}=await client.from("assessment_questions").select("id,correct_answer,concept,explanation").eq("assessment_id",id); if(error||!questions?.length)throw new Error("Assessment questions are unavailable");
 const byId=new Map(body.answers.map(a=>[a.questionId,a.answer.trim().toLowerCase()])); const graded=questions.map(q=>({question_id:q.id,submitted_answer:byId.get(q.id)??"",is_correct:(byId.get(q.id)??"")===q.correct_answer.trim().toLowerCase(),concept:q.concept}));
 const correct=graded.filter(a=>a.is_correct).length, score=Math.round(correct/questions.length*100);
 const {data:attempt,error:attemptError}=await client.from("assessment_attempts").insert({user_id:user.id,assessment_id:id,score,total_questions:questions.length,correct_answers:correct,completed_at:new Date().toISOString()}).select().single(); if(attemptError||!attempt)throw attemptError??new Error("Could not save attempt");
 await client.from("assessment_answers").insert(graded.map(x=>({...x,attempt_id:attempt.id})));
 const {data:prior}=await client.from("performance_records").select("average_score,attempt_count").eq("user_id",user.id).eq("topic_name",assessment.topic_name).maybeSingle(); const attempts=(prior?.attempt_count??0)+1; const average=((Number(prior?.average_score??0)*(attempts-1))+score)/attempts;
 await client.from("performance_records").upsert({user_id:user.id,topic_name:assessment.topic_name,subject_name:assessment.subject_name,average_score:Math.round(average),attempt_count:attempts,last_score:score,updated_at:new Date().toISOString()},{onConflict:"user_id,topic_name"});
 return NextResponse.json({attemptId:attempt.id,score,correct,total:questions.length,weakConcepts:[...new Set(graded.filter(x=>!x.is_correct).map(x=>x.concept))]});
 }catch(error){return apiError(error)}
}
