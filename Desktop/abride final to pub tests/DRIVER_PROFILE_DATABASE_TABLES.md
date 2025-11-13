# جداول قاعدة البيانات - ملف السائق والإحصائيات

## 🗄️ الجداول الرئيسية

### 1. جدول `profiles` - المعلومات الأساسية

**الجدول الرئيسي** للسائق والراكب

```sql
-- عرض معلومات السائق
SELECT 
    id,
    full_name,              -- الاسم الكامل
    phone,                  -- رقم الهاتف
    email,                  -- البريد الإلكتروني
    avatar_url,             -- صورة الملف الشخصي
    role,                   -- الدور (driver/passenger)
    is_verified,            -- هل موثق؟
    average_rating,         -- متوسط التقييم للسائق
    ratings_count,          -- عدد التقييمات
    created_at,             -- تاريخ الانضمام
    updated_at              -- آخر تحديث
FROM profiles
WHERE id = 'driver-uuid-here';
```

**الأعمدة المهمة للسائق:**
- ✅ `average_rating` - متوسط تقييم السائق (يتحدث تلقائياً)
- ✅ `ratings_count` - عدد التقييمات

---

### 2. جدول `trips` - الرحلات

**يحتوي على** جميع الرحلات التي أنشأها السائق

```sql
-- عرض رحلات السائق
SELECT 
    id,
    driver_id,              -- معرف السائق
    from_wilaya_id,         -- من ولاية
    to_wilaya_id,           -- إلى ولاية
    departure_date,         -- تاريخ المغادرة
    departure_time,         -- وقت المغادرة
    available_seats,        -- المقاعد المتاحة
    price_per_seat,         -- سعر المقعد
    status,                 -- الحالة (scheduled/completed/cancelled)
    created_at
FROM trips
WHERE driver_id = 'driver-uuid-here'
ORDER BY created_at DESC;
```

**الإحصائيات المستخرجة:**
```sql
-- عدد الرحلات المكتملة
SELECT COUNT(*) AS completed_trips
FROM trips
WHERE driver_id = 'driver-uuid-here'
AND status = 'completed';

-- عدد جميع الرحلات
SELECT COUNT(*) AS total_trips
FROM trips
WHERE driver_id = 'driver-uuid-here';
```

---

### 3. جدول `bookings` - الحجوزات

**يحتوي على** جميع الحجوزات للرحلات

```sql
-- عرض حجوزات السائق
SELECT 
    b.id,
    b.trip_id,              -- معرف الرحلة
    b.passenger_id,         -- معرف الراكب
    b.driver_id,            -- معرف السائق
    b.seats_booked,         -- عدد المقاعد المحجوزة
    b.total_amount,         -- المبلغ الإجمالي
    b.status,               -- الحالة (pending/confirmed/completed/cancelled)
    b.payment_method,       -- طريقة الدفع
    b.created_at
FROM bookings b
WHERE b.driver_id = 'driver-uuid-here'
ORDER BY b.created_at DESC;
```

**الإحصائيات المستخرجة:**
```sql
-- إجمالي المقاعد المحجوزة (من جميع الحجوزات)
SELECT SUM(seats_booked) AS total_booked_seats
FROM bookings
WHERE driver_id = 'driver-uuid-here';

-- عدد الحجوزات المكتملة
SELECT COUNT(*) AS completed_bookings
FROM bookings
WHERE driver_id = 'driver-uuid-here'
AND status = 'completed';

-- إجمالي الأرباح
SELECT SUM(total_amount) AS total_earnings
FROM bookings
WHERE driver_id = 'driver-uuid-here';

-- إجمالي الأرباح من الحجوزات المكتملة فقط
SELECT SUM(total_amount) AS completed_earnings
FROM bookings
WHERE driver_id = 'driver-uuid-here'
AND status = 'completed';
```

---

### 4. جدول `vehicles` - المركبات

**يحتوي على** مركبات السائق

