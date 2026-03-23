import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import bcrypt from "bcrypt"
import UserModel from "@/app/models/model"
import dbConnect from "@/lib/dbConnect"


export const authOptions : NextAuthOptions = {
    providers : [
        
        
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                identifier:{label:"Email or Password",type:"text"},
                password:{label:"Password",type:"password"},
            
            },
            async authorize(credentials : any ):Promise<any>{
                
                try {
                    await dbConnect();
                   const user = await UserModel.findOne({
  $or: [
    { email: credentials.identifier },
    { username: credentials.identifier }
  ]
})
                    if(!user){
                        throw new Error('No user Found with this email')
                    }

                    if(!user.isverified){
                        throw new Error('Please verify your account first')
                    }

                    const isSame= await bcrypt.compare(credentials.password,user.password);
                    if(!isSame){
                        throw new Error("Password is incorrect");
                    }else{
                        return user;
                    }

                    

                } catch (err:any) {
                    throw new Error(err.message || "Authentication failed");
                }
            }
        })
    ],
    pages : {
        signIn : "/sign-in",
       
    },
    session : {
        strategy : "jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,
    callbacks : {
        async session ({session,token}){
            if(token){
               session.user._id=token._id?.toString();
                session.user.isverified=token.isverified;
                session.user.isAccepting =token.isAccepting;
                session.user.userName=token.userName;
            }
            return session
        } , 

        async jwt ({token,user}) {
           
            if(user){
    
                token._id=user._id?.toString();
                token.isverified=user.isverified;
                token.isAccepting = user.isAccepting;
                token.userName=user.userName;
            }
            return token;
        }
    }
}