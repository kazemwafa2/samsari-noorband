export interface Notification{

id:number;

user_id:string;

title:string;

message:string;

is_read:boolean;

type:
| "order"
| "payment"
| "discount"
| "wishlist"
| "product"
| "delivery"
| "account"
| "system";

link?:string;

created_at:string;

updated_at?:string;

}