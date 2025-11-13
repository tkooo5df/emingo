# إعداد Supabase Storage لصور الملفات الشخصية

## 🚨 المشكلة
الصور لا يتم رفعها إلى Supabase Storage عند إنشاء الحساب.

## ✅ الحل - تشغيل Migration

### الخطوة 1: تشغيل Migration في Supabase

اذهب إلى **Supabase Dashboard → SQL Editor** وشغل الملف:

```bash
supabase/migrations/20260210000000_setup_avatars_storage.sql
```

أو انسخ محتوى الملف وألصقه في SQL Editor واضغط **Run**.

### الخطوة 2: التحقق من إنشاء Bucket

بعد تشغيل الـ Migration، تحقق من:

1. **اذهب إلى Storage في Supabase Dashboard**
2. يجب أن ترى bucket اسمه `avatars`
3. تأكد أن الـ bucket **Public** (عام)

## 🔍 التحقق من الإعداد

### 1. فحص Bucket:
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

### 2. فحص السياسات:
```sql
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%vatar%';
```

**يجب أن ترى 4 سياسات:**
1. `Avatar upload for authenticated users` - INSERT
2. `Avatar read for all` - SELECT
3. `Avatar update for owner` - UPDATE
4. `Avatar delete for owner` - DELETE

## 🧪 اختبار رفع الصور

### طريقة 1: من التطبيق
1. اذهب إلى صفحة التسجيل
2. اختر صورة
3. أكمل التسجيل
4. افتح **Console في المتصفح** (F12)
5. راقب الأخطاء (إن وجدت)

### طريقة 2: اختبار من SQL
```sql
-- التحقق من رفع صورة (بعد التسجيل)
SELECT 
  name,
  bucket_id,
  created_at,
  updated_at
FROM storage.objects 
WHERE bucket_id = 'avatars'
ORDER BY created_at DESC
LIMIT 5;
```

### طريقة 3: التحقق من Profile
```sql
-- فحص روابط الصور في البروفايلات
SELECT 
  id,
  email,
  full_name,
  avatar_url,
  created_at
FROM profiles 
WHERE avatar_url IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
```

## 🐛 حل المشاكل الشائعة

### المشكلة 1: "Bucket does not exist"
**الحل:** 
```sql
-- إنشاء الـ bucket يدوياً
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;
```

### المشكلة 2: "Permission denied"
**الحل:**
```sql
-- التحقق من السياسات
SELECT * FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- إذا لم تكن موجودة، شغل Migration مرة أخرى
```

### المشكلة 3: الصورة ترفع لكن لا تظهر
**الحل:**
```sql
-- تأكد أن الـ bucket عام (public)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'avatars';
```

### المشكلة 4: CORS Error
**الحل:**
- تأكد أن الـ bucket **Public**
- راجع إعدادات CORS في Supabase Dashboard

## 📊 بنية المسار للصور

```
avatars/
  ├── {user_id}/
  │   └── avatar-{timestamp}.jpg
  ├── {user_id2}/
  │   └── avatar-{timestamp}.jpg
  └── ...
```

**مثال:**
```
avatars/123e4567-e89b-12d3-a456-426614174000/avatar-1645123456789.jpg
```

## 🔗 الرابط العام للصورة

**الصيغة:**
```
https://{project_ref}.supabase.co/storage/v1/object/public/avatars/{user_id}/avatar-{timestamp}.jpg
```

**مثال:**
```
https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatars/123e4567.../avatar-1645123456789.jpg
```

## 🎯 ملخص الخطوات

1. ✅ **شغل Migration** - `20260210000000_setup_avatars_storage.sql`
2. ✅ **تحقق من Bucket** - في Storage Dashboard
3. ✅ **تحقق من السياسات** - 4 سياسات
4. ✅ **اختبر رفع صورة** - من التسجيل
5. ✅ **تحقق من النتيجة** - في Console و SQL

## 📝 ملاحظات مهمة

- ✅ الـ bucket يجب أن يكون **Public** لعرض الصور
- ✅ السياسات تسمح للمستخدمين المصادق عليهم فقط برفع الصور
- ✅ الجميع يمكنهم رؤية الصور (قراءة عامة)
- ✅ كل مستخدم يمكنه تعديل/حذف صوره فقط

## 🚀 بعد الإعداد

بعد تشغيل Migration بنجاح:
1. جرب إنشاء حساب جديد مع صورة
2. تحقق من رفع الصورة في Storage
3. تحقق من ظهور الصورة في Dashboard
4. تحقق من عدم وجود أخطاء في Console

---

**إذا واجهت أي مشكلة، راجع القسم "حل المشاكل الشائعة" أعلاه! 🔧**

