import {createServerClient} from "@supabase/ssr"; import {cookies} from "next/headers";
export async function createClient(){const store=await cookies();return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll:()=>store.getAll(),setAll(items){try{items.forEach(({name,value,options})=>store.set(name,value,options))}catch{}}}})}
export async function requireUser(){const client=await createClient();const {data:{user}}=await client.auth.getUser();if(!user)throw new Error("Unauthorized");return {client,user};}
