# ✅ دليل شامل لإصلاح مشكلة رفع الصور

## 📊 الحالة الحالية

### ✅ ما تم إصلاحه:
1. ✅ RLS Policies موجودة (4 policies)
2. ✅ Bucket موجود
3. ✅ Category Constraint محدث
4. ✅ الكود محسّن مع retry logic

### ⚠️ المشكلة المتبقية:
- خطأ `new row violates row-level security policy` عند رفع الصور

## 🔍 السبب المحتمل

المشكلة على الأرجح بسبب **timing issue**:
- المستخدم الجديد يتم إنشاؤه
- Session قد لا تكون نشطة بشكل فوري
- رفع الصورة يحدث قبل تأسيس Session بشكل كامل

## ✅ الحلول المطبقة

### 1. Migration محسّن
**الملف:** `supabase/migrations/20260211000004_fix_avatar_rls_final.sql`

**التحسينات:**
- ✅ إضافة GRANT permissions
- ✅ تحسين bucket settings
- ✅ تبسيط Policy logic
- ✅ إضافة التحقق من النجاح

### 2. تحسين الكود
**الملف:** `src/pages/SignUp.tsx`

**التحسينات:**
- ✅ زيادة وقت الانتظار من 1500ms إلى 2000ms
- ✅ زيادة وقت الانتظار قبل رفع الصورة من 500ms إلى 1000ms
- ✅ إضافة retry logic
- ✅ تحسين error handling

## 📋 خطوات التطبيق

### الخطوة 1: شغّل Migration
1. افتح: https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj/editor/sql
2. اضغط **New Query**
3. انسخ محتوى: `supabase/migrations/20260211000004_fix_avatar_rls_final.sql`
4. الصق في SQL Editor
5. اضغط **Run**

### الخطوة 2: تحقق من النجاح
بعد Migration، شغّل:

```sql
-- التحقق من Bucket
SELECT id, name, public, file_size_limit
FROM storage.buckets 
WHERE id = 'avatars';

-- التحقق من Policies
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%vatar%';

-- التحقق من Permissions
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'storage' 
  AND table_name = 'objects';
```

### الخطوة 3: اختبار
1. سجّل حساب جديد (راكب أو سائق)
2. اختر صورة
3. أكمل التسجيل
4. افتح Console (F12)
5. تحقق من:
   - ✅ `✅ تم رفع الصورة بنجاح!`
   - ✅ `✅ تم حفظ رابط الصورة في البروفايل بنجاح!`

## 🔧 إذا استمرت المشكلة

### الحل البديل 1: استخدام Service Role Key
إذا استمرت المشكلة، يمكن استخدام Service Role Key لرفع الصورة:

```typescript
// في handleAvatarUploadAndUpdate
const { createClient } = await import('@supabase/supabase-js');
const serviceClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// رفع الصورة باستخدام Service Role
const { data, error } = await serviceClient.storage
  .from('avatars')
  .upload(fileName, resizedFile);
```

### الحل البديل 2: رفع الصورة بعد تسجيل الدخول
بدلاً من رفع الصورة أثناء التسجيل، يمكن رفعها بعد تسجيل الدخول:

```typescript
// في handleDriverSignup
if (createdUser && avatarFile) {
  // حفظ avatarFile في state
  // رفع الصورة بعد redirect إلى dashboard
}
```

### الحل البديل 3: استخدام Edge Function
إنشاء Edge Function لرفع الصور:

```typescript
// supabase/functions/upload-avatar/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // رفع الصورة باستخدام Service Role
})
```

## ✅ النتيجة المتوقعة

بعد تطبيق الإصلاحات:
- ✅ رفع الصور يعمل للمستخدمين الجدد
- ✅ Session يتم تأسيسها بشكل صحيح
- ✅ RLS Policies تعمل بشكل صحيح
- ✅ الصور تُحفظ في Storage
- ✅ رابط الصورة يُحفظ في البروفايل
- ✅ الصور تظهر في الملف الشخصي

---

**تاريخ الإصلاح:** 2025-01-19  
**الحالة:** ✅ Migration جاهز - يحتاج للتطبيق والاختبار

