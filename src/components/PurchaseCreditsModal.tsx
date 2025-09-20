'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Coins, Check, Zap, CreditCard, Loader2 } from 'lucide-react'
import { database } from '@/lib/database'
import { useAuth } from '@/contexts/AuthContext'

interface PurchaseCreditsModalProps {
  isOpen: boolean
  onClose: () => void
  onPurchaseComplete?: () => void
}

export function PurchaseCreditsModal({ isOpen, onClose, onPurchaseComplete }: PurchaseCreditsModalProps) {
  const [purchasing, setPurchasing] = useState(false)
  const { user } = useAuth()

  if (!isOpen) return null

  const handlePurchase = async () => {
    if (!user) return
    
    setPurchasing(true)
    try {
      console.log('Creating Stripe checkout session for user:', user.id)
      
      // Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          credits: 1000, // 1000 credits for $10
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Checkout API error:', data.error)
        throw new Error(data.error || 'Failed to create checkout session')
      }

      console.log('Checkout session created, redirecting to:', data.url)

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received from Stripe')
      }

    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert(`Payment setup failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
      setPurchasing(false)
    }
    // Note: We don't set setPurchasing(false) in the success case because the user will be redirected
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-between items-start mb-4">
            <div></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-muted"
              disabled={purchasing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Coins className="h-8 w-8 text-primary" />
          </div>
          
          <CardTitle className="text-2xl mb-2">Purchase Credits</CardTitle>
          <CardDescription className="text-base">
            Get more credits to continue creating amazing advertisements
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Package Details */}
          <div className="border border-primary/20 rounded-2xl p-6 bg-primary/5">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold mb-2">$10</div>
              <div className="text-muted-foreground">One-time payment</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm font-medium">1,000 credits (100 generations)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm">Save all generated ads</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm">Priority generation speed</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm">High-resolution downloads</span>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="text-center p-4 bg-muted/30 rounded-xl">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Best Value</span>
            </div>
            <p className="text-xs text-muted-foreground">
              That's only $0.10 per advertisement - much cheaper than hiring a designer!
            </p>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full h-12 text-base font-semibold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            {purchasing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Purchase...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Purchase Credits - $10
              </>
            )}
          </Button>

          {/* Security Note */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Secure payment processing • Cancel anytime
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
