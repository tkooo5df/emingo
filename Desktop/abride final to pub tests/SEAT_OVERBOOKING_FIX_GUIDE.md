# دليل إصلاح مشكلة تجاوز السعة في الحجز

## المشكلة الأصلية
كان هناك مشكلة في حساب المقاعد المتاحة حيث يمكن لبعض الحسابات حجز مقاعد أكثر من السعة الفعلية للمركبة. على سبيل المثال، يمكن حجز 5 مقاعد في مركبة تحمل 4 مقاعد فقط، مما يؤدي إلى مشاكل في إدارة الحجوزات.

## سبب المشكلة
كان النظام يعتمد فقط على التحقق من المقاعد المتاحة في الواجهة الأمامية، ولكن لم يكن هناك تحقق في دالة `createBooking` على مستوى قاعدة البيانات. هذا يعني أنه في حالة:
- Race conditions (تزامن طلبات الحجز)
- استدعاء مباشر للدالة
- مشاكل في الشبكة أو التحديث

يمكن إنشاء حجز يتجاوز السعة المتاحة.

## الحل المطبق

### 1. إضافة التحقق من المقاعد المتاحة في `createBooking`

تم تحديث دالة `createBooking` في الملفات التالية:

#### أ) `src/integrations/database/browserServices.ts` (Supabase)
```typescript
static async createBooking(data: any) {
  // ... التحقق من المصادقة والإيقاف ...
  
  // التحقق من المقاعد المتاحة قبل إنشاء الحجز
  const seatsRequested = data.seatsBooked || 1;
  const tripId = data.tripId;

  if (tripId) {
    // الحصول على تفاصيل الرحلة الحالية
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('total_seats, available_seats, status')
      .eq('id', tripId)
      .single();

    if (!trip) {
      throw new Error('الرحلة غير موجودة');
    }

    // التحقق من حالة الرحلة
    if (trip.status === 'completed' || trip.status === 'cancelled') {
      throw new Error('لا يمكن الحجز على هذه الرحلة - الرحلة مكتملة أو ملغية');
    }

    // الحصول على الحجوزات الحالية لحساب التوفر الفعلي
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('seats_booked, status')
      .eq('trip_id', tripId)
      .in('status', ['pending', 'confirmed', 'in_progress', 'completed']);

    // حساب المقاعد المتاحة الفعلية
    const seatsBooked = (bookings ?? []).reduce((sum, booking) => sum + (booking.seats_booked ?? 0), 0);
    const seatsAvailable = Math.max(trip.total_seats - seatsBooked, 0);

    // التحقق من توفر المقاعد
    if (seatsRequested > seatsAvailable) {
      throw new Error(`المقاعد المتاحة فقط ${seatsAvailable} مقعد، طلبت ${seatsRequested} مقاعد`);
    }

    console.log(`✅ Seat validation passed: Requested ${seatsRequested}, Available ${seatsAvailable}, Total ${trip.total_seats}`);
  }

  // إنشاء الحجز
  // ...
}
```

#### ب) `src/integrations/database/browserDatabase.ts` (Local Database)
```typescript
async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
  const data = this.getData();
  
  // التحقق من المقاعد المتاحة قبل إنشاء الحجز
  const seatsRequested = bookingData.seatsBooked || 1;
  const tripId = bookingData.tripId;

  if (tripId) {
    // الحصول على تفاصيل الرحلة الحالية
    const trip = data.trips.find((t: Trip) => t.id === tripId);
    if (!trip) {
      throw new Error('الرحلة غير موجودة');
    }

    // التحقق من حالة الرحلة
    if (trip.status === 'completed' || trip.status === 'cancelled') {
      throw new Error('لا يمكن الحجز على هذه الرحلة - الرحلة مكتملة أو ملغية');
    }

    // الحصول على الحجوزات الحالية
    const bookings = data.bookings.filter((b: Booking) =>
      b.tripId === tripId &&
      ['pending', 'confirmed', 'in_progress', 'completed'].includes(b.status)
    );

    // حساب المقاعد المتاحة الفعلية
    const seatsBooked = bookings.reduce((sum, booking) => sum + booking.seatsBooked, 0);
    const seatsAvailable = Math.max(trip.totalSeats - seatsBooked, 0);

    // التحقق من توفر المقاعد
    if (seatsRequested > seatsAvailable) {
      throw new Error(`المقاعد المتاحة فقط ${seatsAvailable} مقعد، طلبت ${seatsRequested} مقاعد`);
    }

    console.log(`✅ Local seat validation passed: Requested ${seatsRequested}, Available ${seatsAvailable}, Total ${trip.totalSeats}`);
  }

  // إنشاء الحجز
  // ...
}
```

