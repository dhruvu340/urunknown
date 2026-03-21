import "next-auth"
import { DefaultSession } from "next-auth"
declare module 'next-auth' {
    interface User { 
        _id?:string,
        isverified?:boolean,
        isAccepting?:boolean,
        userName?:string
    }
    interface Session { 
        user:{
        _id?:string,
        isverified?:boolean,
        isAccepting?:boolean,
        userName?:string
    } & DefaultSession['user']
    }
}


declare module 'next-auth/jwt'{
    interface JWT{

        _id?:string,
        isverified?:boolean,
        isAccepting?:boolean,
        userName?:string
        
    }
}