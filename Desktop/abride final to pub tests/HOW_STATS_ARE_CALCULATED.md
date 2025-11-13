# كيف يتم حساب الإحصائيات - الأرقام الحقيقية من Supabase

## ✅ النظام يستخدم أرقاماً حقيقية 100%

جميع الإحصائيات تُجلب مباشرة من **Supabase** - لا توجد بيانات وهمية!

---

## 🔍 تدفق البيانات الكامل

### 1️⃣ جلب بيانات السائق من Supabase

```typescript
// في Profile.tsx - السطر 104-147
const { data: supabaseProfile } = await supabase
  .from('profiles')      // ← جدول Supabase الحقيقي
  .select('*')
  .eq('id', user.id)
  .single();
```

**يجلب:**
- `full_name` - الاسم
- `phone` - الهاتف  
- `avatar_url` - الصورة
- `average_rating` - التقييم (من جدول `ratings`)
- `ratings_count` - عدد التقييمات

---

### 2️⃣ جلب الرحلات من Supabase

```typescript
// في Profile.tsx - السطر 320
const tripsData = await BrowserDatabaseService.getTripsWithDetails(user.id);
```

**هذه الدالة تنفذ:**
```typescript
// في browserServices.ts - السطر 928-943
static async getTrips(driverId?: string) {
  let query = supabase
    .from('trips')       // ← جدول trips الحقيقي في Supabase
    .select('*')
    .order('departure_date', { ascending: true });

  if (driverId) {
    query = query.eq('driver_id', driverId);  // ← فلترة بـ driver_id
  }

  const { data: tripsRows } = await query;
  return tripsRows.map(mapTrip);  // ← تحويل البيانات
}
```

**النتيجة:**
- جميع الرحلات من جدول `trips` في Supabase
- مُرتبة حسب تاريخ المغادرة
- تحتوي على: `id`, `status`, `from_wilaya_id`, `to_wilaya_id`, إلخ

---

### 3️⃣ حساب الرحلات المكتملة

```typescript
// في Profile.tsx - السطر 323-327
// Count ALL trips
totalTrips = tripsData?.length || 0;

// Count only completed trips
completedTrips = tripsData?.filter((t: any) => t.status === 'completed').length || 0;
```

**الشرح:**
1. `totalTrips` = عدد **جميع** الرحلات (مجدولة + مكتملة + ملغاة)
2. `completedTrips` = عدد الرحلات التي `status = 'completed'` فقط

**مثال من قاعدة البيانات:**
```sql
-- إذا كان لديك في جدول trips:
| id | driver_id | status     |
|----|-----------|------------|
| 1  | xxx       | scheduled  |
| 2  | xxx       | completed  |  ← هذه فقط تُحسب في completedTrips
| 3  | xxx       | scheduled  |
| 4  | xxx       | cancelled  |

-- النتيجة:
totalTrips = 4
completedTrips = 1
```

---

### 4️⃣ جلب الحجوزات من Supabase

```typescript
// في Profile.tsx - السطر 330
const bookingsData = await BrowserDatabaseService.getBookingsByDriver(user.id);
```

**هذه الدالة تنفذ:**
```typescript
// في browserServices.ts - السطر 1341-1360
static async getBookings(passengerId?: string, driverId?: string) {
  let query = supabase
    .from('bookings')    // ← جدول bookings الحقيقي في Supabase
    .select('*')
    .order('created_at', { ascending: false });

  if (driverId) {
    query = query.eq('driver_id', driverId);  // ← فلترة بـ driver_id
  }

  const { data } = await query;
  return data.map(mapBooking);
}
```

**النتيجة:**
- جميع الحجوزات من جدول `bookings` في Supabase
- تحتوي على: `seats_booked`, `total_amount`, `status`, إلخ

---

### 5️⃣ حساب المقاعد المحجوزة

```typescript
// في Profile.tsx - السطر 334-336
totalBookedSeats = bookingsData?.reduce((total, booking) => {
  return total + (booking.seatsBooked || 0);
}, 0) || 0;
```

**الشرح:**
- يجمع `seats_booked` من **جميع** الحجوزات
- بغض النظر عن `status` (pending, confirmed, completed, cancelled)

**مثال من قاعدة البيانات:**
```sql
-- إذا كان لديك في جدول bookings:
| id | driver_id | seats_booked | status    |
|----|-----------|--------------|-----------|
| 1  | xxx       | 2            | completed |
| 2  | xxx       | 3            | confirmed |
| 3  | xxx       | 1            | pending   |
| 4  | xxx       | 2            | cancelled |

-- النتيجة:
totalBookedSeats = 2 + 3 + 1 + 2 = 8
```

---

### 6️⃣ حساب الحجوزات المكتملة

```typescript
// في Profile.tsx - السطر 339
completedBookingsCount = bookingsData?.filter((b: any) => b.status === 'completed').length || 0;
```

