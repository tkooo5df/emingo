# جلب الإحصائيات الحقيقية من Supabase

## 🎯 نظرة عامة

تم تحديث نظام الملفات الشخصية لجلب **جميع الإحصائيات والأرقام الحقيقية** مباشرة من Supabase بدلاً من البيانات الوهمية.

---

## ✅ التحديثات المنفذة

### 1. إزالة ProfileApi تماماً

**قبل:**
```typescript
import ProfileApi from '@/utils/profileApi';

const apiProfile = await ProfileApi.getProfile(user.id);
const stats = await ProfileApi.getUserStats(user.id);
```

**بعد:**
```typescript
// ProfileApi removed - using direct Supabase queries instead

const { data: supabaseProfile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
```

---

### 2. جلب بيانات الملف الشخصي من Supabase مباشرة

#### السائقين (Drivers)

```typescript
// Get driver profile from Supabase
const { data: supabaseProfile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

// Get driver rating from profiles table
const { data: driverStats } = await supabase
  .from('profiles')
  .select('average_rating, ratings_count')
  .eq('id', user.id)
  .single();
```

**البيانات المُجلبة:**
- ✅ `full_name` - الاسم الكامل
- ✅ `phone` - رقم الهاتف
- ✅ `avatar_url` - صورة الملف الشخصي
- ✅ `email` - البريد الإلكتروني
- ✅ `role` - الدور (سائق/راكب)
- ✅ `average_rating` - متوسط التقييم
- ✅ `ratings_count` - عدد التقييمات
- ✅ `is_verified` - حالة التوثيق
- ✅ `created_at` - تاريخ الانضمام
- ✅ `updated_at` - تاريخ آخر تحديث

#### الركاب (Passengers)

```typescript
// Get passenger stats from profile
const { data: profileStats } = await supabase
  .from('profiles')
  .select('passenger_average_rating, passenger_ratings_count, total_trips_as_passenger, total_cancellations_as_passenger')
  .eq('id', user.id)
  .single();
```

**البيانات المُجلبة:**
- ✅ `passenger_average_rating` - متوسط تقييم الراكب
- ✅ `passenger_ratings_count` - عدد التقييمات
- ✅ `total_trips_as_passenger` - عدد الرحلات المكتملة
- ✅ `total_cancellations_as_passenger` - عدد الإلغاءات

---

### 3. حساب الإحصائيات من البيانات الفعلية

#### إحصائيات السائقين

```typescript
// Get trips and bookings from database
const tripsData = await BrowserDatabaseService.getTripsWithDetails(user.id);
const bookingsData = await BrowserDatabaseService.getBookingsByDriver(user.id);

// Calculate real statistics
const completedTrips = tripsData.filter(t => t.status === 'completed').length;
const totalBookedSeats = bookingsData.reduce((total, b) => total + (b.seatsBooked || 0), 0);
const completedBookingsCount = bookingsData.filter(b => b.status === 'completed').length;
const totalEarnings = bookingsData.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

// Get vehicles stats
const vehiclesData = await BrowserDatabaseService.getVehiclesByDriver(user.id);
const totalVehicles = vehiclesData.length;
const activeVehicles = vehiclesData.filter(v => v.isActive).length;
```

#### إحصائيات الركاب

```typescript
// Get bookings from database
const bookingsData = await BrowserDatabaseService.getBookingsByPassenger(user.id);

// Calculate stats (with fallback from profile)
let passengerTrips = profileStats.total_trips_as_passenger || 
                      bookingsData.filter(b => b.status === 'completed').length;

let passengerCancellations = profileStats.total_cancellations_as_passenger || 
                              bookingsData.filter(b => b.status === 'cancelled').length;

let passengerBookings = bookingsData.length;
```

---

### 4. جلب التقييمات من قاعدة البيانات

#### تقييمات السائقين

