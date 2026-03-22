import UserModel from "@/app/models/model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/app/models/model";
export async function POST(request : Request){
    await dbConnect();

    const {username , content }=await request.json();
    try {
     const user = await UserModel.findOne({username});
     if(!user){
        return Response.json({
            success : false ,
            message : "user not found"
        },{status : 401})
     }


     if(!user.isAccepting){
        return Response.json({
            success : false ,
            message : "user is not accepting messages"
        },{status : 403})
     }

     const newmessage={content ,createdAt:new Date()}

     user.messages.push(newmessage as Message);
     await user.save();
     return Response.json({
            success : true ,
            message : "Message sent successfully"
        },{status : 200})
        
    } catch (error) {
        return Response.json({
            success : false ,
            message : "error while sending messages"
        },{status : 401})
    }
}
