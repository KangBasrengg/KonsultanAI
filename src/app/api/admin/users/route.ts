import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

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
      .select("id, email, full_name, is_premium, role, tier, created_at, institution_name, parent_id, subscription_expires_at, token_balance, institution_type, has_analytics_access")
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
    const { userId, tier, isPremium, institution_name, full_name, role, token_balance, institution_type, has_analytics_access } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), { 
        status: 400, headers: { "Content-Type": "application/json" } 
      });
    }

    // Build update object
    const updateData: Record<string, any> = {};
    if (tier !== undefined) updateData.tier = tier;
    if (isPremium !== undefined) updateData.is_premium = isPremium;
    if (institution_name !== undefined) updateData.institution_name = institution_name;
    if (full_name !== undefined) updateData.full_name = full_name;
    if (role !== undefined) updateData.role = role;
    if (token_balance !== undefined) updateData.token_balance = token_balance;
    if (institution_type !== undefined) updateData.institution_type = institution_type;
    if (has_analytics_access !== undefined) updateData.has_analytics_access = has_analytics_access;

    // Auto-set is_premium based on tier
    if (tier && tier !== "free") {
      updateData.is_premium = true;
      if (tier === "enterprise") {
        updateData.token_balance = 18;
      }
    } else if (tier === "free") {
      updateData.is_premium = false;
    }

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", userId);

    if (error) {
      console.error("[Admin Users PATCH] Supabase Error:", error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, headers: { "Content-Type": "application/json" } 
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    console.error("[Admin Users PATCH] Internal Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, headers: { "Content-Type": "application/json" } 
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return new Response(JSON.stringify({ error: "ID Pengguna wajib disertakan" }), { status: 400 });
    }

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return new Response("Unauthorized", { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) return new Response("Unauthorized", { status: 401 });
    const { data: adminData } = await supabaseAdmin.from("users").select("role").eq("id", user.id).single();
    if (!adminData || adminData.role !== "admin") return new Response("Forbidden", { status: 403 });

    // Delete user from auth (this automatically cascades to users table if foreign keys are set up, 
    // but we can just use admin auth API to delete the user completely)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error("[Admin Users DELETE] Supabase Error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" }});
  } catch (err: any) {
    console.error("[Admin Users DELETE] Internal Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
