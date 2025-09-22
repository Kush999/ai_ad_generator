'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Coins, Plus, Loader2 } from 'lucide-react'
import { database, UserProfile } from '@/lib/database'
import { useAuth } from '@/contexts/AuthContext'

interface CreditsDisplayProps {
  onPurchaseClick?: () => void
}

export function CreditsDisplay({ onPurchaseClick }: CreditsDisplayProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadUserProfile()
    }
  }, [user, loadUserProfile])

  const loadUserProfile = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await database.getOrCreateUserProfile(user.id)
      if (error) {
        console.error('Error loading user profile:', error)
      } else {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }, [user])


  if (loading) {
    return (
      <Card className="px-4 py-2 bg-muted/50 border-border/50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </Card>
    )
  }

  if (!userProfile) {
    return null
  }

  const isLowCredits = userProfile.credits < 20
  const isOutOfCredits = userProfile.credits < 10

  return (
    <div className="flex items-center space-x-3">
      {/* Credits Display */}
      <Card className={`px-4 py-2 border ${
        isOutOfCredits ? 'border-red-200 bg-red-50' : 
        isLowCredits ? 'border-amber-200 bg-amber-50' : 
        'border-border/50 bg-muted/50'
      }`}>
        <div className="flex items-center space-x-2">
          <Coins className={`h-4 w-4 ${
            isOutOfCredits ? 'text-red-600' : 
            isLowCredits ? 'text-amber-600' : 
            'text-primary'
          }`} />
          <span className={`text-sm font-medium ${
            isOutOfCredits ? 'text-red-700' : 
            isLowCredits ? 'text-amber-700' : 
            'text-foreground'
          }`}>
            {userProfile.credits} credits
          </span>
        </div>
      </Card>

      {/* Purchase Button (only show if low on credits) */}
      {(isLowCredits || isOutOfCredits) && (
        <Button
          onClick={onPurchaseClick}
          size="sm"
          variant={isOutOfCredits ? "default" : "outline"}
          className={`h-8 px-3 text-xs font-medium ${
            isOutOfCredits ? 
            'bg-primary hover:bg-primary/90 text-primary-foreground' : 
            'border-primary/50 text-primary hover:bg-primary/10'
          }`}
        >
          <Plus className="h-3 w-3 mr-1" />
          {isOutOfCredits ? 'Buy Credits' : 'Add Credits'}
        </Button>
      )}
    </div>
  )
}

// Export the update function for use in parent components
export { CreditsDisplay as default }
