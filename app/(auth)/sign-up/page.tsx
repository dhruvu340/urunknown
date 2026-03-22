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

  const [debounceUsername] = useDebounceValue(username, 300) // ✅ fixed

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
          setusernameMessage(response.data.message) // ✅ fixed
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
    <div className="flex justify-center items-center min-h-screen bg-orange-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md"> {/* ✅ fixed */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Urunknown
          </h1>
          <p className="mb-4">
            Sign up
          </p>
        </div>
        <form id="sign-up" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-col justify-between">
          <Controller 
          name="username"
          control={form.control}
          render={({field,fieldState})=>(
            <Field>
              <FieldLabel htmlFor="username" className="text-lg">
              Enter Username
              </FieldLabel>
              <Input {...field} value={field.value as string ?? ""} id="username" placeholder="Username" className="text-lg" onChange={(e)=>{field.onChange(e.target.value)
                setusername(e.target.value)
              }}/>
              {<div className="min-h-[20px]">
  {fieldState.invalid && (
    <FieldError errors={[fieldState.error]} />
  )}
</div>}  
            </Field>
            )
          }
            />

            <Controller 
          name="email"
          control={form.control}
          render={({field,fieldState})=>(
            <Field>
              <FieldLabel htmlFor="email" className="text-lg">
              Enter Email
              </FieldLabel>
              <Input {...field} id="Email" placeholder="Email" className="text-lg" value={field.value as string ?? ""}/>
              {<div className="min-h-[20px]">
  {fieldState.invalid && (
    <FieldError errors={[fieldState.error]} />
  )}
</div>}  
            </Field>
            )
          }
            />

            <Controller 
          name="password"
          control={form.control}
          render={({field,fieldState})=>(
            <Field>
              <FieldLabel htmlFor="pasword" className="text-lg">
              Enter Password
              </FieldLabel>
              <Input {...field} id="password" placeholder="Password" className="text-lg" value={field.value as string ?? ""}/>
              {<div className="min-h-[20px]">
  {fieldState.invalid && (
    <FieldError errors={[fieldState.error]} />
  )}
</div>}  
            </Field>
            )
          }
            />

        </FieldGroup>

        <Button  className="mt-10" type="submit" disabled={issubmiting}>
            Signup
        </Button>

        </form>
      </div>
    </div>
  )
}

export default page