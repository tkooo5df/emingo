# نظام تقييم الركاب - Passenger Rating System

## 🎯 نظرة عامة

تم إنشاء نظام شامل لتقييم الركاب من قبل السائقين، مشابه تماماً لنظام تقييم السائقين. يتيح هذا النظام:

- ✅ للسائقين تقييم الركاب بعد إكمال الرحلة
- ✅ عرض ملف شخصي كامل للراكب مع إحصائيات مفصلة
- ✅ إمكانية النقر على اسم/صورة الراكب لعرض ملفه الشخصي
- ✅ حساب تلقائي للتقييمات والإحصائيات

---

## 📊 هيكل قاعدة البيانات

### 1. جدول `passenger_ratings`

جدول منفصل لحفظ تقييمات الركاب من قبل السائقين:

```sql
CREATE TABLE passenger_ratings (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    passenger_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, driver_id, passenger_id)
);
```

**الحقول:**
- `id`: معرف فريد للتقييم
- `booking_id`: معرف الحجز المرتبط بالتقييم
- `driver_id`: معرف السائق الذي أعطى التقييم
- `passenger_id`: معرف الراكب الذي تم تقييمه
- `rating`: التقييم من 1 إلى 5 نجوم
- `comment`: تعليق السائق (اختياري)
- `created_at`, `updated_at`: تواريخ الإنشاء والتحديث

**الفهارس:**
- `idx_passenger_ratings_passenger_id`: فهرس على passenger_id
- `idx_passenger_ratings_driver_id`: فهرس على driver_id
- `idx_passenger_ratings_booking_id`: فهرس على booking_id
- `idx_passenger_ratings_created_at`: فهرس على created_at

### 2. حقول جديدة في جدول `profiles`

تمت إضافة الحقول التالية لحفظ إحصائيات الركاب:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
    passenger_average_rating REAL DEFAULT 0,
    passenger_ratings_count INTEGER DEFAULT 0,
    total_trips_as_passenger INTEGER DEFAULT 0,
    total_cancellations_as_passenger INTEGER DEFAULT 0;
```

**الحقول:**
- `passenger_average_rating`: متوسط تقييم الراكب
- `passenger_ratings_count`: عدد التقييمات التي حصل عليها
- `total_trips_as_passenger`: عدد الرحلات المكتملة كراكب
- `total_cancellations_as_passenger`: عدد الإلغاءات كراكب

---

## 🔄 الدوال والمشغلات (Triggers)

### 1. `update_passenger_average_rating()`

دالة تحدث متوسط تقييم الراكب تلقائياً عند إضافة/تعديل/حذف تقييم:

```sql
CREATE OR REPLACE FUNCTION update_passenger_average_rating()
RETURNS TRIGGER AS $$
DECLARE
    v_passenger_id UUID;
BEGIN
    -- Determine which passenger_id to update
    IF TG_OP = 'DELETE' THEN
        v_passenger_id := OLD.passenger_id;
    ELSE
        v_passenger_id := NEW.passenger_id;
    END IF;

    -- Update passenger profile
    UPDATE profiles 
    SET 
        passenger_average_rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM passenger_ratings 
            WHERE passenger_id = v_passenger_id
        ),
        passenger_ratings_count = (
            SELECT COUNT(*) 
            FROM passenger_ratings 
            WHERE passenger_id = v_passenger_id
        ),
        updated_at = NOW()
    WHERE id = v_passenger_id;
    
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;
```

### 2. `update_passenger_stats()`

دالة تحدث إحصائيات الراكب (الرحلات والإلغاءات) تلقائياً:

```sql
CREATE OR REPLACE FUNCTION update_passenger_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_passenger_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_passenger_id := OLD.passenger_id;
    ELSE
        v_passenger_id := NEW.passenger_id;
    END IF;

    IF v_passenger_id IS NOT NULL THEN
        UPDATE profiles 
        SET 
            total_trips_as_passenger = (
                SELECT COUNT(*) 
                FROM bookings 
                WHERE passenger_id = v_passenger_id 
                AND status = 'completed'
            ),
            total_cancellations_as_passenger = (
                SELECT COUNT(*) 
                FROM bookings 
                WHERE passenger_id = v_passenger_id 
                AND status = 'cancelled'
            ),
            updated_at = NOW()
        WHERE id = v_passenger_id;
    END IF;
    
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;
```

---

## 🧩 المكونات (Components)

### 1. `PassengerRatingsDisplay.tsx`

**المسار:** `src/components/passenger/PassengerRatingsDisplay.tsx`

مكون لعرض تقييمات الراكب من قبل السائقين.

**الخصائص (Props):**
- `passengerId: string` - معرف الراكب
- `showTitle?: boolean` - عرض العنوان (افتراضياً: true)

**الميزات:**
- عرض متوسط التقييم وعدد التقييمات
- قائمة بجميع التقييمات مع تفاصيل السائق
- تاريخ كل تقييم وتعليق السائق
- رقم الحجز لكل تقييم
- صور وأسماء السائقين
- رسوم متحركة سلسة

**الاستخدام:**
```tsx
<PassengerRatingsDisplay 
  passengerId="user-uuid-here" 
  showTitle={true} 
