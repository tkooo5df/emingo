# ✅ حل نهائي مبسّط لمشكلة رفع الصور

## 🔍 المشكلة السابقة
❌ خطأ: `must be owner of table objects` عند محاولة GRANT permissions

## ✅ الحل
إزالة GRANT permissions من Migration لأن:
1. **storage.objects** هو جدول نظامي في Supabase
2. Supabase يدير الصلاحيات تلقائياً
3. RLS policies كافية للتحكم في الوصول
4. لا يمكن للمستخدمين منح صلاحيات على جداول النظام

## 📋 Migration الجديد

### الملف: `supabase/migrations/20260211000006_fix_avatar_rls_simple.sql`

### المحتويات:
1. ✅ إنشاء/تحديث bucket `avatars`
2. ✅ حذف جميع السياسات القديمة
3. ✅ إنشاء 4 سياسات جديدة:
   - `Avatar upload for authenticated users` (INSERT)
   - `Avatar read for all` (SELECT)
   - `Avatar update for owner` (UPDATE)
   - `Avatar delete for owner` (DELETE)
4. ✅ التحقق من الإعداد
5. ✅ فحص النتائج

### بدون GRANT permissions
- ❌ لا يحتوي على GRANT statements
- ✅ يعتمد فقط على RLS policies
- ✅ Supabase يدير الصلاحيات تلقائياً

## 🚀 خطوات التطبيق

### الخطوة 1: شغّل Migration
1. افتح: https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj/editor/sql
2. اضغط **New Query**
3. انسخ محتوى: `supabase/migrations/20260211000006_fix_avatar_rls_simple.sql`
4. الصق في SQL Editor
5. اضغط **Run**

### الخطوة 2: تحقق من النتائج
بعد Migration، يجب أن ترى:
- ✅ رسائل نجاح في NOTICE
- ✅ نتائج فحص Bucket (يجب أن ترى `avatars` و `public: true`)
- ✅ نتائج فحص Policies (يجب أن ترى 4 policies)

### الخطوة 3: اختبار
1. سجّل حساب جديد (راكب أو سائق)
2. اختر صورة
3. أكمل التسجيل
4. افتح Console (F12)
5. تحقق من:
   - ✅ `✅ تم رفع الصورة بنجاح!`
   - ✅ `✅ تم حفظ رابط الصورة في البروفايل بنجاح!`

## 🔍 إذا استمرت المشكلة

### السبب المحتمل: Session Timing
المشكلة قد تكون في أن Session غير نشطة بعد عند محاولة رفع الصورة.

### الحلول:

#### 1. زيادة وقت الانتظار (تم تطبيقه)
- ✅ زيادة وقت الانتظار من 1500ms إلى 2000ms
- ✅ زيادة وقت الانتظار قبل رفع الصورة من 500ms إلى 1000ms

#### 2. استخدام Service Role Key (إذا لزم الأمر)
إذا استمرت المشكلة، يمكن استخدام Service Role Key:

```typescript
// في uploadAvatar()
import { createClient } from '@supabase/supabase-js';

const serviceClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// رفع الصورة باستخدام Service Role
const { data, error } = await serviceClient.storage
  .from('avatars')
  .upload(fileName, resizedFile);
```

#### 3. رفع الصورة بعد تسجيل الدخول
بدلاً من رفع الصورة أثناء التسجيل، يمكن رفعها بعد تسجيل الدخول في Dashboard.

## 📊 التحقق من النجاح

### 1. تحقق من Bucket
```sql
SELECT id, name, public, file_size_limit
FROM storage.buckets 
WHERE id = 'avatars';
```
**يجب أن ترى:** `id: avatars`, `public: true`

### 2. تحقق من Policies
```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%vatar%';
```
**يجب أن ترى:** 4 policies (INSERT, SELECT, UPDATE, DELETE)

### 3. تحقق من RLS
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';
```
**يجب أن ترى:** `rowsecurity: true`

## ✅ النتيجة المتوقعة

بعد تطبيق Migration:
- ✅ رفع الصور يعمل للمستخدمين الجدد
- ✅ Session يتم تأسيسها بشكل صحيح
- ✅ RLS Policies تعمل بشكل صحيح
- ✅ الصور تُحفظ في Storage
- ✅ رابط الصورة يُحفظ في البروفايل
- ✅ الصور تظهر في الملف الشخصي

---

**تاريخ الإصلاح:** 2025-01-19  
**الحالة:** ✅ Migration جاهز - بدون GRANT permissions  
**الملف:** `supabase/migrations/20260211000006_fix_avatar_rls_simple.sql`

