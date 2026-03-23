"use client"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import Link from "next/link"
import { useDebounceValue } from "usehooks-ts"
import * as z from "zod"
import axios, { AxiosError } from "axios"
import { SignUpValidation } from "@/schemas/signup"
import { ApiResponse } from "@/types/apiResponse"
import { toast } from "sonner"
import { useRouter } from "next/navigation" 
import {
  Field,
 
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const page = () => {

  const [username, setusername] = useState('')
  const [usernameMessage, setusernameMessage] = useState('')
  const [ischeckingusername, setischeckingusername] = useState(false)

  const [issubmiting, setissubmiting] = useState(false)

  const [debounceUsername] = useDebounceValue(username, 300) 

  const router = useRouter()

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debounceUsername) {
        setischeckingusername(true)
        setusernameMessage("")

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${debounceUsername}`
          )
          setusernameMessage(response.data.message) 
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setusernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        } finally {
          setischeckingusername(false)
        }
      }
    }

    checkUsernameUnique() // ✅ fixed
  }, [debounceUsername])

  const onSubmit = async (data: z.infer<typeof SignUpValidation>) => {
    setissubmiting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      if (response?.data.success) {
        toast.success(response?.data.message)
        router.replace(`/verify/${username}`)
      } else {
        toast.error(response?.data.message)
      }
    } catch (error) {
      toast.error("Error in Sign-up of user")
      const axiosError = error as AxiosError<ApiResponse>
      const messageError = axiosError.response?.data.message
      toast.error(messageError)
    } finally {
      setissubmiting(false)
    }
  }

  return (
   <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black to-gray-900 px-4">
    
    <div className="w-full max-w-lg p-6 sm:p-10 space-y-6 bg-white rounded-2xl shadow-xl">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Join Urunknown 
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Create your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* USERNAME */}
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="text-base font-semibold">
                Username
              </FieldLabel>

              <Input
                {...field}
                value={field.value as string ?? ""}
                placeholder="Enter username"
                className="h-12 text-base px-4 
                placeholder:text-gray-400 placeholder:text-sm
                focus:ring-2 focus:ring-black"
                onChange={(e) => {
                  field.onChange(e.target.value)
                  setusername(e.target.value)
                }}
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

        {/* EMAIL */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="text-base font-semibold">
                Email
              </FieldLabel>

              <Input
                {...field}
                value={field.value as string ?? ""}
                placeholder="Enter email"
                className="h-12 text-base px-4 
                placeholder:text-gray-400 placeholder:text-sm
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
          )}
        />

        {/* PASSWORD */}
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
                className="h-12 text-base px-4 
                placeholder:text-gray-400 placeholder:text-sm
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
          )}
        />

        {/* BUTTON */}
        <Button
          type="submit"
          disabled={issubmiting}
          className="w-full h-12 text-base font-semibold rounded-lg 
          bg-black text-white hover:bg-gray-800 transition"
        >
          {issubmiting ? "Creating..." : "Sign Up"}
        </Button>

      </form>
    </div>
  </div>
  )
}

export default page