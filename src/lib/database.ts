import { supabase } from './supabase'

export interface GeneratedAd {
  id: string
  user_id: string
  title: string
  original_image_url: string
  generated_image_url: string
  style: string
  prompt?: string
  created_at: string
  is_favorite: boolean
}

export interface CreateAdData {
  title: string
  original_image_url: string
  generated_image_url: string
  style: string
  prompt?: string
}

// Database functions for generated ads
export const database = {
  // Get all ads for current user
  async getUserAds(userId: string): Promise<{ data: GeneratedAd[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('generated_ads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Save a new generated ad
  async saveAd(userId: string, adData: CreateAdData): Promise<{ data: GeneratedAd | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('generated_ads')
        .insert({
          user_id: userId,
          ...adData,
          is_favorite: false
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Delete an ad
  async deleteAd(adId: string, userId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('generated_ads')
        .delete()
        .eq('id', adId)
        .eq('user_id', userId) // Ensure user can only delete their own ads

      return { error }
    } catch (error) {
      return { error }
    }
  },

  // Toggle favorite status
  async toggleFavorite(adId: string, userId: string, isFavorite: boolean): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('generated_ads')
        .update({ is_favorite: isFavorite })
        .eq('id', adId)
        .eq('user_id', userId)

      return { error }
    } catch (error) {
      return { error }
    }
  },

  // Update ad title
  async updateAdTitle(adId: string, userId: string, title: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('generated_ads')
        .update({ title })
        .eq('id', adId)
        .eq('user_id', userId)

      return { error }
    } catch (error) {
      return { error }
    }
  }
}

// Storage functions for handling image uploads
export const storage = {
  // Upload original image to Supabase storage
  async uploadOriginalImage(file: File, userId: string): Promise<{ data: string | null; error: any }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}-original.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('user-images')
        .upload(fileName, file)

      if (error) return { data: null, error }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-images')
        .getPublicUrl(fileName)

      return { data: publicUrl, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get public URL for an image
  getPublicUrl(path: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from('user-images')
      .getPublicUrl(path)
    
    return publicUrl
  },

  // Delete an image from storage
  async deleteImage(path: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.storage
        .from('user-images')
        .remove([path])

      return { error }
    } catch (error) {
      return { error }
    }
  }
}
