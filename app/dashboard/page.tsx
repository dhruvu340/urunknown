"use client"
import { useSession } from 'next-auth/react'
import React from 'react'

const Page = () => {
    const {data : session}=useSession();
  return (
    <div>Dashboard user is : {session?.user?.email}</div>
  )
}

export default Page