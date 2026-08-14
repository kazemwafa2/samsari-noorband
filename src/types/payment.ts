export interface Payment {

id:number;

order_id:number;

user_id:string;

amount:number;

currency:string;

status:
| "pending"
| "processing"
| "completed"
| "failed"
| "cancelled"
| "refunded";

payment_method:string;

transaction_id?:string;

tracking_code?:string;

created_at:string;

updated_at?:string;

}