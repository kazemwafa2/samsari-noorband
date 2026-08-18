import { createClient } from "@/lib/supabase/server";


export async function getUserRole(
  userId: string
) {

  const supabase =
    await createClient();


  const {
    data,
    error
  } = await supabase

    .from("profiles")

    .select("role")

    .eq(
      "id",
      userId
    )

    .single();



  if(error){

    return null;

  }



  return data?.role ?? null;

}