# 🔐 إضافة Secrets في Supabase Edge Functions

## الطريقة السريعة

### 1. اذهب إلى Supabase Dashboard

افتح الرابط التالي في المتصفح:
```
https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj/settings/functions
```

### 2. أضف Secrets

1. انقر على تبويب **"Secrets"** في الصفحة
2. انقر على زر **"Add Secret"** أو **"New Secret"**
3. أضف كل Secret التالي:

#### Secret 1:
- **Name**: `MAILRELAY_API_KEY`
- **Value**: `EmdDkZg__JXYqztNvz5uKFVNkkXZgrHJsPqhJ9ta`

#### Secret 2:
- **Name**: `MAILRELAY_ACCOUNT`
- **Value**: `abride.ipzmarketing.com`

#### Secret 3:
- **Name**: `FROM_EMAIL`
- **Value**: `info@abride.online`

#### Secret 4:
- **Name**: `FROM_NAME`
- **Value**: `أبريد`

### 3. احفظ التغييرات

بعد إضافة جميع Secrets، احفظ التغييرات.

## التحقق من الإعدادات

بعد إضافة Secrets:

1. **تحقق من Edge Function:**
   - اذهب إلى: **Edge Functions** → **send-email**
   - تحقق من أن Function نشط

2. **اختبر إرسال البريد:**
   - أنشئ إشعار جديد في التطبيق
   - تحقق من Logs في **Edge Functions** → **Logs**
   - تحقق من وصول البريد

## ملاحظات

- **Secrets آمنة**: Secrets مشفرة ولا يمكن رؤيتها بعد الحفظ
- **لا حاجة لإعادة النشر**: Edge Function سيستخدم Secrets تلقائياً
- **DKIM**: لا حاجة لإعداد DKIM عند استخدام Mailrelay API

## استكشاف الأخطاء

### Edge Function لا يعمل
- تحقق من أن جميع Secrets موجودة
- تحقق من Logs في Supabase Dashboard

### البريد لا يصل
- تحقق من `MAILRELAY_ACCOUNT` - يجب أن يكون subdomain الصحيح
- تحقق من `FROM_EMAIL` - يجب أن يكون مسجل في Mailrelay
- تحقق من Logs في Supabase Dashboard → Edge Functions → Logs

