# ⚡ إعداد Resend API - دليل سريع

## ✅ المعلومات الجاهزة

- **API Key:** `re_RqXhGuKv_H8UTTvUr6GjooHqMTHtUhVfF`
- **DNS Servers:** ✅ تم إعدادها
- **From Email:** `noreply@abride.online`

## 🚀 الخطوات (5 دقائق)

### الخطوة 1: إضافة API Key إلى Supabase

1. افتح [Supabase Dashboard](https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj/settings/functions)
2. في القائمة الجانبية: **Settings** → **Edge Functions**
3. اختر تبويب **Secrets**
4. انقر **Add a new secret**
5. املأ:
   ```
   Name: RESEND_API_KEY
   Value: re_RqXhGuKv_H8UTTvUr6GjooHqMTHtUhVfF
   ```
6. انقر **Save**

### الخطوة 2: التحقق من Domain في Resend

1. افتح [Resend Dashboard → Domains](https://resend.com/domains)
2. تأكد من وجود `abride.online`
3. تحقق من الحالة:
   - ✅ **Verified** = جاهز
   - ⚠️ **Pending** = في انتظار DNS (انتظر 24-48 ساعة)
   - ❌ **Failed** = تحقق من DNS records

### الخطوة 3: نشر Edge Function

افتح Terminal/PowerShell في مجلد المشروع واكتب:

```bash
# تأكد من تثبيت Supabase CLI
npm install -g supabase

# سجل الدخول
supabase login

# اربط المشروع
supabase link --project-ref kobsavfggcnfemdzsnpj

# انشر Edge Function
supabase functions deploy send-email
```

### الخطوة 4: الاختبار

#### أ) اختبار من Console:

افتح Console في المتصفح (F12) والصق:

```javascript
fetch('https://kobsavfggcnfemdzsnpj.supabase.co/functions/v1/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvYnNhdmZnZ2NuZmVtZHpzbnBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTk3ODEsImV4cCI6MjA3NDM3NTc4MX0._TfXDauroKe8EAv_Fv4PQAZfOqk-rHbXAlF8bOU3-Qk'
  },
  body: JSON.stringify({
    to: 'YOUR_EMAIL@example.com', // ضع بريدك هنا
    subject: '🧪 اختبار من أبريد',
    html: '<h1>اختبار</h1><p>إذا وصلت هذه الرسالة، الإعداد يعمل!</p>',
    text: 'اختبار - إذا وصلت هذه الرسالة، الإعداد يعمل!'
  })
}).then(r => r.json()).then(console.log);
```

#### ب) اختبار في التطبيق:

1. أكد حجز كسائق
2. افتح Console
3. يجب أن ترى:
   ```
   📧 Using Resend API
   ✅ Email sent via Resend successfully
   ```
4. تحقق من بريد الراكب

## 🔍 التحقق من النجاح

### ✅ في Console يجب أن ترى:
```
📧 Using Resend API
📧 From: أبريد <noreply@abride.online>
📧 To: [email]
✅ Email sent via Resend successfully
✅ Email provider: resend
```

### ✅ في Resend Dashboard:
1. اذهب إلى [Resend → Emails](https://resend.com/emails)
2. يجب أن ترى البريد المرسل
3. الحالة: **Delivered** ✅

### ✅ في البريد:
- تحقق من Inbox
- تحقق من Spam folder
- البريد من: `noreply@abride.online`

## ❌ إذا لم يعمل

### الخطأ: 404
**الحل:** انشر Edge Function:
```bash
supabase functions deploy send-email
```

### الخطأ: 401/403
**الحل:** تحقق من API Key في Supabase Secrets

### الخطأ: 422
**الحل:** 
- تحقق من أن `abride.online` مُفعّل في Resend
- تحقق من DNS records

### البريد لا يصل
**التحقق:**
1. Resend Dashboard → Emails (لرؤية حالة الإرسال)
2. Spam folder
3. Console للأخطاء
4. Supabase Dashboard → Edge Functions → send-email → Logs

## 📞 الدعم

- راجع `RESEND_SETUP_STEPS.md` للتفاصيل الكاملة
- راجع `DEPLOY_EMAIL_FUNCTION.md` لإصلاح الأخطاء

