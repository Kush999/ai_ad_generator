import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {/* Logo Icon */}
      <div className={cn("relative", sizeClasses[size])}>
        {/* Outer blue ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 p-1">
          {/* Inner white circle */}
          <div className="h-full w-full rounded-full bg-white p-2">
            {/* Gear */}
            <div className="absolute bottom-1 left-1 h-3 w-3">
              <svg viewBox="0 0 24 24" className="h-full w-full">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  fill="#1e40af"
                  fillOpacity="0.1"
                />
                <path
                  d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
                  fill="#1e40af"
                />
                <circle cx="12" cy="12" r="2" fill="white" />
                {/* Gear teeth */}
                <rect x="10" y="2" width="4" height="2" rx="1" fill="#1e40af" />
                <rect x="10" y="20" width="4" height="2" rx="1" fill="#1e40af" />
                <rect x="2" y="10" width="2" height="4" rx="1" fill="#1e40af" />
                <rect x="20" y="10" width="2" height="4" rx="1" fill="#1e40af" />
                <rect x="5.5" y="5.5" width="2" height="2" rx="1" fill="#1e40af" transform="rotate(45 6.5 6.5)" />
                <rect x="16.5" y="16.5" width="2" height="2" rx="1" fill="#1e40af" transform="rotate(45 17.5 17.5)" />
                <rect x="16.5" y="5.5" width="2" height="2" rx="1" fill="#1e40af" transform="rotate(-45 17.5 6.5)" />
                <rect x="5.5" y="16.5" width="2" height="2" rx="1" fill="#1e40af" transform="rotate(-45 6.5 17.5)" />
              </svg>
            </div>
            
            {/* Speech Bubble */}
            <div className="absolute top-1 left-1 h-3 w-3">
              <svg viewBox="0 0 24 24" className="h-full w-full">
                <path
                  d="M8 2c-3.31 0-6 2.69-6 6v4c0 3.31 2.69 6 6 6h1v3l4-3h3c3.31 0 6-2.69 6-6V8c0-3.31-2.69-6-6-6H8z"
                  fill="#9ca3af"
                  fillOpacity="0.8"
                />
                <path
                  d="M8 4h8c2.21 0 4 1.79 4 4v4c0 2.21-1.79 4-4 4h-2.5l-2.5 2v-2H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z"
                  fill="#e5e7eb"
                />
                <path
                  d="M6 12h8v2H6v-2zm0-3h8v2H6V9z"
                  fill="#6b7280"
                />
                {/* Speech bubble tail */}
                <path
                  d="M6 16l2-2h2l-2 2z"
                  fill="#e5e7eb"
                />
              </svg>
            </div>
            
            {/* Wing */}
            <div className="absolute top-0 right-0 h-4 w-4">
              <svg viewBox="0 0 24 24" className="h-full w-full">
                <path
                  d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8z"
                  fill="#3b82f6"
                  fillOpacity="0.2"
                />
                <path
                  d="M16 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  fill="#3b82f6"
                />
                <path
                  d="M18 6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                  fill="#60a5fa"
                />
                {/* Wing feather details */}
                <path
                  d="M14 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  fill="#93c5fd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={cn("font-bold text-foreground", textSizeClasses[size])}>
          AdCraft Studio
        </span>
      )}
    </div>
  )
}
