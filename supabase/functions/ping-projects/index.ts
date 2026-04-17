import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const onlyId = url.searchParams.get("id");

    let query = supabase.from("pinged_projects").select("*").eq("enabled", true);
    if (onlyId) query = query.eq("id", onlyId);
    const { data: projects, error } = await query;
    if (error) throw error;

    const now = Date.now();
    const results: any[] = [];

    for (const p of projects ?? []) {
      // Skip if not due yet (unless manual ping by id)
      if (!onlyId && p.last_pinged_at) {
        const last = new Date(p.last_pinged_at).getTime();
        if (now - last < p.interval_minutes * 60 * 1000) continue;
      }

      const start = Date.now();
      let statusCode: number | null = null;
      let success = false;
      let errorMessage: string | null = null;

      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 15000);
        const res = await fetch(p.url, { method: "GET", signal: ctrl.signal });
        clearTimeout(t);
        statusCode = res.status;
        success = res.ok;
        await res.text().catch(() => {});
      } catch (e: any) {
        errorMessage = e?.message ?? String(e);
      }

      const responseTime = Date.now() - start;

      await supabase.from("ping_logs").insert({
        project_id: p.id,
        status_code: statusCode,
        success,
        response_time_ms: responseTime,
        error_message: errorMessage,
      });

      await supabase.from("pinged_projects").update({
        last_pinged_at: new Date().toISOString(),
        last_status_code: statusCode,
        last_error: errorMessage,
      }).eq("id", p.id);

      results.push({ id: p.id, name: p.name, statusCode, success, responseTime, errorMessage });
    }

    return new Response(JSON.stringify({ pinged: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
