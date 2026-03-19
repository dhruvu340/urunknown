import mongoose , { Schema , Document} from "mongoose";

export interface Message extends Document{
    content : string ,
    createdAt: Date ,
    updatedAt: Date ,
}

const MessageSchema : Schema<Message> = new Schema ( {
    content : { type : String , required:true} ,
    createdAt : {
        type: Date,
        required : true,
        default:Date.now,
    }
} )



export interface User extends Document{
    userName : string ,
    email:string,
    password: string ,
    verifyCode:string ,
    verifyCodeExpiry:Date,
    isverified:boolean,
    isAccepting:boolean,
    message : Message[],
}


const UserSchema : Schema<User> = new Schema ( {
    userName : {type:String,required:[true,"UserName is reuired"],trim:true,unique:true} ,
    email:{type:String,required:[true,"Email is reuired"],trim:true,unique:true,match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,'please use a valid email address']},
    password: {type:String,required:[true,"Password is required"],trim:true} ,
    verifyCode:{type:String,required:[true,"code is required"]} ,
    verifyCodeExpiry:{type:Date,required:[true,"expiry is required"]},
    isverified:{type:Boolean,default:false},
    isAccepting:{type:Boolean,default:true},
    message : [MessageSchema],
} )


const UserModel = (mongoose.models.User as mongoose.Model<User>) || (
    mongoose.model<User>("Userofmessage",UserSchema)
)


export default UserModel;



