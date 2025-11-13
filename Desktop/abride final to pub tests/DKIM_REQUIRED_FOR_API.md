# ⚠️ DKIM مطلوب حتى عند استخدام Mailrelay API

## المشكلة الحالية

Mailrelay API يرفض إرسال البريد مع الخطأ:
```
DKIM is not configured for this domain.
```

## السبب

**Mailrelay يتطلب DKIM حتى عند استخدام API!** هذا يعني أن:
- ❌ استخدام API لا يحل مشكلة DKIM
- ✅ يجب إعداد DKIM في DNS لـ `abride.online`
- ✅ يجب أن يكون `info@abride.online` مسجل في Mailrelay كـ Sender

## الحلول المتاحة

### الحل 1: إعداد DKIM في DNS (موصى به)

اتبع الخطوات في `MAILRELAY_DKIM_SETUP.md` لإعداد DKIM:

1. **الحصول على DKIM Public Key من Mailrelay:**
   - سجّل الدخول إلى [Mailrelay Dashboard](https://abride.ipzmarketing.com/admin/smtp_settings)
   - اذهب إلى **Settings** → **Domains** → **DKIM Settings**
   - اختر النطاق `abride.online` أو أضفه
   - انسخ **DKIM Public Key** و **DKIM Selector**

2. **إضافة DKIM Record في DNS:**
   - سجّل الدخول إلى لوحة تحكم DNS (مزود النطاق الخاص بك)
   - أضف سجل **TXT** جديد:
     ```
     Name/Host: mailrelay._domainkey.abride.online
     Type: TXT
     Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
     TTL: 3600
     ```
   - **ملاحظة**: استخدم DKIM Public Key الكامل من Mailrelay

3. **التحقق من DKIM:**
   - انتظر 5-15 دقيقة حتى يتم نشر DNS records
   - تحقق من DKIM باستخدام:
     ```bash
     nslookup -type=TXT mailrelay._domainkey.abride.online
     ```
   - أو استخدم أدوات Online:
     - [MXToolbox DKIM Checker](https://mxtoolbox.com/dkim.aspx)
     - [DKIM Validator](https://www.dkimvalidator.com/)

4. **التحقق في Mailrelay:**
   - اذهب إلى Mailrelay Dashboard → **Settings** → **Domains** → **DKIM Settings**
   - انقر على **Verify DKIM**
   - يجب أن يظهر **DKIM Verified** أو **DKIM Active**

### الحل 2: استخدام بريد إلكتروني آخر (حل مؤقت)

إذا كان لديك بريد إلكتروني آخر مسجل بالفعل في Mailrelay مع DKIM مُعدّ:

1. **تحديث `FROM_EMAIL` في Supabase Secrets:**
   - اذهب إلى Supabase Dashboard → **Project Settings** → **Edge Functions** → **Secrets**
   - حدّث `FROM_EMAIL` إلى بريد إلكتروني آخر (مثل `noreply@abride.online` أو بريد آخر)
   - حدّث `FROM_NAME` إذا لزم الأمر

2. **تسجيل البريد الجديد في Mailrelay:**
   - تأكد من أن البريد الجديد مسجل في Mailrelay كـ Sender
   - تأكد من أن DKIM مُعدّ للنطاق الخاص بالبريد الجديد

## خطوات إعداد DKIM في Mailrelay

### الطريقة 1: من Mailrelay Dashboard

1. سجّل الدخول إلى [Mailrelay Dashboard](https://abride.ipzmarketing.com/admin/smtp_settings)
2. اذهب إلى: **Settings** → **Domains**
3. اختر النطاق `abride.online` أو أضفه
4. اذهب إلى **DKIM Settings**
5. انقر على **Generate DKIM Key** أو **Enable DKIM**
6. انسخ **DKIM Public Key** و **DKIM Selector**
7. أضف السجل في DNS كما هو موضح أعلاه
8. انقر على **Verify DKIM** للتحقق

### الطريقة 2: من خلال Support

إذا لم تجد خيار DKIM في Dashboard:
1. تواصل مع [Mailrelay Support](https://mailrelay.com/support)
2. اطلب إعداد DKIM للنطاق `abride.online`
3. سيقدمون لك:
   - DKIM Selector
   - DKIM Public Key
   - تعليمات إضافة السجل في DNS

## إعدادات DNS المطلوبة

بالإضافة إلى DKIM، تأكد من إعداد:

### 1. SPF Record

```
Name/Host: abride.online
Type: TXT
Value: v=spf1 include:mailrelay.com ~all
TTL: 3600
```

### 2. DMARC Record (اختياري لكن موصى به)

```
Name/Host: _dmarc.abride.online
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:info@abride.online
TTL: 3600
```

## التحقق من الإعدادات

بعد إعداد DKIM:

1. **تحقق من DNS Records:**
   ```bash
   nslookup -type=TXT mailrelay._domainkey.abride.online
   ```

2. **أرسل بريد تجريبي:**
   - استخدم Edge Function لإرسال بريد تجريبي
   - تحقق من وصول البريد
   - تحقق من headers البريد (يجب أن يظهر `DKIM-Signature`)

3. **تحقق في Mailrelay:**
   - اذهب إلى Mailrelay Dashboard
   - تحقق من أن DKIM Status = **Active** أو **Verified**

## استكشاف الأخطاء

### DKIM لا يزال غير مُعدّ بعد إضافة السجل

- **السبب**: DNS records لم يتم نشرها بعد
- **الحل**: انتظر 15-30 دقيقة وأعد المحاولة

### DKIM Record غير صحيح

- **السبب**: القيمة `Value` غير كاملة أو بها أخطاء
- **الحل**: 
  1. تأكد من نسخ DKIM Public Key الكامل من Mailrelay
  2. تأكد من أن السجل يبدأ بـ `v=DKIM1;`
  3. تأكد من عدم وجود مسافات إضافية أو أخطاء في النسخ

### Mailrelay لا يتحقق من DKIM

- **السبب**: Selector غير صحيح
- **الحل**: 
  1. تحقق من Selector في Mailrelay Dashboard
  2. تأكد من أن Name/Host في DNS يتطابق مع Selector
  3. مثال: إذا كان Selector = `mailrelay`، يجب أن يكون Name = `mailrelay._domainkey.abride.online`

## ملاحظات مهمة

- **DNS Propagation**: قد يستغرق نشر DNS records من 5 دقائق إلى 48 ساعة (عادة 15-30 دقيقة)
- **TTL**: استخدم TTL = 3600 (ساعة واحدة) لتسريع التحديثات
- **Testing**: استخدم أدوات Online للتحقق من DKIM قبل إرسال بريد فعلي
- **Backup**: احتفظ بنسخة من DKIM Public Key في مكان آمن

## المراجع

- [MAILRELAY_DKIM_SETUP.md](./MAILRELAY_DKIM_SETUP.md) - دليل إعداد DKIM التفصيلي
- [MXToolbox DKIM Checker](https://mxtoolbox.com/dkim.aspx)
- [DKIM Validator](https://www.dkimvalidator.com/)
- [Mailrelay DKIM Documentation](https://mailrelay.com/en/support/knowledge-base/dkim-configuration/)

