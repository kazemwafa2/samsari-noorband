//===================================
// NOORBAND AI CACHE SYSTEM
//===================================


export interface CacheSystem{


language:string;
country:string;
currency:string;

timezone:string;
time:string;


member:
"visitor"
| "user"
| "seller"
| "admin"
| "super_admin";


season:string;

weather:string;

theme:string;



firstVisit:boolean;
firstLogin:boolean;

firstOrder:boolean;
firstPayment:boolean;


welcomeBack:boolean;



vip:boolean;

premium:boolean;



seller:boolean;

admin:boolean;

superAdmin:boolean;



notifications:boolean;

discount:boolean;

holiday:boolean;

online:boolean;



darkMode:boolean;



languageDetected:boolean;

countryDetected:boolean;

currencyDetected:boolean;



favoriteCategory:string;


favoriteProducts:string[];

recentSearches:string[];

cartProducts:string[];


orders:number;



lastVisit:string;

lastLogin:string;



}





//===================================
// AI CHAT MEMORY
//===================================


export interface AIMemoryMessage{


role:
"USER"
|
"AI";


text:string;

date:string;


}





//===================================
// AI ANSWER CACHE
//===================================


export interface AICacheItem{


question:string;

answer:string;

date:string;


}




const CACHE_KEY="NOORBAND_AI";

const MEMORY_KEY="NOORBAND_AI_MEMORY";

const ANSWER_KEY="NOORBAND_AI_ANSWERS";




//===================================
// SAVE USER CACHE
//===================================


export function saveCache(
data:Partial<CacheSystem>
){


if(typeof window==="undefined")
return;



const old=getCache();


const update={

...old,

...data

};



localStorage.setItem(

CACHE_KEY,

JSON.stringify(update)

);



}





//===================================
// GET USER CACHE
//===================================


export function getCache():CacheSystem{


if(typeof window==="undefined"){

return defaultCache();

}



const data=

localStorage.getItem(

CACHE_KEY

);



if(!data){

return defaultCache();

}



try{

return {

...defaultCache(),

...JSON.parse(data)

};


}

catch{


return defaultCache();


}



}





//===================================
// DEFAULT CACHE
//===================================


export function defaultCache():CacheSystem{


return{


language:"fa",

country:"AF",

currency:"AFN",


timezone:"Asia/Kabul",

time:"",



member:"visitor",



season:"spring",

weather:"",



theme:"glass",



firstVisit:true,

firstLogin:true,


firstOrder:false,

firstPayment:false,


welcomeBack:false,



vip:false,

premium:false,


seller:false,

admin:false,

superAdmin:false,



notifications:true,

discount:false,

holiday:false,


online:true,



darkMode:false,



languageDetected:false,

countryDetected:false,

currencyDetected:false,



favoriteCategory:"",



favoriteProducts:[],


recentSearches:[],


cartProducts:[],


orders:0,



lastVisit:"",

lastLogin:""


};



}





//===================================
// CLEAR CACHE
//===================================


export function clearCache(){


if(typeof window==="undefined")
return;



localStorage.removeItem(

CACHE_KEY

);


}





//===================================
// RESET CACHE
//===================================


export function resetCache(){


if(typeof window==="undefined")
return;



localStorage.setItem(

CACHE_KEY,

JSON.stringify(

defaultCache()

)

);


}






//===================================
// USER HELPERS
//===================================


export function isFirstVisit(){

return getCache().firstVisit;

}


export function isFirstOrder(){

return getCache().firstOrder;

}


export function isFirstPayment(){

return getCache().firstPayment;

}


export function isVip(){

return getCache().vip;

}


export function isPremium(){

return getCache().premium;

}


export function isAdmin(){

return getCache().admin;

}


export function isSeller(){

return getCache().seller;

}


export function getLanguage(){

return getCache().language;

}


export function getCountry(){

return getCache().country;

}


export function getCurrency(){

return getCache().currency;

}


export function getTheme(){

return getCache().theme;

}


export function getRecentSearches(){

return getCache().recentSearches;

}


export function getFavoriteProducts(){

return getCache().favoriteProducts;

}


export function isOnline(){

return getCache().online;

}





//===================================
// SAVE AI MEMORY
//===================================


export function saveAIMemory(

message:AIMemoryMessage

){


if(typeof window==="undefined")
return;



const old=getAIMemory();


const update=[

...old,

message

].slice(-50);



localStorage.setItem(

MEMORY_KEY,

JSON.stringify(update)

);


}





//===================================
// GET AI MEMORY
//===================================


export function getAIMemory()

:AIMemoryMessage[]{


if(typeof window==="undefined")
return [];



const data=

localStorage.getItem(

MEMORY_KEY

);



if(!data)
return [];



try{

return JSON.parse(data);

}

catch{

return [];

}


}





//===================================
// RECENT AI MEMORY
//===================================


export function getRecentMemory(

count:number=10

){


return getAIMemory().slice(-count);


}





//===================================
// SAVE AI ANSWER CACHE
//===================================


export function saveAICache(

item:AICacheItem

){


if(typeof window==="undefined")
return;



const old=getAICache();



const update=[

...old,

item

].slice(-100);



localStorage.setItem(

ANSWER_KEY,

JSON.stringify(update)

);


}





//===================================
// GET AI ANSWER CACHE
//===================================


export function getAICache()

:AICacheItem[]{


if(typeof window==="undefined")
return [];



const data=

localStorage.getItem(

ANSWER_KEY

);



if(!data)
return [];



try{

return JSON.parse(data);

}

catch{

return [];

}


}





//===================================
// FIND AI ANSWER
//===================================


export function findAICache(

question:string

){


return getAICache().find(

item=>

item.question===question

);


}





//===================================
// CLEAR AI MEMORY
//===================================


export function clearAIMemory(){


if(typeof window==="undefined")
return;



localStorage.removeItem(

MEMORY_KEY

);


}





//===================================
// CLEAR AI ANSWERS
//===================================


export function clearAICache(){


if(typeof window==="undefined")
return;



localStorage.removeItem(

ANSWER_KEY

);


}