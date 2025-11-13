# 📧 دليل إعداد Mailrelay API لإرسال البريد الإلكتروني

## نظرة عامة

تم تحديث Edge Function `send-email` لاستخدام Mailrelay REST API بدلاً من SMTP مباشرة. هذا يحل مشاكل DKIM ويزيد من موثوقية إرسال البريد.

## المزايا

- ⚠️ **DKIM مطلوب**: Mailrelay API يتطلب DKIM حتى عند استخدام API (راجع `DKIM_REQUIRED_FOR_API.md`)
- ✅ **موثوقية أعلى**: API أكثر موثوقية من SMTP
- ✅ **تتبع أفضل**: يمكن تتبع حالة البريد عبر API
- ✅ **أخطاء أوضح**: رسائل خطأ أكثر وضوحاً من API

## الإعدادات

### 1. متغيرات البيئة في Supabase

اذهب إلى Supabase Dashboard → **Project Settings** → **Edge Functions** → **Secrets**

أضف المتغيرات التالية:

```
MAILRELAY_API_KEY=EmdDkZg__JXYqztNvz5uKFVNkkXZgrHJsPqhJ9ta
MAILRELAY_ACCOUNT=abride.ipzmarketing.com
FROM_EMAIL=info@abride.online
FROM_NAME=أبريد
```

**ملاحظة**: 
- `MAILRELAY_ACCOUNT` هو subdomain الخاص بك في Mailrelay
- بناءً على رابط إعدادات SMTP: `https://abride.ipzmarketing.com/admin/smtp_settings`
- `MAILRELAY_ACCOUNT` يجب أن يكون `abride.ipzmarketing.com`

### 2. التحقق من Mailrelay Account

لتحديد `MAILRELAY_ACCOUNT` الصحيح:

1. سجّل الدخول إلى [Mailrelay Dashboard](https://mailrelay.com)
2. اذهب إلى **Settings** → **API**
3. ستجد API URL في الصفحة، عادة ما يكون على الشكل:
   ```
   https://[YOUR-ACCOUNT]/api/v1/...
   ```
4. استخدم `[YOUR-ACCOUNT]` كقيمة لـ `MAILRELAY_ACCOUNT`

### 3. نشر Edge Function

تم نشر Edge Function تلقائياً عبر MCP. إذا كنت تريد إعادة النشر يدوياً:

```bash
supabase functions deploy send-email
```

## كيفية العمل

1. عند إنشاء إشعار جديد:
   - يتم إنشاء الإشعار في قاعدة البيانات
   - يتم استدعاء `sendEmailNotification()` تلقائياً
   - يتم الحصول على بريد المستخدم من profile
   - يتم استدعاء Edge Function `send-email`

2. Edge Function (`send-email`):
   - يستقبل طلب POST مع بيانات البريد
   - يستخدم Mailrelay REST API لإرسال البريد
   - يستخدم `X-AUTH-TOKEN` header للمصادقة
   - يعيد نتيجة الإرسال

## Mailrelay API Endpoint

```
POST https://[MAILRELAY_ACCOUNT]/api/v1/send_emails
Headers:
  X-AUTH-TOKEN: [MAILRELAY_API_KEY]
  Content-Type: application/json
Body:
{
  "subject": "Subject",
  "html": "<html>...</html>",
  "text": "Plain text version",
  "from_email": "info@abride.online",
  "from_name": "أبريد",
  "to": [
    {
      "email": "recipient@example.com",
      "name": "Recipient Name"
    }
  ]
}
```

## استكشاف الأخطاء

### خطأ 401 (Unauthorized)
- **السبب**: API key غير صحيح أو منتهي الصلاحية
- **الحل**: تحقق من `MAILRELAY_API_KEY` في Supabase Secrets

### خطأ 404 (Not Found)
- **السبب**: `MAILRELAY_ACCOUNT` غير صحيح
- **الحل**: تحقق من `MAILRELAY_ACCOUNT` في Supabase Secrets

### خطأ 400 (Bad Request)
- **السبب**: بيانات البريد غير صحيحة (مثل `from_email` غير مسجل)
- **الحل**: تحقق من `FROM_EMAIL` في Supabase Secrets وتأكد من أنه مسجل في Mailrelay

### خطأ 422 (Unprocessable Entity) - DKIM not configured
- **السبب**: DKIM غير مُعدّ للنطاق الخاص بـ `from_email`
- **الحل**: 
  1. راجع `DKIM_REQUIRED_FOR_API.md` لإعداد DKIM
  2. تأكد من إضافة DKIM Record في DNS
  3. تحقق من DKIM في Mailrelay Dashboard

### البريد لا يصل
- **السبب**: قد يكون البريد في Spam أو `from_email` غير مسجل
- **الحل**: 
  1. تحقق من مجلد Spam
  2. تأكد من أن `from_email` مسجل في Mailrelay كـ Sender
  3. تحقق من Logs في Supabase Dashboard → Edge Functions → Logs

## التحقق من الإعدادات

1. **تحقق من Secrets في Supabase:**
   - اذهب إلى: Supabase Dashboard → Project Settings → Edge Functions → Secrets
   - تأكد من وجود جميع المتغيرات المطلوبة

2. **اختبر إرسال البريد:**
   - أنشئ إشعار جديد في التطبيق
   - تحقق من Logs في Supabase Dashboard → Edge Functions → Logs
   - تحقق من وصول البريد

3. **تحقق من Mailrelay Dashboard:**
   - اذهب إلى Mailrelay Dashboard → **SMTP emails**
   - يجب أن ترى البريد المرسل عبر API

## ملاحظات

- **API Key**: يجب أن يكون آمناً ولا يُشارك مع أي شخص
- **Rate Limiting**: Mailrelay قد يطبق rate limiting على API calls
- **DKIM**: ⚠️ **DKIM مطلوب حتى عند استخدام API!** راجع `DKIM_REQUIRED_FOR_API.md` لإعداد DKIM
- **SMTP vs API**: API أكثر موثوقية من SMTP لكن يتطلب إعداد DKIM مثل SMTP

## المراجع

- [Mailrelay API Documentation](https://mailrelay.com/en/support/knowledge-base/api/)
- [Mailrelay API Reference](https://mailrelay.com/en/support/knowledge-base/api-reference/)

