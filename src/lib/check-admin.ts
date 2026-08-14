import { supabase } from "./supabase";


export async function checkAdmin(){


const {
data:{
session
}

}= await supabase.auth.getSession();



if(!session){

return false;

}



const userId = session.user.id;



const {
data,
error
}= await supabase

.from("profiles")

.select("role")

.eq("id",userId)

.single();



if(error || !data){

return false;

}



return ["super_admin", "admin", "seller"].includes(data.role);


}