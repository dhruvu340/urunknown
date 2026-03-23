"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Loader2 } from "lucide-react"

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoginSchema } from "@/schemas/login"
import { signIn } from "next-auth/react"

const Page = () => {
 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  
  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
  setIsSubmitting(true)        // ✅ add
  try {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })
    if (result?.error) toast.error("Incorrect Username or Password")
    if (result?.url) {toast.success("logged in") 
        router.replace("/dashboard")}
  } finally {
    setIsSubmitting(false)     
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
            Create your account
          </p>
        </div>

       
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          
          <Controller
            name="identifier"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel className="text-base font-semibold">
                  Email/Username
                </FieldLabel>

                <Input
                  {...field}
                  value={field.value as string?? ""}
                  placeholder="Email/Password"
                  className="h-12 text-base px-4 focus:ring-2 focus:ring-black"
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
            )}
          />

          
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel className="text-base font-semibold">
                  Password
                </FieldLabel>

                <Input
                  {...field}
                  type="password"
                  value={field.value as string ?? ""}
                  placeholder="Enter password"
                  className="h-12 text-base px-4 focus:ring-2 focus:ring-black"
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
            )}
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