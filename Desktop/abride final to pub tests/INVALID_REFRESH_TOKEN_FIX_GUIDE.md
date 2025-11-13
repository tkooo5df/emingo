# دليل إصلاح مشكلة Invalid Refresh Token

## المشكلة
```
AuthApiError: Invalid Refresh Token: Refresh Token Not Found
```

## السبب
هذا الخطأ يحدث عندما يكون هناك token قديم أو غير صالح محفوظ في localStorage للمتصفح.

## الحلول المطبقة

### 1. إصلاح تلقائي في الكود
تم إضافة معالجة تلقائية لأخطاء المصادقة في:
- `src/integrations/supabase/client.ts`
- `src/hooks/useAuth.ts`
- `src/utils/authUtils.ts`

### 2. مسح البيانات المحفوظة محلياً

#### الطريقة الأولى: استخدام ملف JavaScript
```bash
# تشغيل الملف في المتصفح
node clear-auth-data.js
```

#### الطريقة الثانية: مسح يدوي من المتصفح
1. افتح Developer Tools (F12)
2. اذهب إلى Console
3. اكتب:
```javascript
// مسح جميع بيانات Supabase
Object.keys(localStorage).forEach(key => {
  if (key.includes('supabase')) {
    localStorage.removeItem(key);
  }
});

// مسح sessionStorage
sessionStorage.clear();

// إعادة تحميل الصفحة
window.location.reload();
```

#### الطريقة الثالثة: مسح كامل للمتصفح
1. اذهب إلى إعدادات المتصفح
2. امسح بيانات التصفح
3. اختر "Cookies and other site data"
4. امسح البيانات للموقع

### 3. إعادة تسجيل الدخول
بعد مسح البيانات:
1. أعد تحميل الصفحة
2. سجل دخولك مرة أخرى
3. يجب أن تعمل المصادقة بشكل طبيعي

## الملفات المحدثة

### 1. `src/integrations/supabase/client.ts`
```typescript
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Add error handling for auth errors
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
    // Clear any invalid tokens
    if (!session) {
      try {
        // Clear Supabase auth data if session is invalid
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.includes('supabase')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.error('Error clearing auth data:', error);
      }
    }
  }
});
```

### 2. `src/hooks/useAuth.ts`
```typescript
const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
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
    console.error('Error in getSession:', error);
    setSession(null);
    setUser(null);
    setProfile(null);
  } finally {
    setLoading(false);
  }
};
```

### 3. `src/utils/authUtils.ts`
```typescript
export const clearSupabaseAuthData = async () => {
  try {
    // Sign out from Supabase first
    await supabase.auth.signOut();
    
    // Clear all Supabase-related data from localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('supabase')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Also clear sessionStorage
    sessionStorage.clear();
    
    console.log('Cleared Supabase auth data successfully');
    return true;
  } catch (error) {
    console.error('Error clearing Supabase auth data:', error);
    return false;
  }
};
```

## الوقاية من المشكلة مستقبلاً

### 1. معالجة تلقائية للأخطاء
الكود الآن يتعامل تلقائياً مع أخطاء المصادقة ويمسح البيانات غير الصالحة.

### 2. تحديث دوري للـ tokens
Supabase يتعامل تلقائياً مع تحديث الـ tokens، لكن في حالة الفشل يتم مسح البيانات.

### 3. مراقبة حالة المصادقة
تم إضافة مراقبة أفضل لحالة المصادقة في `onAuthStateChange`.

## الاختبار

### 1. اختبار المسح التلقائي
- افتح Developer Tools
- اذهب إلى Application > Local Storage
- ابحث عن مفاتيح تحتوي على "supabase"
- إذا ظهرت أخطاء مصادقة، يجب أن تختفي هذه المفاتيح تلقائياً

### 2. اختبار إعادة تسجيل الدخول
- بعد مسح البيانات
- جرب تسجيل الدخول مرة أخرى
- يجب أن يعمل بشكل طبيعي

### 3. اختبار استمرارية الجلسة
- سجل دخولك
- أغلق المتصفح
- افتح المتصفح مرة أخرى
- يجب أن تبقى مسجل الدخول

## الخلاصة

تم إصلاح مشكلة Invalid Refresh Token من خلال:
- ✅ إضافة معالجة تلقائية لأخطاء المصادقة
- ✅ مسح البيانات المحفوظة محلياً عند حدوث أخطاء
- ✅ تحسين معالجة الأخطاء في useAuth hook
- ✅ إضافة أدوات مساعدة لمسح البيانات يدوياً

المشكلة يجب أن تحل تلقائياً الآن، وإذا استمرت يمكن استخدام الأدوات المساعدة لمسح البيانات يدوياً.
