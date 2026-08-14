export interface User{

id:string;

name:string;

email:string;

avatar?:string;

phone?:string;

address?:string;

language?:string;

currency?:string;

is_verified:boolean;

role:
| "admin"
| "customer"
| "moderator";

created_at:string;

updated_at?:string;

}