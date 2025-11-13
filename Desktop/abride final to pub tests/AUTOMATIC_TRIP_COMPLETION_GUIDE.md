# تطبيق منطق إكمال الرحلة التلقائي لجميع الركاب

## المطلوب
عندما يكمل السائق رحلة لراكب واحد، يجب أن تكتمل الرحلة تلقائياً لجميع الركاب في نفس الرحلة وتصبح حالة الرحلة `COMPLETED`.

## التحديث المطبق

### 1. المنطق الجديد في `handleCompleteBooking`
```typescript
const handleCompleteBooking = async (bookingId: string | number) => {
  try {
    console.log('🚀 Starting trip completion for booking:', bookingId);
    
    // 1. الحصول على تفاصيل الحجز
    const booking = bookings.find((b: any) => b.id === bookingId);
    if (!booking) {
      throw new Error('الحجز غير موجود');
    }
    
    console.log('🚀 Found booking:', booking);
    console.log('🚀 Trip ID:', booking.tripId);
    
    // 2. الحصول على جميع حجوزات هذه الرحلة
    const tripBookings = bookings.filter((b: any) => b.tripId === booking.tripId);
    console.log('🚀 All bookings for this trip:', tripBookings.length);
    
    // 3. إكمال جميع حجوزات هذه الرحلة
    const completionPromises = tripBookings.map(async (tripBooking: any) => {
      console.log('🚀 Completing booking:', tripBooking.id);
      return BookingTrackingService.trackStatusChange(
        tripBooking.id.toString(),
        BookingStatus.COMPLETED,
        'driver',
        user!.id,
        'تم إكمال الرحلة لجميع الركاب'
      );
    });
    
    // 4. انتظار إكمال جميع الحجوزات
    await Promise.all(completionPromises);
    console.log('✅ All bookings completed successfully');
    
    // 5. تحديث حالة الرحلة إلى مكتملة
    console.log('🚀 Updating trip status to completed:', booking.tripId);
    await BrowserDatabaseService.updateTrip(booking.tripId, { 
      status: 'completed' 
    });
    console.log('✅ Trip status updated to completed');
    
    // 6. تحديث جميع البيانات
    await Promise.all([
      fetchBookings(), 
      fetchTrips(), 
      fetchAllTripsForStats(), 
      fetchAllBookingsForStats(), 
      fetchNotificationStats()
    ]);
    
    // 7. عرض نافذة التقييم للراكب الأول
    if (booking) {
      setRatingBooking(booking);
      setRatingTarget({
        userId: booking.passengerId,
        type: 'passenger'
      });
      setShowRatingPopup(true);
    }
    
    // 8. عرض رسالة النجاح
    toast({
      title: "تم إكمال الرحلة",
      description: `تم إكمال الرحلة لجميع الركاب (${tripBookings.length} راكب) وإرسال إشعارات للجميع`,
    });
    
    console.log('🎉 Trip completion process finished successfully');
  } catch (error) {
    console.error('❌ Error completing booking:', error);
    toast({
      title: "خطأ",
      description: "حدث خطأ أثناء إكمال الرحلة",
      variant: "destructive"
    });
  }
};
```

## كيفية عمل النظام

### 1. عند الضغط على "إكمال الرحلة"
```typescript
// السائق يضغط على زر "إكمال الرحلة" لأي حجز
onClick={() => handleCompleteBooking(booking.id)}
```

### 2. البحث عن جميع حجوزات الرحلة
```typescript
// الحصول على جميع الحجوزات لنفس الرحلة
const tripBookings = bookings.filter((b: any) => b.tripId === booking.tripId);
```

### 3. إكمال جميع الحجوزات
```typescript
// إكمال كل حجز في الرحلة
const completionPromises = tripBookings.map(async (tripBooking: any) => {
  return BookingTrackingService.trackStatusChange(
    tripBooking.id.toString(),
    BookingStatus.COMPLETED,
    'driver',
    user!.id,
    'تم إكمال الرحلة لجميع الركاب'
  );
});

await Promise.all(completionPromises);
```

