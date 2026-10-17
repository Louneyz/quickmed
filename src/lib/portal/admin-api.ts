import { DEMO_ONLY, demoFetch } from "./demo";
import { supabase } from "./supabase";

export async function onboard(body: Record<string, unknown>) {
    const { data } = await supabase().auth.getSession();
    // The demo answers in the browser, so nothing reaches the real API or sends email.
    const response = await (DEMO_ONLY ? demoFetch : fetch)("/api/admin/clients", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${data.session?.access_token ?? ""}`,
        },
        body: JSON.stringify(body),
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(json.error ?? "Something went wrong.");
    return json as { pharmacyId: string };
}
