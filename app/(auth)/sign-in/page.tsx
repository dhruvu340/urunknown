"use client"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import Link from "next/link"
import {useDebounceValue} from "usehooks-ts";
import * as z from "zod"
import axios , {AxiosError} from "axios"
import { SignUpValidation } from "@/schemas/signup"
import { ApiResponse } from "@/types/apiResponse"


const page = () => {
  const [username,setusername]=useState('');
  const [usernameMessage,setusernameMessage]=useState('');
  const [ischeckingusername,setischeckingusername]=useState(false);

  const [issubmiting,setissubmiting]=useState(false);
  const debounceUsername=useDebounceValue(username,300);

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver:zodResolver(SignUpValidation),
    defaultValues:{
      username:"",
      email:"",
      password:""
    }
  })

  useEffect(
    ()=>{
      const checkUsernameUnique=async()=>{
        if(debounceUsername){
          setischeckingusername(true);
          setusernameMessage("");
          try {
            const response = await axios.get(`/api/check-username-unique?username=${debounceUsername}`);
            setusername(response.data.message);
          } catch (error) {
            const axiosError= error as AxiosError<ApiResponse>;
            setusernameMessage(axiosError.response?.data.message??"Error checking username");
          }finally{
            setischeckingusername(false);
          }
        }
      }
    },
    [debounceUsername]
  )

  
  return (
    <div>Page</div>
  )
}

export default page