### 4. تحديث حالة الرحلة
```typescript
// تحديث حالة الرحلة إلى 'completed'
await BrowserDatabaseService.updateTrip(booking.tripId, { 
  status: 'completed' 
});
```

### 5. تحديث الإحصائيات
```typescript
// تحديث جميع البيانات والإحصائيات
await Promise.all([
  fetchBookings(),           // تحديث قائمة الحجوزات
  fetchTrips(),             // تحديث قائمة الرحلات
  fetchAllTripsForStats(),  // تحديث إحصائيات الرحلات
  fetchAllBookingsForStats(), // تحديث إحصائيات الحجوزات
  fetchNotificationStats()  // تحديث إحصائيات الإشعارات
]);
```

## النتيجة المتوقعة

### 1. عند إكمال رحلة لراكب واحد:
- ✅ **جميع حجوزات الرحلة** تصبح `'completed'`
- ✅ **حالة الرحلة** تصبح `'completed'`
- ✅ **"رحلات مكتملة"** تزيد بـ 1
- ✅ **"حجوزات مكتملة"** تزيد بعدد الركاب
- ✅ **إشعارات** ترسل لجميع الركاب

### 2. رسائل الكونسول:
```
🚀 Starting trip completion for booking: [booking-id]
🚀 Found booking: [booking-details]
🚀 Trip ID: [trip-id]
🚀 All bookings for this trip: [number]
🚀 Completing booking: [booking-id-1]
🚀 Completing booking: [booking-id-2]
✅ All bookings completed successfully
🚀 Updating trip status to completed: [trip-id]
✅ Trip status updated to completed
🎉 Trip completion process finished successfully
```

### 3. رسالة النجاح:
```
"تم إكمال الرحلة لجميع الركاب (3 راكب) وإرسال إشعارات للجميع"
```

## كيفية التحقق من الإصلاح

### 1. افتح لوحة السائق
- اذهب إلى: http://localhost:5173/dashboard
- تأكد من أنك مسجل دخول كسائق

### 2. افتح أدوات المطور
- اضغط F12 أو Ctrl+Shift+I
- انتقل إلى تبويب "Console"

### 3. لاحظ الإحصائيات الحالية
- سجل عدد "رحلات مكتملة"
- سجل عدد "حجوزات مكتملة"

### 4. اختبر إكمال رحلة
- اذهب إلى تبويب "الحجوزات"
- ابحث عن رحلة لها عدة حجوزات
- اضغط على زر "إكمال الرحلة" لأي حجز

### 5. تحقق من النتائج
- راقب رسائل الكونسول
- ارجع إلى تبويب "نظرة عامة"
- تحقق من تحديث الإحصائيات:
  - "رحلات مكتملة" يجب أن تزيد بـ 1
  - "حجوزات مكتملة" يجب أن تزيد بعدد الركاب

### 6. تحقق من الحجوزات
- اذهب إلى تبويب "الحجوزات"
- تحقق من أن جميع حجوزات الرحلة أصبحت "مكتملة"

## ملاحظات مهمة

### 1. الأداء
```typescript
// استخدام Promise.all لتحسين الأداء
await Promise.all(completionPromises);
```

### 2. معالجة الأخطاء
```typescript
try {
  // منطق الإكمال
} catch (error) {
  console.error('❌ Error completing booking:', error);
  toast({
    title: "خطأ",
    description: "حدث خطأ أثناء إكمال الرحلة",
    variant: "destructive"
  });
}
```

### 3. التسجيل المفصل
```typescript
// رسائل تسجيل مفصلة لتتبع العملية
console.log('🚀 Starting trip completion for booking:', bookingId);
console.log('🚀 All bookings for this trip:', tripBookings.length);
console.log('✅ All bookings completed successfully');
```

## الخطوات التالية

1. **اختبر إكمال رحلة لها عدة حجوزات**
2. **تحقق من رسائل الكونسول**
3. **تأكد من تحديث الإحصائيات**
4. **تحقق من إكمال جميع الحجوزات**
5. **تأكد من تحديث حالة الرحلة**

إذا كانت المشكلة لا تزال موجودة، أخبرني بما تراه في الكونسول!
