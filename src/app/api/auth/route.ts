import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// قبلا این route فقط {success:true} هارد-کد برمی‌گرداند و هیچ کار واقعی
// نمی‌کرد. حالا:
// GET  -> وضعیت واقعی لاگین کاربر را برمی‌گرداند
// POST -> خروج از حساب (logout) را انجام می‌دهد

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: true, authenticated: false });
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
    },
  });
}

export async function POST() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
