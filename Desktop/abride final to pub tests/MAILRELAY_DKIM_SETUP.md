# 📧 دليل إعداد DKIM في Mailrelay

## المشكلة

Mailrelay يرفض الرسائل مع الخطأ:
```
[E15] Message rejected because DKIM is not configured for sender.
```

## السبب

DKIM (DomainKeys Identified Mail) غير مُعدّ للنطاق `abride.online`. DKIM هو نظام مصادقة البريد الإلكتروني الذي يساعد في:
- منع التصيد الاحتيالي
- تحسين تسليم البريد (تقليل احتمالية وصول البريد إلى Spam)
- زيادة مصداقية البريد الإلكتروني

## الحل

### 1. الحصول على DKIM Public Key من Mailrelay

1. سجّل الدخول إلى [Mailrelay Dashboard](https://mailrelay.com)
2. اذهب إلى: **Settings** → **Domains** → **DKIM Settings**
3. اختر النطاق `abride.online` (أو أضفه إذا لم يكن موجوداً)
4. ستحصل على:
   - **DKIM Selector**: عادة ما يكون `mailrelay` أو `default`
   - **DKIM Public Key**: مفتاح عام طويل
   - **DKIM Record**: سجل DNS كامل

### 2. إضافة DKIM Record في DNS

1. سجّل الدخول إلى لوحة تحكم DNS (مزود النطاق الخاص بك)
2. أضف سجل **TXT** جديد:

#### مثال على DKIM Record:

```
Name/Host: mailrelay._domainkey.abride.online
Type: TXT
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
TTL: 3600 (أو Default)
```

**ملاحظة**: القيمة `Value` هي DKIM Public Key الكامل من Mailrelay.

#### أو إذا كان Selector مختلف:

```
Name/Host: default._domainkey.abride.online
Type: TXT
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
TTL: 3600
```

### 3. التحقق من DKIM Record

بعد إضافة السجل، انتظر 5-15 دقيقة حتى يتم نشر DNS records، ثم تحقق:

#### باستخدام Command Line:

```bash
# Windows PowerShell
nslookup -type=TXT mailrelay._domainkey.abride.online

# أو
dig TXT mailrelay._domainkey.abride.online
```

#### أو باستخدام أدوات Online:

- [MXToolbox DKIM Checker](https://mxtoolbox.com/dkim.aspx)
- [DKIM Validator](https://www.dkimvalidator.com/)

### 4. التحقق في Mailrelay

1. اذهب إلى Mailrelay Dashboard → **Settings** → **Domains** → **DKIM Settings**
2. انقر على **Verify DKIM** أو **Test DKIM**
3. يجب أن يظهر **DKIM Verified** أو **DKIM Active**

## إعدادات DNS المطلوبة لـ Mailrelay

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

### 3. MX Records (إذا كنت تستخدم Mailrelay كخادم بريد رئيسي)

```
Name/Host: abride.online
Type: MX
Priority: 10
Value: mx1.mailrelay.com
TTL: 3600
```

## خطوات إعداد DKIM في Mailrelay

### الطريقة 1: من Mailrelay Dashboard

1. سجّل الدخول إلى [Mailrelay](https://mailrelay.com)
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

## التحقق من الإعدادات

بعد إعداد DKIM:

1. **تحقق من DNS Records:**
   ```bash
   nslookup -type=TXT mailrelay._domainkey.abride.online
   ```

2. **أرسل بريد تجريبي:**
   - أرسل بريد من `info@abride.online`
   - تحقق من headers البريد
   - يجب أن يظهر `DKIM-Signature` في headers

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

- [Mailrelay DKIM Documentation](https://mailrelay.com/en/support/knowledge-base/dkim-configuration/)
- [DKIM Validator](https://www.dkimvalidator.com/)
- [MXToolbox DKIM Checker](https://mxtoolbox.com/dkim.aspx)

