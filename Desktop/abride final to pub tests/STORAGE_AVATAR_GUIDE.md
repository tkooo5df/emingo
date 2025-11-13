# ربط صور البروفايل مع Supabase Storage

## 🎯 الهدف:
ربط صور البروفايل المحفوظة في Supabase Storage (مجلد `avatar`) مع التقييمات.

## 📁 هيكل Storage:
```
Supabase Storage/
└── avatar/
    ├── user1-avatar.jpg
    ├── user2-avatar.png
    └── user3-avatar.webp
```

## ✅ التحديثات المنجزة:

### **1. تحديث دالة get_driver_ratings**
تم تحديث الدالة لبناء رابط Storage الصحيح:

```sql
CASE 
    WHEN p.avatar_url IS NOT NULL AND p.avatar_url != '' THEN 
        'https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatar/' || p.avatar_url
    ELSE NULL 
END as passenger_avatar_url
```

### **2. معالجة الحالات المختلفة**
- ✅ **صورة موجودة** - بناء رابط Storage كامل
- ✅ **صورة غير موجودة** - إرجاع NULL
- ✅ **حقل فارغ** - إرجاع NULL

## 🚀 التطبيق:

### **شغل `database/storage_ratings_function.sql`** في Supabase SQL Editor

هذا الملف يحتوي على:
1. ✅ **حذف الدالة القديمة** - `DROP FUNCTION IF EXISTS`
2. ✅ **إنشاء الدالة الجديدة** - مع ربط Storage
3. ✅ **فحص الصور الموجودة** - استعلام لعرض الصور
4. ✅ **اختبار الدالة** - مثال على الاستخدام

## 🔗 بناء رابط Storage:

### **الرابط الأساسي**:
```
https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatar/
```

### **مثال على الرابط الكامل**:
```
https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatar/user123-avatar.jpg
```

### **في قاعدة البيانات**:
- `avatar_url` يحتوي على اسم الملف فقط (مثل: `user123-avatar.jpg`)
- الدالة تبني الرابط الكامل تلقائياً

## 🎨 عرض الصور في المكون:

### **في DriverRatingsDisplay.tsx**:
```typescript
<Avatar className="h-8 w-8">
  {rating.passengerAvatarUrl ? (
    <img 
      src={rating.passengerAvatarUrl} 
      alt={rating.passengerName || 'راكب'}
      className="h-8 w-8 rounded-full object-cover"
      onError={(e) => {
        // في حالة فشل تحميل الصورة
        e.currentTarget.style.display = 'none';
      }}
    />
  ) : (
    <AvatarFallback>
      <User className="h-4 w-4" />
    </AvatarFallback>
  )}
</Avatar>
```

## 🔍 كيفية الاختبار:

1. **شغل `database/storage_ratings_function.sql`** في Supabase
2. **تحقق من رسالة النجاح** - "تم إنشاء الدالة مع ربط Storage بنجاح!"
3. **فحص الصور الموجودة** - ستظهر في نتائج الاستعلام
4. **اختبر التقييمات** - يجب أن تظهر الصور الحقيقية

## 📊 فحص الصور الموجودة:

### **استعلام فحص Storage**:
```sql
SELECT 
    p.full_name,
    p.avatar_url,
    CASE 
        WHEN p.avatar_url IS NOT NULL AND p.avatar_url != '' THEN 
            'https://kobsavfggcnfemdzsnpj.supabase.co/storage/v1/object/public/avatar/' || p.avatar_url
        ELSE 'لا توجد صورة'
    END as full_avatar_url
FROM profiles p 
WHERE p.avatar_url IS NOT NULL AND p.avatar_url != ''
LIMIT 5;
```

## 🛠️ إعدادات Storage المطلوبة:

### **في Supabase Dashboard**:
1. **Storage** → **avatar** bucket
2. **Public access** - يجب أن يكون متاح للعامة
3. **File uploads** - يجب أن تكون مسموحة
4. **File types** - jpg, png, webp, gif

### **RLS Policies**:
```sql
-- سياسة للقراءة العامة
CREATE POLICY "Public avatar access" ON storage.objects
FOR SELECT USING (bucket_id = 'avatar');

-- سياسة للرفع
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatar' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 📝 ملاحظات مهمة:

- ✅ **رابط Storage صحيح** - يستخدم الرابط العام للـ Storage
- ✅ **معالجة الأخطاء** - في حالة فشل تحميل الصورة
- ✅ **أداء محسن** - رابط مباشر للـ Storage
- ✅ **أمان** - استخدام الـ public bucket فقط

## 🎉 النتيجة:

بعد التحديث:
- ✅ **صور حقيقية** من Supabase Storage
- ✅ **أسماء حقيقية** للركاب
- ✅ **روابط صحيحة** للصور
- ✅ **عرض محسن** للتقييمات

**شغل `database/storage_ratings_function.sql` وستحصل على صور حقيقية من Storage!** 🎉
