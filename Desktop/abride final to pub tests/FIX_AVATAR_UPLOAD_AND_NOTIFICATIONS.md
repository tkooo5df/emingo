# إصلاح مشاكل رفع الصور والإشعارات

## المشاكل التي تم إصلاحها

### 1. ❌ خطأ RLS Policy في رفع الصور
**المشكلة:**
```
StorageApiError: new row violates row-level security policy
```

**السبب:**
- سياسات RLS في Supabase Storage كانت لا تسمح برفع الصور بشكل صحيح
- السياسات كانت تتحقق من بنية المجلدات بشكل صارم جداً

**الحل:**
- تم إنشاء migration جديد (`20260211000000_fix_avatars_storage_rls.sql`) يصلح السياسات
- السياسات الجديدة تسمح للمستخدمين المصادق عليهم برفع الصور في مجلداتهم
- إضافة دعم لبنيتين مختلفتين للمجلدات (لتوافق مع الكود القديم)

### 2. ❌ خطأ "User not found" في الإشعارات
**المشكلة:**
```
Error: User not found
at NotificationService.notifyWelcomeUser
```

**السبب:**
- الإشعارات كانت تُرسل قبل إنشاء البروفايل في قاعدة البيانات
- قاعدة البيانات تحتاج وقت لإنشاء البروفايل عبر trigger

**الحل:**
- إضافة آلية إعادة المحاولة (retry logic) مع 10 محاولات كل 500ms
- إذا لم يُعثر على البروفايل، يتم تخطي الإشعار بدلاً من إيقاف التسجيل
- جعل إرسال الإشعارات غير متزامن (async) حتى لا توقف عملية التسجيل

### 3. ⚠️ تحسينات إضافية
- تحسين دالة رفع الصور لدعم عدة طرق للرفع (upload, update, upsert)
- إضافة فحص للتأكد من أن المستخدم مصادق عليه قبل رفع الصور
- جعل عملية رفع الصور لا توقف التسجيل في حالة الفشل
- تحسين معالجة الأخطاء وسجلات console

## الخطوات المطلوبة

### 1. تشغيل Migration في Supabase

اذهب إلى **Supabase Dashboard → SQL Editor** وشغل الملف:

```sql
supabase/migrations/20260211000000_fix_avatars_storage_rls.sql
```

أو انسخ محتوى الملف وألصقه في SQL Editor واضغط **Run**.

### 2. التحقق من الإعداد

بعد تشغيل الـ Migration، تحقق من:

#### أ. فحص Bucket:
```sql
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets 
WHERE id = 'avatars';
```

**النتيجة المتوقعة:**
```
id: avatars
name: avatars
public: true
```

#### ب. فحص السياسات:
```sql
SELECT 
  policyname,
  cmd as operation,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%vatar%'
ORDER BY policyname;
```

**يجب أن ترى 4 سياسات:**
1. `Avatar upload for authenticated users` - INSERT
2. `Avatar read for all` - SELECT
3. `Avatar update for owner` - UPDATE
4. `Avatar delete for owner` - DELETE

### 3. اختبار الإصلاحات

#### أ. اختبار رفع الصور:
1. اذهب إلى صفحة التسجيل
2. اختر صورة
3. أكمل التسجيل
4. افتح **Console في المتصفح** (F12)
5. يجب أن ترى:
   - ✅ `تم رفع الصورة بنجاح!`
   - ✅ `تم حفظ رابط الصورة في البروفايل بنجاح!`

#### ب. اختبار الإشعارات:
1. بعد التسجيل، انتظر قليلاً
2. افتح **Console في المتصفح** (F12)
3. يجب أن ترى:
   - ✅ `SignUp - Notifications sent successfully`
   - أو: `Profile not found for user ... after 10 attempts. Skipping welcome notification.` (هذا طبيعي إذا لم يُنشأ البروفايل)

## الملفات المعدلة

### 1. `supabase/migrations/20260211000000_fix_avatars_storage_rls.sql`
- Migration جديد لإصلاح سياسات RLS
- يجب تشغيله في Supabase Dashboard

### 2. `src/pages/SignUp.tsx`
- تحسين دالة `uploadAvatar()` لدعم عدة طرق للرفع
- إضافة فحص للتأكد من المصادقة
- تحسين ترتيب العمليات (انتظار إنشاء البروفايل أولاً)
- جعل إرسال الإشعارات غير متزامن

### 3. `src/integrations/database/notificationService.ts`
- إضافة آلية إعادة المحاولة في `notifyWelcomeUser()`
- تحسين معالجة الأخطاء (لا توقف التسجيل)

## التحسينات المضافة

### 1. آلية إعادة المحاولة
```typescript
// Wait for profile to be created (with retry logic)
let user = null;
let attempts = 0;
const maxAttempts = 10;
const delayMs = 500;

while (!user && attempts < maxAttempts) {
  user = await BrowserDatabaseService.getProfile(userId);
  if (!user) {
    attempts++;
    if (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}
```

### 2. رفع الصور مع دعم متعدد
```typescript
// Try upload without upsert first (cleaner for new files)
// If file exists, try with update
// If update fails, try with upsert
```

### 3. إرسال الإشعارات غير المتزامن
```typescript
// Send notifications asynchronously (don't block signup)
setTimeout(async () => {
  // Send notifications...
}, 500);
```

## النتيجة المتوقعة

بعد تطبيق الإصلاحات:

✅ **رفع الصور يعمل بنجاح** - لا مزيد من أخطاء RLS
✅ **الإشعارات تُرسل بنجاح** - لا مزيد من أخطاء "User not found"
✅ **عملية التسجيل لا تتوقف** - حتى لو فشل رفع الصور أو الإشعارات
✅ **تحسين تجربة المستخدم** - التسجيل يعمل بسلاسة

## ملاحظات مهمة

1. **يجب تشغيل Migration** - بدون تشغيل Migration، ستبقى مشكلة RLS موجودة
2. **الانتظار مطلوب** - البروفايل يحتاج وقت للإنشاء عبر trigger في قاعدة البيانات
3. **الإشعارات اختيارية** - إذا فشلت الإشعارات، لا يتوقف التسجيل
4. **رفع الصور اختياري** - إذا فشل رفع الصور، يمكن للمستخدم المتابعة بدون صورة

## الدعم

إذا واجهت أي مشاكل:

1. تحقق من Console في المتصفح (F12)
2. تحقق من Supabase Dashboard → Logs
3. تأكد من تشغيل Migration بشكل صحيح
4. تحقق من أن bucket `avatars` موجود وpublic

---

**تاريخ الإصلاح:** 2025-01-19  
**الحالة:** ✅ مكتمل - يحتاج لتشغيل Migration

