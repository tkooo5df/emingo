import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { uploadPendingAvatar } from '@/utils/avatarUpload';
import { TelegramService } from '@/integrations/telegram/telegramService';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(false);

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (!user || loading) return;
      
      setCheckingProfile(true);
      
      // Check if this is a Google sign-up in progress (from SignUp page)
      const isGoogleSignUp = localStorage.getItem('googleSignUpInProgress');
      // تحقق من الإرسال لكي لا يُرسل الإشعار سوى مرة واحدة فقط لهذا المستخدم
      const telegramNotified = localStorage.getItem('googleTelegramNotified');
      
      try {
        // 🔥 FIRST: Check if email exists in database BEFORE checking current user profile
        // This prevents new users from signing in with Google if they haven't created an account first
        if (!user.email) {
          await supabase.auth.signOut();
          localStorage.removeItem('googleSignUpInProgress');
          const errorMessage = 'لا يوجد بريد إلكتروني. يجب عليك إنشاء حساب جديد أولاً من صفحة التسجيل.';
          navigate('/auth/signin?error=no_email&message=' + encodeURIComponent(errorMessage));
          return;
        }

        // Check if ANY profile exists with this email (regardless of user ID)
        const { data: existingProfileByEmail, error: emailCheckError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        // If no profile exists with this email, REJECT sign-in
        if (!existingProfileByEmail || emailCheckError) {
          // Delete the newly created user and profile (if trigger created them)
          try {
            // First, try to delete the profile if it was auto-created
            await supabase.from('profiles').delete().eq('id', user.id);
          } catch (deleteError) {
            // Silent fail
          }
          
          await supabase.auth.signOut();
          localStorage.removeItem('googleSignUpInProgress');
          const errorMessage = `لا يوجد حساب بهذا العنوان (${user.email}). يجب عليك إنشاء حساب جديد بهذا العنوان من صفحة التسجيل أولاً (باستخدام البريد الإلكتروني وكلمة المرور)، ثم يمكنك تسجيل الدخول بـ Google لاحقاً.`;
          navigate('/auth/signin?error=no_account&message=' + encodeURIComponent(errorMessage) + '&email=' + encodeURIComponent(user.email));
          return;
        }

        // 🔥 CRITICAL: Check if existingProfileByEmail was just created (new Google account)
        // If it was created recently and has incomplete data, it's a new Google OAuth account - REJECT IT
        const existingProfileCreatedAt = new Date(existingProfileByEmail.created_at);
        const nowCheck = new Date();
        const existingTimeDiff = nowCheck.getTime() - existingProfileCreatedAt.getTime();
        const existingMinutesDiff = existingTimeDiff / (1000 * 60);
        const existingIsRecentlyCreated = existingMinutesDiff < 10;
        const existingHasIncompleteData = !existingProfileByEmail.first_name || !existingProfileByEmail.phone;
        
        // If the existing profile was just created and has incomplete data, it's a new Google account
        if (existingIsRecentlyCreated && existingHasIncompleteData) {
          // Delete the auto-created profile
          try {
            await supabase.from('profiles').delete().eq('id', user.id);
          } catch (deleteError) {
            // Silent fail
          }
          
          await supabase.auth.signOut();
          localStorage.removeItem('googleSignUpInProgress');
          const errorMessage = `لا يوجد حساب بهذا العنوان (${user.email}). يجب عليك إنشاء حساب جديد بهذا العنوان من صفحة التسجيل أولاً (باستخدام البريد الإلكتروني وكلمة المرور)، ثم يمكنك تسجيل الدخول بـ Google لاحقاً.`;
          navigate('/auth/signin?error=no_account&message=' + encodeURIComponent(errorMessage) + '&email=' + encodeURIComponent(user.email));
          return;
        }

        // Check if the existing profile belongs to a different user (email/password signup)
        const isDifferentUser = existingProfileByEmail.id !== user.id;

        // Check if user has completed basic profile information for current user ID
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, full_name, wilaya, age, ksar, role, phone, created_at, email, avatar_url')
          .eq('id', user.id)
          .single();
        
        // If existing profile belongs to different user, link accounts
        if (isDifferentUser) {
          // Link accounts - copy data from existing profile to new Google user
          // Get all fields from existing profile (including vehicle fields)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const existingProfileData = existingProfileByEmail as any;
            
          // Copy all data from existing profile to new Google profile
          const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id, // New Google user ID
              email: user.email,
              first_name: existingProfileData.first_name || user.user_metadata?.full_name?.split(' ')[0] || '',
              last_name: existingProfileData.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
              full_name: existingProfileData.full_name || user.user_metadata?.full_name || '',
              role: existingProfileData.role || 'passenger', // 🔥 Preserve role from existing account
              phone: existingProfileData.phone || null,
              wilaya: existingProfileData.wilaya || null,
              commune: existingProfileData.commune || null,
              address: existingProfileData.address || null,
              age: existingProfileData.age || null,
              ksar: existingProfileData.ksar || null,
              avatar_url: existingProfileData.avatar_url || user.user_metadata?.avatar_url || null,
              vehicle_brand: existingProfileData.vehicle_brand || null,
              vehicle_model: existingProfileData.vehicle_model || null,
              vehicle_year: existingProfileData.vehicle_year || null,
              vehicle_color: existingProfileData.vehicle_color || null,
              vehicle_plate: existingProfileData.vehicle_plate || null,
              vehicle_seats: existingProfileData.vehicle_seats || null,
              vehicle_category: existingProfileData.vehicle_category || null,
              onboarding_completed: existingProfileData.onboarding_completed || false,
              created_at: existingProfileData.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });
            
            if (updateError) {
              await supabase.auth.signOut();
              localStorage.removeItem('googleSignUpInProgress');
              const errorMessage = 'حدث خطأ أثناء ربط الحسابات. يرجى المحاولة مرة أخرى.';
              navigate('/auth/signin?error=link_failed&message=' + encodeURIComponent(errorMessage));
              return;
            }
          
          // Re-fetch the profile to continue
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name, full_name, wilaya, age, ksar, role, phone, created_at, email, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (!newProfile) {
            await supabase.auth.signOut();
            localStorage.removeItem('googleSignUpInProgress');
            const errorMessage = 'حدث خطأ أثناء ربط الحسابات. يرجى المحاولة مرة أخرى.';
            navigate('/auth/signin?error=link_failed&message=' + encodeURIComponent(errorMessage));
            return;
          }
          
          // Use the linked profile
          const isProfileComplete = !!newProfile && !!newProfile.email;
          
          if (!isProfileComplete) {
            await supabase.auth.signOut();
            localStorage.removeItem('googleSignUpInProgress');
            const errorMessage = 'الحساب غير مكتمل. يجب عليك إنشاء حساب جديد أولاً من صفحة التسجيل (باستخدام البريد الإلكتروني وكلمة المرور).';
            navigate('/auth/signin?error=incomplete_account&message=' + encodeURIComponent(errorMessage));
            return;
          }
          
          // Profile is complete, allow sign-in
          localStorage.removeItem('googleSignUpInProgress');
          
          // Send Telegram notification to admin and welcome notification to user
          if (isGoogleSignUp && !telegramNotified) {
            // Send Telegram notification to admin
            try {
              await TelegramService.notifyNewUser({
                userName: newProfile.full_name || `${newProfile.first_name} ${newProfile.last_name}`.trim() || user.email || 'مستخدم',
                userRole: newProfile.role as 'driver' | 'passenger' | 'admin' | 'developer',
                userEmail: user.email || '',
                userId: user.id,
              });
            } catch (telegramError) {
              // Silent fail
            }
            
            // Send welcome notification to user (only after email confirmation)
            // Check if email is confirmed
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (currentUser?.email_confirmed_at) {
              try {
                const { NotificationService } = await import('@/integrations/database/notificationService');
                await NotificationService.notifyWelcomeUser(user.id, newProfile.role);
              } catch (welcomeError) {
                // Silent fail
              }
            }
            
            localStorage.setItem('googleTelegramNotified', 'true');
          }
          
          navigate('/');
          return;
        }
        
        // Profile exists for current user ID - check if it was just auto-created
        if (error || !profile) {
          // Profile doesn't exist for current user, but email exists in different user
          // This shouldn't happen if isDifferentUser logic worked, but handle it anyway
          
          // 🔥 NEW: If profile doesn't exist but email exists, create profile from Google data
          // This ensures all Google OAuth users have profiles
          if (user.email && existingProfileByEmail) {
            // Extract name from Google metadata
            const googleName = user.user_metadata?.full_name || user.user_metadata?.name || '';
            const nameParts = googleName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            // Create profile with Google data
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                first_name: firstName,
                last_name: lastName,
                full_name: googleName,
                role: existingProfileByEmail.role || 'passenger',
                avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
                phone: existingProfileByEmail.phone || null,
                wilaya: existingProfileByEmail.wilaya || null,
                commune: existingProfileByEmail.commune || null,
                address: existingProfileByEmail.address || null,
                age: existingProfileByEmail.age || null,
                ksar: existingProfileByEmail.ksar || null,
                onboarding_completed: false,
              });
            
            if (createError) {
              await supabase.auth.signOut();
              localStorage.removeItem('googleSignUpInProgress');
              const errorMessage = 'حدث خطأ أثناء إنشاء الملف الشخصي. يرجى المحاولة مرة أخرى.';
              navigate('/auth/signin?error=profile_create_failed&message=' + encodeURIComponent(errorMessage));
              return;
            }
            
            // Re-fetch profile
            const { data: newProfile } = await supabase
              .from('profiles')
              .select('first_name, last_name, full_name, wilaya, age, ksar, role, phone, created_at, email, avatar_url')
              .eq('id', user.id)
              .single();
            
            if (!newProfile) {
              await supabase.auth.signOut();
              localStorage.removeItem('googleSignUpInProgress');
              const errorMessage = 'حدث خطأ أثناء إنشاء الملف الشخصي. يرجى المحاولة مرة أخرى.';
              navigate('/auth/signin?error=profile_create_failed&message=' + encodeURIComponent(errorMessage));
              return;
            }
            
            // Continue with profile check
            const isProfileComplete = !!newProfile && !!newProfile.email;
            
            if (!isProfileComplete) {
              await supabase.auth.signOut();
              localStorage.removeItem('googleSignUpInProgress');
              const errorMessage = 'الحساب غير مكتمل. يجب عليك إنشاء حساب جديد أولاً من صفحة التسجيل (باستخدام البريد الإلكتروني وكلمة المرور).';
              navigate('/auth/signin?error=incomplete_account&message=' + encodeURIComponent(errorMessage));
              return;
            }
            
            // Profile is complete, allow sign-in
            localStorage.removeItem('googleSignUpInProgress');
            
            // Send Telegram notification to admin and welcome notification to user
            if (isGoogleSignUp && !telegramNotified) {
              // Send Telegram notification to admin
              try {
                await TelegramService.notifyNewUser({
                  userName: newProfile.full_name || `${newProfile.first_name} ${newProfile.last_name}`.trim() || user.email || 'مستخدم',
                  userRole: newProfile.role as 'driver' | 'passenger' | 'admin' | 'developer',
                  userEmail: user.email || '',
                  userId: user.id,
                });
              } catch (telegramError) {
                // Silent fail
              }
              
              // Send welcome notification to user (only after email confirmation)
              // Check if email is confirmed
              const { data: { user: currentUser } } = await supabase.auth.getUser();
              if (currentUser?.email_confirmed_at) {
                try {
                  const { NotificationService } = await import('@/integrations/database/notificationService');
                  await NotificationService.notifyWelcomeUser(user.id, newProfile.role);
                } catch (welcomeError) {
                  // Silent fail
                }
              }
              
              localStorage.setItem('googleTelegramNotified', 'true');
            }
            
            navigate('/');
            return;
          }
        }
        
        // 🔥 STRICT CHECK: Verify this is NOT a new account created via Google OAuth
        // A legitimate account should have been created via email/password signup first
        const profileCreatedAt = new Date(profile.created_at);
        const nowProfile = new Date();
        const timeDiff = nowProfile.getTime() - profileCreatedAt.getTime();
        const minutesDiff = timeDiff / (1000 * 60);
        
        // Check if profile was created very recently (likely auto-created by trigger)
        const isRecentlyCreated = minutesDiff < 10; // 10 minutes threshold
        
        // Check if profile has incomplete data (typical of auto-created profiles)
        const hasIncompleteData = !profile.first_name || !profile.phone;
        
        // Check if this is the same profile we found by email (legitimate account)
        const isLegitimateAccount = existingProfileByEmail.id === user.id;
        
        // 🔥 CRITICAL CHECK: If profile was created recently AND has incomplete data
        // This means it's a new account created via Google OAuth - REJECT IT
        // Exception: Only allow if existingProfileByEmail has the SAME ID (legitimate account from email/password)
        // AND existingProfileByEmail has complete data (not a new account)
        const existingProfileHasCompleteData = existingProfileByEmail.first_name && existingProfileByEmail.phone;
        const isTrulyLegitimate = isLegitimateAccount && existingProfileHasCompleteData;
        
        if (isRecentlyCreated && hasIncompleteData && !isTrulyLegitimate) {
          // Delete the auto-created profile
          try {
            await supabase.from('profiles').delete().eq('id', user.id);
          } catch (deleteError) {
            // Silent fail
          }
          
          await supabase.auth.signOut();
          localStorage.removeItem('googleSignUpInProgress');
          const errorMessage = `لا يوجد حساب بهذا العنوان (${user.email}). يجب عليك إنشاء حساب جديد بهذا العنوان من صفحة التسجيل أولاً (باستخدام البريد الإلكتروني وكلمة المرور)، ثم يمكنك تسجيل الدخول بـ Google لاحقاً.`;
          navigate('/auth/signin?error=no_account&message=' + encodeURIComponent(errorMessage) + '&email=' + encodeURIComponent(user.email));
          return;
        }
        
        // Additional check: if profile exists but was created recently and has default role 'passenger'
        // and no first_name, it's likely a new Google OAuth account - REJECT IT
        if (isRecentlyCreated && profile.role === 'passenger' && !profile.first_name && !profile.phone) {
          // Delete the auto-created profile
          try {
            await supabase.from('profiles').delete().eq('id', user.id);
          } catch (deleteError) {
            // Silent fail
          }
          
          await supabase.auth.signOut();
          localStorage.removeItem('googleSignUpInProgress');
          const errorMessage = `لا يوجد حساب بهذا العنوان (${user.email}). يجب عليك إنشاء حساب جديد بهذا العنوان من صفحة التسجيل أولاً (باستخدام البريد الإلكتروني وكلمة المرور)، ثم يمكنك تسجيل الدخول بـ Google لاحقاً.`;
          navigate('/auth/signin?error=no_account&message=' + encodeURIComponent(errorMessage) + '&email=' + encodeURIComponent(user.email));
          return;
        }
        
        // 🔥 ADDITIONAL CHECK: If profile has same ID as user but was created recently
        // AND existingProfileByEmail has different ID, this means:
        // - existingProfileByEmail is from email/password signup (legitimate)
        // - profile is new from Google OAuth (should be rejected)
        // We should link accounts instead, but if profile is too new, reject it
        if (isLegitimateAccount && isRecentlyCreated && hasIncompleteData && existingProfileByEmail.id !== user.id) {
          // Delete the auto-created profile
          try {
            await supabase.from('profiles').delete().eq('id', user.id);
          } catch (deleteError) {
            // Silent fail
          }
          
          await supabase.auth.signOut();
          localStorage.removeItem('googleSignUpInProgress');
          const errorMessage = `لا يوجد حساب بهذا العنوان (${user.email}). يجب عليك إنشاء حساب جديد بهذا العنوان من صفحة التسجيل أولاً (باستخدام البريد الإلكتروني وكلمة المرور)، ثم يمكنك تسجيل الدخول بـ Google لاحقاً.`;
          navigate('/auth/signin?error=no_account&message=' + encodeURIComponent(errorMessage) + '&email=' + encodeURIComponent(user.email));
          return;
        }
        
        // Upload pending avatar if exists (from signup when session was not available)
        await uploadPendingAvatar(user.id);
        
        // 🔥 NEW: Ensure profile has all Google data saved
        if (profile && user.user_metadata) {
          const googleName = user.user_metadata.full_name || user.user_metadata.name || '';
          const nameParts = googleName.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          const googleAvatar = user.user_metadata.avatar_url || user.user_metadata.picture || null;
          
          const needsUpdate = 
            (!profile.first_name && firstName) ||
            (!profile.last_name && lastName) ||
            (!profile.avatar_url && googleAvatar) ||
            (!profile.full_name && googleName);
          
          if (needsUpdate) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                first_name: profile.first_name || firstName,
                last_name: profile.last_name || lastName,
                full_name: profile.full_name || googleName,
                avatar_url: profile.avatar_url || googleAvatar,
                email: user.email || profile.email,
              })
              .eq('id', user.id);
            
            if (!updateError) {
              // Re-fetch profile to get updated data
              const { data: updatedProfile } = await supabase
                .from('profiles')
                .select('first_name, last_name, full_name, wilaya, age, ksar, role, phone, created_at, email, avatar_url')
                .eq('id', user.id)
                .single();
              
              if (updatedProfile) {
                // Use updated profile
                Object.assign(profile, updatedProfile);
              }
            }
          }
        }
        
        // تحقق إذا كان صف profile موجود ويحتوي email فقط
        const isProfileComplete = !!profile && !!profile.email;
        
        if (!isProfileComplete) {
          // 🔥 NEW POLICY: If profile is incomplete, REJECT sign-in ALWAYS
          // User must create account via email/password first, then can use Google
          await supabase.auth.signOut();
          localStorage.removeItem('googleSignUpInProgress');
          const errorMessage = 'الحساب غير مكتمل. يجب عليك إنشاء حساب جديد أولاً من صفحة التسجيل (باستخدام البريد الإلكتروني وكلمة المرور)، ثم يمكنك تسجيل الدخول بـ Google لاحقاً.';
          navigate('/auth/signin?error=incomplete_account&message=' + encodeURIComponent(errorMessage));
          return;
        }
        
        // Profile is complete, allow sign-in
        localStorage.removeItem('googleSignUpInProgress');
        
        // Send Telegram notification to admin and welcome notification to user
        if (isGoogleSignUp && !telegramNotified) {
          // Send Telegram notification to admin
          try {
            await TelegramService.notifyNewUser({
              userName: profile.full_name || `${profile.first_name} ${profile.last_name}`.trim() || user.email || 'مستخدم',
              userRole: profile.role as 'driver' | 'passenger' | 'admin' | 'developer',
              userEmail: user.email || '',
              userId: user.id,
              });
            } catch (telegramError) {
              // Silent fail
            }
            
            // Send welcome notification to user (only after email confirmation)
            // Check if email is confirmed
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (currentUser?.email_confirmed_at) {
              try {
                const { NotificationService } = await import('@/integrations/database/notificationService');
                await NotificationService.notifyWelcomeUser(user.id, profile.role);
              } catch (welcomeError) {
                // Silent fail
              }
            }
          
          localStorage.setItem('googleTelegramNotified', 'true');
        }
        
        navigate('/');
      } catch (error) {
        // 🔥 NEW POLICY: Always reject sign-in if there's an error checking profile
        // User must have an existing account to use Google sign-in
        await supabase.auth.signOut();
        localStorage.removeItem('googleSignUpInProgress');
        const errorMessage = 'حدث خطأ أثناء التحقق من الحساب. إذا لم يكن لديك حساب، يجب عليك إنشاء حساب جديد أولاً من صفحة التسجيل (باستخدام البريد الإلكتروني وكلمة المرور).';
        navigate('/auth/signin?error=check_failed&message=' + encodeURIComponent(errorMessage));
      } finally {
        setCheckingProfile(false);
      }
    };

    if (!loading && user) {
      checkAndRedirect();
    } else if (!loading && !user) {
      // No user, redirect to sign in
      navigate('/auth/signin');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">جاري معالجة تسجيل الدخول...</h2>
          <p className="text-muted-foreground">يرجى الانتظار بينما نجهز حسابك</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
