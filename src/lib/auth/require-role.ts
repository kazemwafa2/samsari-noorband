import { createClient } from "@/lib/supabase/server";
import type { Role } from "./roles";
import { redirect } from "next/navigation";


export async function requireRole(
  allowedRoles: Role[]
) {

  const supabase =
    await createClient();



  const {
    data:{
      user
    }
  } =
  await supabase.auth.getUser();



  if(!user){

    redirect("/login");

  }



  const {
    data:profile,
    error
  } =
  await supabase

    .from("profiles")

    .select(
      "role,is_active"
    )

    .eq(
      "id",
      user.id
    )

    .single();



  if(
    error ||
    !profile
  ){

    redirect("/login");

  }



  if(
    !profile.is_active
  ){

    redirect("/");

  }



  if(
    !allowedRoles.includes(
      profile.role as Role
    )
  ){

    redirect("/");

  }



  return user;

}