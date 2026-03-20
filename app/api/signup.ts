import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helper/sendVerificationMail";
import UserModel from "../models/model";

export async function POST(req: Request):Promise<Response> {
  await dbConnect();

  try {
    const { username, password, email } = await req.json();

    
    const existingUserByUserName = await UserModel.findOne({
      userName: username,
      isverified: true,
    });

    if (existingUserByUserName) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 3600000);

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      if (existingUser.isverified) {
        return Response.json(
          { success: false, message: "Email already registered" },
          { status: 400 }
        );
      }

      
      existingUser.password = await bcrypt.hash(password, 10);
      existingUser.verifyCode = otp;
      existingUser.verifyCodeExpiry = expiryDate;

      await existingUser.save();
    } else {
      const hashPass = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        userName: username,
        email,
        password: hashPass,
        verifyCode: otp,
        verifyCodeExpiry: expiryDate,
        isverified: false,
        isAccepting: true,
        message: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      otp
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registering user:", error);

    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}