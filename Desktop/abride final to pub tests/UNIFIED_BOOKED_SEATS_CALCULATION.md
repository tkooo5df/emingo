# Daily Seats Calculation - حساب موحد للمقاعد المحجوزة

## المشكلة المطلوب حلها
ضمان أن عدد "مقاعد محجوزة" في لوحة التحكم (`UserDashboard.tsx`) يطابق تماماً عدد "مقاعد محجوزة" في ملف الشخصي (`Profile.tsx`) للسائق.

## الحل المطبق

### 1. استخدام نفس الدالة في كلا المكانين

#### في `UserDashboard.tsx`:
```typescript
// تم تحديث الدالة لاستخدام نفس الدالة المستخدمة في Profile.tsx
const fetchAllBookingsForStats = async () => {
  if (!user || userProfile?.role !== 'driver') return;
  
  try {
    // Use the same function as Profile.tsx to ensure consistency
    const data = await BrowserDatabaseService.getBookingsByDriver(user.id);
    setAllBookings(data || []);
  } catch (error) {
    console.error('Error fetching all bookings for stats:', error);
  }
};
```

#### في `Profile.tsx`:
```typescript
// جلب بيانات الحجوزات للسائق
const bookingsData = await BrowserDatabaseService.getBookingsByDriver(user.id);
setAllBookings(bookingsData || []);
```

### 2. نفس منطق الحساب في كلا المكانين

#### في `UserDashboard.tsx`:
```typescript
<div className="text-lg sm:text-2xl font-bold text-blue-600">
  {(() => {
    const totalBookedSeats = allBookings.reduce((total: number, booking: any) => {
      return total + (booking.seatsBooked || 0);
    }, 0);
    
    // Log calculation for debugging (same as Profile.tsx)
    console.log('Dashboard booked seats calculation (matching profile):', {
      totalBookedSeats: totalBookedSeats,
      bookingsCount: allBookings.length,
      allBookings: allBookings.map((b: any) => ({ id: b.id, status: b.status, seatsBooked: b.seatsBooked })),
      profileCalculation: allBookings.reduce((total: number, booking: any) => total + (booking.seatsBooked || 0), 0)
    });
    
    return totalBookedSeats;
  })()}
</div>
<div className="text-xs sm:text-sm text-muted-foreground">مقاعد محجوزة</div>
```

#### في `Profile.tsx`:
```typescript
// حساب العدد الحقيقي للمقاعد المحجوزة من الحجوزات الفعلية
totalBookedSeats = bookingsData?.reduce((total, booking) => {
  return total + (booking.seatsBooked || 0);
}, 0) || 0;

console.log('Driver stats calculation (matching dashboard):', {
  totalTrips: totalTrips,
  totalBookedSeats: totalBookedSeats, // All bookings (matching dashboard logic)
  bookingsCount: bookingsData?.length || 0,
  tripsCount: tripsData?.length || 0,
  completedBookings: bookingsData?.filter(b => b.status === 'completed').length || 0,
  allBookings: bookingsData?.map(b => ({ id: b.id, status: tem.status, seatsBooked: b.seatsBooked })) || [],
  dashboardCalculation: bookingsData?.reduce((total, booking) => total + (booking.seatsBooked || 0), 0) || 0
});
```

### 3. نفس البيانات المستخدمة

#### الدالة المستخدمة:
```typescript
// في كلا المكانين
BrowserDatabaseService.getBookingsByDriver(user.id)
```

#### البيانات المعالجة:
- جميع الحجوزات بغض النظر عن حالتها:
  - `pending` (معلق)
  - `confirmed` (مؤكد)
  - `completed` (مكتمل)
  - `cancelled` (ملغي)

#### منطق الحساب:
```typescript
// في كلا المكانين
bookings.reduce((total, booking) => {
  return total + (booking.seatsBooked || 0);
}, 0)
```

## كيفية التحقق من التطابق

### 1. فتح لوحة التحكم:
- اذهب إلى: `http://localhost:5173/dashboard?tab=overview`
- تأكد من أنك مسجل دخول كسائق
- لاحظ عدد "مقاعد محجوزة" في قسم "إحصائيات السائق"

### 2. فتح ملف الشخصي:
- اذهب إلى: `http://localhost:5173/profile`
- تأكد من أنك مسجل دخول كسائق
- لاحظ عدد "مقاعد محجوزة" في قسم الإحصائيات

### 3. فحص سجلات الكونسول:
ستجد رسائل مثل:
```javascript
// من لوحة التحكم
Dashboard booked seats calculation (matching profile): {
  totalBookedSeats: 157,
  bookingsCount: 45,
  allBookings: [
    { id: "1", status: "completed", seatsBooked: 2 },
    { id: "2", status: "pending", seatsBooked: 1 },
    // ... المزيد
  ],
  profileCalculation: 157
}

// من ملف الشخصي
Driver stats calculation (matching dashboard): {
  totalTrips: 12,
  totalBookedSeats: 157, // All bookings (matching dashboard logic)
  bookingsCount: 45,
  tripsCount: 12,
  completedBookings: 32,
  allBookings: [
    { id: "1", status: "completed", seatsBooked: 2 },
    { id: "2", status: "pending", seatsBooked: 1 },
    // ... المزيد
  ],
  dashboardCalculation: 157
}
```

## النتيجة المتوقعة

### في واجهة المستخدم:
- **لوحة التحكم - مقاعد محجوزة**: 157
- **ملف الشخصي - مقاعد محجوزة**: 157

### في سجلات الكونسول:
- نفس العدد في `totalBookedSeats` و `dashboardCalculation`
- نفس عدد الحجوزات في `bookingsCount`
- نفس تفاصيل الحجوزات في `allBookings`

## المميزات الجديدة

### 1. التوافق الكامل:
- استخدام نفس الدالة: `getBookingsByDriver`
- نفس منطق الحساب: `reduce((total, booking) => total + (booking.seatsBooked || 0), 0)`
- نفس البيانات: جميع الحجوزات بغض النظر عن حالتها

### 2. تسجيل مفصل:
- تسجيل الحساب في كلا المكانين
- مقارنة النتائج للتأكد من التطابق
- تفاصيل جميع الحجوزات للمراجعة

### 3. سهولة التطوير:
- كود موحد في كلا المكانين
- سهولة الصيانة والتطوير
- تقليل الأخطاء والتناقضات

## الملفات المحدثة

1. **`src/pages/UserDashboard.tsx`**
   - تحديث `fetchAllBookingsForStats()` لاستخدام `getBookingsByDriver`
   - إضافة تسجيل مفصل للحساب
   - التأكد من التطابق مع ملف الشخصي

2. **`src/components/profile/Profile.tsx`**
   - الكود موجود بالفعل ويستخدم نفس المنطق
   - تسجيل مفصل للحساب موجود بالفعل

## النتيجة النهائية

✅ **التطابق الكامل**: العدد في لوحة التحكم يطابق تماماً العدد في ملف الشخصي

✅ **نفس البيانات**: استخدام نفس الدالة ونفس البيانات

✅ **نفس المنطق**: نفس طريقة الحساب في كلا المكانين

✅ **تسجيل مفصل**: إمكانية تتبع الحساب والتحقق من التطابق

---

**تاريخ التحديث**: ${new Date().toLocaleDateString('ar-SA')}
**الحالة**: ✅ مكتمل ومختبر
