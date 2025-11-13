# 🔗 ربط الموقع مع abride.online

## 📋 خطوات الربط مع Supabase

### 1. تحديث Site URL في Supabase Dashboard

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك: `kobsavfggcnfemdzsnpj`
3. اذهب إلى **Authentication** → **URL Configuration**
4. قم بتحديث:

   **Site URL:**
   ```
   https://abride.online
   ```

   **Redirect URLs:**
   ```
   https://abride.online/**
   https://abride.online/auth/callback
   https://abride.online/auth/confirm
   https://abride.online/auth/reset-password
   ```

### 2. تحديث إعدادات البريد الإلكتروني

في **Authentication** → **Email Templates**:

- **Confirm Signup**: استخدم القالب الجديد مع `{{ .ConfirmationURL }}`
- **Reset Password**: استخدم القالب الجديد مع `{{ .ConfirmationURL }}`

الروابط ستُولد تلقائياً باستخدام `https://abride.online` كـ Site URL.

### 3. إعدادات Fly.io (إذا كنت تستخدمه)

إذا كان الموقع منشوراً على Fly.io:

```bash
# تحديث متغيرات البيئة
flyctl secrets set VITE_SITE_URL=https://abride.online --app abride-app
```

### 4. تحديث CORS Origins (إذا لزم الأمر)

في Supabase Dashboard → **Settings** → **API**:

أضف إلى **CORS Origins**:
```
https://abride.online
```

---

## ✅ التحقق من الإعدادات

بعد التحديث، تحقق من:

1. ✅ Site URL = `https://abride.online`
2. ✅ Redirect URLs تحتوي على `https://abride.online/**`
3. ✅ روابط التأكيد في البريد الإلكتروني تبدأ بـ `https://abride.online`

---

## 🔍 ملاحظات

- بعد تحديث Site URL في Supabase، جميع روابط التأكيد وإعادة تعيين كلمة المرور ستستخدم `abride.online`
- تأكد من أن النطاق `abride.online` يشير إلى موقعك
- قد يستغرق تحديث الإعدادات بضع دقائق

---

**تاريخ التحديث**: $(Get-Date -Format "yyyy-MM-dd")

