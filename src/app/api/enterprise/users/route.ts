import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

// Initialize Supabase Admin Client for Auth Management (creating users)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check if user is enterprise
    const { data: profile } = await supabase
      .from('users')
      .select('tier, role, token_balance')
      .eq('id', user.id)
      .single();

    if (profile?.tier !== 'enterprise' && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak. Fitur ini khusus untuk paket Enterprise.' }, { status: 403 });
    }

    // Get sub-accounts (using supabaseAdmin to bypass RLS since users can only see their own row normally)
    const { data: employees, error } = await supabaseAdmin
      .from('users')
      .select('id, email, token_balance, created_at, full_name')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ employees, token_balance: profile?.token_balance || 0 });
  } catch (error: any) {
    console.error('[Enterprise API] GET Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { email, password, full_name, initial_tokens } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    // Verify enterprise tier and quota
    const { data: profile } = await supabase
      .from('users')
      .select('tier, role, token_balance, institution_name, institution_type, has_analytics_access')
      .eq('id', user.id)
      .single();

    if (profile?.tier !== 'enterprise' && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    // Check 5 accounts limit for Enterprise
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('parent_id', user.id);

    if (count !== null && count >= 5 && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Limit akun karyawan (5 akun) telah tercapai.' }, { status: 403 });
    }

    const tokensToAllocate = parseInt(initial_tokens) || 0;
    if (tokensToAllocate > (profile?.token_balance || 0)) {
      return NextResponse.json({ error: 'Saldo token Anda tidak mencukupi untuk dialokasikan.' }, { status: 400 });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: full_name || 'Karyawan',
      }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const newUserId = authData.user.id;

    // Supabase trigger will automatically create a row in public.users.
    // We just need to update it with parent_id and allocated tokens.
    
    // Decrease parent token, increase child token, set parent_id
    if (tokensToAllocate > 0) {
      await supabaseAdmin.from('users').update({ token_balance: (profile?.token_balance || 0) - tokensToAllocate }).eq('id', user.id);
    }

    let updateResult = await supabaseAdmin.from('users').update({
      parent_id: user.id,
      tier: 'enterprise_member',
      is_premium: true,
      token_balance: tokensToAllocate,
      full_name: full_name || 'Karyawan',
      institution_name: profile?.institution_name || null,
      institution_type: profile?.institution_type || 'swasta',
      has_analytics_access: profile?.has_analytics_access || false
    }).eq('id', newUserId).select();

    if (!updateResult.data || updateResult.data.length === 0) {
      await new Promise(r => setTimeout(r, 1000));
      await supabaseAdmin.from('users').update({
        parent_id: user.id,
        tier: 'enterprise_member',
        is_premium: true,
        token_balance: tokensToAllocate,
        full_name: full_name || 'Karyawan',
        institution_name: profile?.institution_name || null,
        institution_type: profile?.institution_type || 'swasta',
        has_analytics_access: profile?.has_analytics_access || false
      }).eq('id', newUserId);
    }

    return NextResponse.json({ success: true, user_id: newUserId });
  } catch (error: any) {
    console.error('[Enterprise API] POST Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat membuat akun.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { employee_id, transfer_amount } = await request.json(); // Positive to give, negative to take
    const amount = parseInt(transfer_amount);

    if (!employee_id || isNaN(amount) || amount === 0) {
      return NextResponse.json({ error: 'Data tidak valid.' }, { status: 400 });
    }

    // Verify ownership and balances
    const { data: parentProfile } = await supabase.from('users').select('tier, role, token_balance').eq('id', user.id).single();
    if (parentProfile?.tier !== 'enterprise' && parentProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const { data: employeeProfile } = await supabase.from('users').select('token_balance, parent_id').eq('id', employee_id).single();
    
    if (!employeeProfile || employeeProfile.parent_id !== user.id) {
      return NextResponse.json({ error: 'Karyawan tidak ditemukan.' }, { status: 404 });
    }

    const parentBalance = parentProfile?.token_balance || 0;
    const employeeBalance = employeeProfile?.token_balance || 0;

    if (amount > 0 && parentBalance < amount) {
      return NextResponse.json({ error: 'Saldo token Anda tidak mencukupi.' }, { status: 400 });
    }
    if (amount < 0 && employeeBalance < Math.abs(amount)) {
      return NextResponse.json({ error: 'Saldo token karyawan tidak mencukupi untuk ditarik.' }, { status: 400 });
    }

    // Apply transfers
    await supabaseAdmin.from('users').update({ token_balance: parentBalance - amount }).eq('id', user.id);
    await supabaseAdmin.from('users').update({ token_balance: employeeBalance + amount }).eq('id', employee_id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Enterprise API] PUT Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat transfer kuota.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const employee_id = searchParams.get('id');

    if (!employee_id) return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });

    const { data: employeeProfile } = await supabase.from('users').select('token_balance, parent_id').eq('id', employee_id).single();
    if (!employeeProfile || employeeProfile.parent_id !== user.id) {
      return NextResponse.json({ error: 'Karyawan tidak ditemukan.' }, { status: 404 });
    }

    // Refund tokens to parent
    if (employeeProfile.token_balance > 0) {
      const { data: parentProfile } = await supabase.from('users').select('token_balance').eq('id', user.id).single();
      await supabaseAdmin.from('users').update({ token_balance: (parentProfile?.token_balance || 0) + employeeProfile.token_balance }).eq('id', user.id);
    }

    // Delete user from Auth (also triggers cascade delete in public.users depending on schema, or we manually delete)
    await supabaseAdmin.auth.admin.deleteUser(employee_id);
    await supabaseAdmin.from('users').delete().eq('id', employee_id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Enterprise API] DELETE Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat menghapus akun.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { employee_id, full_name, email, password } = await request.json();

    if (!employee_id) {
      return NextResponse.json({ error: 'Data tidak valid.' }, { status: 400 });
    }

    // Verify ownership
    const { data: employeeProfile } = await supabase.from('users').select('parent_id').eq('id', employee_id).single();
    if (!employeeProfile || employeeProfile.parent_id !== user.id) {
      return NextResponse.json({ error: 'Karyawan tidak ditemukan.' }, { status: 404 });
    }

    // Update in Auth
    const authUpdatePayload: any = {
      user_metadata: { full_name: full_name }
    };
    if (email) authUpdatePayload.email = email;
    if (password) authUpdatePayload.password = password;

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(employee_id, authUpdatePayload);
    
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Update in public.users
    const { error: dbError } = await supabaseAdmin.from('users').update({
      full_name: full_name,
      email: email || undefined
    }).eq('id', employee_id);

    if (dbError) {
      return NextResponse.json({ error: 'Gagal memperbarui profil database' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Enterprise API] PATCH Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengupdate akun.' }, { status: 500 });
  }
}
