# إعداد Supabase Storage والسياسات للتقييمات

## 🎯 الهدف:
إعداد Supabase Storage مع السياسات الصحيحة لعرض صور البروفايل في التقييمات.

## 📁 هيكل Storage المطلوب:
```
Supabase Storage/
└── avatars/ (bucket)
    ├── user1-avatar.jpg
    ├── user2-avatar.png
    └── user3-avatar.webp
```

## ✅ الإعدادات المطلوبة:

### **1. إنشاء Bucket**
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
```

### **2. سياسات RLS للـ Storage**
```sql
-- السماح للمستخدمين المصادق عليهم برفع الصور
CREATE POLICY "Allow avatar uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- السماح بالقراءة العامة للصور
CREATE POLICY "Allow public avatar access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- السماح للمستخدمين بتحديث صورهم الخاصة
CREATE POLICY "Allow avatar updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text))
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text));

-- السماح للمستخدمين بحذف صورهم الخاصة
CREATE POLICY "Allow avatar deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (select auth.uid()::text));
```

### **3. تحديث دالة get_driver_ratings**
```sql
-- حذف الدالة القديمة
DROP FUNCTION IF EXISTS get_driver_ratings(UUID);

-- إنشاء دالة جديدة مع ربط Storage الصحيح
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
            WHEN p.avatar_url IS NOT NULL AND p.avatar_url != '' THEN 
                'https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatars/' || p.avatar_url
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

## 🚀 التطبيق:

### **شغل `database/setup_storage_and_ratings.sql`** في Supabase SQL Editor

هذا الملف يحتوي على:
1. ✅ **إنشاء bucket** - `avatars` مع الوصول العام
2. ✅ **سياسات RLS** - للرفع والقراءة والتحديث والحذف
3. ✅ **تحديث الدالة** - مع ربط Storage الصحيح
4. ✅ **فحص الإعدادات** - للتأكد من نجاح العملية

## 🔗 رابط Storage الصحيح:

### **الرابط الأساسي**:
```
https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatars/
```

### **مثال على الرابط الكامل**:
```
https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatars/user123-avatar.jpg
```

## 🛠️ إعدادات Supabase Dashboard:

### **Storage Settings**:
1. **Storage** → **avatars** bucket
2. **Public access** - ✅ مفعل
3. **File uploads** - ✅ مسموح
4. **File types** - jpg, png, webp, gif
5. **Max file size** - 5MB (مقترح)

### **RLS Policies**:
- ✅ **Public read access** - للقراءة العامة
- ✅ **Authenticated uploads** - للرفع للمستخدمين المصادق عليهم
- ✅ **User-specific updates** - للتحديث والحذف للمستخدمين فقط

## 🔍 كيفية الاختبار:

1. **شغل `database/setup_storage_and_ratings.sql`** في Supabase
2. **تحقق من رسالة النجاح** - "تم إعداد Storage والدالة بنجاح!"
3. **فحص bucket** - يجب أن يظهر في Storage
4. **فحص السياسات** - يجب أن تظهر في نتائج الاستعلام
5. **اختبر التقييمات** - يجب أن تظهر الصور الحقيقية

## 📊 فحص الإعدادات:

### **فحص Bucket**:
```sql
SELECT 
    id,
    name,
    public,
    created_at
FROM storage.buckets 
WHERE id = 'avatars';
```

### **فحص السياسات**:
```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
```

### **فحص الصور**:
```sql
SELECT 
    p.full_name,
    p.avatar_url,
    CASE 
        WHEN p.avatar_url IS NOT NULL AND p.avatar_url != '' THEN 
            'https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatars/' || p.avatar_url
        ELSE 'لا توجد صورة'
    END as full_avatar_url
FROM profiles p 
WHERE p.avatar_url IS NOT NULL AND p.avatar_url != ''
LIMIT 5;
```

## 📝 ملاحظات مهمة:

- ✅ **اسم bucket صحيح** - `avatars` (بصيغة الجمع)
- ✅ **سياسات RLS شاملة** - للجميع العمليات المطلوبة
- ✅ **رابط Storage صحيح** - يستخدم الرابط العام
- ✅ **أمان محسن** - سياسات محددة للمستخدمين

## 🎉 النتيجة:

بعد التحديث:
- ✅ **Storage مُعد بشكل صحيح** مع السياسات
- ✅ **صور حقيقية** من Supabase Storage
- ✅ **أسماء حقيقية** للركاب
- ✅ **عرض محسن** للتقييمات مع الصور

**شغل `database/setup_storage_and_ratings.sql` وستحصل على إعداد Storage كامل!** 🎉
