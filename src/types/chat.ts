// src/types/chat.ts

export interface ChatMessage{

id?:string;

role:"AI" | "USER" | "SYSTEM";

content:string;

language?:string;

createdAt?:string;

}