import UserModel from "@/app/models/model";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";
import { success } from "zod";


export async function GET(request : Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
   
   if(!session||!session.user){
    return Response.json({
        success:true,
        message:"not authenticated"
    },{status:401})
   }
   const user : User = session?.user as User
   const userId=new mongoose.Types.ObjectId(user._id);
   try {
    const userfound = await UserModel.aggregate([
        { $match : {id :userId} },
        {$unwind: '$messages'},
        {$sort : {'messages.createdAt':-1}},
        {$group : {_id : '$_id',messages : {$push : "$messages"}}},   
    ])

    if(!userfound||userfound?.length===0){
        return Response.json({
            success : false ,
            message : "user not found"
        },{status : 401});
    }

    return Response.json({
            success : true ,
            message : userfound[0].messages,
        },{status : 200});
   } catch (error) {
    return Response.json({
            success : false ,
            message : "error while finding messages"
        },{status : 401});
   }
}