import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Car, User, Mail, Phone, MapPin, Eye, EyeOff, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Chrome, Settings, ArrowRight, Check } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { wilayas } from "@/data/wilayas";
import { resizeImage, uploadAvatar } from '@/utils/avatarUpload';

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("passenger");
  const [age, setAge] = useState("");
  const [ksar, setKsar] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Driver onboarding states
  const [showDriverOnboarding, setShowDriverOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [driverFormData, setDriverFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    age: "",
    ksar: "",
    wilaya: "",
    commune: "",
    address: "",
    
    // Vehicle Info
    vehicleBrand: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    plateNumber: "",
    seats: "",
    category: "",
  });

  // القصور الـ7 لواد مزاب
  const ksour = [
    { value: "قصر بريان", label: "قصر بريان" },
    { value: "قصر القرارة", label: "قصر القرارة" },
    { value: "قصر بني يزقن", label: "قصر بني يزقن" },
    { value: "قصر العطف", label: "قصر العطف" },
    { value: "قصر غرداية", label: "قصر غرداية" },
    { value: "قصر بنورة", label: "قصر بنورة" },
    { value: "قصر مليكة", label: "قصر مليكة" },
  ];

  const vehicleCategories = [
    { value: "economy", label: "اقتصادي" },
    { value: "comfort", label: "مريح" },
    { value: "premium", label: "فاخر" }
  ];

  // Check for role in URL parameters or hash
  useEffect(() => {
    const checkRole = () => {
      const roleParam = searchParams.get('role');
      const hash = window.location.hash;
      
      if (roleParam === 'driver' || hash === '#driver') {
        setRole('driver');
        setShowDriverOnboarding(true);
      } else if (roleParam === 'passenger' || hash === '#passenger') {
        setRole('passenger');
        setShowDriverOnboarding(false);
      }
    };

    checkRole();

    // Listen for hash changes
    const handleHashChange = () => {
      checkRole();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [searchParams]);

  // Pre-fill driver form when showDriverOnboarding becomes true
  useEffect(() => {
    if (showDriverOnboarding && (firstName || lastName || email || phone || age || ksar || wilaya || commune)) {
      setDriverFormData(prev => ({
        ...prev,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName,
        email: email || prev.email,
        phone: phone || prev.phone,
        age: age || prev.age,
        ksar: ksar || prev.ksar,
        wilaya: wilaya || prev.wilaya,
        commune: commune || prev.commune
      }));
    }
  }, [showDriverOnboarding, firstName, lastName, email, phone, age, ksar, wilaya, commune]);

  const validateForm = () => {
    if (!showDriverOnboarding) {
      // Regular signup validation
      if (!firstName.trim()) {
        setError("الاسم الأول مطلوب");
        return false;
      }
      if (!lastName.trim()) {
        setError("اسم العائلة مطلوب");
        return false;
      }
      if (!email.trim()) {
        setError("البريد الإلكتروني مطلوب");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("البريد الإلكتروني غير صحيح");
        return false;
      }
      if (password.length < 6) {
        setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        return false;
      }
      if (password !== confirmPassword) {
        setError("كلمات المرور غير متطابقة");
        return false;
      }
      if (phone && !/^(\+213|0)[5-7][0-9]{8}$/.test(phone)) {
        setError("رقم الهاتف غير صحيح");
        return false;
      }
      if (!age || age.trim() === "") {
        setError("السن مطلوب");
        return false;
      }
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        setError("السن يجب أن يكون بين 18 و 100 سنة");
        return false;
      }
      if (!wilaya || wilaya.trim() === "") {
        setError("الولاية مطلوبة");
        return false;
      }
      // القصر مطلوب فقط إذا كانت الولاية هي غرداية (47)
      if (wilaya === '47' && (!ksar || ksar.trim() === "")) {
        setError("القصر مطلوب عند اختيار ولاية غرداية");
        return false;
      }
      if (!acceptTerms) {
        setError("يجب الموافقة على الشروط والأحكام");
        return false;
      }
    } else {
      // Driver onboarding validation
      if (currentStep === 1) {
        if (!driverFormData.firstName.trim()) {
          setError("الاسم الأول مطلوب");
          return false;
        }
        if (!driverFormData.lastName.trim()) {
          setError("اسم العائلة مطلوب");
          return false;
        }
        if (!driverFormData.email.trim()) {
          setError("البريد الإلكتروني مطلوب");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driverFormData.email)) {
          setError("البريد الإلكتروني غير صحيح");
          return false;
        }
        if (driverFormData.phone && !/^(\+213|0)[5-7][0-9]{8}$/.test(driverFormData.phone)) {
          setError("رقم الهاتف غير صحيح");
          return false;
        }
        if (!driverFormData.age || driverFormData.age.trim() === "") {
          setError("السن مطلوب");
          return false;
        }
        const ageNum = parseInt(driverFormData.age);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
          setError("السن يجب أن يكون بين 18 و 100 سنة");
          return false;
        }
        if (!driverFormData.wilaya || driverFormData.wilaya.trim() === "") {
          setError("الولاية مطلوبة");
          return false;
        }
        // القصر مطلوب فقط إذا كانت الولاية هي غرداية (47)
        if (driverFormData.wilaya === '47' && (!driverFormData.ksar || driverFormData.ksar.trim() === "")) {
          setError("القصر مطلوب عند اختيار ولاية غرداية");
          return false;
        }
      } else if (currentStep === 2) {
        if (!driverFormData.vehicleBrand.trim()) {
          setError("ماركة المركبة مطلوبة");
          return false;
        }
        if (!driverFormData.vehicleModel.trim()) {
          setError("موديل المركبة مطلوب");
          return false;
        }
        if (!driverFormData.vehicleYear.trim()) {
          setError("سنة الصنع مطلوبة");
          return false;
        }
        if (!driverFormData.vehicleColor.trim()) {
          setError("لون المركبة مطلوب");
          return false;
        }
        if (!driverFormData.plateNumber.trim()) {
          setError("رقم اللوحة مطلوب");
          return false;
        }
        if (!driverFormData.seats) {
          setError("عدد المقاعد مطلوب");
          return false;
        }
      } else if (currentStep === 3) {
        // Password validation for step 3
        if (password.length < 6) {
          setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
          return false;
        }
        if (password !== confirmPassword) {
          setError("كلمات المرور غير متطابقة");
          return false;
        }
        if (!acceptTerms) {
          setError("يجب الموافقة على الشروط والأحكام");
          return false;
        }
      }
    }
    return true;
  };

  const interpretedErrorMessage = useMemo(() => {
    if (!error) return null;
    return error;
  }, [error]);


  const mapSupabaseSignUpError = (supabaseError: any) => {
    if (!supabaseError) {
      return "حدث خطأ غير متوقع أثناء محاولة إنشاء الحساب. حاول مرة أخرى.";
    }

    const status = typeof supabaseError.status === "number" ? supabaseError.status : undefined;
    const message = typeof supabaseError.message === "string" ? supabaseError.message : "";
    const details = typeof supabaseError.details === "string" ? supabaseError.details : "";
    const code = typeof supabaseError.code === "string" ? supabaseError.code : "";
    const combinedMessage = `${message} ${details}`.toLowerCase();

    if (status === 400 && combinedMessage.includes("already registered")) {
      return "هذا البريد الإلكتروني مسجل بالفعل. جرّب تسجيل الدخول أو استخدم بريداً مختلفاً.";
    }

    const isDatabaseSetupFailure =
      status === 500 ||
      code === "unexpected_failure" ||
      combinedMessage.includes("database error") ||
      combinedMessage.includes("database error saving new user") ||
      combinedMessage.includes("new row violates row-level security policy") ||
      combinedMessage.includes("42p01") ||
      combinedMessage.includes("relation \"notifications\" does not exist");

    if (isDatabaseSetupFailure) {
      // Force schema check when we detect database errors
      setTimeout(() => {
        // checkSupabaseSchema();
      }, 100);

      return "تعذر إنشاء الحساب بسبب خطأ في قاعدة البيانات. إعداد Supabase غير مكتمل (قد يكون جدول notifications أو مشغلات on_auth_user_created ناقصة). طبّق جميع الهجرات عبر 'supabase db push' أو انسخ محتوى ملف 20260206000000_supabase_full_reset.sql إلى SQL Editor، ثم أعد المحاولة. راجع SIGNUP_FIX_GUIDE.md للتفاصيل.";
    }

    if (combinedMessage.includes("network error")) {
      return "تعذر الاتصال بخدمة Supabase. تأكد من اتصالك بالإنترنت ثم أعد المحاولة.";
    }

    if (message) {
      return message;
    }

    return "حدث خطأ غير معروف أثناء إنشاء الحساب. الرجاء المحاولة مرة أخرى لاحقاً.";
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (showDriverOnboarding) {
        await handleDriverSignup();
        return;
      }

      // 🔥 FIRST: Check if email already exists in profiles table
      const normalizedEmail = email.toLowerCase().trim();
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
        .ilike('email', normalizedEmail)
        .maybeSingle();

      if (existingProfile && !checkError) {
        setLoading(false);
        setError(`البريد الإلكتروني (${email}) موجود سابقاً. يرجى استخدام بريد إلكتروني آخر أو تسجيل الدخول إذا كان لديك حساب.`);
        return;
      }

      // Get wilaya name from code
      const selectedWilaya = wilayas.find(w => w.code === wilaya);
      const wilayaName = selectedWilaya?.name || wilaya;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            role,
            age: parseInt(age),
            ksar,
            wilaya: wilayaName,
            commune: commune || null,
          },
        },
      });

      if (error) {
        throw error;
      }

      const createdUser = data.user;
      const sessionFromSignUp = data.session; // Session may be available immediately
      if (createdUser) {
        // If session is available from signUp, set it immediately
        if (sessionFromSignUp) {
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: sessionFromSignUp.access_token,
            refresh_token: sessionFromSignUp.refresh_token,
          });
          
          if (setSessionError) {
          } else {
          }
          
          // Verify session is actually set and active
          let sessionVerified = false;
          for (let i = 0; i < 5; i++) {
            const { data: { session: verifiedSession } } = await supabase.auth.getSession();
            if (verifiedSession && verifiedSession.user?.id === createdUser.id) {
              sessionVerified = true;
              break;
            } else {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          
          if (!sessionVerified) {
          }
          
          // Small delay to ensure profile is created by database trigger
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          // Wait for profile to be created by database trigger
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Upload avatar if selected - استخدام Edge Function للرفع حتى بدون Session
        if (avatarFile) {
          // Wait a bit for profile to be created
          await new Promise(resolve => setTimeout(resolve, 1500));
          await handleAvatarUploadAndUpdate(createdUser.id);
        }

        // Send notifications asynchronously (don't block signup)
        // Wait longer to ensure profile is created and session is established
        setTimeout(async () => {
          try {
            // Wait a bit more to ensure profile is fully created
            await new Promise(resolve => setTimeout(resolve, 2000));
            const { NotificationService } = await import('@/integrations/database/notificationService');
            // Send notification to admins about new user registration FIRST
            // This doesn't require the user profile, so it should work immediately
            try {
              await NotificationService.notifyNewUserRegistration({
                userId: createdUser.id,
                userRole: role as 'driver' | 'passenger',
                userName: `${firstName} ${lastName}`,
                userEmail: email,
              });
            } catch (adminNotificationError: any) {
            }
            
            // 🔥 NOTE: Welcome notification will be sent AFTER email confirmation
            // This is handled in useAuth.ts when user confirms their email
          } catch (notificationError: any) {
            // Log error but don't throw - notifications are not critical for signup
            // notifyWelcomeUser should return null instead of throwing, but catch any errors just in case
          }
        }, 5000); // Wait 5 seconds to ensure everything is ready
      }

      setSuccess("تم إنشاء الحساب بنجاح! جاري تحويلك إلى الصفحة الرئيسية...");

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setAge("");
      setKsar("");
      setAcceptTerms(false);
      setAvatarFile(null);
      setAvatarPreview(null);

      // Redirect to home page immediately instead of onboarding
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error: any) {
      const mappedError = mapSupabaseSignUpError(error);
      setError(mappedError);
    } finally {
      setLoading(false);
    }
  };

  const handleDriverSignup = async () => {
    try {
      // 🔥 FIRST: Check if email already exists in profiles table
      const normalizedEmail = driverFormData.email.toLowerCase().trim();
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
        .ilike('email', normalizedEmail)
        .maybeSingle();

      if (existingProfile && !checkError) {
        setLoading(false);
        setError(`البريد الإلكتروني (${driverFormData.email}) موجود سابقاً. يرجى استخدام بريد إلكتروني آخر أو تسجيل الدخول إذا كان لديك حساب.`);
        return;
      }

      // Get wilaya name from code
      const selectedWilaya = wilayas.find(w => w.code === driverFormData.wilaya);
      const wilayaName = selectedWilaya?.name || driverFormData.wilaya;

      const { data, error } = await supabase.auth.signUp({
        email: driverFormData.email,
        password,
        options: {
          data: {
            first_name: driverFormData.firstName,
            last_name: driverFormData.lastName,
            phone: driverFormData.phone,
            role: 'driver',
            age: driverFormData.age ? parseInt(driverFormData.age) : null,
            ksar: driverFormData.ksar,
            wilaya: wilayaName,
            commune: driverFormData.commune || null,
            address: driverFormData.address,
            vehicle_brand: driverFormData.vehicleBrand,
            vehicle_model: driverFormData.vehicleModel,
            vehicle_year: driverFormData.vehicleYear,
            vehicle_color: driverFormData.vehicleColor,
            vehicle_plate: driverFormData.plateNumber,
            vehicle_seats: driverFormData.seats,
            vehicle_category: driverFormData.category,
          },
        },
      });

      if (error) {
        throw error;
      }

      const createdUser = data.user;
      const sessionFromSignUp = data.session; // Session may be available immediately
      if (createdUser) {
        // If session is available from signUp, set it immediately
        if (sessionFromSignUp) {
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: sessionFromSignUp.access_token,
            refresh_token: sessionFromSignUp.refresh_token,
          });
          
          if (setSessionError) {
          } else {
          }
          
          // Verify session is actually set and active
          let sessionVerified = false;
          for (let i = 0; i < 5; i++) {
            const { data: { session: verifiedSession } } = await supabase.auth.getSession();
            if (verifiedSession && verifiedSession.user?.id === createdUser.id) {
              sessionVerified = true;
              break;
            } else {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          
          if (!sessionVerified) {
          }
          
          // Small delay to ensure profile is created by database trigger
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          // Wait for profile to be created by database trigger
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Upload avatar if selected - استخدام Edge Function للرفع حتى بدون Session
        if (avatarFile) {
          // Wait a bit for profile to be created
          await new Promise(resolve => setTimeout(resolve, 1500));
          await handleAvatarUploadAndUpdate(createdUser.id);
        }

        // Create vehicle for the driver with retry logic
        // Capture vehicle data to avoid closure issues
        const vehicleDataToSave = {
          driverId: createdUser.id,
          make: driverFormData.vehicleBrand?.trim() || '',
          model: driverFormData.vehicleModel?.trim() || '',
          year: parseInt(driverFormData.vehicleYear) || new Date().getFullYear(),
          color: driverFormData.vehicleColor?.trim() || 'غير محدد',
          licensePlate: driverFormData.plateNumber?.trim() || '',
          seats: parseInt(driverFormData.seats) || 4,
          isActive: true
        };
        // Validate vehicle data before attempting to create
        if (!vehicleDataToSave.make || !vehicleDataToSave.model) {
        } else {
          // Create vehicle with retry logic
          const createVehicleWithRetry = async (maxRetries: number = 5): Promise<void> => {
            const { BrowserDatabaseService } = await import('@/integrations/database/browserServices');
            
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
              try {
                // Wait progressively longer for session to be established
                if (attempt > 1) {
                  const waitTime = (attempt - 1) * 1000; // 1s, 2s, 3s, 4s
                  await new Promise(resolve => setTimeout(resolve, waitTime));
                }
                
                // Check if we have a valid session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
                // Verify session is active and user matches
                if (!session || !currentUser || currentUser.id !== createdUser.id) {
                  if (attempt < maxRetries) {
                    continue; // Try again
                  } else {
                    return; // Don't throw - just return
                  }
                }
                const vehicle = await BrowserDatabaseService.createVehicle(vehicleDataToSave);
                return; // Success!
                
              } catch (vehicleError: any) {
                // If RLS policy violation, wait and retry
                if (vehicleError?.code === '42501' || vehicleError?.message?.includes('row-level security') || vehicleError?.message?.includes('RLS')) {
                  if (attempt < maxRetries) {
                    continue; // Retry
                  } else {
                    return; // Don't throw - just return
                  }
                } else if (attempt < maxRetries) {
                  // Other errors - retry
                  continue;
                } else {
                  // Final attempt failed
                  return; // Don't throw - just return
                }
              }
            }
          };
          
          // Try to create vehicle with retry logic (don't block signup)
          // Wait a bit before starting to ensure profile is created
          setTimeout(async () => {
            try {
              await createVehicleWithRetry(5);
            } catch (error) {
              // Don't fail signup - user can add vehicle manually later
            }
          }, 1000);
        }

        // Send notifications asynchronously (don't block signup)
        // Wait longer to ensure profile is created and session is established
        setTimeout(async () => {
          try {
            // Wait a bit more to ensure profile is fully created
            await new Promise(resolve => setTimeout(resolve, 2000));
            const { NotificationService } = await import('@/integrations/database/notificationService');
            // Send notification to admins about new driver registration FIRST
            // This doesn't require the user profile, so it should work immediately
            try {
              await NotificationService.notifyNewUserRegistration({
                userId: createdUser.id,
                userRole: 'driver',
                userName: `${driverFormData.firstName} ${driverFormData.lastName}`,
                userEmail: driverFormData.email,
              });
            } catch (adminNotificationError: any) {
            }
            
            // 🔥 NOTE: Welcome notification will be sent AFTER email confirmation
            // This is handled in useAuth.ts when user confirms their email
          } catch (notificationError: any) {
            // Log error but don't throw - notifications are not critical for signup
            // notifyWelcomeUser should return null instead of throwing, but catch any errors just in case
          }
        }, 5000); // Wait 5 seconds to ensure everything is ready
      }

      setSuccess("تم إنشاء حساب السائق بنجاح! جاري تحويلك إلى الصفحة الرئيسية...");

      // Redirect to home page immediately instead of onboarding
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error: any) {
      const mappedError = mapSupabaseSignUpError(error);
      setError(mappedError);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      // Set flag to indicate Google sign-up is in progress (from SignUp page)
      localStorage.setItem('googleSignUpInProgress', 'true');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) {
        throw error;
      }
      // Note: The redirect will happen automatically
    } catch (error: any) {
      localStorage.removeItem('googleSignUpInProgress');
      setError(error.message || "حدث خطأ أثناء التسجيل بـ Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDriverInputChange = (field: string, value: string) => {
    setDriverFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    if (selectedRole === 'driver') {
      setShowDriverOnboarding(true);
      // Pre-fill driver form with basic info if available
      setDriverFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        email,
        phone,
        age,
        ksar,
        wilaya,
        commune
      }));
    }
  };

  const handleBackToSignup = () => {
    navigate('/auth/signup#passenger');
    setShowDriverOnboarding(false);
    setRole('passenger');
    setCurrentStep(1);
  };

  // Avatar upload functions
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('الرجاء اختيار صورة صالحة');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // استخدام الدوال المشتركة من avatarUpload utility
  // (resizeImage and uploadAvatar are imported at the top)

  // استخدام دالة uploadAvatar المشتركة - Edge Function سيتولى تحديث Profile أيضاً
  const handleAvatarUploadAndUpdate = async (userId: string) => {
    if (!avatarFile) {
      return;
    }
    // Upload avatar - Edge Function will handle profile update if session is not available
    const avatarUrl = await uploadAvatar(avatarFile, userId);
    
    if (avatarUrl) {
      // Edge Function already updates the profile, but let's verify
      // If direct upload was used, we need to update the profile manually
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user?.id === userId) {
          // Profile was updated by Edge Function, but let's verify
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('id', userId);
          
          if (updateError) {
          } else {
          }
        } else {
        }
      } catch (error) {
      }
    } else {
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                <User className="h-8 w-8 text-primary" />
                {showDriverOnboarding ? (
                  <Link 
                    to="/auth/signup#driver" 
                    className="text-primary hover:underline transition-colors"
                  >
                    انضم إلى شبكة سائقي منصة أبريد
                  </Link>
                ) : (
                  "إنشاء حساب جديد"
                )}
              </CardTitle>
              <CardDescription>
                {showDriverOnboarding 
                  ? "أدخل معلوماتك لبدء العمل كسائق" 
                  : "أدخل معلوماتك لإنشاء حساب في منصة أبريد"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!showDriverOnboarding ? (
                <>
                  {/* Role Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card 
                      className={`w-full h-full cursor-pointer transition-all ${role === 'passenger' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                      onClick={() => handleRoleSelect('passenger')}
                    >
                      <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                        <User className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-semibold">راكب</h3>
                        <p className="text-sm text-muted-foreground">أريد حجز رحلات</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`w-full h-full cursor-pointer transition-all ${role === 'driver' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                      onClick={() => handleRoleSelect('driver')}
                    >
                      <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                        <Car className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-semibold">سائق</h3>
                        <p className="text-sm text-muted-foreground">أريد تقديم رحلات</p>
                      </CardContent>
                    </Card>

                    {/* خيار المدير مُزال من الواجهة العامة */}
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">الاسم الأول *</Label>
                        <Input
                          id="first-name"
                          placeholder="أدخل اسمك الأول"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">اسم العائلة *</Label>
                        <Input
                          id="last-name"
                          placeholder="أدخل اسم العائلة"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Avatar Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="avatar">صورة الملف الشخصي (اختياري)</Label>
                      <div className="flex items-center gap-4">
                        {avatarPreview && (
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary">
                            <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF حتى 5 ميجابايت
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="أدخل بريدك الإلكتروني"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+213 555 123 456"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Age and Location */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">السن *</Label>
                        <Input
                          id="age"
                          type="number"
                          min="18"
                          max="100"
                          placeholder="أدخل السن"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wilaya">الولاية *</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Select value={wilaya} onValueChange={(value) => {
                            setWilaya(value);
                            setCommune(""); // Reset commune when wilaya changes
                            // Reset ksar if wilaya is not Ghardaïa (47)
                            if (value !== '47') {
                              setKsar("");
                            }
                          }}>
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="اختر الولاية" />
                            </SelectTrigger>
                            <SelectContent>
                              {wilayas.map((w) => (
                                <SelectItem key={w.code} value={w.code}>
                                  {w.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Ksar and Commune */}
                    <div className={`grid gap-4 ${wilaya === '47' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {/* القصر - يظهر فقط عند اختيار ولاية غرداية (47) */}
                      {wilaya === '47' && (
                        <div className="space-y-2">
                          <Label htmlFor="ksar">القصر *</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Select value={ksar} onValueChange={setKsar}>
                              <SelectTrigger className="pl-10">
                                <SelectValue placeholder="اختر القصر" />
                              </SelectTrigger>
                              <SelectContent>
                                {ksour.map((ksr) => (
                                  <SelectItem key={ksr.value} value={ksr.value}>
                                    {ksr.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="commune">البلدية</Label>
                        <Input
                          id="commune"
                          type="text"
                          placeholder="أدخل البلدية (اختياري)"
                          value={commune}
                          onChange={(e) => setCommune(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Password Fields */}
                    <div className="space-y-2">
                      <Label htmlFor="password">كلمة المرور *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">تأكيد كلمة المرور *</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="أعد إدخال كلمة المرور"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        أوافق على{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          الشروط والأحكام
                        </Link>
                        {" "}و{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          سياسة الخصوصية
                        </Link>
                      </Label>
                    </div>

                    {/* Error and Success Messages */}
                    {interpretedErrorMessage && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{interpretedErrorMessage}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Buttons */}
                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loading}
                      >
                        {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">أو</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button"
                        variant="outline" 
                        className="w-full" 
                        onClick={handleGoogleSignUp}
                        disabled={loading || googleLoading}
                      >
                        <Chrome className="h-4 w-4 mr-2" />
                        {googleLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب بـ Google"}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  {/* Driver Onboarding Slides */}
                  {/* Progress Steps */}
                  <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step <= currentStep 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {step < currentStep ? <Check className="h-4 w-4" /> : step}
                          </div>
                          {step < 3 && (
                            <div className={`w-12 h-0.5 mx-2 ${
                              step < currentStep ? 'bg-primary' : 'bg-muted'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-6">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="driver-first-name">الاسم الأول</Label>
                            <Input
                              id="driver-first-name"
                              value={driverFormData.firstName}
                              onChange={(e) => handleDriverInputChange("firstName", e.target.value)}
                              placeholder="أدخل اسمك الأول"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="driver-last-name">اسم العائلة</Label>
                            <Input
                              id="driver-last-name"
                              value={driverFormData.lastName}
                              onChange={(e) => handleDriverInputChange("lastName", e.target.value)}
                              placeholder="أدخل اسم العائلة"
                            />
                          </div>
                        </div>
                        
                        {/* Avatar Upload */}
                        <div className="space-y-2">
                          <Label htmlFor="driver-avatar">صورة الملف الشخصي (اختياري)</Label>
                          <div className="flex items-center gap-4">
                            {avatarPreview && (
                              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary">
                                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1">
                              <Input
                                id="driver-avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="cursor-pointer"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, GIF حتى 5 ميجابايت
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="driver-phone">رقم الهاتف</Label>
                          <Input
                            id="driver-phone"
                            value={driverFormData.phone}
                            onChange={(e) => handleDriverInputChange("phone", e.target.value)}
                            placeholder="+213 555 123 456"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="driver-email">البريد الإلكتروني</Label>
                          <Input
                            id="driver-email"
                            type="email"
                            value={driverFormData.email}
                            onChange={(e) => handleDriverInputChange("email", e.target.value)}
                            placeholder="example@email.com"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="driver-age">السن *</Label>
                            <Input
                              id="driver-age"
                              type="number"
                              min="18"
                              max="100"
                              value={driverFormData.age}
                              onChange={(e) => handleDriverInputChange("age", e.target.value)}
                              placeholder="أدخل السن"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="driver-wilaya">الولاية *</Label>
                            <Select 
                              value={driverFormData.wilaya} 
                              onValueChange={(value) => {
                                handleDriverInputChange("wilaya", value);
                                handleDriverInputChange("commune", ""); // Reset commune when wilaya changes
                                // Reset ksar if wilaya is not Ghardaïa (47)
                                if (value !== '47') {
                                  handleDriverInputChange("ksar", "");
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الولاية" />
                              </SelectTrigger>
                              <SelectContent>
                                {wilayas.map((w) => (
                                  <SelectItem key={w.code} value={w.code}>
                                    {w.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className={`grid gap-4 ${driverFormData.wilaya === '47' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {/* القصر - يظهر فقط عند اختيار ولاية غرداية (47) */}
                          {driverFormData.wilaya === '47' && (
                            <div className="space-y-2">
                              <Label htmlFor="driver-ksar">القصر *</Label>
                              <Select value={driverFormData.ksar} onValueChange={(value) => handleDriverInputChange("ksar", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر القصر" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ksour.map((ksr) => (
                                    <SelectItem key={ksr.value} value={ksr.value}>
                                      {ksr.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="driver-commune">البلدية</Label>
                            <Input
                              id="driver-commune"
                              type="text"
                              placeholder="أدخل البلدية (اختياري)"
                              value={driverFormData.commune}
                              onChange={(e) => handleDriverInputChange("commune", e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="driver-address">العنوان</Label>
                          <Input
                            id="driver-address"
                            value={driverFormData.address}
                            onChange={(e) => handleDriverInputChange("address", e.target.value)}
                            placeholder="أدخل عنوانك الكامل"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Vehicle Information */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="vehicle-brand">ماركة المركبة</Label>
                            <Input
                              id="vehicle-brand"
                              value={driverFormData.vehicleBrand}
                              onChange={(e) => handleDriverInputChange("vehicleBrand", e.target.value)}
                              placeholder="تويوتا، هيونداي، رينو..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vehicle-model">الموديل</Label>
                            <Input
                              id="vehicle-model"
                              value={driverFormData.vehicleModel}
                              onChange={(e) => handleDriverInputChange("vehicleModel", e.target.value)}
                              placeholder="كورولا، أكسنت، سيم볼..."
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="vehicle-year">سنة الصنع</Label>
                            <Input
                              id="vehicle-year"
                              value={driverFormData.vehicleYear}
                              onChange={(e) => handleDriverInputChange("vehicleYear", e.target.value)}
                              placeholder="2020"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vehicle-color">اللون</Label>
                            <Input
                              id="vehicle-color"
                              value={driverFormData.vehicleColor}
                              onChange={(e) => handleDriverInputChange("vehicleColor", e.target.value)}
                              placeholder="أبيض، أسود، رمادي..."
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="plate-number">رقم اللوحة</Label>
                          <Input
                            id="plate-number"
                            value={driverFormData.plateNumber}
                            onChange={(e) => handleDriverInputChange("plateNumber", e.target.value)}
                            placeholder="16-123-45"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="seats">عدد المقاعد</Label>
                            <Select value={driverFormData.seats} onValueChange={(value) => handleDriverInputChange("seats", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر عدد المقاعد" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 مقعد</SelectItem>
                                <SelectItem value="2">2 مقعد</SelectItem>
                                <SelectItem value="3">3 مقاعد</SelectItem>
                                <SelectItem value="4">4 مقاعد</SelectItem>
                                <SelectItem value="5">5 مقاعد</SelectItem>
                                <SelectItem value="6">6 مقاعد</SelectItem>
                                <SelectItem value="7">7 مقاعد</SelectItem>
                                <SelectItem value="8">8 مقاعد (نقل)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">فئة المركبة</Label>
                            <Select value={driverFormData.category} onValueChange={(value) => handleDriverInputChange("category", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الفئة" />
                              </SelectTrigger>
                              <SelectContent>
                                {vehicleCategories.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Password */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="driver-password">كلمة المرور *</Label>
                          <div className="relative">
                            <Input
                              id="driver-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="driver-confirm-password">تأكيد كلمة المرور *</Label>
                          <div className="relative">
                            <Input
                              id="driver-confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="أعد إدخال كلمة المرور"
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="driver-terms"
                            checked={acceptTerms}
                            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                          />
                          <Label htmlFor="driver-terms" className="text-sm">
                            أوافق على{" "}
                            <Link to="/terms" className="text-primary hover:underline">
                              الشروط والأحكام
                            </Link>
                            {" "}و{" "}
                            <Link to="/privacy" className="text-primary hover:underline">
                              سياسة الخصوصية
                            </Link>
                          </Label>
                        </div>
                      </div>
                    )}

                    {/* Error and Success Messages */}
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    {/* Navigation Buttons */}
                    <div className="space-y-4 pt-6">
                      <div className="flex justify-between">
                        {currentStep === 1 ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleBackToSignup}
                          >
                            العودة للتسجيل
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                          >
                            السابق
                          </Button>
                        )}
                        
                        {currentStep < 3 ? (
                          <Button type="button" onClick={nextStep}>
                            التالي
                            <ArrowRight className="h-4 w-4 mr-2" />
                          </Button>
                        ) : (
                          <Button 
                            type="submit" 
                            className="bg-gradient-primary" 
                            disabled={loading}
                          >
                            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
                            <Check className="h-4 w-4 mr-2" />
                          </Button>
                        )}
                      </div>
                      
                      {/* Google Sign Up Button for Drivers */}
                      {currentStep === 3 && (
                        <>
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-background px-2 text-muted-foreground">أو</span>
                            </div>
                          </div>
                          
                          <Button 
                            type="button"
                            variant="outline" 
                            className="w-full" 
                            onClick={handleGoogleSignUp}
                            disabled={loading || googleLoading}
                          >
                            <Chrome className="h-4 w-4 mr-2" />
                            {googleLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب بـ Google"}
                          </Button>
                        </>
                      )}
                    </div>
                  </form>
                </>
              )}

              {!showDriverOnboarding && (
                <div className="text-center text-sm">
                  لديك حساب بالفعل؟{" "}
                  <Link to="/auth/signin" className="text-primary hover:underline font-medium">
                    تسجيل الدخول
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;