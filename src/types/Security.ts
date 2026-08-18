export interface Security{

is_login:boolean;

is_verified:boolean;

is_admin:boolean;

two_factor_auth:boolean;

email_verified:boolean;

phone_verified:boolean;

device_verified:boolean;

created_at:string;

updated_at?:string;

}