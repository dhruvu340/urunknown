import {z} from "zod";

export const MessageSchema = z.object ( {
     content : z.string().min(10,{message:'content must be 10 min characters'})
     .max(300,{message:'content atmax have 300 characters'}),
} )