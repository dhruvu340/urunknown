
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/models/model";




export async function POST(request:Request){
    await dbConnect();

    try{
        const {username,code}=await request.json();
        const decodeusername=decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodeusername});
        if(!user){
             return Response.json({
            success:false,
            message:"user not found",
        },{status:400})
        }

        const iscode=user.verifyCode===code;
        const iscodenotexpire=new Date(user.verifyCodeExpiry) > new Date()

        if(iscode&&iscodenotexpire){
            user.isverified=true
            await user.save();
        }else if(!iscodenotexpire){
            return Response.json({
            success:false,
            message:"verification code expired",
        },{status:400})
        }else{
            return Response.json({
            success:false,
            message:"code is incorrect",
        },{status:400})
        }


        return Response.json({
            success:true,
            message:"user verified",
        },{status:200})
    }catch(error){
        console.error('error verifying user',error);
        return Response.json({
            success:false,
            message:"error verifying user",
        },{status:400})
    }
}