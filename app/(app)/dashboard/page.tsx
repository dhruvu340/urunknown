"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

const Dashboard = () => {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ callbackUrl: "/sign-in" })
  }

  return (
    <div className="flex justify-between items-center p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <Button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="bg-black text-white hover:bg-gray-800 transition"
      >
        {isSigningOut ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing out...
          </>
        ) : (
          "Sign Out"
        )}
      </Button>
    </div>
  )
}

export default Dashboard