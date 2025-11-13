# 🚀 خطوات إعداد Resend API - دليل سريع

## ✅ المعلومات المتوفرة

- **API Key:** `re_RqXhGuKv_H8UTTvUr6GjooHqMTHtUhVfF`
- **DNS Servers:** تم إعدادها ✅
- **From Email:** `noreply@abride.online`

## 📋 خطوات الإعداد (خطوة بخطوة)

### 1️⃣ إضافة API Key إلى Supabase Secrets

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj/settings/functions)
2. في القائمة الجانبية، اختر **Settings** → **Edge Functions**
3. انقر على تبويب **Secrets**
4. انقر على **Add a new secret**
5. املأ البيانات:
   ```
   Name: RESEND_API_KEY
   Value: re_RqXhGuKv_H8UTTvUr6GjooHqMTHtUhVfF
   ```
6. انقر على **Save**

### 2️⃣ التحقق من Domain في Resend

1. اذهب إلى [Resend Dashboard](https://resend.com/domains)
2. تأكد من وجود النطاق `abride.online`
3. تحقق من حالة النطاق:
   - ✅ **Verified** - جاهز للاستخدام
   - ⚠️ **Pending** - في انتظار التحقق من DNS
   - ❌ **Failed** - تحقق من DNS records

4. إذا كان النطاق غير موجود:
   - انقر على **Add Domain**
   - أدخل `abride.online`
   - اتبع التعليمات لإضافة DNS records

### 3️⃣ التحقق من DNS Records

في Resend Dashboard → Domains → `abride.online` → DNS Records:

يجب أن ترى:
- ✅ **SPF Record** - موجود ومُفعّل
- ✅ **DKIM Records** - موجودة ومُفعّلة
- ✅ **DMARC Record** (اختياري) - موجود

إذا كانت أي من السجلات مفقودة أو غير صحيحة:
1. انسخ القيمة من Resend
2. أضفها في DNS Provider (Namecheap أو أي مزود DNS)
3. انتظر 24-48 ساعة لانتشار DNS

### 4️⃣ نشر Edge Function

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

### 5️⃣ التحقق من النشر

1. في Supabase Dashboard:
   - اذهب إلى **Edge Functions**
   - تأكد من أن `send-email` موجودة
   - تأكد من أن الحالة: **Active**

2. اختبر Edge Function:
   - افتح Console في المتصفح
   - أكد حجز كسائق
   - يجب أن ترى:
     ```
     📧 Using Resend API
     📧 From: أبريد <noreply@abride.online>
     ✅ Email sent via Resend successfully
     ```

## 🧪 اختبار يدوي سريع

### من Console في المتصفح:

```javascript
// استبدل YOUR_EMAIL@example.com ببريدك الإلكتروني
fetch('https://kobsavfggcnfemdzsnpj.supabase.co/functions/v1/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvYnNhdmZnZ2NuZmVtZHpzbnBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTk3ODEsImV4cCI6MjA3NDM3NTc4MX0._TfXDauroKe8EAv_Fv4PQAZfOqk-rHbXAlF8bOU3-Qk'
  },
  body: JSON.stringify({
    to: 'YOUR_EMAIL@example.com',
    subject: '🧪 اختبار من أبريد',
    html: '<h1>اختبار</h1><p>هذا بريد تجريبي من أبريد للتأكد من أن الإعداد يعمل بشكل صحيح.</p>',
    text: 'اختبار - هذا بريد تجريبي من أبريد'
  })
})
.then(r => r.json())
.then(result => {
  console.log('✅ النتيجة:', result);
  if (result.success) {
    console.log('✅ البريد أُرسل بنجاح عبر', result.provider);
  } else {
    console.error('❌ فشل الإرسال:', result);
  }
})
.catch(error => {
  console.error('❌ خطأ:', error);
});
```

## 🔍 استكشاف الأخطاء

### ❌ الخطأ: 404 Not Found
**السبب:** Edge Function غير منشور  
**الحل:** 
```bash
supabase functions deploy send-email
```

### ❌ الخطأ: 401 Unauthorized
**السبب:** API Key غير صحيح  
**الحل:** 
1. تحقق من أن `RESEND_API_KEY` موجود في Supabase Secrets
2. تأكد من نسخ API Key بشكل صحيح (بدون مسافات)
3. تأكد من أن API Key لا يزال نشطاً في Resend Dashboard

### ❌ الخطأ: 422 Validation Error
**السبب:** Domain غير مُفعّل أو `from` email غير صحيح  
**الحل:** 
1. تحقق من أن `abride.online` مُفعّل في Resend Dashboard
2. تأكد من أن DNS records صحيحة
3. تأكد من أن `noreply@abride.online` مسموح به في Resend

### ❌ البريد لا يصل
**التحقق:**
1. ✅ تحقق من Resend Dashboard → **Emails** لرؤية حالة الإرسال
2. ✅ تحقق من **Spam** folder
3. ✅ تحقق من Console للأخطاء
4. ✅ راجع Logs في Supabase Dashboard → Edge Functions → send-email → Logs

## 📊 مراقبة الإرسال

### في Resend Dashboard:
1. اذهب إلى [Resend Dashboard → Emails](https://resend.com/emails)
2. ستجد جميع البريد المرسل
3. يمكنك رؤية:
   - ✅ **Delivered** - تم التسليم
   - ⚠️ **Bounced** - فشل التسليم
   - ⏳ **Pending** - قيد الإرسال

### في Supabase Dashboard:
1. اذهب إلى **Edge Functions** → **send-email** → **Logs**
2. ستجد سجلات مفصلة لكل استدعاء
3. ابحث عن:
   - `✅ Email sent via Resend successfully`
   - `❌ Resend API error` (إذا كان هناك خطأ)

## ✅ Checklist النهائي

- [ ] أضفت `RESEND_API_KEY` في Supabase Secrets
- [ ] تأكدت من أن النطاق `abride.online` موجود في Resend
- [ ] تحققت من أن DNS records صحيحة (SPF, DKIM)
- [ ] نشرت Edge Function `send-email`
- [ ] اختبرت إرسال بريد تجريبي
- [ ] تحققت من وصول البريد
- [ ] اختبرت تأكيد الحجز وراقبت Console

## 🎯 الخطوات التالية

بعد إكمال الإعداد:

1. **اختبر في التطبيق:**
   - أكد حجز كسائق
   - تحقق من وصول البريد للراكب

2. **راقب Logs:**
   - Supabase Dashboard → Edge Functions → send-email → Logs
   - Resend Dashboard → Emails

3. **تحقق من DNS:**
   - إذا كنت قد أضفت DNS للتو، انتظر 24-48 ساعة
   - تحقق من Resend Dashboard للتأكد من أن النطاق **Verified**

## 🆘 إذا استمرت المشكلة

1. **راجع Logs:**
   - Supabase Dashboard → Edge Functions → send-email → Logs
   - Resend Dashboard → Emails

2. **تحقق من Console:**
   - افتح Developer Tools → Console
   - ابحث عن رسائل `📧` و `❌`

3. **تحقق من Secrets:**
   - تأكد من أن `RESEND_API_KEY` موجود في Supabase Secrets
   - تأكد من نسخ API Key بشكل صحيح

4. **تواصل مع الدعم:**
   - [Resend Support](https://resend.com/support)
   - راجع `DEPLOY_EMAIL_FUNCTION.md` للتفاصيل الكاملة

