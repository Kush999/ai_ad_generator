'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, Trash2, Download, Edit2, X, Check } from 'lucide-react'
import { database, GeneratedAd } from '@/lib/database'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'

interface SavedImagesProps {
  onRefresh?: () => void
}

export function SavedImages({ onRefresh }: SavedImagesProps) {
  const [savedAds, setSavedAds] = useState<GeneratedAd[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadSavedAds()
    }
  }, [user])

  const loadSavedAds = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await database.getUserAds(user.id)
      if (error) {
        console.error('Error loading saved ads:', error)
      } else {
        setSavedAds(data || [])
      }
    } catch (error) {
      console.error('Error loading saved ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (adId: string) => {
    if (!user) return
    
    if (window.confirm('Are you sure you want to delete this generated image?')) {
      try {
        const { error } = await database.deleteAd(adId, user.id)
        if (error) {
          console.error('Error deleting ad:', error)
        } else {
          setSavedAds(prev => prev.filter(ad => ad.id !== adId))
          onRefresh?.()
        }
      } catch (error) {
        console.error('Error deleting ad:', error)
      }
    }
  }

  const handleToggleFavorite = async (adId: string, currentFavorite: boolean) => {
    if (!user) return
    
    try {
      const { error } = await database.toggleFavorite(adId, user.id, !currentFavorite)
      if (error) {
        console.error('Error toggling favorite:', error)
      } else {
        setSavedAds(prev => prev.map(ad => 
          ad.id === adId ? { ...ad, is_favorite: !currentFavorite } : ad
        ))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const startEditing = (ad: GeneratedAd) => {
    setEditingId(ad.id)
    setEditTitle(ad.title)
  }

  const saveTitle = async () => {
    if (!editingId || !user || !editTitle.trim()) return
    
    try {
      const { error } = await database.updateAdTitle(editingId, user.id, editTitle.trim())
      if (error) {
        console.error('Error updating title:', error)
      } else {
        setSavedAds(prev => prev.map(ad => 
          ad.id === editingId ? { ...ad, title: editTitle.trim() } : ad
        ))
        setEditingId(null)
        setEditTitle('')
      }
    } catch (error) {
      console.error('Error updating title:', error)
    }
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditTitle('')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Saved Images</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse mb-4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (savedAds.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Saved Images</h2>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No saved images yet</p>
          <p className="text-sm text-muted-foreground">
            Generate and save your first AI image to see it here!
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Saved Images</h2>
        <p className="text-sm text-muted-foreground">
          {savedAds.length} saved image{savedAds.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {savedAds.map((ad) => (
          <Card key={ad.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="relative group">
              <img
                src={ad.generated_image_url}
                alt={ad.title}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
              
              {/* Action buttons overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDownload(ad.generated_image_url, ad.title)}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleToggleFavorite(ad.id, ad.is_favorite)}
                  className={`h-8 w-8 p-0 ${ad.is_favorite ? 'text-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${ad.is_favorite ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => startEditing(ad)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(ad.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Title editing */}
            {editingId === ad.id ? (
              <div className="flex gap-2 mb-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveTitle()
                    if (e.key === 'Escape') cancelEditing()
                  }}
                  className="text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={saveTitle} className="h-8 w-8 p-0">
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEditing} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                {ad.title}
                {ad.is_favorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
              </h3>
            )}
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Style: {ad.style}</p>
              <p>Created: {new Date(ad.created_at).toLocaleDateString()}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
