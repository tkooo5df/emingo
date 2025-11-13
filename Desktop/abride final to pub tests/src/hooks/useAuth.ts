import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  language: string | null;
  wilaya: string | null;
  commune: string | null;
  address: string | null;
  age: number | null;
  ksar: string | null;
  date_of_birth: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          // If there's an auth error, clear the session
          if (error.message.includes('Invalid Refresh Token') || error.message.includes('Refresh Token Not Found')) {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Clear profile when signing out
          if (event === 'SIGNED_OUT') {
            setProfile(null);
          }
          
          // Handle auth errors
          if (event === 'TOKEN_REFRESHED' && !session) {
            setProfile(null);
          }
          
          // 🔥 NEW: Send welcome notification after email confirmation (only once)
          if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            // Check if email is confirmed and welcome notification hasn't been sent
            if (session.user.email_confirmed_at) {
              const welcomeSentKey = `welcome_sent_${session.user.id}`;
              const welcomeSent = localStorage.getItem(welcomeSentKey);
              
              if (!welcomeSent) {
                // Fetch profile to get role
                try {
                  const { data: profileData } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .maybeSingle();
                  
                  if (profileData?.role) {
                    // Check if welcome email was already sent (from profiles table)
                    const { data: profileCheck } = await supabase
                      .from('profiles')
                      .select('welcome_email_sent')
                      .eq('id', session.user.id)
                      .maybeSingle();
                    
                    // Only send if not already sent
                    if (!profileCheck?.welcome_email_sent) {
                      const { NotificationService } = await import('@/integrations/database/notificationService');
                      await NotificationService.notifyWelcomeUser(session.user.id, profileData.role);
                      localStorage.setItem(welcomeSentKey, 'true');
                    } else {
                      // Already sent, mark as sent in localStorage
                      localStorage.setItem(welcomeSentKey, 'true');
                    }
                  }
                } catch (error) {
                  // Don't fail auth flow if notification fails
                  // Silent fail
                }
              }
            }
          }
        } catch (error) {
          setSession(null);
          setUser(null);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // First, try to get the profile with all required fields
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, first_name, last_name, phone, role, avatar_url, is_verified, language, age, ksar, wilaya, commune, address, created_at, updated_at')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
      }

      // Read user metadata to normalize role
      const { data: userData } = await supabase.auth.getUser();
      const metadata = userData.user?.user_metadata || {};
      const normalizedRole = (metadata.role === 'driver'
        || metadata.role === 'passenger'
        || metadata.role === 'admin'
        || metadata.role === 'developer')
        ? metadata.role
        : 'passenger';

      // If profile exists but role mismatches metadata, update it to ensure UI reflects correct dashboard
      if (data && normalizedRole && data.role !== normalizedRole) {
        try {
          const { data: updated, error: updateError } = await supabase
            .from('profiles')
            .update({ role: normalizedRole, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select('id, email, full_name, first_name, last_name, phone, role, avatar_url, is_verified, language, age, ksar, wilaya, commune, address, created_at, updated_at')
            .maybeSingle();

          if (!updateError && updated) {
            return updated as Profile;
          }
        } catch (updateErr) {
        }
      }

      // If no profile exists, synthesize one from metadata without attempting a client-side insert
      if (!data) {
        if (userData.user) {
          const fallbackProfile: Profile = {
            id: userId,
            email: userData.user.email || null,
            full_name: metadata.full_name || metadata.name || null,
            first_name: metadata.first_name || null,
            last_name: metadata.last_name || null,
            phone: metadata.phone || null,
            role: normalizedRole,
            avatar_url: metadata.avatar_url || metadata.avatarURL || null,
            language: metadata.language || 'ar',
            wilaya: metadata.wilaya || null,
            commune: metadata.commune || null,
            address: metadata.address || null,
            age: metadata.age || null,
            ksar: metadata.ksar || null,
            date_of_birth: metadata.date_of_birth || null,
            is_verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          return fallbackProfile;
        }
      }

      return data as (Profile | null);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const profileData = await fetchProfile(user.id);
        setProfile(profileData);
      };

      fetchUserProfile();
      
      // Set up real-time subscription for profile changes
      const profileSubscription = supabase
        .channel('profile_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === 'UPDATE') {
              setProfile(payload.new as Profile);
            }
          }
        )
        .subscribe();

      return () => {
        profileSubscription.unsubscribe();
      };
    } else {
      setProfile(null);
    }
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };
    
    // التحقق من حالة الحساب الموقوف
    try {
      const { BrowserDatabaseService } = await import('@/integrations/database/browserServices');
      const isSuspended = await BrowserDatabaseService.isUserSuspended(user.id);
      if (isSuspended) {
        return { error: 'تم إيقاف حسابك. يرجى التواصل مع المدير لإعادة التفعيل.' };
      }
    } catch (error) {
      // نتابع التحديث حتى لو فشل فحص الحالة
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      return { error: error.message };
    }
    
    setProfile(data);
    return { data };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      // Don't expose the raw error to the console to avoid showing network errors
      // Create a more user-friendly error message
      let userFriendlyError = new Error("حدث خطأ أثناء تسجيل الدخول");
      
      if (error?.message?.includes("Invalid login credentials")) {
        userFriendlyError = new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else if (error?.message?.includes("Email not confirmed")) {
        userFriendlyError = new Error("يرجى تأكيد بريدك الإلكتروني أولاً");
      } else if (error?.message?.includes("Too many requests")) {
        userFriendlyError = new Error("محاولات كثيرة جداً، يرجى المحاولة لاحقاً");
      }
      
      throw userFriendlyError;
    }
  };

  return { 
    session, 
    user, 
    profile, 
    loading, 
    updateProfile, 
    signOut,
    signInWithGoogle,
    signIn
  };
};