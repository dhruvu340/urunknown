"use client"
import { VerifySchema } from '@/schemas/verify'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import React , {useState} from 'react'
import { useForm ,Controller } from 'react-hook-form'
import * as z from 'zod'
import { toast } from "sonner"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { Loader2 } from "lucide-react"

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
const Page = () => {
  const router=useRouter();
  const param=useParams<{username: string}>();
  const [isSubmitting,setIsSubmitting]=useState(false);
  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver:zodResolver(VerifySchema),
    defaultValues:{
        code : ""
    }
  })

  const onSubmit=async (data : z.infer<typeof VerifySchema>)=>{
      setIsSubmitting(true);
      try {
        const response = await axios.post('/api/verify-code',{
          username : param.username,
          code : data.code
        })

        if(!response.data.success){
          toast.error(response?.data.message);
          
        }else{
        toast.success(response?.data.message)
        router.replace("/sign-in");
        }
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message);
      }finally{
        setIsSubmitting(false);
      }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black to-gray-900 px-4">
      <div className="w-full max-w-lg p-6 sm:p-10 space-y-6 bg-white rounded-2xl shadow-xl">

        
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Join Urunknown
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Verify Your Account
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5' >
          <Controller
            name="code"
            control={form.control}
            render = {({field,fieldState})=>
                <Field>
                  <FieldLabel className='text-base font-semibold'>
                    Verify Code
                  </FieldLabel>
                  <Input {...field} 
                  value={field.value as string ?? ""}
                  placeholder='Enter Verification Code'
                  className="h-12 text-base px-4 pr-10
                  focus:ring-2 focus:ring-black"
                  />

                  <div className="min-h-[18px] mt-1">
                  {fieldState.error && (
                    <FieldError
                      className="text-xs text-red-500"
                      errors={[fieldState.error]}
                    />
                  )}
                </div>

                </Field>

            }  
            />



            <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base font-semibold rounded-lg 
            bg-black text-white hover:bg-gray-800 transition flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          
        </form>  
      </div>
    </div>
  )
}

export default Page