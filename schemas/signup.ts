import { z } from "zod";

export const usernameValidation : z.ZodString = z.string()
                            .min(5,"UserName must be atleast 5 characters")
                            .max(10,"UserName must contain atmax 10 characters")
                            .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")

export const SignUpValidation : z.ZodObject=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"password must be atleast 6 characters"})
                            .max(10,{message:"password must be atmax 10 characters"})
})