```sql
-- عرض مركبات السائق
SELECT 
    id,
    driver_id,              -- معرف السائق
    make,                   -- الصانع (Toyota, Renault, ...)
    model,                  -- الموديل (Corolla, Clio, ...)
    year,                   -- سنة الصنع
    license_plate,          -- رقم اللوحة
    color,                  -- اللون
    seats,                  -- عدد المقاعد
    is_active,              -- هل نشط؟
    created_at
FROM vehicles
WHERE driver_id = 'driver-uuid-here';
```

**الإحصائيات المستخرجة:**
```sql
-- عدد جميع المركبات
SELECT COUNT(*) AS total_vehicles
FROM vehicles
WHERE driver_id = 'driver-uuid-here';

-- عدد المركبات النشطة
SELECT COUNT(*) AS active_vehicles
FROM vehicles
WHERE driver_id = 'driver-uuid-here'
AND is_active = true;
```

---

### 5. جدول `ratings` - التقييمات

**يحتوي على** تقييمات الركاب للسائق

```sql
-- عرض تقييمات السائق
SELECT 
    r.id,
    r.booking_id,           -- معرف الحجز
    r.driver_id,            -- معرف السائق
    r.passenger_id,         -- معرف الراكب
    r.rating,               -- التقييم (1-5)
    r.comment,              -- التعليق
    r.created_at,           -- تاريخ التقييم
    -- معلومات الراكب
    p.full_name AS passenger_name,
    p.avatar_url AS passenger_avatar
FROM ratings r
LEFT JOIN profiles p ON r.passenger_id = p.id
WHERE r.driver_id = 'driver-uuid-here'
ORDER BY r.created_at DESC;
```

**الإحصائيات المستخرجة:**
```sql
-- متوسط التقييم
SELECT AVG(rating) AS average_rating
FROM ratings
WHERE driver_id = 'driver-uuid-here';

-- عدد التقييمات
SELECT COUNT(*) AS ratings_count
FROM ratings
WHERE driver_id = 'driver-uuid-here';

-- توزيع التقييمات
SELECT 
    rating,
    COUNT(*) AS count
FROM ratings
WHERE driver_id = 'driver-uuid-here'
GROUP BY rating
ORDER BY rating DESC;
```

---

## 📊 استعلام شامل لكل إحصائيات السائق

```sql
-- استعلام واحد يجلب جميع الإحصائيات
WITH driver_stats AS (
    SELECT 
        p.id,
        p.full_name,
        p.phone,
        p.email,
        p.avatar_url,
        p.is_verified,
        p.average_rating,
        p.ratings_count,
        p.created_at,
        -- عدد الرحلات المكتملة
        (SELECT COUNT(*) 
         FROM trips t 
         WHERE t.driver_id = p.id AND t.status = 'completed') AS completed_trips,
        -- عدد جميع الرحلات
        (SELECT COUNT(*) 
         FROM trips t 
         WHERE t.driver_id = p.id) AS total_trips,
        -- إجمالي المقاعد المحجوزة
        (SELECT COALESCE(SUM(b.seats_booked), 0) 
         FROM bookings b 
         WHERE b.driver_id = p.id) AS total_booked_seats,
        -- عدد الحجوزات المكتملة
        (SELECT COUNT(*) 
         FROM bookings b 
         WHERE b.driver_id = p.id AND b.status = 'completed') AS completed_bookings,
        -- إجمالي الأرباح
        (SELECT COALESCE(SUM(b.total_amount), 0) 
         FROM bookings b 
         WHERE b.driver_id = p.id) AS total_earnings,
        -- عدد جميع المركبات
        (SELECT COUNT(*) 
         FROM vehicles v 
         WHERE v.driver_id = p.id) AS total_vehicles,
        -- عدد المركبات النشطة
        (SELECT COUNT(*) 
         FROM vehicles v 
         WHERE v.driver_id = p.id AND v.is_active = true) AS active_vehicles
    FROM profiles p
    WHERE p.id = 'driver-uuid-here'
)
SELECT * FROM driver_stats;
```

---

