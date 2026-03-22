import {z} from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/model";

import { usernameValidation } from "@/schemas/signup";

const UserNameQuerySchema=z.object({
    username:usernameValidation,
})

export async function GET(request:Request){
    if(request.method!=='GET'){
         return Response.json({
                success:false,
                message:"Method not allowed"
            },{status:405})
    }
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username : searchParams.get('username'),
        }
        //validate with zod

        const datar = UserNameQuerySchema.safeParse(queryParam);
        if(!datar.success){
            const usernameerrors=datar.error.format().username?._errors||[];
            return Response.json({
                success:false,
                message:usernameerrors?.length>0 ? usernameerrors.join(', '):"invalid query parameters",
            },{status:400})
        }

        const {username}=datar?.data;

        const findUser= await UserModel.findOne({username,isverified:true})
        if(findUser){
             return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:400})
        }

         return Response.json({
                success:true,
                message:"username is available"
            },{status:201})



    } catch (error) {
        console.error("Error checking username : ", error);
        return Response.json({
            success:false,
            message:"error checking username",
        },{status:500})
    }
}
