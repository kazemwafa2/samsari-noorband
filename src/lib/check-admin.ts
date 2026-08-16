import { supabase } from "./supabase";

export async function checkAdmin(){

  const { data: { user } } = await supabase.auth.getUser();

  if(!user){
    return false;
  }

  const {
    data,
    error
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if(error || !data){
    return false;
  }

  return ["super_admin", "admin", "seller"].includes(data.role);
}
