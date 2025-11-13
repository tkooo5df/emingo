# 🔴 استكشاف أخطاء 404 & 500

## ⚠️ المشكلة الحالية

السيرفر لا يعمل بسبب مشكلة في تثبيت حزمة `vite`. الخطأ:
```
Cannot find package 'vite'
```

## 🔧 الحلول المقترحة

### الحل 1: إعادة تثبيت node_modules (مُوصى به)

```bash
# 1. احذف node_modules
Remove-Item -Recurse -Force node_modules

# 2. احذف package-lock.json
Remove-Item -Force package-lock.json

# 3. نظف cache  
npm cache clean --force

# 4. أعد التثبيت
npm install
```

### الحل 2: تثبيت vite بشكل مباشر

```bash
npm install vite@7.1.12 --save-dev --force
```

### الحل 3: استخدام yarn بدلاً من npm

```bash
# ثبت yarn
npm install -g yarn

# احذف node_modules
Remove-Item -Recurse -Force node_modules

# ثبت باستخدام yarn
yarn install

# شغل السيرفر
yarn dev
```

---

## 🎯 التعليمات خطوة بخطوة

### الطريقة الأسهل (نسخ ولصق في PowerShell):

```powershell
# انتقل للمجلد
cd "d:\amine codes\abridev4-codex-fix-completed-trip-visibility-in-search (2)\abridev4-codex-fix-completed-trip-visibility-in-search"

# أوقف جميع عمليات Node
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# احذف node_modules و package-lock.json
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# نظف cache
npm cache clean --force

# أعد التثبيت
npm install

# شغل السيرفر
npm run dev
```

---

## 🐛 الأخطاء المُصلحة في الكود

### 1. TripTracking.tsx
✅ أضفت فحص تحميل Google Maps قبل الاستخدام
✅ أضفت try/catch لمعالجة الأخطاء

### 2. maps.ts (Config)
✅ أزلت الأنواع البرمجية المُعتمدة على `google.maps`
✅ صححت تعريف MARKER_ICONS

---

## 📊 تشخيص المشكلة

### هل vite موجود؟
```powershell
Test-Path "node_modules\vite"
```
يجب أن يُرجع `True`

### هل التثبيت صحيح؟
```powershell
npm list vite
```
يجب أن يُظهر:
```
vite@7.1.12
```

---

## 🚨 إذا استمرت المشكلة

### المشكلة قد تكون:

#### 1. اسم المجلد (يحتوي على فراغات ورقم 2)
**الحل:** انسخ المشروع لمجلد بدون فراغات:
```powershell
# انسخ المشروع
Copy-Item -Recurse "d:\amine codes\abridev4-codex-fix-completed-trip-visibility-in-search (2)\abridev4-codex-fix-completed-trip-visibility-in-search" "d:\abridev4"

# انتقل للمجلد الجديد
cd "d:\abridev4"

# احذف node_modules
Remove-Item -Recurse -Force node_modules

# أعد التثبيت
npm install

# شغل السيرفر
npm run dev
```

#### 2. صلاحيات Windows
**الحل:** شغل PowerShell كمسؤول (Run as Administrator)

#### 3. برنامج الحماية (Antivirus)
**الحل:** أضف المجلد للاستثناءات مؤقتاً

#### 4. إصدار Node قديم
**الحل:** تحديث Node.js:
```powershell
# تحقق من الإصدار
node --version

# يجب أن يكون >= 18.0.0
```

---

## ✅ بعد حل المشكلة

### تحقق من السيرفر:
```powershell
# شغل السيرفر
npm run dev

# في نافذة أخرى، تحقق من الاتصال
curl http://localhost:5173
```

يجب أن ترى:
```
StatusCode: 200
```

### افتح المتصفح:
```
http://localhost:5173
```

### افتح Developer Console (F12):
- لا أخطاء 404
- لا أخطاء 500
- لا أخطاء React Refresh

---

## 🎉 عند نجاح التشغيل

### اختبر الميزات الجديدة:

#### 1. الصفحة الرئيسية:
✅ قسم "تتبع رحلاتك على الخريطة"

#### 2. خريطة السائقين:
```
http://localhost:5173/drivers-map
```
✅ الخريطة تُحمَّل
✅ العلامات تظهر
✅ البحث يعمل

#### 3. تتبع الرحلة:
```
http://localhost:5173/trip-tracking?bookingId=xxx
```
✅ الخريطة تُحمَّل
✅ خط المسار يظهر
✅ المسافة والوقت يظهران

---

## 📝 ملاحظات مهمة

### Google Maps API:
```
AIzaSyBvyaGOeUWJqjBnR2mHR0Ye9hbPJia3G5M
```

**تأكد من تفعيل:**
- Maps JavaScript API
- Places API
- Directions API
- Distance Matrix API
- Geocoding API

### التطوير محلي فقط:
⚠️ لا ترفع على Fly.io حتى تتأكد من عمل كل شيء محلياً

---

## 🆘 المساعدة

إذا استمرت المشكلة:
1. أرسل screenshot من الخطأ
2. أرسل نتيجة `npm list vite`
3. أرسل نتيجة `node --version`
4. أرسل نتيجة `npm --version`

---

**تاريخ الإنشاء:** 27 أكتوبر 2025  
**الحالة:** ⏳ يحتاج إعادة تثبيت node_modules

**الحل السريع:**
```bash
Remove-Item -Recurse -Force node_modules
npm cache clean --force
npm install
npm run dev
```


