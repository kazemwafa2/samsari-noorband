//==================================
// NOORBAND AI LANGUAGE DETECTION
//==================================


export function detectLanguage(
message:string
){

const text =
message.toLowerCase().trim();


//=============================
// پشتو
//=============================

if(

text.includes("څنګه") ||
text.includes("مننه") ||
text.includes("ستاسو") ||
text.includes("ښه")

){

return "ps";

}



//=============================
// دری
//=============================

if(

text.includes("سلام علیکم") ||
text.includes("چطور هستین") ||
text.includes("خوب هستید") ||
text.includes("می‌باشد")

){

return "prs";

}



//=============================
// انگلیسی
//=============================

if(

text.includes("hello") ||
text.includes("hi") ||
text.includes("how are you") ||
text.includes("product") ||
text.includes("price") ||
text.includes("order")

){

return "en";

}



//=============================
// آلمانی
//=============================

if(

text.includes("hallo") ||
text.includes("guten") ||
text.includes("preis") ||
text.includes("produkt")

){

return "de";

}



//=============================
// سوئیسی آلمانی
//=============================

if(

text.includes("grüezi") ||
text.includes("gruezi")

){

return "de-ch";

}



//=============================
// فرانسوی
//=============================

if(

text.includes("bonjour") ||
text.includes("prix") ||
text.includes("produit")

){

return "fr";

}



//=============================
// ایتالیایی
//=============================

if(

text.includes("buongiorno") ||
text.includes("prezzo")

){

return "it";

}



//=============================
// فارسی
//=============================

if(

text.includes("سلام") ||
text.includes("درود") ||
text.includes("قیمت") ||
text.includes("محصول") ||
text.includes("چادر") ||
text.includes("لباس")

){

return "fa";

}



//=============================
// DEFAULT
//=============================

return "fa";


}