import { createClient } from "@/lib/supabase/server";

// GET: List all users (admin only)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401, headers: { "Content-Type": "application/json" } 
      });
    }

    // Verify admin role
    const { data: adminProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminProfile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { 
        status: 403, headers: { "Content-Type": "application/json" } 
      });
    }

    // Fetch all users with consultation counts
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, full_name, is_premium, role, tier, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, headers: { "Content-Type": "application/json" } 
      });
    }

    // Get consultation counts for each user
    const usersWithStats = await Promise.all(
      (users || []).map(async (u) => {
        const { count } = await supabase
          .from("consultations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", u.id);

        return {
          ...u,
          consultationCount: count || 0,
        };
      })
    );

    return new Response(JSON.stringify({ users: usersWithStats }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, headers: { "Content-Type": "application/json" } 
    });
  }
}

// PATCH: Update user tier/role (admin only)
export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401, headers: { "Content-Type": "application/json" } 
      });
    }

    // Verify admin role
    const { data: adminProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminProfile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { 
        status: 403, headers: { "Content-Type": "application/json" } 
      });
    }

    const body = await req.json();
    const { userId, tier, isPremium } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), { 
        status: 400, headers: { "Content-Type": "application/json" } 
      });
    }

    // Build update object
    const updateData: Record<string, any> = {};
    if (tier !== undefined) updateData.tier = tier;
    if (isPremium !== undefined) updateData.is_premium = isPremium;

    // Auto-set is_premium based on tier
    if (tier && tier !== "free") {
      updateData.is_premium = true;
    } else if (tier === "free") {
      updateData.is_premium = false;
    }

    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, headers: { "Content-Type": "application/json" } 
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, headers: { "Content-Type": "application/json" } 
    });
  }
}