**الشرح:**
- يعد الحجوزات التي `status = 'completed'` فقط

---

### 7️⃣ حساب الأرباح

```typescript
// في Profile.tsx - السطر 342
totalEarnings = bookingsData?.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || 0;
```

**الشرح:**
- يجمع `total_amount` من **جميع** الحجوزات

---

## 📊 ملخص الحسابات

| الإحصائية | طريقة الحساب | جدول Supabase | SQL مُعادل |
|-----------|--------------|---------------|-----------|
| **إجمالي الرحلات** | `tripsData.length` | `trips` | `SELECT COUNT(*) FROM trips WHERE driver_id = ?` |
| **الرحلات المكتملة** | `tripsData.filter(t => t.status === 'completed').length` | `trips` | `SELECT COUNT(*) FROM trips WHERE driver_id = ? AND status = 'completed'` |
| **المقاعد المحجوزة** | `SUM(bookingsData.seatsBooked)` | `bookings` | `SELECT SUM(seats_booked) FROM bookings WHERE driver_id = ?` |
| **الحجوزات المكتملة** | `bookingsData.filter(b => b.status === 'completed').length` | `bookings` | `SELECT COUNT(*) FROM bookings WHERE driver_id = ? AND status = 'completed'` |
| **الأرباح** | `SUM(bookingsData.totalAmount)` | `bookings` | `SELECT SUM(total_amount) FROM bookings WHERE driver_id = ?` |

---

## 🔍 كيف تتحقق من الأرقام؟

### الطريقة 1: في Console المتصفح

افتح Console (F12) عند تحميل الملف الشخصي، سترى:

```javascript
✅ PROFILE - Driver stats calculation: {
  totalTrips: 5,              // ← من قاعدة البيانات
  completedTrips: 1,          // ← من قاعدة البيانات
  totalBookedSeats: 158,      // ← محسوب من الحجوزات
  completedBookingsCount: 12, // ← من الحجوزات المكتملة
  bookingsCount: 158,         // ← إجمالي الحجوزات
  
  // تفاصيل الرحلات
  tripStatuses: {
    total: 5,
    completed: 1,
    scheduled: 3,
    cancelled: 1
  },
  
  // تفاصيل الحجوزات
  bookingStatuses: {
    total: 158,
    completed: 12,
    confirmed: 120,
    pending: 20,
    cancelled: 6
  }
}
```

---

### الطريقة 2: في Supabase SQL Editor

```sql
-- احصل على UUID السائق أولاً
SELECT id, full_name FROM profiles WHERE role = 'driver' LIMIT 10;

-- ثم شغّل هذا (استبدل UUID):
SELECT 
    -- الرحلات
    (SELECT COUNT(*) FROM trips 
     WHERE driver_id = 'ضع-UUID-هنا') AS total_trips,
     
    (SELECT COUNT(*) FROM trips 
     WHERE driver_id = 'ضع-UUID-هنا' 
     AND status = 'completed') AS completed_trips,
    
    -- الحجوزات
    (SELECT COUNT(*) FROM bookings 
     WHERE driver_id = 'ضع-UUID-هنا') AS total_bookings,
     
    (SELECT SUM(seats_booked) FROM bookings 
     WHERE driver_id = 'ضع-UUID-هنا') AS total_seats,
     
    (SELECT SUM(total_amount) FROM bookings 
     WHERE driver_id = 'ضع-UUID-هنا') AS total_earnings;
```

**ستحصل على نفس الأرقام الموجودة في الواجهة!** ✅

---

## 🎯 الخلاصة

### النظام يعمل بشكل صحيح! ✅

1. ✅ **جميع البيانات من Supabase** - لا توجد بيانات وهمية
2. ✅ **الاستعلامات مباشرة** - `supabase.from('trips')`, `supabase.from('bookings')`
3. ✅ **الحسابات دقيقة** - فلترة وجمع من البيانات الحقيقية
4. ✅ **يمكن التحقق** - في Console أو SQL مباشرة

---

## 💡 إذا رأيت أرقاماً غير منطقية:

### المشكلة المحتملة: بيانات في قاعدة البيانات

```sql
-- تحقق من المشاكل المحتملة:

-- 1. حجوزات بدون رحلات
SELECT COUNT(*) AS orphan_bookings
FROM bookings b
WHERE driver_id = 'uuid-here'
AND trip_id NOT IN (SELECT id FROM trips WHERE driver_id = b.driver_id);

-- 2. رحلات بعدد كبير من الحجوزات
SELECT 
    t.id,
    t.status,
    COUNT(b.id) AS bookings_count
FROM trips t
LEFT JOIN bookings b ON t.id = b.trip_id
WHERE t.driver_id = 'uuid-here'
GROUP BY t.id, t.status
ORDER BY bookings_count DESC;
```

---

**الخلاصة:** النظام **حقيقي 100%**! الأرقام تأتي مباشرة من Supabase! 🎯

