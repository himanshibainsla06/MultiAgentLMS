import {NextResponse} from "next/server";
import {requireUser} from "@/lib/supabase/server";
import {apiError} from "@/lib/api";

export async function GET(_:Request,{params}:{params:Promise<{id:string}>}) {
  try {
    const {id}=await params; const {client,user}=await requireUser();
    const {data,error}=await client.from("assessments").select("id,title,subject_name,topic_name,difficulty,assessment_questions(id,position,question,type,options,difficulty,concept)").eq("id",id).eq("user_id",user.id).single();
    if(error||!data) throw new Error("Assessment was not found");
    return NextResponse.json({assessment:data});
  } catch(error) { return apiError(error); }
}
