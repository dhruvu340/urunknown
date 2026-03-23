"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut({ callbackUrl: "/sign-in" })
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Could not sign out. Try again.")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <nav className="w-full border-b bg-white px-6 py-4 flex items-center justify-between">
      
      {/* logo */}
      <Link href="/" className="text-xl font-bold text-black">
        Urunknown
      </Link>

      {/* right side */}
      {session ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:block">
            {user?.username || user?.email}
          </span>
          <Button
            onClick={handleSignOut}
            disabled={isSigningOut}
            variant="outline"
            size="sm"
          >
            {isSigningOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              "Sign out"
            )}
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
              Sign up
            </Button>
          </Link>
        </div>
      )}

    </nav>
  )
}

export default Navbar