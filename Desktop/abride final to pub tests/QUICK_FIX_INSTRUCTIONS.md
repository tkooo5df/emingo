# 🚀 تعليمات سريعة لإصلاح المشاكل

## المشاكل الحالية:
1. ❌ **خطأ RLS في رفع الصور**: `new row violates row-level security policy`
2. ❌ **خطأ constraint في notifications**: `violates check constraint "notifications_category_check"`

## ✅ الحل: تشغيل Migration

### الخطوة 1: افتح Supabase SQL Editor
**الرابط المباشر:**
https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj/editor/sql

### الخطوة 2: شغّل Migration
1. اضغط **New Query**
2. انسخ محتوى الملف: `supabase/migrations/20260211000002_fix_all_issues.sql`
3. الصق في SQL Editor
4. اضغط **Run** أو `Ctrl+Enter`

### الخطوة 3: التحقق من النجاح
بعد التشغيل، يجب أن ترى:
- ✅ رسالة نجاح
- ✅ نتائج فحص Bucket (يجب أن ترى `avatars` bucket)
- ✅ نتائج فحص Policies (يجب أن ترى 4 policies)
- ✅ نتائج فحص Constraint (يجب أن ترى constraint محدث)

## 📋 ملف Migration
`supabase/migrations/20260211000002_fix_all_issues.sql`

هذا الملف يحتوي على:
1. إصلاح سياسات RLS للصور (4 policies)
2. إصلاح constraint للـ category في notifications (إضافة 'user')

## 🔍 بعد التشغيل
بعد تشغيل Migration بنجاح:
- ✅ رفع الصور سيعمل بدون أخطاء
- ✅ الإشعارات ستعمل بدون أخطاء constraint
- ✅ جميع الوظائف ستعمل بشكل طبيعي

---

**ملاحظة:** إذا واجهت أي مشاكل، تحقق من:
1. أنك مسجل الدخول إلى Supabase Dashboard
2. أنك في المشروع الصحيح (`kobsavfggcnfemdzsnpj`)
3. أن لديك صلاحيات لتشغيل SQL

