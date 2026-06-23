import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, supabaseAdminKey);

async function createMidtransTestUser() {
  const email = "midtrans-test@konsultanai.com";
  const password = "Midtrans123!";

  console.log("Creating test user...");
  
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true
  });

  if (authError) {
    if (authError.message.includes("already exists")) {
      console.log("Test user already exists!");
    } else {
      console.error("Failed to create auth user:", authError.message);
    }
    return;
  }

  // Update public.users table
  if (authData.user) {
    const { error: updateError } = await supabase.from('users').update({
      full_name: "Midtrans Reviewer",
      tier: "free",
      role: "user"
    }).eq('id', authData.user.id);
    
    if (updateError) {
      console.error("Failed to update user profile:", updateError.message);
    } else {
      console.log("Test user created successfully!");
      console.log("Email:", email);
      console.log("Password:", password);
    }
  }
}

createMidtransTestUser();
