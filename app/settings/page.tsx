import PreferencesForm from "@/components/preferences-form";
import { requireUser } from "@/lib/supabase/server";
const defaults = { tutor_name: "AI Tutor", mentor_name: "AI Mentor", learning_style: "normal" as const, preferred_difficulty: "adaptive" as const };
export default async function SettingsPage() { const { client, user } = await requireUser(); const { data } = await client.from("user_preferences").select("tutor_name,mentor_name,learning_style,preferred_difficulty").eq("user_id", user.id).maybeSingle(); return <main className="shell" style={{ maxWidth: 650 }}><PreferencesForm initial={{ ...defaults, ...data }} /></main>; }