## 🔍 استعلامات مفيدة للتحليل

### 1. أفضل 10 سائقين حسب التقييم

```sql
SELECT 
    p.full_name,
    p.average_rating,
    p.ratings_count,
    (SELECT COUNT(*) FROM trips WHERE driver_id = p.id AND status = 'completed') AS completed_trips
FROM profiles p
WHERE p.role = 'driver'
AND p.ratings_count >= 5  -- على الأقل 5 تقييمات
ORDER BY p.average_rating DESC, p.ratings_count DESC
LIMIT 10;
```

### 2. السائقين الأكثر نشاطاً

```sql
SELECT 
    p.full_name,
    COUNT(DISTINCT t.id) AS total_trips,
    SUM(b.seats_booked) AS total_seats_booked,
    SUM(b.total_amount) AS total_earnings
FROM profiles p
LEFT JOIN trips t ON p.id = t.driver_id
LEFT JOIN bookings b ON p.id = b.driver_id
WHERE p.role = 'driver'
GROUP BY p.id, p.full_name
ORDER BY total_trips DESC
LIMIT 10;
```

### 3. إحصائيات شهرية للسائق

```sql
SELECT 
    DATE_TRUNC('month', b.created_at) AS month,
    COUNT(DISTINCT b.id) AS bookings_count,
    SUM(b.seats_booked) AS seats_booked,
    SUM(b.total_amount) AS earnings
FROM bookings b
WHERE b.driver_id = 'driver-uuid-here'
AND b.status = 'completed'
GROUP BY DATE_TRUNC('month', b.created_at)
ORDER BY month DESC;
```

---

## 🎯 كيف يتم استخدام هذه الجداول في الكود؟

### في ملف `Profile.tsx`:

```typescript
// 1. جلب معلومات السائق من profiles
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', driverId)
  .single();

// 2. جلب الرحلات من trips
const trips = await BrowserDatabaseService.getTripsWithDetails(driverId);
const completedTrips = trips.filter(t => t.status === 'completed').length;

// 3. جلب الحجوزات من bookings
const bookings = await BrowserDatabaseService.getBookingsByDriver(driverId);
const totalBookedSeats = bookings.reduce((sum, b) => sum + b.seatsBooked, 0);
const totalEarnings = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

// 4. جلب المركبات من vehicles
const vehicles = await BrowserDatabaseService.getVehiclesByDriver(driverId);
const totalVehicles = vehicles.length;
const activeVehicles = vehicles.filter(v => v.isActive).length;

// 5. جلب التقييمات من ratings
const { data: ratings } = await supabase
  .from('ratings')
  .select(`
    *,
    passenger:profiles!ratings_passenger_id_fkey(full_name, avatar_url)
  `)
  .eq('driver_id', driverId);
```

---

## 📋 ملخص الجداول

| الجدول | المسؤولية | الإحصائيات |
|--------|-----------|------------|
| `profiles` | المعلومات الأساسية | التقييم، الاسم، الصورة |
| `trips` | الرحلات | عدد الرحلات المكتملة |
| `bookings` | الحجوزات | المقاعد، الأرباح، الحجوزات المكتملة |
| `vehicles` | المركبات | عدد المركبات، النشطة |
| `ratings` | التقييمات | متوسط التقييم، عدد التقييمات |

---

## 🔄 التحديث التلقائي

بعض الحقول تتحدث **تلقائياً** بواسطة Triggers:

### في `profiles`:
- `average_rating` ← يتحدث عند إضافة/تعديل/حذف في `ratings`
- `ratings_count` ← يتحدث عند إضافة/تعديل/حذف في `ratings`

### الحقول التي تُحسب من الكود:
- عدد الرحلات المكتملة ← من `trips`
- المقاعد المحجوزة ← من `bookings`
- الأرباح ← من `bookings`
- عدد المركبات ← من `vehicles`

---

**الخلاصة:** جدول `profiles` هو الجدول الرئيسي، والإحصائيات تُجمع من 4 جداول إضافية! 📊

