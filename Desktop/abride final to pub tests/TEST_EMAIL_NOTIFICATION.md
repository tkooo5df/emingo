# اختبار إرسال الإشعارات عبر Mailrelay API

## المشكلة الحالية

عند محاولة إرسال بريد إلكتروني عبر Edge Function `send-email`، يظهر الخطأ:
```
Account not found
The link that you're trying to access belongs to an account that doesn't exist.
```

## السبب

الخطأ يشير إلى أن `MAILRELAY_ACCOUNT` غير صحيح أو أن الـ secrets لم يتم إضافتها إلى Supabase.

## الحل

### 1. التحقق من إعدادات Mailrelay

تأكد من أن:
- `MAILRELAY_API_KEY`: `EmdDkZg__JXYqztNvz5uKFVNkkXZgrHJsPqhJ9ta`
- `MAILRELAY_ACCOUNT`: يجب أن يكون `abride.ipzmarketing.com` (بناءً على رابط إعدادات SMTP: `https://abride.ipzmarketing.com/admin/smtp_settings`)
- `FROM_EMAIL`: `info@abride.online`
- `FROM_NAME`: `أبريد`

### 2. إضافة Secrets إلى Supabase

اتبع الخطوات في `ADD_SECRETS_INSTRUCTIONS.md` لإضافة الـ secrets التالية إلى Supabase Dashboard:

1. اذهب إلى **Supabase Dashboard** → **Project Settings** → **Edge Functions** → **Secrets**
2. أضف الـ secrets التالية:
   - `MAILRELAY_API_KEY` = `EmdDkZg__JXYqztNvz5uKFVNkkXZgrHJsPqhJ9ta`
   - `MAILRELAY_ACCOUNT` = `abride.ipzmarketing.com`
   - `FROM_EMAIL` = `info@abride.online`
   - `FROM_NAME` = `أبريد`

### 3. التحقق من اسم الحساب

اسم الحساب في Mailrelay هو:
- `abride.ipzmarketing.com` (بناءً على رابط إعدادات SMTP: `https://abride.ipzmarketing.com/admin/smtp_settings`)

### 4. اختبار الإرسال

بعد إضافة الـ secrets، يمكنك اختبار الإرسال باستخدام:

1. **ملف HTML**: افتح `test-email-notification.html` في المتصفح
2. **سكريبت PowerShell**: شغّل `send-test-email.ps1`
3. **من التطبيق**: أنشئ إشعار جديد في التطبيق

## ملاحظات

- تأكد من أن الـ secrets موجودة في Supabase قبل اختبار الإرسال
- تحقق من أن `MAILRELAY_ACCOUNT` صحيح من لوحة تحكم Mailrelay
- تأكد من أن API Key نشط وصحيح

