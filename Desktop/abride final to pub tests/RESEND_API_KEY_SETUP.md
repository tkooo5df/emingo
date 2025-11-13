# 🔑 إضافة RESEND_API_KEY إلى Supabase - دليل سريع

## ✅ تم نشر Edge Function بنجاح!

**Function:** `send-email`  
**Version:** 16  
**Status:** ACTIVE ✅

## 📋 الخطوة المطلوبة: إضافة API Key

### الطريقة السريعة:

1. **افتح الرابط مباشرة:**
   [إضافة Secret في Supabase](https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj/settings/functions/secrets)

2. **أو اتبع الخطوات:**
   - اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj)
   - **Settings** → **Edge Functions** → **Secrets**
   - انقر **Add a new secret**
   - املأ:
     ```
     Name: RESEND_API_KEY
     Value: re_RqXhGuKv_H8UTTvUr6GjooHqMTHtUhVfF
     ```
   - انقر **Save**

## ✅ التحقق من الإعداد:

بعد إضافة API Key، اختبر:

```javascript
// من Console في المتصفح
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
    text: 'اختبار'
  })
}).then(r => r.json()).then(result => {
  console.log('✅ النتيجة:', result);
  if (result.success) {
    console.log('✅ البريد أُرسل بنجاح عبر', result.provider);
  }
});
```

## 🎯 النتيجة المتوقعة:

- ✅ عند تأكيد الحجز: البريد يُرسل للراكب تلقائياً
- ✅ في Console: `✅ Email sent via Resend successfully`
- ✅ في Resend Dashboard: ستجد البريد المرسل

## 📞 إذا لم يعمل:

1. تحقق من أن API Key موجود في Secrets
2. راجع Logs في Supabase Dashboard
3. تحقق من Console للأخطاء
4. تأكد من أن `abride.online` مُفعّل في Resend Dashboard

