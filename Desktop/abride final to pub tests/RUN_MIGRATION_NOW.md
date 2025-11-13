# 🚀 تشغيل Migration الآن

## ✅ Migration جاهز للتشغيل

**الملف:** `supabase/migrations/20260211000006_fix_avatar_rls_simple.sql`

## 📋 خطوات سريعة

### الطريقة 1: عبر Supabase SQL Editor (موصى بها)

1. **افتح SQL Editor:**
   https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj/editor/sql

2. **اضغط "New Query"**

3. **انسخ محتوى الملف:**
   `supabase/migrations/20260211000006_fix_avatar_rls_simple.sql`

4. **الصق في SQL Editor**

5. **اضغط "Run" أو Ctrl+Enter**

### الطريقة 2: عبر PowerShell Script

شغّل:
```powershell
powershell -ExecutionPolicy Bypass -File run-avatar-migration.ps1
```

هذا سيعرض SQL ويساعدك في نسخه.

### الطريقة 3: عبر Supabase CLI (إذا كان مربوط)

```bash
# تأكد من أنك مربوط بالمشروع
npx supabase link --project-ref kobsavfggcnfemdzsnpj

# شغّل Migration
npx supabase db push
```

## ✅ بعد التشغيل

بعد تشغيل Migration بنجاح:

1. ✅ Bucket `avatars` موجود و public
2. ✅ 4 RLS policies موجودة
3. ✅ رفع الصور يعمل للمستخدمين الجدد
4. ✅ الصور تُحفظ في Storage
5. ✅ رابط الصورة يُحفظ في البروفايل

## 🧪 اختبار

بعد Migration:
1. سجّل حساب جديد (راكب أو سائق)
2. اختر صورة
3. أكمل التسجيل
4. افتح Console (F12)
5. تحقق من:
   - ✅ `✅ تم رفع الصورة بنجاح!`
   - ✅ `✅ تم حفظ رابط الصورة في البروفايل بنجاح!`

---

**ملاحظة:** Migration آمن ويمكن تشغيله عدة مرات (idempotent).