/>
```

### 2. `PassengerStatsCard.tsx`

**المسار:** `src/components/passenger/PassengerStatsCard.tsx`

بطاقة إحصائيات شاملة للراكب.

**الخصائص (Props):**
- `totalTrips: number` - عدد الرحلات المكتملة
- `totalCancellations: number` - عدد الإلغاءات
- `totalBookings: number` - مرات الحجز
- `averageRating: number` - متوسط التقييم
- `ratingsCount: number` - عدد التقييمات

**المعلومات المعروضة:**
1. **الرحلات المكتملة** - عدد الرحلات التي أكملها الراكب
2. **مرات الحجز** - إجمالي عدد الحجوزات
3. **الإلغاءات** - عدد ونسبة الإلغاءات
4. **التقييم** - متوسط التقييم مع عدد التقييمات
5. **معدل إتمام الرحلات** - نسبة مئوية مع شريط تقدم
6. **حالة الحساب** - تقييم شامل (ممتاز، جيد، يحتاج تحسين)

**التنبيهات الذكية:**
- ⚠️ تحذير إذا كان معدل الإلغاءات أعلى من 15%
- ✅ مكافأة للركاب الممتازين (تقييم 4.5+ مع 5+ تقييمات)

**الاستخدام:**
```tsx
<PassengerStatsCard
  totalTrips={25}
  totalCancellations={2}
  totalBookings={27}
  averageRating={4.7}
  ratingsCount={15}
/>
```

### 3. `RatingPassengerSection.tsx`

**المسار:** `src/components/booking/RatingPassengerSection.tsx`

مكون لتقييم الراكب من قبل السائق.

**الخصائص (Props):**
- `bookingId: number` - معرف الحجز
- `passengerId: string` - معرف الراكب
- `passengerName?: string` - اسم الراكب
- `existingRating?: number | null` - التقييم الحالي
- `existingComment?: string | null` - التعليق الحالي
- `onRatingSubmit?: () => void` - callback عند إرسال التقييم

**الميزات:**
- واجهة سهلة لاختيار عدد النجوم (1-5)
- حقل تعليق اختياري
- حفظ في قاعدة البيانات و localStorage
- إمكانية تعديل التقييم
- عرض التقييم السابق
- رسائل تأكيد وأخطاء

**الاستخدام:**
```tsx
<RatingPassengerSection
  bookingId={123}
  passengerId="passenger-uuid"
  passengerName="أحمد محمد"
  onRatingSubmit={() => console.log('Rating submitted')}
