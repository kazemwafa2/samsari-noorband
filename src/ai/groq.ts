export async function groqAI(
  message: string
){

const response = await fetch(
"https://api.groq.com/openai/v1/chat/completions",
{
method:"POST",

headers:{
"Content-Type":"application/json",

"Authorization":
`Bearer ${process.env.GROQ_API_KEY}`
},

body:JSON.stringify({

model:"llama-3.3-70b-versatile",

messages:[
{
role:"system",
content:
"تو دستیار هوشمند فروشگاه NOORBAND Jaghori هستی. فقط اطلاعات درست بده."
},
{
role:"user",
content:message
}
]

})

}
);


if(!response.ok){
throw new Error(
"Groq API Error"
);
}


const data=await response.json();


return (
data.choices?.[0]?.message?.content
||
"پاسخی دریافت نشد"
);

}