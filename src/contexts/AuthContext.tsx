
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userType: string | null;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, userEmail?: string) => {
    console.log('Fetching profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist, create a basic one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating basic profile...');
          const defaultName = userEmail ? userEmail.split('@')[0] : 'User';
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: defaultName,
              user_type: 'promoter' // default user type
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            return null;
          }

          console.log('Profile created successfully:', newProfile);
          return newProfile;
        }
        
        return null;
      }

      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      setLoading(true);
      const profileData = await fetchProfile(user.id, user.email);
      setProfile(profileData);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Setting up auth listener...');
    
    let isMounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'TOKEN_REFRESHED') {
          // Fetch profile for authenticated user
          const profileData = await fetchProfile(session.user.id, session.user.email);
          if (isMounted) {
            setProfile(profileData);
            setLoading(false);
          }
        } else if (!session) {
          // User signed out
          if (isMounted) {
            setProfile(null);
            setLoading(false);
          }
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.id, error);
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id, session.user.email);
          if (isMounted) {
            setProfile(profileData);
          }
        }
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initialize
    getInitialSession();

    return () => {
      console.log('Cleaning up auth listener');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      setProfile(null);
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      loading, 
      signOut, 
      userType: profile?.user_type || null,
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
