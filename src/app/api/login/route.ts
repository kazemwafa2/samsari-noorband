import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "ایمیل و رمز الزامی است.",
        },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    const sessionCookies: Array<{
      name: string;
      value: string;
      options?: Record<string, unknown>;
    }> = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },

          setAll(cookiesToSet) {
            sessionCookies.push(...cookiesToSet);
          },
        },
      }
    );

    const windowStart = new Date(
      Date.now() - WINDOW_MINUTES * 60 * 1000
    ).toISOString();

    const { count } = await supabase
      .from("login_attempts")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("email", email)
      .eq("success", false)
      .gte("created_at", windowStart);

    if ((count || 0) >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          success: false,
          error: `تعداد تلاش‌های ناموفق زیاد است. ${WINDOW_MINUTES} دقیقه دیگر امتحان کن.`,
        },
        {
          status: 429,
          headers: {
            "Cache-Control": "private, no-store",
          },
        }
      );
    }

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    await supabase.from("login_attempts").insert({
      email,
      success: !error,
    });

    if (error || !data.user) {
      return NextResponse.json(
        {
          success: false,
          error:
            error?.message ||
            "ورود انجام نشد.",
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "private, no-store",
          },
        }
      );
    }

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

    const response = NextResponse.json(
      {
        success: true,
        user: data.user,
        role: profile?.role || "customer",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );

    for (const cookie of sessionCookies) {
      response.cookies.set(
        cookie.name,
        cookie.value,
        cookie.options as Parameters<
          typeof response.cookies.set
        >[2]
      );
    }

    return response;
  } catch (error) {
    console.error(
      "LOGIN_ROUTE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "خطایی در ورود رخ داد. لطفاً دوباره تلاش کنید.",
      },
      { status: 500 }
    );
  }
}