/>
```

---

## 📄 تحديثات المكونات الموجودة

### 1. `Profile.tsx`

**المسار:** `src/components/profile/Profile.tsx`

**التحديثات:**
- ✅ إضافة حقول جديدة لـ `PassengerProfileData`:
  - `totalCancellations`
  - `totalBookings`
  - `ratingsCount`
- ✅ دالة `fetchPassengerRatings()` لجلب تقييمات الراكب من قاعدة البيانات
- ✅ جلب إحصائيات الراكب من جدول `profiles`
- ✅ عرض `PassengerStatsCard` للركاب
- ✅ عرض `PassengerRatingsDisplay` للركاب

**العرض للركاب:**
```tsx
{!isDriver && (
  <>
    <PassengerStatsCard
      totalTrips={profileData.completedTrips}
      totalCancellations={profileData.totalCancellations}
      totalBookings={profileData.totalBookings}
      averageRating={profileData.averageRating}
      ratingsCount={profileData.ratingsCount}
    />
    <PassengerRatingsDisplay 
      passengerId={profileData.id} 
      showTitle={true} 
    />
  </>
)}
```

### 2. `UserDashboard.tsx`

**المسار:** `src/pages/UserDashboard.tsx`

**التحديثات:**
- ✅ جعل أسماء الركاب قابلة للنقر
- ✅ إضافة روابط إلى ملفات الركاب
- ✅ روابط clickable مع hover effect

**الكود المُحدث:**
```tsx
{userProfile?.role === 'driver' && booking.passenger?.id ? (
  <Link 
    to={`/profile?userId=${booking.passenger.id}`}
    className="text-primary hover:underline cursor-pointer"
  >
    الراكب: {booking.passenger?.fullName}
  </Link>
) : (
  <span>الراكب: {booking.passenger?.fullName}</span>
)}
```

---

## 🗂️ ملفات قاعدة البيانات

### 1. `passenger_ratings_table.sql`

**المسار:** `database/passenger_ratings_table.sql`

ملف SQL شامل يحتوي على:
- إنشاء جدول `passenger_ratings`
- إضافة الفهارس
- إضافة حقول جديدة لجدول `profiles`
- إنشاء الدوال والمشغلات
- إنشاء view `passenger_ratings_detailed`
- تعليقات توضيحية

### 2. `passenger_ratings_sample_data.sql`

**المسار:** `database/passenger_ratings_sample_data.sql`

ملف لإضافة بيانات تجريبية:
- تقييمات متنوعة (2-5 نجوم)
- تعليقات واقعية بالعربية
- تحديث الإحصائيات التلقائي
- استعلام للتحقق من البيانات

---

## 📋 خطوات التطبيق

### 1. تطبيق تغييرات قاعدة البيانات

في Supabase SQL Editor، شغّل الملفات بالترتيب:

```sql
-- الخطوة 1: إنشاء الجدول والدوال
\i database/passenger_ratings_table.sql

-- الخطوة 2 (اختياري): إضافة بيانات تجريبية
\i database/passenger_ratings_sample_data.sql
```

### 2. تحديث الكود

الملفات جاهزة ولا تحتاج تعديلات إضافية:
- ✅ `src/components/passenger/PassengerRatingsDisplay.tsx`
- ✅ `src/components/passenger/PassengerStatsCard.tsx`
- ✅ `src/components/booking/RatingPassengerSection.tsx`
- ✅ `src/components/profile/Profile.tsx`
- ✅ `src/pages/UserDashboard.tsx`

### 3. إضافة RatingPassengerSection في لوحة السائق

في `UserDashboard.tsx` أو أي صفحة يعرض فيها السائق الحجوزات المكتملة:

```tsx
import RatingPassengerSection from '@/components/booking/RatingPassengerSection';

// في مكان عرض تفاصيل الحجز للسائق
{userProfile?.role === 'driver' && booking.status === 'completed' && (
  <RatingPassengerSection
    bookingId={booking.id}
    passengerId={booking.passenger.id}
    passengerName={booking.passenger.fullName}
    onRatingSubmit={() => refreshBookings()}
  />
)}
```

---

## 🎨 الميزات البصرية

### 1. PassengerStatsCard

**التصميم:**
- بطاقات ملونة لكل إحصائية
- أيقونات توضيحية
- شريط تقدم لمعدل الإتمام
- شارات ديناميكية حسب الأداء
- تنبيهات ملونة

**الألوان:**
- 🔵 أزرق للحجوزات
- 🟢 أخضر للرحلات المكتملة
- 🔴 أحمر للإلغاءات
- 🟡 أصفر للتقييم

### 2. PassengerRatingsDisplay

**التصميم:**
- بطاقات منفصلة لكل تقييم
- صور دائرية للسائقين
- نجوم ذهبية للتقييمات
- تواريخ بالعربية
- تعليقات في صناديق رمادية

### 3. RatingPassengerSection

**التصميم:**
- نجوم تفاعلية مع hover effect
- حقل تعليق قابل للتوسيع
- أزرار واضحة للحفظ/الإلغاء
- عرض التقييم السابق بشكل جميل
- رسائل toast للتأكيد

---

## 🔍 الاستعلامات المفيدة

### عرض جميع تقييمات راكب معين

```sql
SELECT 
    pr.rating,
    pr.comment,
    pr.created_at,
    d.full_name AS driver_name,
    b.id AS booking_id
