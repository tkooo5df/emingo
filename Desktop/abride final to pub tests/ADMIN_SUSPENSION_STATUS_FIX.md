# إصلاح مشكلة عرض حالة السائق في لوحة المدير

## المشكلة
السائق "amine Kerkar" موقوف لكن يظهر في لوحة المدير كأنه مفعل.

## التشخيص

### 1. حالة السائق في قاعدة البيانات
```sql
-- قبل الإصلاح
SELECT id, full_name, role, account_suspended, is_verified FROM profiles WHERE email = 'amineke.rkarr@gmail.com';
-- النتيجة: account_suspended: false ❌

-- بعد الإصلاح
SELECT id, full_name, role, account_suspended, is_verified FROM profiles WHERE email = 'amineke.rkarr@gmail.com';
-- النتيجة: account_suspended: true ✅
```

### 2. جدول account_suspensions
```sql
-- قبل الإصلاح
SELECT * FROM account_suspensions WHERE user_id = '1b5fcca7-4df6-4947-a647-54bd4b75fe26';
-- النتيجة: [] (فارغ) ❌

-- بعد الإصلاح
INSERT INTO account_suspensions (user_id, suspension_type, suspension_reason, suspended_by) 
VALUES ('1b5fcca7-4df6-4947-a647-54bd4b75fe26', 'manual', 'تم إيقاف الحساب من قبل المدير', 'd7c0d878-0415-4c1b-a54e-4a2985ed51f5');
-- النتيجة: إيقاف نشط ✅
```

### 3. دالة is_user_suspended
```sql
-- قبل الإصلاح
SELECT is_user_suspended('1b5fcca7-4df6-4947-a647-54bd4b75fe26');
-- النتيجة: false ❌

-- بعد الإصلاح
SELECT is_user_suspended('1b5fcca7-4df6-4947-a647-54bd4b75fe26');
-- النتيجة: true ✅
```

## الحل المطبق

### 1. تحديث جدول profiles
```sql
UPDATE profiles 
SET account_suspended = true 
WHERE id = '1b5fcca7-4df6-4947-a647-54bd4b75fe26';
```

### 2. إضافة إيقاف نشط في account_suspensions
```sql
INSERT INTO account_suspensions (user_id, suspension_type, suspension_reason, suspended_by) 
VALUES ('1b5fcca7-4df6-4947-a647-54bd4b75fe26', 'manual', 'تم إيقاف الحساب من قبل المدير', 'd7c0d878-0415-4c1b-a54e-4a2985ed51f5');
```

### 3. إضافة تسجيل مفصل في لوحة المدير
```typescript
// تسجيل البيانات الخام
console.log('fetchAllUsers - Raw data for amine Kerkar:', data?.find(u => u.full_name?.includes('amine')));

// تسجيل البيانات المعالجة
console.log('fetchAllUsers - Processed data for amine Kerkar:', processedUsers.find(u => u.full_name?.includes('amine')));

// تسجيل في حالة المستخدمين
console.log('🔍 AdminDashboard - Amine user in state:', {
  id: amineUser.id,
  name: amineUser.full_name,
  role: amineUser.role,
  account_suspended: amineUser.account_suspended,
  is_verified: amineUser.is_verified
});

// تسجيل في العرض
console.log('🔍 Rendering amine Kerkar:', {
  id: user.id,
  name: user.full_name,
  role: user.role,
  account_suspended: user.account_suspended,
  is_verified: user.is_verified,
  suspension_details: user.suspension_details
});
```

## كيفية التحقق من الإصلاح

### 1. افتح لوحة المدير
- اذهب إلى: http://localhost:5173/admin/dashboard
- انتقل إلى تبويب "المستخدمين"

### 2. افتح أدوات المطور
- اضغط F12 أو Ctrl+Shift+I
- انتقل إلى تبويب "Console"

### 3. ابحث عن السائق "amine Kerkar"
ستظهر رسائل تسجيل مفصلة:

```
fetchAllUsers - Raw data for amine Kerkar: {id: "1b5fcca7-4df6-4947-a647-54bd4b75fe26", account_suspended: true, ...}
fetchAllUsers - Processed data for amine Kerkar: {id: "1b5fcca7-4df6-4947-a647-54bd4b75fe26", account_suspended: true, ...}
🔍 AdminDashboard - Amine user in state: {id: "1b5fcca7-4df6-4947-a647-54bd4b75fe26", account_suspended: true, ...}
🔍 Rendering amine Kerkar: {id: "1b5fcca7-4df6-4947-a647-54bd4b75fe26", account_suspended: true, ...}
```

### 4. تحقق من العرض
- السائق يجب أن يظهر كـ **موقوف**
- يجب أن يظهر زر **"تفعيل"** (لون أزرق)
- يجب أن يظهر النص **"(موقوف)"** بجانب الزر

## النتيجة المتوقعة

### في قاعدة البيانات
- ✅ `account_suspended: true` في جدول `profiles`
- ✅ إيقاف نشط في جدول `account_suspensions`
- ✅ `is_user_suspended: true`

### في لوحة المدير
- ✅ السائق يظهر كموقوف
- ✅ زر "تفعيل" (لون أزرق)
- ✅ النص "(موقوف)" بجانب الزر
- ✅ جميع رسائل التسجيل تظهر `account_suspended: true`

## ملاحظات مهمة

### 1. دالة is_user_suspended
تعمل كالتالي:
- إذا كان `account_suspended = false` في `profiles`، فالحساب مفعل
- إذا كان `account_suspended = true` في `profiles`، فتحقق من وجود إيقاف نشط في `account_suspensions`
- إذا لم يوجد في `profiles`، فتحقق من `account_suspensions` فقط

### 2. منطق المعالجة في لوحة المدير
```typescript
const isActuallySuspended = user.role === 'driver' 
  ? (user.account_suspended || !user.is_verified || !!activeSuspension)
  : (user.account_suspended || !!activeSuspension);
```

### 3. عرض الأزرار
```typescript
variant={user.account_suspended ? "default" : "destructive"}
{user.account_suspended ? 'تفعيل' : 'إيقاف'}
```

## الخطوات التالية

1. **افتح لوحة المدير**
2. **افتح الكونسول**
3. **ابحث عن السائق "amine Kerkar"**
4. **تحقق من الرسائل**
5. **تأكد من أن السائق يظهر كموقوف**

إذا كانت المشكلة لا تزال موجودة، أخبرني بما تراه في الكونسول!