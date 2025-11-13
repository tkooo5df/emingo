# ✅ تم إعداد Migration بنجاح!

## 📋 Migration File
`supabase/migrations/20260211000000_fix_avatars_storage_rls.sql`

## 🚀 كيفية تشغيل Migration

### الطريقة 1: عبر Supabase SQL Editor (الأسهل)

1. افتح الرابط التالي:
   **https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj/editor/sql**

2. اضغط **New Query**

3. انسخ محتوى الملف `supabase/migrations/20260211000000_fix_avatars_storage_rls.sql`

4. الصق المحتوى في SQL Editor

5. اضغط **Run** أو `Ctrl+Enter`

### الطريقة 2: عبر Supabase CLI

```bash
# تأكد من أنك مربوط بالمشروع
npx supabase link --project-ref kobsavfggcnfemdzsnpj

# شغّل Migration مباشرة
npx supabase db execute --file supabase/migrations/20260211000000_fix_avatars_storage_rls.sql
```

## ✅ التحقق من النجاح

بعد تشغيل Migration، شغّل هذا الاستعلام في SQL Editor:

```sql
-- فحص Bucket
SELECT id, name, public 
FROM storage.buckets 
WHERE id = 'avatars';

-- فحص Policies
SELECT policyname, cmd as operation
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%vatar%'
ORDER BY policyname;
```

يجب أن ترى:
- ✅ Bucket `avatars` موجود و `public = true`
- ✅ 4 policies موجودة:
  - `Avatar upload for authenticated users`
  - `Avatar read for all`
  - `Avatar update for owner`
  - `Avatar delete for owner`

## 🎯 النتيجة المتوقعة

بعد تشغيل Migration بنجاح:
- ✅ رفع الصور سيعمل بدون أخطاء RLS
- ✅ المستخدمون يمكنهم رفع صورهم في مجلداتهم الخاصة
- ✅ الصور متاحة للقراءة العامة

