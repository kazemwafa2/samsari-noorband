"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";


export default function EditProfile(){


const supabase =
createClient();


const router =
useRouter();



const [loading,setLoading] =
useState(false);


// شناسه کاربر لازم است تا مسیر آپلود عکس زیر پوشه‌ی خودش باشد —
// باکت جدای avatars فقط اجازه می‌دهد هرکسی داخل پوشه‌ی {uid-خودش}/
// آپلود/حذف کند، نه هرجای دیگر.
const [userId,setUserId] =
useState<string | null>(null);



const [form,setForm] =
useState({

full_name:"",
phone:"",
avatar:""

});






useEffect(()=>{


async function loadProfile(){


const {
data:{
user
}
}
=
await supabase.auth.getUser();



if(!user)
return;




setUserId(user.id);




const {
data
}
=
await supabase

.from("profiles")

.select(
`
full_name,
phone,
avatar
`
)

.eq(
"id",
user.id
)

.maybeSingle();





if(data){

setForm({

full_name:
data.full_name || "",

phone:
data.phone || "",

avatar:
data.avatar || ""

});


}



}



loadProfile();



},[]);







async function saveProfile(){


setLoading(true);



const {
data:{
user
}
}
=
await supabase.auth.getUser();




if(!user)
return;






const {
error
}
=
await supabase

.from("profiles")

.update({

full_name:
form.full_name,

phone:
form.phone,

avatar:
form.avatar,

updated_at:
new Date()

})

.eq(
"id",
user.id
);





if(error){

alert(
error.message
);

setLoading(false);

return;

}





alert(
"پروفایل با موفقیت ذخیره شد"
);



router.push(
"/site/profile"
);



}







return(

<main className="home-page">


<h1 className="section-title">

✏️ ویرایش پروفایل

</h1>





<div className="card">





<label>
نام کامل
</label>


<input

className="input"

value={
form.full_name
}

onChange={
e=>

setForm({

...form,

full_name:
e.target.value

})

}

/>






<label>
شماره تماس
</label>


<input

className="input"

value={
form.phone
}

onChange={
e=>

setForm({

...form,

phone:
e.target.value

})

}

/>






<label>
عکس پروفایل
</label>


<ImageUploader
value={form.avatar}
onUploaded={
url=>

setForm({

...form,

avatar:
url

})

}
bucket="avatars"
folder={userId ?? "unknown"}
allowRemove
/>






<button

className="primary-btn"

onClick={saveProfile}

disabled={loading}

>

{

loading

?

"در حال ذخیره..."

:

"ذخیره تغییرات"

}



</button>




</div>



</main>

);


}