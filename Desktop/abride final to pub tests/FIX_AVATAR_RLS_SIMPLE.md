# 🚨 إصلاح عاجل - RLS Policies للصور

## المشكلة
❌ خطأ: `new row violates row-level security policy` عند رفع الصور

## ✅ الحل السريع

### شغّل Migration في Supabase SQL Editor

**الرابط:**
https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj/editor/sql

**الملف:**
`supabase/migrations/20260211000003_fix_avatar_rls_only.sql`

### الخطوات:
1. افتح SQL Editor
2. اضغط **New Query**
3. انسخ محتوى الملف: `supabase/migrations/20260211000003_fix_avatar_rls_only.sql`
4. الصق في SQL Editor
5. اضغط **Run**

## 📋 ما يقوم به Migration

1. ✅ إنشاء bucket `avatars` إذا لم يكن موجوداً
2. ✅ حذف جميع السياسات القديمة
3. ✅ إنشاء 4 سياسات جديدة بسيطة:
   - `Avatar upload for authenticated users` (INSERT)
   - `Avatar read for all` (SELECT)
   - `Avatar update for owner` (UPDATE)
   - `Avatar delete for owner` (DELETE)

## 🔍 بعد التشغيل

بعد تشغيل Migration، يجب أن ترى:
- ✅ رسالة نجاح
- ✅ نتائج فحص Bucket (يجب أن ترى `avatars`)
- ✅ نتائج فحص Policies (يجب أن ترى 4 policies)

## 🧪 اختبار

بعد Migration:
1. سجّل حساب جديد (راكب أو سائق)
2. اختر صورة
3. أكمل التسجيل
4. افتح Console (F12) - يجب أن ترى:
   - ✅ `✅ تم رفع الصورة بنجاح!`
   - ✅ `✅ تم حفظ رابط الصورة في البروفايل بنجاح!`

---

**ملاحظة:** هذا Migration أبسط من السابق ويركز فقط على RLS policies للصور.