FROM passenger_ratings pr
LEFT JOIN profiles d ON pr.driver_id = d.id
LEFT JOIN bookings b ON pr.booking_id = b.id
WHERE pr.passenger_id = 'passenger-uuid-here'
ORDER BY pr.created_at DESC;
```

### عرض إحصائيات راكب

```sql
SELECT 
    full_name,
    passenger_average_rating,
    passenger_ratings_count,
    total_trips_as_passenger,
    total_cancellations_as_passenger,
    ROUND(
        CASE 
            WHEN total_trips_as_passenger + total_cancellations_as_passenger > 0 
            THEN (total_cancellations_as_passenger::FLOAT / 
                  (total_trips_as_passenger + total_cancellations_as_passenger)) * 100 
            ELSE 0 
        END, 
        2
    ) AS cancellation_rate
FROM profiles
WHERE id = 'passenger-uuid-here';
```

### أفضل 10 ركاب

```sql
SELECT 
    full_name,
    passenger_average_rating,
    passenger_ratings_count,
    total_trips_as_passenger,
    total_cancellations_as_passenger
FROM profiles
WHERE passenger_ratings_count >= 5
ORDER BY passenger_average_rating DESC, passenger_ratings_count DESC
LIMIT 10;
```

---

## 📊 View: `passenger_ratings_detailed`

View شامل يجمع كل المعلومات في مكان واحد:

```sql
SELECT * FROM passenger_ratings_detailed
WHERE passenger_id = 'passenger-uuid-here';
```

**الأعمدة:**
- معلومات التقييم (rating, comment, created_at)
- معلومات الراكب (id, name, avatar, stats)
- معلومات السائق (id, name, avatar)
- معلومات الحجز (trip_id, status, seats_booked)

---

## ✨ التحسينات المستقبلية

### مقترحات للتطوير:

1. **تقييمات ثنائية الاتجاه في نفس الوقت**
   - السائق يقيّم الراكب والراكب يقيّم السائق بعد نفس الرحلة
   
2. **شارات إنجاز للركاب**
   - "راكب ذهبي" للتقييم 4.8+
   - "راكب موثوق" لعدم وجود إلغاءات
   - "راكب نشط" لعدد رحلات كبير

3. **تصفية السائقين حسب تقييمات الركاب**
   - السائقون يمكنهم رؤية تقييم الراكب قبل قبول الحجز

4. **تقارير وتحليلات**
   - Dashboard للمشرفين بإحصائيات الركاب
   - رسوم بيانية لتطور التقييمات

5. **نظام إشعارات**
   - إشعار للراكب عند حصوله على تقييم جديد
   - إشعار للسائق لتذكيره بتقييم الراكب

---

## 🐛 استكشاف الأخطاء

### المشكلة: لا تظهر التقييمات

**الحلول:**
1. تحقق من تشغيل SQL في Supabase
2. تحقق من وجود بيانات في `passenger_ratings`
3. افتح Console وابحث عن أخطاء JavaScript
4. تحقق من صحة `passengerId`

### المشكلة: الإحصائيات لا تتحدث

**الحلول:**
1. تحقق من تفعيل Triggers في Supabase
2. شغّل استعلام تحديث يدوي:
```sql
UPDATE profiles 
SET passenger_average_rating = (
    SELECT COALESCE(AVG(rating), 0) 
    FROM passenger_ratings 
    WHERE passenger_id = profiles.id
)
WHERE id = 'passenger-uuid';
```

### المشكلة: لا يمكن حفظ التقييم

**الحلول:**
1. تحقق من صلاحيات المستخدم في Supabase
2. تحقق من وجود `booking_id` صحيح
3. تحقق من Logs في Supabase

---

## 📝 ملاحظات

- جميع التواريخ بصيغة ISO 8601
- جميع النصوص بالعربية (RTL)
- جميع التقييمات من 1 إلى 5
- الإحصائيات تتحدث تلقائياً عبر Triggers
- localStorage يُستخدم كنسخة احتياطية

---

**تاريخ الإنشاء:** 2025-10-23  
**الحالة:** ✅ مكتمل وجاهز للاستخدام  
**الإصدار:** 1.0.0

