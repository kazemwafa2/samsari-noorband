"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";


export default function UserOverview(){
  const supabase = createClient();

const [users,setUsers]=useState({

total:0,
newUsers:0,
active:0,
blocked:0

});



useEffect(()=>{

loadUsers();

},[]);



async function loadUsers(){


const {data,error}=await supabase

.from("profiles")

.select("*");



if(error){

console.log(error);
return;

}



const allUsers=data || [];


const today=new Date();

today.setHours(0,0,0,0);



const newUsers=allUsers.filter((user:any)=>{

if(!user.created_at) return false;


return new Date(user.created_at) >= today;


});



const activeUsers=allUsers.filter((user:any)=>{

return user.status !== "blocked";

});



const blockedUsers=allUsers.filter((user:any)=>{

return user.status === "blocked";

});



setUsers({

total:allUsers.length,

newUsers:newUsers.length,

active:activeUsers.length,

blocked:blockedUsers.length

});


}




const cards=[

{
title:"👤 کاربران کل",
value:users.total
},

{
title:"🆕 امروز",
value:users.newUsers
},

{
title:"🟢 فعال",
value:users.active
},

{
title:"🚫 مسدود",
value:users.blocked
}

];



return(

<div
className="
card
backdrop-blur-xl
bg-white/10
border
border-white/20
rounded-3xl
p-5
shadow-lg
"
>


<h2 className="
text-xl
font-bold
mb-4
">
👥 وضعیت کاربران
</h2>



<div className="
grid
grid-cols-2
gap-3
">


{

cards.map((card,index)=>(


<div

key={index}

className="
rounded-2xl
bg-white/10
p-4
text-center
"

>

<p>
{card.title}
</p>


<strong className="
text-2xl
block
mt-2
">
{card.value}
</strong>


</div>


))


}


</div>


</div>

);


}