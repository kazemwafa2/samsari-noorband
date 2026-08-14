"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginForm() {

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [remember,setRemember]=useState(false);

const [loading,setLoading]=useState(false);

const [showPassword,setShowPassword]=useState(false);


async function handleLogin(
e:React.FormEvent<HTMLFormElement>
){

e.preventDefault();

setLoading(true);


/*
مرحله بعد:

Supabase Auth

*/


setTimeout(()=>{

setLoading(false);

},2000);


}



return(

<div className="login-page">

<div className="glass-card">

{/* LOGO */}

<div className="logo-box">

<h1>

🌷 سیمساری نوربند جاغوری 🌷

</h1>

<p>

خوش آمدید.

</p>

</div>


<form
onSubmit={handleLogin}
>

{/* EMAIL */}


<div className="input-box">

<Mail size={20}/>

<input

type="email"

placeholder="ایمیل"

required

value={email}

onChange={(e)=>
setEmail(e.target.value)
}

/>

</div>



{/* PASSWORD */}


<div className="input-box">


<Lock size={20}/>


<input

type={
showPassword
?
"text"
:
"password"
}

placeholder="رمز عبور"

required

value={password}

onChange={(e)=>
setPassword(e.target.value)
}

/>


<button

type="button"

onClick={()=>

setShowPassword(

!showPassword

)

}

>

{

showPassword

?

<EyeOff size={20}/>

:

<Eye size={20}/>

}

</button>


</div>



{/* REMEMBER ME */}



<div className="remember-box">


<label>

<input

type="checkbox"

checked={remember}

onChange={()=>

setRemember(

!remember

)

}

/>

مرا به خاطر بسپار

</label>


<Link href="/forgot-password">

فراموشی رمز عبور؟

</Link>


</div>



{/* LOGIN BUTTON */}



<button

type="submit"

className="login-btn"

disabled={loading}

>

{

loading

?

"در حال ورود..."

:

"ورود به حساب"

}


</button>



{/* REGISTER */}


<div className="register-box">

<p>

حساب کاربری ندارید؟

</p>


<Link href="/register">

ثبت نام در سایت

</Link>


</div>


</form>


</div>


</div>


);


}