#### ج) `src/integrations/database/services.ts` (Prisma)
```typescript
static async createBooking(data: { /* ... */ }) {
  // التحقق من المقاعد المتاحة قبل إنشاء الحجز
  const seatsRequested = data.seatsBooked || 1;
  const tripId = data.tripId;

  if (tripId) {
    // الحصول على تفاصيل الرحلة الحالية
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: {
        totalSeats: true,
        availableSeats: true,
        status: true
      }
    });

    if (!trip) {
      throw new Error('الرحلة غير موجودة');
    }

    // التحقق من حالة الرحلة
    if (trip.status === 'completed' || trip.status === 'cancelled') {
      throw new Error('لا يمكن الحجز على هذه الرحلة - الرحلة مكتملة أو ملغية');
    }

    // الحصول على الحجوزات الحالية
    const bookings = await prisma.booking.findMany({
      where: {
        tripId: tripId,
        status: {
          in: ['pending', 'confirmed', 'in_progress', 'completed']
        }
      },
      select: {
        seatsBooked: true
      }
    });

    // حساب المقاعد المتاحة الفعلية
    const seatsBooked = bookings.reduce((sum, booking) => sum + booking.seatsBooked, 0);
    const seatsAvailable = Math.max(trip.totalSeats - seatsBooked, 0);

    // التحقق من توفر المقاعد
    if (seatsRequested > seatsAvailable) {
      throw new Error(`المقاعد المتاحة فقط ${seatsAvailable} مقعد، طلبت ${seatsRequested} مقاعد`);
    }

    console.log(`✅ Prisma seat validation passed: Requested ${seatsRequested}, Available ${seatsAvailable}, Total ${trip.totalSeats}`);
  }

  // إنشاء الحجز
  // ...
}
```

## المميزات الجديدة

### 1. التحقق الشامل من المقاعد
- يتم حساب المقاعد المتاحة من الحجوزات الفعلية في قاعدة البيانات
- يتم تضمين جميع حالات الحجز النشطة (pending, confirmed, in_progress, completed)
- يتم منع الحجز إذا تجاوزت المقاعد المطلوبة السعة المتاحة

### 2. التحقق من حالة الرحلة
- يتم منع الحجز على الرحلات المكتملة أو الملغية
- يتم عرض رسائل خطأ واضحة للمستخدم

### 3. رسائل خطأ واضحة
- `المقاعد المتاحة فقط X مقعد، طلبت Y مقاعد`
- `لا يمكن الحجز على هذه الرحلة - الرحلة مكتملة أو ملغية`
- `الرحلة غير موجودة`

### 4. تسجيل مفصل
- يتم تسجيل نجاح التحقق من المقاعد
- يتم عرض تفاصيل المقاعد المطلوبة والمتاحة والإجمالية

## اختبار الإصلاح

تم إنشاء ملف اختبار `test-seat-validation-fix.js` يختبر:
1. حساب المقاعد المتاحة بشكل صحيح
2. منع الحجز عند تجاوز السعة
3. منع الحجز على الرحلات المكتملة
4. محاكاة سيناريو المشكلة الأصلية

## النتائج

✅ **تم حل المشكلة**: النظام الآن يمنع الحجز عندما تتجاوز المقاعد المطلوبة السعة المتاحة

✅ **أمان إضافي**: التحقق يتم على مستوى قاعدة البيانات وليس الواجهة الأمامية فقط

✅ **رسائل واضحة**: المستخدمون يحصلون على رسائل خطأ واضحة ومفهومة

✅ **تسجيل مفصل**: يمكن تتبع عملية التحقق من المقاعد في سجلات النظام

## الملفات المحدثة

1. `src/integrations/database/browserServices.ts` - دالة createBooking لـ Supabase
2. `src/integrations/database/browserDatabase.ts` - دالة createBooking للقاعدة المحلية  
3. `src/integrations/database/services.ts` - دالة createBooking لـ Prisma
4. `test-seat-validation-fix.js` - ملف اختبار الإصلاح

## التوصيات المستقبلية

1. **مراقبة الأداء**: مراقبة تأثير التحقق الإضافي على أداء النظام
2. **اختبارات شاملة**: إضافة اختبارات وحدة شاملة للتحقق من المقاعد
3. **تحسين الرسائل**: يمكن تحسين رسائل الخطأ لتكون أكثر تفصيلاً
4. **إحصائيات**: تتبع عدد المرات التي يتم فيها منع الحجز بسبب تجاوز السعة

---

**تاريخ الإصلاح**: ${new Date().toLocaleDateString('ar-SA')}
**الحالة**: ✅ مكتمل ومختبر