```typescript
// Fetch from ratings table
const { data: ratingsData } = await supabase
  .from('ratings')
  .select(`
    id,
    booking_id,
    passenger_id,
    rating,
    comment,
    created_at,
    passenger:profiles!ratings_passenger_id_fkey(
      full_name,
      avatar_url,
      email
    )
  `)
  .eq('driver_id', driverId)
  .order('created_at', { ascending: false });
```

#### تقييمات الركاب

```typescript
// Fetch from passenger_ratings table
const { data: ratingsData } = await supabase
  .from('passenger_ratings')
  .select(`
    id,
    driver_id,
    rating,
    comment,
    created_at,
    driver:profiles!passenger_ratings_driver_id_fkey(
      full_name,
      avatar_url,
      email
    )
  `)
  .eq('passenger_id', passengerId)
  .order('created_at', { ascending: false });
```

---

## 📊 مصادر البيانات الحقيقية

### للسائقين (Drivers)

| الإحصائية | المصدر | الجدول |
|-----------|--------|--------|
| الرحلات المكتملة | عدد trips بحالة 'completed' | `trips` |
| المقاعد المحجوزة | مجموع seats_booked من جميع الحجوزات | `bookings` |
| الحجوزات المكتملة | عدد bookings بحالة 'completed' | `bookings` |
| الأرباح الإجمالية | مجموع total_amount من جميع الحجوزات | `bookings` |
| عدد المركبات | عدد جميع vehicles | `vehicles` |
| المركبات النشطة | عدد vehicles بحالة is_active = true | `vehicles` |
| متوسط التقييم | average_rating أو حساب من ratings | `profiles` / `ratings` |
| عدد التقييمات | ratings_count | `profiles` |
| التقييمات | جميع التقييمات مع تفاصيل الراكب | `ratings` |

### للركاب (Passengers)

| الإحصائية | المصدر | الجدول |
|-----------|--------|--------|
| الرحلات المكتملة | total_trips_as_passenger أو حساب | `profiles` / `bookings` |
| مرات الحجز | عدد جميع bookings | `bookings` |
| الإلغاءات | total_cancellations_as_passenger أو حساب | `profiles` / `bookings` |
| متوسط التقييم | passenger_average_rating | `profiles` |
| عدد التقييمات | passenger_ratings_count | `profiles` |
| التقييمات | جميع التقييمات مع تفاصيل السائق | `passenger_ratings` |

---

## 🔍 الفوائد

### 1. **دقة البيانات** ✅
- جميع الأرقام من قاعدة البيانات الحقيقية
- لا توجد بيانات وهمية أو hardcoded
- تحديث فوري عند تغيير البيانات

### 2. **الأداء** ⚡
- استعلامات مباشرة من Supabase
- تحميل البيانات المطلوبة فقط
- استخدام الفهارس للبحث السريع

### 3. **الموثوقية** 🛡️
- Fallback للقاعدة المحلية إذا فشل Supabase
- معالجة الأخطاء بشكل صحيح
- Logging للمساعدة في التشخيص

### 4. **الصيانة** 🔧
- كود أنظف بدون ProfileApi
- استعلامات واضحة ومباشرة
- سهولة التتبع والتعديل

---

## 🧪 التحقق من البيانات

### 1. افتح Console في المتصفح

```javascript
// سيظهر لك logs تفصيلية مثل:
"✅ PROFILE - Driver stats calculation (matching dashboard): {
  completedTrips: 15,
  totalBookedSeats: 48,
  completedBookingsCount: 12,
  totalVehicles: 2,
  activeVehicles: 1,
  totalEarnings: 12500
}"

"✅ PROFILE - Passenger stats: {
  passengerTrips: 8,
  passengerCancellations: 1,
  passengerBookings: 9,
  passengerRating: 4.5,
  passengerRatingsCount: 6
}"
```

### 2. قارن مع قاعدة البيانات

