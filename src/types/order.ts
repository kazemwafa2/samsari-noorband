export interface Order {

id:number;

user_id:string;

status:
| "pending"
| "paid"
| "packing"
| "shipping"
| "completed"
| "cancelled"
| "returned";

total:number;

payment_status?:
| "pending"
| "paid"
| "failed"
| "cancelled";

payment_method?:string;

tracking_code?:string;

address?:string;

phone?:string;

notes?:string;

delivery_price?:number;

discount?:number;

coupon_code?:string;

delivery_status?:
| "preparing"
| "shipping"
| "delivered"
| "returned";

currency?:string;

language?:string;

created_at:string;

updated_at?:string;

}