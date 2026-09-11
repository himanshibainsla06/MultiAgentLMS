import {z} from "zod";
export const topicRequest=z.object({subject:z.string().trim().min(2).max(120),topic:z.string().trim().min(2).max(180),style:z.enum(["beginner","normal","exam","deep"]).default("normal")});
export const syllabusSchema=z.object({subject:z.string(),units:z.array(z.object({name:z.string(),topics:z.array(z.object({name:z.string(),subtopics:z.array(z.string()).default([])}))}))});
export const noteSchema=z.object({title:z.string(),sections:z.array(z.object({title:z.string(),content:z.string(),kind:z.enum(["text","diagram","questions"]).default("text")})).min(4)});
export const questionSchema=z.object({question:z.string(),type:z.enum(["mcq","short","long"]),options:z.array(z.string()).default([]),correctAnswer:z.string(),explanation:z.string(),difficulty:z.enum(["easy","medium","hard"]),concept:z.string()});
export const assessmentSchema=z.object({title:z.string(),questions:z.array(questionSchema).min(3).max(15)});
export const chatSchema=z.object({message:z.string().trim().min(2).max(3000),sessionId:z.string().uuid().optional(),topic:z.string().max(180).optional(),mode:z.enum(["beginner","normal","exam","deep"]).default("normal")});
export const assessmentRequest=z.object({subject:z.string().min(2),topic:z.string().min(2),difficulty:z.enum(["easy","medium","hard","adaptive"]).default("adaptive")});
