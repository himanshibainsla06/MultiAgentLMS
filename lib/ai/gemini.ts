import {ChatGoogleGenerativeAI} from "@langchain/google-genai"; import {z} from "zod";
export function model(){if(!process.env.GEMINI_API_KEY)throw new Error("AI service is not configured. Add GEMINI_API_KEY on the server.");return new ChatGoogleGenerativeAI({apiKey:process.env.GEMINI_API_KEY,model:"gemini-1.5-flash",temperature:0.3});}
export async function structured<T>(prompt:string,schema:z.ZodType<T>):Promise<T>{const runnable=model().withStructuredOutput(schema);return runnable.invoke(prompt)}
export async function text(prompt:string){const answer=await model().invoke(prompt);return typeof answer.content==="string"?answer.content:"I could not prepare a response. Please try again."}
