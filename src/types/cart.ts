export interface Cart{

id:number;

product_id:number;

title:string;

image:string;

price:number;

discount:number;

quantity:number;

stock:number;

category:string;

is_available:boolean;

user_id?:string;

created_at?:string;

updated_at?:string;

}