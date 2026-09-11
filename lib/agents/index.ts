import {structured,text} from "@/lib/ai/gemini"; import {assessmentSchema,noteSchema,syllabusSchema} from "@/lib/validation/schemas"; import {assessmentPrompt,notesPrompt,syllabusPrompt,tutorPrompt,mentorPrompt} from "./prompts";
export const analyseSyllabus=(source:string)=>structured(syllabusPrompt(source),syllabusSchema);
export const generateNotes=(subject:string,topic:string,style:string)=>structured(notesPrompt(subject,topic,style),noteSchema);
export const generateAssessment=(subject:string,topic:string,difficulty:string)=>structured(assessmentPrompt(subject,topic,difficulty),assessmentSchema);
export const tutor=(message:string,topic:string,mode:string,history:string)=>text(tutorPrompt(message,topic,mode,history));
export const mentor=(summary:string)=>text(mentorPrompt(summary));