#### للسائقين:
```sql
-- تحقق من الرحلات المكتملة
SELECT COUNT(*) FROM trips 
WHERE driver_id = 'your-driver-id' 
AND status = 'completed';

-- تحقق من المقاعد المحجوزة
SELECT SUM(seats_booked) FROM bookings 
WHERE driver_id = 'your-driver-id';

-- تحقق من التقييم
SELECT average_rating, ratings_count FROM profiles 
WHERE id = 'your-driver-id';
```

#### للركاب:
```sql
-- تحقق من الرحلات المكتملة
SELECT total_trips_as_passenger FROM profiles 
WHERE id = 'your-passenger-id';

-- تحقق من الإلغاءات
SELECT total_cancellations_as_passenger FROM profiles 
WHERE id = 'your-passenger-id';

-- تحقق من التقييم
SELECT passenger_average_rating, passenger_ratings_count FROM profiles 
WHERE id = 'your-passenger-id';
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: الأرقام لا تزال تظهر صفر

**الحلول:**
1. تحقق من وجود بيانات في الجداول:
```sql
SELECT COUNT(*) FROM trips WHERE driver_id = 'your-id';
SELECT COUNT(*) FROM bookings WHERE passenger_id = 'your-id';
```

2. تحقق من Triggers في Supabase:
```sql
-- تحقق من تفعيل triggers
SELECT * FROM pg_trigger 
WHERE tgname LIKE '%passenger%' OR tgname LIKE '%driver%';
```

3. شغّل تحديث يدوي:
```sql
-- للركاب
UPDATE profiles 
SET 
  total_trips_as_passenger = (
    SELECT COUNT(*) FROM bookings 
    WHERE passenger_id = profiles.id AND status = 'completed'
  ),
  total_cancellations_as_passenger = (
    SELECT COUNT(*) FROM bookings 
    WHERE passenger_id = profiles.id AND status = 'cancelled'
  )
WHERE id = 'your-passenger-id';

-- للسائقين
UPDATE profiles 
SET 
  average_rating = (
    SELECT COALESCE(AVG(rating), 0) FROM ratings 
    WHERE driver_id = profiles.id
  ),
  ratings_count = (
    SELECT COUNT(*) FROM ratings 
    WHERE driver_id = profiles.id
  )
WHERE id = 'your-driver-id';
```

### المشكلة: الصفحة بطيئة في التحميل

**الحلول:**
1. تحقق من الفهارس على الجداول
2. استخدم EXPLAIN ANALYZE في SQL
3. قلل عدد الاستعلامات المتزامنة

### المشكلة: خطأ في الاستعلام

**تحقق من:**
- صلاحيات المستخدم في Supabase
- Row Level Security (RLS) policies
- أسماء الأعمدة صحيحة
- Console للأخطاء JavaScript

---

## 📝 ملاحظات مهمة

1. **جميع الإحصائيات حقيقية** - لا توجد بيانات وهمية
2. **التحديث التلقائي** - Triggers تحدث الإحصائيات
3. **Fallback موجود** - إذا فشل Supabase، يتم الحساب من البيانات المحلية
4. **Logging شامل** - جميع العمليات مسجلة في Console
5. **TypeScript آمن** - استخدام `as any` فقط للحقول الجديدة

---

## 🔄 تدفق البيانات

```
User Profile Page
       ↓
   Supabase Query (profiles)
       ↓
   Get Real Data:
   - trips
   - bookings
   - vehicles
   - ratings
   - passenger_ratings
       ↓
   Calculate Stats
       ↓
   Display in UI
```

---

## ✨ الملفات المعدلة

- ✅ `src/components/profile/Profile.tsx` - تحديث كامل لجلب البيانات
- ✅ إزالة الاعتماد على `ProfileApi`
- ✅ استعلامات مباشرة من Supabase
- ✅ حسابات حقيقية من البيانات الفعلية

---

**تاريخ التحديث:** 2025-10-23  
**الحالة:** ✅ مكتمل وجاهز  
**الإصدار:** 2.0.0 - Real Data

