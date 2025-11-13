# حل مشكلة تغيير نوع الإرجاع للدالة

## 🚨 المشكلة:
```
ERROR: 42P13: cannot change return type of existing function
DETAIL: Row type defined by OUT parameters is different.
HINT: Use DROP FUNCTION get_driver_ratings(uuid) first.
```

## 🔍 السبب:
الدالة `get_driver_ratings` موجودة بالفعل ولها نوع إرجاع مختلف. PostgreSQL لا يسمح بتغيير نوع الإرجاع باستخدام `CREATE OR REPLACE FUNCTION`.

## ✅ الحل:

### **الخطوة 1: حذف الدالة الموجودة**
```sql
DROP FUNCTION IF EXISTS get_driver_ratings(UUID);
```

### **الخطوة 2: إنشاء الدالة الجديدة**
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
        p.avatar_url as passenger_avatar_url,
        p.email as passenger_email
    FROM ratings r
    LEFT JOIN profiles p ON r.passenger_id = p.id
    WHERE r.driver_id = driver_id
    ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql;
```

## 🚀 التطبيق:

### **شغل `database/fix_ratings_function.sql`** في Supabase SQL Editor

هذا الملف يحتوي على:
1. ✅ **حذف الدالة القديمة** - `DROP FUNCTION IF EXISTS`
2. ✅ **إنشاء الدالة الجديدة** - مع نوع الإرجاع المحدث
3. ✅ **التحقق من النجاح** - استعلام للتحقق من إنشاء الدالة
4. ✅ **رسالة تأكيد** - تأكيد نجاح العملية

## 🎯 المميزات الجديدة:

### **نوع الإرجاع المحدث**:
- `passenger_name` - الاسم الحقيقي للراكب
- `passenger_avatar_url` - رابط صورة البروفايل
- `passenger_email` - البريد الإلكتروني

### **الاستعلام المحسن**:
- ربط مع جدول `profiles` لجلب المعلومات الكاملة
- معالجة الحالات الفارغة باستخدام `COALESCE`
- ترتيب حسب تاريخ الإنشاء

## 🔍 كيفية الاختبار:

1. **شغل `database/fix_ratings_function.sql`** في Supabase
2. **تحقق من رسالة النجاح** - "تم إنشاء الدالة بنجاح!"
3. **اختبر الدالة** - استخدم معرف سائق حقيقي
4. **تحقق من النتائج** - يجب أن تحتوي على الاسم والصورة

## 📝 ملاحظات مهمة:

- ✅ **حذف آمن** - `DROP FUNCTION IF EXISTS` لا يسبب خطأ إذا لم تكن الدالة موجودة
- ✅ **إنشاء جديد** - `CREATE FUNCTION` بدلاً من `CREATE OR REPLACE`
- ✅ **نوع إرجاع محدث** - يتضمن جميع الحقول المطلوبة
- ✅ **توافق مع الكود** - يعمل مع `DriverRatingsDisplay` المحدث

## 🎉 النتيجة:

بعد تشغيل الملف:
- ✅ **الدالة محدثة** مع نوع الإرجاع الجديد
- ✅ **أسماء حقيقية** للركاب
- ✅ **صور بروفايل** حقيقية
- ✅ **معلومات كاملة** ومفصلة

**شغل `database/fix_ratings_function.sql` وستحل المشكلة!** 🎉
