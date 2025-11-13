# إصلاح عرض التقييمات في بروفايل السائق

## 🚨 المشكلة:
الجدول موجود والتقييمات تُرفع إليه لكن لا تظهر في بروفايل السائق.

## 📁 كيفية عمل النظام:

### **1. رفع التقييمات:**
```
الراكب → يضيف تقييم → يُحفظ في جدول ratings
```

### **2. حفظ الصور:**
```
الراكب → يرفع صورة → تُحفظ في Storage bucket "avatars" باسم passenger_id
```

### **3. عرض التقييمات:**
```
السائق → يفتح بروفايله → يجب أن تظهر التقييمات مع الأسماء والصور
```

## ✅ الحل:

### **تحديث دالة get_driver_ratings**
```sql
CREATE FUNCTION get_driver_ratings(driver_id UUID)
RETURNS TABLE (
    id INTEGER,
    booking_id INTEGER,
    passenger_id UUID,
    rating INTEGER,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    passenger_name TEXT,
    passenger_avatar_url TEXT,
    passenger_email TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.booking_id,
        r.passenger_id,
        r.rating,
        r.comment,
        r.created_at,
        COALESCE(p.full_name, 'راكب') as passenger_name,
        CASE 
            WHEN p.id IS NOT NULL THEN 
                -- الصورة تُسمى بنفس اسم passenger_id
                'https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatars/' || p.id::text
            ELSE NULL 
        END as passenger_avatar_url,
        p.email as passenger_email
    FROM ratings r
    LEFT JOIN profiles p ON r.passenger_id = p.id
    WHERE r.driver_id = driver_id
    ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql;
```

## 🔗 بناء رابط الصورة:

### **الرابط الأساسي:**
```
https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatars/
```

### **اسم الصورة:**
```
passenger_id (UUID) - نفس معرف الراكب
```

### **الرابط الكامل:**
```
https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatars/[passenger_id]
```

### **مثال:**
```
passenger_id = "3414418a-a5e0-4ea2-be32-72eadc2645b7"
avatar_url = "https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatars/3414418a-a5e0-4ea2-be32-72eadc2645b7"
```

## 🚀 التطبيق:

### **شغل `database/fix_driver_profile_ratings.sql`** في Supabase SQL Editor

هذا الملف يحتوي على:
1. ✅ **حذف الدالة القديمة** - `DROP FUNCTION IF EXISTS`
2. ✅ **إنشاء دالة جديدة** - مع ربط صحيح للصور والأسماء
3. ✅ **فحص التقييمات** - للتأكد من وجودها
4. ✅ **فحص الصور** - للتأكد من الروابط الصحيحة
5. ✅ **اختبار الدالة** - مع بيانات حقيقية

## 🔍 فحص البيانات:

### **فحص التقييمات الموجودة:**
```sql
SELECT 
    id,
    booking_id,
    driver_id,
    passenger_id,
    rating,
    comment,
    created_at
FROM ratings 
ORDER BY created_at DESC;
```

### **فحص التقييمات مع معلومات الراكب:**
```sql
SELECT 
    r.id as rating_id,
    r.driver_id,
    r.passenger_id,
    r.rating,
    r.comment,
    r.created_at,
    p.full_name as passenger_name,
    p.email as passenger_email,
    CASE 
        WHEN p.id IS NOT NULL THEN 
            'https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatars/' || p.id::text
        ELSE 'لا توجد صورة'
    END as avatar_url
FROM ratings r
LEFT JOIN profiles p ON r.passenger_id = p.id
ORDER BY r.created_at DESC;
```

### **فحص التقييمات لكل سائق:**
```sql
SELECT 
    r.driver_id,
    p.full_name as driver_name,
    COUNT(r.id) as ratings_count,
    AVG(r.rating) as average_rating
FROM ratings r
LEFT JOIN profiles p ON r.driver_id = p.id
GROUP BY r.driver_id, p.full_name
ORDER BY ratings_count DESC;
```

## 🎯 مثال على البيانات:

### **في جدول ratings:**
```sql
id: 1
booking_id: 2
driver_id: "9f0de29e-4211-463a-aa2d-d20074921e84"
passenger_id: "3414418a-a5e0-4ea2-be32-72eadc2645b7"
rating: 5
comment: "سائق ممتاز ومهذب"
```

### **في جدول profiles:**
```sql
id: "3414418a-a5e0-4ea2-be32-72eadc2645b7"
full_name: "أحمد محمد"
email: "ahmed@example.com"
```

### **في Storage:**
```
bucket: avatars/
file: 3414418a-a5e0-4ea2-be32-72eadc2645b7
```

### **الرابط النهائي:**
```
https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatars/3414418a-a5e0-4ea2-be32-72eadc2645b7
```

## 🔍 كيفية الاختبار:

1. **شغل `database/fix_driver_profile_ratings.sql`** في Supabase
2. **تحقق من رسالة النجاح** - "تم إنشاء الدالة مع ربط الصور والأسماء الصحيح!"
3. **فحص التقييمات** - ستظهر في النتائج
4. **فحص الصور** - ستظهر الروابط الصحيحة
5. **اختبر التقييمات** - يجب أن تظهر في بروفايل السائق

## 📊 النتائج المتوقعة:

### **في قاعدة البيانات:**
- ✅ **التقييمات موجودة** في جدول `ratings`
- ✅ **الأسماء موجودة** في جدول `profiles`
- ✅ **الصور موجودة** في Storage bucket `avatars`
- ✅ **الدالة تعمل** بشكل صحيح

### **في التطبيق:**
- ✅ **التقييمات تظهر** في بروفايل السائق
- ✅ **الأسماء الحقيقية** للركاب
- ✅ **الصور الحقيقية** من Storage
- ✅ **معلومات كاملة** ومفصلة

## 📝 ملاحظات مهمة:

- ✅ **اسم الصورة** = `passenger_id` (UUID)
- ✅ **bucket الصور** = `avatars`
- ✅ **ربط صحيح** بين الجداول
- ✅ **روابط صحيحة** للصور

## 🎉 النتيجة:

بعد التحديث:
- ✅ **التقييمات تظهر** في بروفايل السائق
- ✅ **أسماء حقيقية** للركاب
- ✅ **صور حقيقية** من Storage
- ✅ **عرض محسن** للتقييمات

**شغل `database/fix_driver_profile_ratings.sql` وستظهر التقييمات في بروفايل السائق!** 🎉
