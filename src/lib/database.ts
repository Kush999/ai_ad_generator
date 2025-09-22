import { supabase, supabaseAdmin } from './supabase'

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

export interface UserProfile {
  id: string
  user_id: string
  credits: number
  total_credits_purchased: number
  created_at: string
  updated_at: string
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
  },

  // Get user profile with credits
  async getUserProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Create user profile (fallback if trigger doesn't work)
  async createUserProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          credits: 50,
          total_credits_purchased: 0
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get or create user profile
  async getOrCreateUserProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    try {
      // First try to get existing profile
      let { data, error } = await this.getUserProfile(userId)
      
      // If profile doesn't exist, create it
      if (error && error.code === 'PGRST116') {
        const createResult = await this.createUserProfile(userId)
        return createResult
      }

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Deduct credits for image generation
  async deductCredits(userId: string, creditsToDeduct: number = 10): Promise<{ data: UserProfile | null; error: any }> {
    try {
      // Get current credits
      const { data: profile, error: getError } = await this.getOrCreateUserProfile(userId)
      
      if (getError || !profile) {
        return { data: null, error: getError || new Error('Profile not found') }
      }

      // Check if user has enough credits
      if (profile.credits < creditsToDeduct) {
        return { data: null, error: new Error('Insufficient credits') }
      }

      // Deduct credits
      const newCredits = profile.credits - creditsToDeduct
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ credits: newCredits })
        .eq('user_id', userId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Add credits (for purchases)
  async addCredits(userId: string, creditsToAdd: number): Promise<{ data: UserProfile | null; error: any }> {
    try {
      console.log(`Adding ${creditsToAdd} credits to user ${userId}`);

      // Use service-role client if available (webhooks run without a user session)
      const db = supabaseAdmin ?? supabase

      // Fetch existing profile without RLS restrictions when using admin
      let { data: profile, error: getError } = await db
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (getError) {
        console.error('Error fetching profile:', getError)
        return { data: null, error: getError }
      }

      // If profile doesn't exist, create it with initial credits
      if (!profile) {
        console.log('Profile not found. Creating a new one for user:', userId)
        const { data: created, error: createErr } = await db
          .from('user_profiles')
          .insert({
            user_id: userId,
            credits: 0,
            total_credits_purchased: 0,
          })
          .select()
          .single()

        if (createErr) {
          console.error('Error creating user profile:', createErr)
          return { data: null, error: createErr }
        }
        profile = created
      }

      console.log('Current profile:', profile)

      // Add credits
      const newCredits = profile.credits + creditsToAdd
      const newTotalPurchased = profile.total_credits_purchased + creditsToAdd

      console.log(`Updating credits: ${profile.credits} + ${creditsToAdd} = ${newCredits}`)
      console.log(`Updating total purchased: ${profile.total_credits_purchased} + ${creditsToAdd} = ${newTotalPurchased}`)

      const { data, error } = await db
        .from('user_profiles')
        .update({
          credits: newCredits,
          total_credits_purchased: newTotalPurchased,
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating credits in database:', error)
      } else {
        console.log('Successfully updated credits in database:', data)
      }

      return { data, error }
    } catch (error) {
      console.error('Exception in addCredits:', error);
      return { data: null, error }
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
