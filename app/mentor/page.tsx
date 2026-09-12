import MentorPanel from "@/components/mentor-panel";
import { requireUser } from "@/lib/supabase/server";
export default async function MentorPage() { const { client, user } = await requireUser(); const { data } = await client.from("mentor_recommendations").select("content").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(); return <main className="shell" style={{ maxWidth: 760 }}><MentorPanel initialRecommendation={data?.content} /></main>; }
