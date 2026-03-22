import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/model";
import {User} from "next-auth"

export async function POST(request:Request){
    await dbConnect();
   const session = await getServerSession(authOptions);
   
   if(!session||!session.user){
    return Response.json({
        success:true,
        message:"not authenticated"
    },{status:401})
   }

   const user = session?.user ;

   const userId=user._id;
   const {acceptMessages} =  await request.json();

   try {
   const user =  await UserModel.findByIdAndUpdate(
    userId,
    {$set : { isAccepting : acceptMessages }},
    {new:true}
   )

   if(!user){
        return Response.json({
        success:false,
        message:"failed to update user status"
    },{status:401})
   }

       return Response.json({
        success:true,
        message:"messageAcceptance status updated",
        user,
    },{status:200})
    
   } catch (error) {
        return Response.json({
        success:false,
        message:"failed some error occured to accept message",
    },{status:401})
   }

}