import { createClient } from "@/lib/supabase/client";

export function authListener(callback: (event: string) => void) {
  const supabase = createClient();
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event) => {
    callback(event);
  });

  return () => {
    subscription.unsubscribe();
  };
}
