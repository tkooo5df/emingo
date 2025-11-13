# 🌐 إعداد النطاق الرئيسي (بدون www) لـ abride.online

## المشكلة
الموقع يعمل فقط مع `www.abride.online` ولا يعمل مع `abride.online` (بدون www).

## الحل

### الطريقة 1: استخدام A Record (الموصى بها)

في لوحة تحكم DNS الخاصة بك، أضف **A Record**:

```
Type: A
Name: @ (أو اتركه فارغاً أو ضع abride.online)
Value: 66.241.125.205
TTL: 3600 (أو Automatic)
```

### الطريقة 2: استخدام CNAME (إذا كان مزود DNS يدعم CNAME للنطاق الرئيسي)

بعض مزودي DNS (مثل Cloudflare) يدعمون CNAME Flattening:

```
Type: CNAME
Name: @ (أو اتركه فارغاً)
Value: abridasv5.fly.dev
TTL: 3600 (أو Automatic)
```

### الطريقة 3: إعادة توجيه (Redirect)

إذا كان مزود DNS يدعم Page Rules أو Redirects:

- **Redirect Rule:**
  - من: `abride.online/*`
  - إلى: `https://www.abride.online/$1`
  - Type: 301 Permanent Redirect

---

## الإعدادات الحالية

### CNAME Record (موجود بالفعل):
```
Type: CNAME
Name: www
Value: abridasv5.fly.dev
```

### A Record (يجب إضافته):
```
Type: A
Name: @
Value: 66.241.125.205
TTL: 3600
```

---

## خطوات الإعداد حسب مزود DNS

### Cloudflare
1. اذهب إلى DNS Settings
2. أضف A Record:
   - Type: A
   - Name: @
   - IPv4 address: `66.241.125.205`
   - Proxy status: DNS only (أو Proxied)
   - TTL: Auto

### Namecheap
1. اذهب إلى Domain List → Manage
2. Advanced DNS
3. أضف New Record:
   - Type: A Record
   - Host: @
   - Value: `66.241.125.205`
   - TTL: Automatic

### GoDaddy
1. اذهب إلى DNS Management
2. أضف Record:
   - Type: A
   - Name: @
   - Value: `66.241.125.205`
   - TTL: 600 seconds

### Google Domains
1. اذهب إلى DNS
2. أضف Resource Record:
   - Type: A
   - Name: @
   - Data: `66.241.125.205`
   - TTL: 3600

---

## التحقق من الإعدادات

بعد إضافة السجل، انتظر 5-30 دقيقة ثم تحقق:

```bash
# Windows
nslookup abride.online
nslookup www.abride.online

# Mac/Linux
dig abride.online
dig www.abride.online
```

يجب أن ترى:
- `abride.online` → يشير إلى `66.241.125.205`
- `www.abride.online` → يشير إلى `abridasv5.fly.dev`

---

## تحديث Supabase

بعد التأكد من أن النطاق يعمل، حدث Supabase:

1. **Site URL:**
   ```
   https://abride.online
   ```

2. **Redirect URLs:**
   ```
   https://abride.online/**
   https://www.abride.online/**
   https://abride.online/auth/callback
   https://www.abride.online/auth/callback
   ```

---

## ملاحظات

- ⏱️ **DNS Propagation**: قد يستغرق من 5 دقائق إلى 48 ساعة
- 🔒 **SSL Certificate**: Fly.io سيضيف شهادة SSL تلقائياً لكلا النطاقين
- ✅ **Caching**: قد تحتاج لمسح cache المتصفح بعد التحديث

---

**تاريخ الإنشاء**: 2025-01-05

