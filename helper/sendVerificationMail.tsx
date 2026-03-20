import VerifyEmailTemp from "@/emails/verificationEmail";
import { resend } from "@/lib/resend";



import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email:string,username:string,verifyCode:string
):Promise<ApiResponse>{

    try {
        await resend.emails.send({
            from:'onboarding@resend.dev',
            to:email,
            subject:'verfication email',
            react : VerifyEmailTemp({name : username,otp:verifyCode})
        })
        return {success:false,message:'verification mail send successfully'};
    } catch (emailError) {
        console.error("error sending verification email");

        return {success:false,message:'failed to send verification email'};
    }
}
