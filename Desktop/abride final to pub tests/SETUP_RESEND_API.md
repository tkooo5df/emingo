# 📧 إعداد Resend API لإرسال البريد الإلكتروني

## ✅ المعلومات المتوفرة

- **API Key:** `re_RqXhGuKv_H8UTTvUr6GjooHqMTHtUhVfF`
- **DNS Servers:** تم إعدادها ✅

## 🚀 خطوات الإعداد

### الخطوة 1: إضافة API Key إلى Supabase Secrets

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj)
2. اذهب إلى **Settings** → **Edge Functions** → **Secrets**
3. انقر على **Add a new secret**
4. أضف Secret:

```
Name: RESEND_API_KEY
Value: re_RqXhGuKv_H8UTTvUr6GjooHqMTHtUhVfF
```

5. انقر على **Save**

### الخطوة 2: التحقق من إعداد DNS في Resend

1. اذهب إلى [Resend Dashboard](https://resend.com/domains)
2. تأكد من أن النطاق `abride.online` مضاف ومُفعّل
3. تحقق من DNS Records:
   - ✅ SPF Record
   - ✅ DKIM Records
   - ✅ DMARC Record (اختياري)

### الخطوة 3: نشر Edge Function (إذا لم يكن منشوراً)

```bash
# تأكد من أنك في مجلد المشروع
cd "D:\amine codes\abridev4-codex-fix-completed-trip-visibility-in-search (2)\abridev4-codex-fix-completed-trip-visibility-in-search"

# تأكد من تثبيت Supabase CLI
npm install -g supabase

# سجل الدخول (إذا لم تكن مسجلاً)
supabase login

# اربط المشروع
supabase link --project-ref kobsavfggcnfemdzsnpj

# انشر Edge Function
supabase functions deploy send-email
```

### الخطوة 4: التحقق من النشر

1. في Supabase Dashboard:
   - اذهب إلى **Edge Functions**
   - تأكد من أن `send-email` موجودة وحالتها **Active**

2. اختبر Edge Function:
   - افتح Console في المتصفح
   - أكد حجز كسائق
   - يجب أن ترى:
     ```
     📧 Edge Function response status: 200 OK
     ✅ Email notification sent successfully
     ✅ Email provider: resend
     ```

## 🧪 اختبار يدوي

### من Console في المتصفح:

```javascript
fetch('https://kobsavfggcnfemdzsnpj.supabase.co/functions/v1/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvYnNhdmZnZ2NuZmVtZHpzbnBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTk3ODEsImV4cCI6MjA3NDM3NTc4MX0._TfXDauroKe8EAv_Fv4PQAZfOqk-rHbXAlF8bOU3-Qk'
  },
  body: JSON.stringify({
    to: 'YOUR_EMAIL@example.com', // ضع بريدك الإلكتروني هنا
    subject: 'اختبار من أبريد',
    html: '<h1>اختبار</h1><p>هذا بريد تجريبي من أبريد</p>',
    text: 'اختبار - هذا بريد تجريبي من أبريد'
  })
}).then(r => r.json()).then(console.log).catch(console.error);
```

### من Terminal:

```bash
curl -X POST https://kobsavfggcnfemdzsnpj.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvYnNhdmZnZ2NuZmVtZHpzbnBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTk3ODEsImV4cCI6MjA3NDM3NTc4MX0._TfXDauroKe8EAv_Fv4PQAZfOqk-rHbXAlF8bOU3-Qk" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_EMAIL@example.com",
    "subject": "اختبار من أبريد",
    "html": "<h1>اختبار</h1><p>هذا بريد تجريبي من أبريد</p>",
    "text": "اختبار - هذا بريد تجريبي من أبريد"
  }'
```

## 🔍 استكشاف الأخطاء

### الخطأ: 404 Not Found
**السبب:** Edge Function غير منشور
**الحل:** 
```bash
supabase functions deploy send-email
```

### الخطأ: 401 Unauthorized
**السبب:** API Key غير صحيح أو غير موجود في Secrets
**الحل:** 
1. تحقق من أن `RESEND_API_KEY` موجود في Supabase Secrets
2. تأكد من نسخ API Key بشكل صحيح

### الخطأ: Invalid API Key
**السبب:** API Key غير صحيح أو منتهي الصلاحية
**الحل:** 
1. تحقق من API Key في [Resend Dashboard](https://resend.com/api-keys)
2. أنشئ API Key جديد إذا لزم الأمر

### البريد لا يصل
**التحقق:**
1. ✅ تحقق من Resend Dashboard → Emails لرؤية حالة الإرسال
2. ✅ تحقق من Spam folder
3. ✅ تأكد من أن DNS records صحيحة في Resend Dashboard
4. ✅ راجع Console للأخطاء

## 📋 Checklist

- [ ] أضفت `RESEND_API_KEY` في Supabase Secrets
- [ ] نشرت Edge Function `send-email`
- [ ] تأكدت من أن النطاق `abride.online` مُفعّل في Resend
- [ ] تحققت من DNS Records في Resend Dashboard
- [ ] اختبرت إرسال بريد تجريبي
- [ ] تحققت من وصول البريد عند تأكيد الحجز

## 🎯 الخطوات التالية

بعد إكمال الإعداد:

1. **اختبر إرسال بريد:**
   - أكد حجز كسائق
   - تحقق من وصول البريد للراكب

2. **راقب Logs:**
   - Supabase Dashboard → Edge Functions → send-email → Logs
   - Resend Dashboard → Emails

3. **تحقق من DNS:**
   - تأكد من أن جميع DNS records صحيحة في Resend Dashboard
   - انتظر 24-48 ساعة لانتشار DNS إذا كنت قد أضفتها للتو

## 📞 الدعم

إذا واجهت مشاكل:
1. راجع سجلات Edge Function في Supabase Dashboard
2. راجع Emails في Resend Dashboard
3. تحقق من Console في المتصفح
4. راجع `DEPLOY_EMAIL_FUNCTION.md` للتفاصيل الكاملة

