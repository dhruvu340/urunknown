import { Message } from "@/app/models/model";

export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingMessages?: boolean ;
    messages?:Array<Message>
}