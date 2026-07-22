import { createClient } from "@/lib/supabase/server";

export async function getUserPlan() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .single();

    return data?.plan ?? "free";
}