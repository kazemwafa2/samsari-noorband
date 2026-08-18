//=============================
// NOORBAND AI SUGGESTION SYSTEM
//=============================

import { getMessage } from "@/constants/messages";
import type { Language } from "@/lib/i18n/dictionaries";


export async function AI_SUGGESTION(type:string, language:string="fa"){


//=============================
// WELCOME
//=============================

if(type==="WELCOME"){

return{

success:true,
type:"WELCOME",
message:getMessage("WELCOME_MESSAGE", language as Language),
data:null

};

}


//=============================
// FIRST VISIT
//=============================

if(type==="FIRST_VISIT"){

return{

success:true,
type:"FIRST_VISIT",
message:getMessage("FIRST_VISIT_MESSAGE", language as Language),
data:null

};

}


//=============================
// RETURN USER
//=============================

if(type==="RETURN_USER"){

return{

success:true,
type:"RETURN_USER",
message:getMessage("SMART_RETURN_MESSAGE", language as Language),
data:null

};

}


//=============================
// FIRST ORDER
//=============================

if(type==="FIRST_ORDER"){

return{

success:true,
type:"FIRST_ORDER",
message:getMessage("FIRST_ORDER_MESSAGE", language as Language),
data:null

};

}


//=============================
// FIRST PAYMENT
//=============================

if(type==="FIRST_PAYMENT"){

return{

success:true,
type:"FIRST_PAYMENT",
message:getMessage("FIRST_PAYMENT_MESSAGE", language as Language),
data:null

};

}


//=============================
// VIP
//=============================

if(type==="VIP"){

return{

success:true,
type:"VIP",
message:getMessage("VIP_MEMBER_MESSAGE", language as Language),
data:null

};

}


//=============================
// PREMIUM
//=============================

if(type==="PREMIUM"){

return{

success:true,
type:"PREMIUM",
message:getMessage("PREMIUM_MEMBER_MESSAGE", language as Language),
data:null

};

}


//=============================
// NEW PRODUCTS
//=============================

if(type==="NEW_PRODUCTS"){

return{

success:true,
type:"NEW_PRODUCTS",
message:getMessage("NEW_PRODUCT_MESSAGE", language as Language),
data:null

};

}


//=============================
// NEW DISCOUNT
//=============================

if(type==="NEW_DISCOUNT"){

return{

success:true,
type:"NEW_DISCOUNT",
message:getMessage("NEW_DISCOUNT_MESSAGE", language as Language),
data:null

};

}


//=============================
// SPECIAL DISCOUNT
//=============================

if(type==="SPECIAL_DISCOUNT"){

return{

success:true,
type:"SPECIAL_DISCOUNT",
message:getMessage("SPECIAL_DISCOUNT_MESSAGE", language as Language),
data:null

};

}


//=============================
// DAILY SPECIAL
//=============================

if(type==="DAILY_SPECIAL"){

return{

success:true,
type:"DAILY_SPECIAL",
message:getMessage("DAILY_SPECIAL_MESSAGE", language as Language),
data:null

};

}


//=============================
// WEATHER
//=============================

if(type==="WEATHER"){

return{

success:true,
type:"WEATHER",
message:getMessage("SMART_WEATHER_MESSAGE", language as Language),
data:null

};

}


//=============================
// HOLIDAY
//=============================

if(type==="HOLIDAY"){

return{

success:true,
type:"HOLIDAY",
message:getMessage("SMART_HOLIDAY_MESSAGE", language as Language),
data:null

};

}


//=============================
// NOTIFICATION
//=============================

if(type==="NOTIFICATION"){

return{

success:true,
type:"NOTIFICATION",
message:getMessage("SMART_NOTIFICATION_MESSAGE", language as Language),
data:null

};

}


//=============================
// SPRING
//=============================

if(type==="SPRING"){

return{

success:true,
type:"SPRING",
message:getMessage("SPRING_MESSAGE", language as Language),
data:null

};

}


//=============================
// SUMMER
//=============================

if(type==="SUMMER"){

return{

success:true,
type:"SUMMER",
message:getMessage("SUMMER_MESSAGE", language as Language),
data:null

};

}


//=============================
// AUTUMN
//=============================

if(type==="AUTUMN"){

return{

success:true,
type:"AUTUMN",
message:getMessage("AUTUMN_MESSAGE", language as Language),
data:null

};

}


//=============================
// WINTER
//=============================

if(type==="WINTER"){

return{

success:true,
type:"WINTER",
message:getMessage("WINTER_MESSAGE", language as Language),
data:null

};

}


//=============================
// GOODBYE
//=============================

if(type==="GOODBYE"){

return{

success:true,
type:"GOODBYE",
message:getMessage("GOODBYE_MESSAGE", language as Language),
data:null

};

}


//=============================
// DEFAULT AI
//=============================

return{

success:true,
type:"AI",
message:getMessage("AI_SUGGESTION_MESSAGE", language as Language),
data:null

};


}