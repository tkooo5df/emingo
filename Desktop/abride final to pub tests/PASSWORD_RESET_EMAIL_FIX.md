# 🔐 حل مشكلة إعادة تعيين كلمة المرور - البريد الإلكتروني لا يصل

## 🐛 المشكلة
الموقع يخبر المستخدم بأن رابط إعادة التعيين تم إرساله، لكن البريد الإلكتروني لا يصل.

## 🔍 الأسباب المحتملة

1. **إعدادات SMTP غير مضبوطة في Supabase**
2. **البريد يذهب إلى Spam/Junk**
3. **Email Template غير مضبوط بشكل صحيح**
4. **Site URL أو Redirect URLs غير صحيحة**
5. **إعدادات Email Provider في Supabase غير مفعلة**

## ✅ الحلول

### 1. التحقق من إعدادات Supabase Auth Email

#### أ. الذهاب إلى Supabase Dashboard
1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك: `kobsavfggcnfemdzsnpj`
3. اذهب إلى **Authentication** → **Email Templates**

#### ب. التحقق من Reset Password Template
تأكد من وجود **Reset Password** template وأنه يحتوي على:
- **Subject**: يمكن تخصيصه (مثل: "إعادة تعيين كلمة المرور")
- **Body**: يجب أن يحتوي على `{{ .ConfirmationURL }}` أو `{{ .ConfirmationLink }}`

#### مثال للقالب:
```html
<h2>إعادة تعيين كلمة المرور</h2>
<p>لإعادة تعيين كلمة المرور، اضغط على الرابط التالي:</p>
<p><a href="{{ .ConfirmationURL }}">إعادة تعيين كلمة المرور</a></p>
<p>أو انسخ الرابط التالي إلى المتصفح:</p>
<p>{{ .ConfirmationURL }}</p>
<p>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة.</p>
```

### 2. التحقق من Site URL و Redirect URLs

#### أ. الذهاب إلى URL Configuration
1. في Supabase Dashboard
2. اذهب إلى **Authentication** → **URL Configuration**

#### ب. التحقق من الإعدادات:
**Site URL:**
```
https://abride.online
```
أو إذا كنت تستخدم localhost للتطوير:
```
http://localhost:5173
```

**Redirect URLs:**
```
https://abride.online/**
https://abride.online/reset-password
https://abride.online/auth/callback
http://localhost:5173/reset-password
http://localhost:5173/**
```

### 3. إعداد Custom SMTP (مهم جداً!)

Supabase يستخدم SMTP افتراضي محدود. لإرسال البريد بشكل موثوق:

#### أ. الذهاب إلى Settings
1. في Supabase Dashboard
2. اذهب إلى **Settings** → **Auth**
3. ابحث عن **SMTP Settings**

#### ب. إعداد Custom SMTP
يمكنك استخدام:
- **Resend** (موصى به)
- **SendGrid**
- **Mailgun**
- **Amazon SES**
- **Gmail SMTP** (للتطوير فقط)

#### مثال لإعداد Resend:
1. اذهب إلى [Resend.com](https://resend.com)
2. أنشئ حساب وحصل على API Key
3. في Supabase Dashboard → **Settings** → **Auth** → **SMTP Settings**:
   - **Enable Custom SMTP**: ✅
   - **SMTP Host**: `smtp.resend.com`
   - **SMTP Port**: `465` (SSL) أو `587` (TLS)
   - **SMTP User**: `resend`
   - **SMTP Password**: `[Your Resend API Key]`
   - **Sender Email**: `noreply@abride.online` (أو `onboarding@resend.dev` للتطوير)
   - **Sender Name**: `أبريد`

### 4. التحقق من Email Provider Settings

#### أ. في Supabase Dashboard
1. اذهب إلى **Settings** → **Auth**
2. تأكد من أن **Enable Email Signup** = ✅
3. تأكد من أن **Enable Email Confirmations** = ✅ (اختياري، لكن موصى به)

### 5. التحقق من Logs في Supabase

#### أ. فحص Logs
1. اذهب إلى **Logs** → **Auth Logs**
2. ابحث عن محاولات إرسال البريد
3. تحقق من أي أخطاء في الإرسال

### 6. اختبار إرسال البريد

#### أ. استخدام Supabase Dashboard
1. اذهب إلى **Authentication** → **Users**
2. اختر مستخدم
3. انقر على **Send Password Reset Email**
4. تحقق من وصول البريد

#### ب. استخدام الكود
في Console المتصفح، جرب:
```javascript
// في Console المتصفح
const { data, error } = await supabase.auth.resetPasswordForEmail('your-email@example.com', {
  redirectTo: 'https://abride.online/reset-password'
});
console.log('Result:', data, error);
```

## 🔧 إصلاحات الكود

### 1. تحديث ForgotPassword.tsx
تم تحديث الكود لاستخدام `VITE_SITE_URL` إذا كان موجوداً، وإلا يستخدم `window.location.origin`.

### 2. تحديث ResetPassword.tsx
تم تحديث الكود للتعامل مع password reset tokens من URL hash بشكل صحيح.

## 📋 Checklist للتحقق

- [ ] Site URL مضبوط بشكل صحيح في Supabase
- [ ] Redirect URLs تحتوي على `/reset-password`
- [ ] Reset Password Email Template موجود ويحتوي على `{{ .ConfirmationURL }}`
- [ ] Custom SMTP مضبوط (أو على الأقل Email Provider مفعل)
- [ ] Sender Email مضبوط بشكل صحيح
- [ ] البريد لا يذهب إلى Spam (تحقق من Spam folder)
- [ ] Logs في Supabase لا تظهر أخطاء

## 🚨 إذا استمرت المشكلة

1. **تحقق من Spam Folder**: البريد قد يكون في مجلد الرسائل غير المرغوب فيها
2. **تحقق من Email Address**: تأكد من أن البريد الإلكتروني صحيح
3. **تحقق من Rate Limiting**: قد يكون هناك حد للطلبات (انتظر دقيقة واحدة)
4. **تحقق من Logs**: راجع Logs في Supabase Dashboard للبحث عن أخطاء
5. **اتصل بدعم Supabase**: إذا كانت المشكلة في Supabase نفسه

## 📝 ملاحظات إضافية

- **Development vs Production**: تأكد من استخدام Site URL الصحيح للتطوير والإنتاج
- **Email Templates**: يمكن تخصيص قوالب البريد في Supabase Dashboard
- **SMTP Limits**: إذا كنت تستخدم SMTP مجاني، قد يكون هناك حدود على عدد الرسائل
- **Email Deliverability**: لتحسين وصول البريد، استخدم Custom SMTP مع نطاق مخصص

## 🔗 روابط مفيدة

- [Supabase Auth Email Configuration](https://supabase.com/docs/guides/auth/auth-email)
- [Supabase SMTP Settings](https://supabase.com/docs/guides/auth/auth-smtp)
- [Resend Documentation](https://resend.com/docs)
- [Email Template Variables](https://supabase.com/docs/guides/auth/auth-email-templates)

