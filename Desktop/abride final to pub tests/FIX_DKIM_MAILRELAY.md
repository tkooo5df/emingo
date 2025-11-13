# 🔧 إصلاح مشكلة DKIM في Mailrelay

## المشكلة الحالية

لديك سجلات DKIM في Namecheap، لكن Mailrelay لا يكتشفها ويقول:
```
DKIM is not configured for this domain.
```

## السجلات الموجودة في Namecheap

### DKIM Records (CNAME):
- ✅ `ipz1._domainkey.abride.online` → `vwpazm.dkim.ipzsv.com`
- ✅ `ipz2._domainkey.abride.online` → `zbwmez.dkim.ipzsv.com`

### SPF Record (TXT):
- ✅ `@` → `v=spf1 include:spf.ipzmarketing.com include:spf.mailjet.com include:spf.privateemail.com ~all`

### DMARC Record (TXT):
- ❌ غير موجود - يجب إضافته

## الحل

### 1. التحقق من DKIM Records

أولاً، تحقق من أن السجلات موجودة في DNS:

```bash
# Windows PowerShell
nslookup -type=CNAME ipz1._domainkey.abride.online
nslookup -type=CNAME ipz2._domainkey.abride.online
```

**النتيجة المتوقعة:**
```
ipz1._domainkey.abride.online
    canonical name = vwpazm.dkim.ipzsv.com
```

إذا لم تظهر النتيجة، انتظر 15-30 دقيقة حتى يتم نشر DNS records.

### 2. إضافة DMARC Record

في Namecheap، أضف سجل TXT جديد:

**في Namecheap Dashboard:**
1. اذهب إلى **Domain List** → **Manage** → **Advanced DNS**
2. انقر على **Add New Record**
3. اختر **TXT Record**
4. أضف:
   - **Host**: `_dmarc`
   - **Value**: `v=DMARC1; p=none;`
   - **TTL**: `Automatic` (أو `3600`)

**السجل المطلوب:**
```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none;
TTL: Automatic
```

### 3. التحقق من DKIM في Mailrelay

بعد إضافة DMARC Record:

1. **انتظر 15-30 دقيقة** حتى يتم نشر DNS records
2. اذهب إلى [Mailrelay Dashboard](https://abride.ipzmarketing.com/admin/smtp_settings)
3. اذهب إلى **Settings** → **Domains** → **DKIM Settings**
4. انقر على **Verify DKIM** أو **Test DKIM**
5. يجب أن يظهر **DKIM Verified** أو **DKIM Active**

### 4. إذا لم يعمل DKIM بعد التحقق

إذا كان Mailrelay لا يزال يقول أن DKIM غير مُعدّ:

#### أ. تحقق من أن السجلات صحيحة:

في Namecheap، تأكد من أن:
- **Host** صحيح: `ipz1._domainkey` و `ipz2._domainkey` (بدون `.abride.online`)
- **Value** صحيح: `vwpazm.dkim.ipzsv.com.` و `zbwmez.dkim.ipzsv.com.` (مع النقطة في النهاية)

#### ب. تحقق من DNS Propagation:

استخدم أدوات Online للتحقق:
- [MXToolbox DKIM Checker](https://mxtoolbox.com/dkim.aspx) - ابحث عن `abride.online`
- [DKIM Validator](https://www.dkimvalidator.com/)

#### ج. تواصل مع Mailrelay Support:

إذا كانت السجلات صحيحة لكن Mailrelay لا يكتشفها:
1. تواصل مع [Mailrelay Support](https://mailrelay.com/support)
2. أخبرهم أن لديك السجلات التالية:
   - `ipz1._domainkey.abride.online` → `vwpazm.dkim.ipzsv.com`
   - `ipz2._domainkey.abride.online` → `zbwmez.dkim.ipzsv.com`
3. اطلب منهم التحقق من DKIM يدوياً

## ملخص السجلات المطلوبة في Namecheap

### DKIM (موجود بالفعل):
```
Type: CNAME
Host: ipz1._domainkey
Value: vwpazm.dkim.ipzsv.com.
TTL: Automatic

Type: CNAME
Host: ipz2._domainkey
Value: zbwmez.dkim.ipzsv.com.
TTL: Automatic
```

### SPF (موجود بالفعل):
```
Type: TXT
Host: @
Value: v=spf1 include:spf.ipzmarketing.com include:spf.mailjet.com include:spf.privateemail.com ~all
TTL: Automatic
```

### DMARC (يجب إضافته):
```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none;
TTL: Automatic
```

## خطوات الإصلاح السريعة

1. ✅ **تحقق من DKIM Records** في DNS (استخدم `nslookup`)
2. ✅ **أضف DMARC Record** في Namecheap
3. ⏳ **انتظر 15-30 دقيقة** حتى يتم نشر DNS records
4. ✅ **تحقق من DKIM** في Mailrelay Dashboard
5. ✅ **اختبر إرسال البريد** مرة أخرى

## ملاحظات مهمة

- **DNS Propagation**: قد يستغرق نشر DNS records من 5 دقائق إلى 48 ساعة (عادة 15-30 دقيقة)
- **TTL**: استخدم TTL = `Automatic` أو `3600` (ساعة واحدة) لتسريع التحديثات
- **Testing**: استخدم أدوات Online للتحقق من DKIM قبل إرسال بريد فعلي
- **Mailrelay Verification**: قد يحتاج Mailrelay إلى بعض الوقت للتحقق من DKIM بعد نشر DNS records

## المراجع

- [MAILRELAY_DKIM_SETUP.md](./MAILRELAY_DKIM_SETUP.md) - دليل إعداد DKIM التفصيلي
- [DKIM_REQUIRED_FOR_API.md](./DKIM_REQUIRED_FOR_API.md) - لماذا DKIM مطلوب
- [MXToolbox DKIM Checker](https://mxtoolbox.com/dkim.aspx)
- [DKIM Validator](https://www.dkimvalidator.com/)

