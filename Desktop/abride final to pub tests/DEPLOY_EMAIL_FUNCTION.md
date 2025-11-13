# 📧 دليل نشر Edge Function لإرسال البريد الإلكتروني

## المشكلة
البريد الإلكتروني لا يصل للراكب عند تأكيد الحجز لأن Edge Function `send-email` غير موجود أو غير منشور.

## الحل

### 1. نشر Edge Function

#### الطريقة الأولى: باستخدام Supabase CLI (موصى به)

```bash
# 1. تأكد من تثبيت Supabase CLI
npm install -g supabase

# 2. سجل الدخول إلى Supabase
supabase login

# 3. اربط المشروع
supabase link --project-ref kobsavfggcnfemdzsnpj

# 4. انشر Edge Function
supabase functions deploy send-email
```

#### الطريقة الثانية: من Supabase Dashboard

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك: `kobsavfggcnfemdzsnpj`
3. اذهب إلى **Edge Functions**
4. انقر على **Create a new function**
5. اسم الدالة: `send-email`
6. انسخ محتوى `supabase/functions/send-email/index.ts`
7. انشر الدالة

### 2. إعداد Secrets في Supabase

يجب إضافة Secrets التالية في Supabase Dashboard:

1. اذهب إلى **Settings** → **Edge Functions** → **Secrets**

#### الخيار 1: استخدام Resend (موصى به)

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

للحصول على API Key:
1. سجّل في [Resend.com](https://resend.com)
2. أنشئ API Key
3. أضفه في Supabase Secrets

#### الخيار 2: استخدام Mailrelay

```
MAILRELAY_API_KEY=EmdDkZg__JXYqztNvz5uKFVNkkXZgrHJsPqhJ9ta
MAILRELAY_ACCOUNT=abride.ipzmarketing.com
FROM_EMAIL=noreply@abride.online
```

### 3. التحقق من النشر

بعد النشر، تحقق من:

1. **في Supabase Dashboard:**
   - اذهب إلى **Edge Functions** → **send-email**
   - تأكد من أن الحالة: **Active**

2. **في Console:**
   - افتح Developer Tools
   - عند تأكيد الحجز، يجب أن ترى:
   ```
   📧 Edge Function response status: 200 OK
   ✅ Email notification sent successfully
   ```

### 4. اختبار Edge Function

#### من المتصفح (Console):
```javascript
fetch('https://kobsavfggcnfemdzsnpj.supabase.co/functions/v1/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    to: 'test@example.com',
    subject: 'اختبار',
    html: '<h1>اختبار</h1>',
    text: 'اختبار'
  })
}).then(r => r.json()).then(console.log);
```

#### من Terminal:
```bash
curl -X POST https://kobsavfggcnfemdzsnpj.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "اختبار",
    "html": "<h1>اختبار</h1>",
    "text": "اختبار"
  }'
```

## استكشاف الأخطاء

### الخطأ: 404 Not Found
**السبب:** Edge Function غير منشور
**الحل:** انشر Edge Function باستخدام `supabase functions deploy send-email`

### الخطأ: 401 Unauthorized
**السبب:** API Key غير صحيح
**الحل:** تحقق من `RESEND_API_KEY` أو `MAILRELAY_API_KEY` في Supabase Secrets

### الخطأ: 500 Internal Server Error
**السبب:** خطأ في Edge Function
**الحل:** 
1. اذهب إلى Supabase Dashboard → Edge Functions → send-email → Logs
2. راجع سجلات الأخطاء
3. تحقق من Secrets

### البريد لا يصل
**التحقق:**
1. تأكد من أن البريد الإلكتروني للراكب موجود في قاعدة البيانات
2. تحقق من Console للأخطاء
3. راجع سجلات Edge Function في Supabase Dashboard
4. تأكد من أن Secrets مُعدّة بشكل صحيح

## ملاحظات

- ✅ Edge Function يدعم Resend و Mailrelay
- ✅ إذا فشل أحد الخدمات، سيحاول استخدام الأخرى
- ✅ البريد الإلكتروني يُرسل تلقائياً عند تأكيد الحجز
- ✅ الإشعارات داخل التطبيق تعمل حتى لو فشل البريد

## الدعم

إذا استمرت المشكلة:
1. راجع سجلات Edge Function في Supabase Dashboard
2. تحقق من Console في المتصفح
3. تأكد من إعدادات Secrets
4. راجع `supabase/QUICK_EMAIL_FIX.md` لإعداد SMTP

