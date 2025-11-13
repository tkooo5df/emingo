# 🚀 دليل النشر الكامل على Fly.io

## 📋 المتطلبات

1. **حساب Fly.io**: سجل في [fly.io](https://fly.io)
2. **Fly CLI**: ثبت Fly CLI:
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   ```

3. **تسجيل الدخول**:
   ```bash
   flyctl auth login
   ```

---

## 🚀 الطريقة السريعة (مستحسنة)

### استخدام سكريبت النشر:

**Windows (PowerShell):**
```powershell
.\deploy-flyio.ps1
```

**macOS/Linux:**
```bash
chmod +x deploy-flyio.sh
./deploy-flyio.sh
```

---

## 📝 الطريقة اليدوية

### الخطوة 1: بناء المشروع
```bash
npm run build
```

### الخطوة 2: النشر على Fly.io
```bash
flyctl deploy --app abride-app
```

### الخطوة 3: فتح التطبيق
```bash
flyctl open --app abride-app
```

أو افتح مباشرة: **https://abride-app.fly.dev**

---

## 🔧 الإعدادات الحالية

### ملف `fly.toml`:
```toml
app = "abride-app"
primary_region = "cdg"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512
```

### ملف `Dockerfile`:
- يستخدم Node.js 18 Alpine
- يبني المشروع مع `npm run build`
- يشغل الخادم باستخدام `server.cjs` على المنفذ 8080

---

## 📊 الحالة والمراقبة

### عرض الحالة:
```bash
flyctl status --app abride-app
```

### عرض السجلات:
```bash
flyctl logs --app abride-app
```

### عرض المقياس:
```bash
flyctl metrics --app abride-app
```

---

## 🔄 التحديثات

### تحديث سريع:
```bash
flyctl deploy --app abride-app
```

### تحديث من Git:
```bash
git push
flyctl deploy --app abride-app --remote-only
```

---

## 🐛 استكشاف الأخطاء

### 1. فشل النشر:
```bash
# عرض السجلات التفصيلية
flyctl logs --app abride-app

# إعادة تشغيل التطبيق
flyctl restart --app abride-app
```

### 2. فشل البناء:
```bash
# تحقق من البناء محلياً
npm run build

# تحقق من Dockerfile
docker build -t test-build .
```

### 3. التطبيق لا يعمل:
```bash
# فحص الحالة
flyctl status --app abride-app

# فحص الصحة
curl https://abride-app.fly.dev/health
```

---

## 🔐 متغيرات البيئة

### إضافة متغيرات البيئة:
```bash
flyctl secrets set KEY=value --app abride-app
```

### عرض المتغيرات:
```bash
flyctl secrets list --app abride-app
```

### أمثلة مهمة:
```bash
# Supabase URL
flyctl secrets set VITE_SUPABASE_URL=https://your-project.supabase.co --app abride-app

# Supabase Key
flyctl secrets set VITE_SUPABASE_ANON_KEY=your-anon-key --app abride-app

# Mapbox Token
flyctl secrets set VITE_MAPBOX_ACCESS_TOKEN=your-token --app abride-app
```

---

## 💰 التكلفة

### الخطة الحالية:
- **CPU**: 1 shared CPU
- **Memory**: 512 MB
- **التكلفة**: ~$0.0000022/ثانية (حوالي $5-6/شهر للعمل 24/7)

### لتقليل التكلفة:
- استخدم `auto_stop_machines = true` (يوقف الآلة عند عدم الاستخدام)
- قلل `min_machines_running` إلى 0

---

## 📱 اختبار التطبيق

### 1. اختبار الصحة:
```bash
curl https://abride-app.fly.dev/health
```

### 2. اختبار الصفحة الرئيسية:
```bash
curl https://abride-app.fly.dev/
```

### 3. فتح في المتصفح:
```
https://abride-app.fly.dev
```

---

## 🎯 المهام الشائعة

### إعادة تشغيل التطبيق:
```bash
flyctl restart --app abride-app
```

### فتح SSH:
```bash
flyctl ssh console --app abride-app
```

### عرض معلومات التطبيق:
```bash
flyctl info --app abride-app
```

### حذف التطبيق:
```bash
flyctl apps destroy abride-app
```

---

## 📞 الدعم

- **Fly.io Docs**: https://fly.io/docs
- **Community**: https://community.fly.io
- **Status**: https://status.fly.io

---

## ✅ قائمة التحقق قبل النشر

- [ ] تم بناء المشروع بنجاح (`npm run build`)
- [ ] تم تسجيل الدخول في Fly.io (`flyctl auth login`)
- [ ] تم التحقق من `fly.toml` و `Dockerfile`
- [ ] تم إعداد متغيرات البيئة المطلوبة
- [ ] تم اختبار التطبيق محلياً

---

## 🎉 بعد النشر

✅ **رابط التطبيق**: https://abride-app.fly.dev
✅ **Health Check**: https://abride-app.fly.dev/health
✅ **Test Endpoint**: https://abride-app.fly.dev/test

---

**آخر تحديث**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

