# مصادر التقييمات في النظام - Abridas

## 📊 مصادر التقييمات الحالية

### 1. **DriverRatingsDisplay** (لوحة تحكم السائق)
**الموقع**: `src/components/driver/DriverRatingsDisplay.tsx`
**المصادر**:
- ✅ **جدول `ratings`** (الأولوية الأولى)
- ✅ **جدول `profiles`** (متوسط التقييم)
- ✅ **LocalStorage** (نسخة احتياطية)

```typescript
// جلب التقييمات من الجدول المنفصل
const { data: ratingsData } = await supabase
  .from('ratings')
  .select(`
    *,
    passenger:profiles!ratings_passenger_id_fkey(full_name, avatar_url),
    booking:bookings(id, trip_id)
  `)
  .eq('driver_id', driverId);

// جلب متوسط التقييم من ملف السائق
const { data: profile } = await supabase
  .from('profiles')
  .select('average_rating, ratings_count')
  .eq('id', driverId);
```

### 2. **RatingSection** (إضافة التقييم)
**الموقع**: `src/components/booking/RatingSection.tsx`
**المصادر**:
- ✅ **LocalStorage** (قراءة التقييمات المحفوظة)
- ✅ **Props** (التقييمات الموجودة)

```typescript
// قراءة من LocalStorage
const loadRatingFromStorage = () => {
  const ratingsKey = `booking_ratings_${bookingId}`;
  const savedRating = localStorage.getItem(ratingsKey);
  return JSON.parse(savedRating);
};
```

### 3. **Profile Component** (الملف الشخصي)
**الموقع**: `src/components/profile/Profile.tsx`
**المصادر**:
- ✅ **ProfileApi.getUserReviews()** (مصدر وهمي - تم إصلاحه)
- ✅ **ProfileApi.getUserStats()** (إحصائيات وهمية - تم إصلاحه)

```typescript
// جلب التقييمات من API
const reviews = await ProfileApi.getUserReviews(user.id);
const stats = await ProfileApi.getUserStats(user.id);
```

### 4. **ProfileApi** (API وهمي)
**الموقع**: `src/utils/profileApi.ts`
**الحالة**: ✅ **تم إصلاحه**
- ❌ **قبل**: إرجاع بيانات وهمية
- ✅ **بعد**: إرجاع قوائم فارغة

```typescript
// بعد الإصلاح
static async getUserReviews(userId: string): Promise<any[]> {
  return []; // قائمة فارغة بدلاً من البيانات الوهمية
}

static async getUserStats(userId: string) {
  return {
    completedTrips: 0,
    averageRating: 0,
    totalEarnings: 0
  };
}
```

## 🎯 مصادر التقييمات الحقيقية

### **المصدر الأساسي**: جدول `ratings`
```sql
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    driver_id UUID NOT NULL REFERENCES profiles(id),
    passenger_id UUID NOT NULL REFERENCES profiles(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **المصدر الثانوي**: جدول `profiles`
```sql
-- حقول التقييمات في profiles
average_rating REAL DEFAULT 0,
ratings_count INTEGER DEFAULT 0
```

### **المصدر الاحتياطي**: LocalStorage
```javascript
// مفتاح التخزين
const ratingsKey = `booking_ratings_${bookingId}`;
localStorage.setItem(ratingsKey, JSON.stringify(ratingData));
```

## 🔄 تدفق البيانات

### **عند إضافة تقييم**:
1. **RatingSection** → حفظ في جدول `ratings`
2. **RatingSection** → حفظ في حقل `notes` في جدول `bookings`
3. **RatingSection** → حفظ في LocalStorage
4. **Trigger** → تحديث متوسط التقييم في جدول `profiles`

### **عند عرض التقييمات**:
1. **DriverRatingsDisplay** → قراءة من جدول `ratings`
2. **DriverRatingsDisplay** → قراءة متوسط التقييم من جدول `profiles`
3. **RatingSection** → قراءة من LocalStorage (إذا لم تكن موجودة في قاعدة البيانات)

## 📍 أماكن عرض التقييمات

### 1. **لوحة تحكم السائق** (`UserDashboard`)
- مكون: `DriverRatingsDisplay`
- مصدر البيانات: جدول `ratings` + جدول `profiles`

### 2. **قائمة الحجوزات** (للراكب)
- مكون: `RatingSection`
- مصدر البيانات: LocalStorage + Props

### 3. **الملف الشخصي** (`Profile`)
- مكون: `Profile` component
- مصدر البيانات: `ProfileApi` (تم إصلاحه)

## ⚠️ الحالة الحالية

### ✅ **تم إصلاحه**:
- ❌ البيانات الوهمية في `ProfileApi`
- ❌ التقييمات التجريبية في الملف الشخصي
- ✅ عرض رسالة "لا توجد تقييمات بعد" عند عدم وجود بيانات

### 🔄 **يعمل حالياً**:
- ✅ قراءة من جدول `ratings` (إذا كان موجوداً)
- ✅ قراءة من جدول `profiles` للمتوسط
- ✅ قراءة من LocalStorage كنسخة احتياطية
- ✅ حفظ في جميع المصادر عند إضافة تقييم

### 📝 **ملاحظات مهمة**:
- النظام يعمل حتى لو لم يكن جدول `ratings` موجوداً
- البيانات محفوظة في عدة أماكن لضمان الأمان
- لا توجد بيانات وهمية تظهر في أي مكان
- النظام جاهز للبيانات الحقيقية من قاعدة البيانات

## 🚀 الخطوات التالية

1. **إنشاء جدول `ratings`** في Supabase
2. **إضافة بيانات تجريبية حقيقية** (إذا رغبت)
3. **اختبار النظام** مع البيانات الحقيقية
4. **مراقبة التقييمات** في لوحة تحكم السائق
