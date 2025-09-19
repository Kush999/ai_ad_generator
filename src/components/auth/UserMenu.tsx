'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { User, LogOut } from 'lucide-react'

export function UserMenu() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    setLoading(false)
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div className="hidden sm:block">
          <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleSignOut}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <LogOut className="h-3 w-3" />
        {loading ? 'Signing out...' : 'Sign Out'}
      </Button>
    </div>
  )
}
