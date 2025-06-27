
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  user_type: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async (userId: string, userEmail?: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const defaultName = userEmail ? userEmail.split('@')[0] : 'User';
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: defaultName,
            user_type: 'promoter'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return null;
        }
        return newProfile as Profile;
      }

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  const refreshProfile = async (user: User | null) => {
    if (user?.id) {
      const profileData = await fetchProfile(user.id, user.email);
      setProfile(profileData);
    }
  };

  return {
    profile,
    setProfile,
    fetchProfile,
    refreshProfile
  };
};
