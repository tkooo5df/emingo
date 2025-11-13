# إضافة إحصائيات جديدة لبروفايل السائق

## المطلوب
إضافة إحصائيات إضافية في بروفايل السائق:
1. **العدد الحقيقي للرحلات المكتملة**
2. **عدد المقاعد المحجوزة للراكب**

## الإحصائيات المضافة

### 1. مقاعد محجوزة
```typescript
<div className="text-center p-2 sm:p-3 bg-blue-500/5 rounded-lg">
  <div className="text-lg sm:text-2xl font-bold text-blue-600">
    {allBookings.reduce((total: number, booking: any) => {
      return total + (booking.seatsBooked || 0);
    }, 0)}
  </div>
  <div className="text-xs sm:text-sm text-muted-foreground">مقاعد محجوزة</div>
</div>
```

### 2. كيفية الحساب
```typescript
// مجموع جميع المقاعد المحجوزة في جميع الحجوزات
allBookings.reduce((total: number, booking: any) => {
  return total + (booking.seatsBooked || 0);
}, 0)
```

## الإحصائيات الكاملة في بروفايل السائق

### 1. مركبات نشطة
```typescript
<div className="text-center p-2 sm:p-3 bg-green-500/5 rounded-lg">
  <div className="text-lg sm:text-2xl font-bold text-green-600">
    {vehicles.filter((v: any) => v.isActive).length}
  </div>
  <div className="text-xs sm:text-sm text-muted-foreground">مركبات نشطة</div>
</div>
```

### 2. رحلات مكتملة
```typescript
<div className="text-center p-2 sm:p-3 bg-green-500/5 rounded-lg">
  <div className="text-lg sm:text-2xl font-bold text-green-600">
    {allTrips.filter((t: any) => t.status === 'completed').length}
  </div>
  <div className="text-xs sm:text-sm text-muted-foreground">رحلات مكتملة</div>
</div>
```

### 3. مقاعد محجوزة (جديد)
```typescript
<div className="text-center p-2 sm:p-3 bg-blue-500/5 rounded-lg">
  <div className="text-lg sm:text-2xl font-bold text-blue-600">
    {allBookings.reduce((total: number, booking: any) => {
      return total + (booking.seatsBooked || 0);
    }, 0)}
  </div>
  <div className="text-xs sm:text-sm text-muted-foreground">مقاعد محجوزة</div>
</div>
```

### 4. حجوزات مكتملة
```typescript
<div className="text-center p-2 sm:p-3 bg-orange-500/5 rounded-lg">
  <div className="text-lg sm:text-2xl font-bold text-orange-600">
    {allBookings.filter((b: any) => b.status === 'completed').length}
  </div>
  <div className="text-xs sm:text-sm text-muted-foreground">حجوزات مكتملة</div>
</div>
```

### 5. الأرباح
```typescript
<div className="text-center p-2 sm:p-3 bg-yellow-500/5 rounded-lg">
  <div className="text-lg sm:text-2xl font-bold text-yellow-600">
    {allBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0)} دج
  </div>
  <div className="text-xs sm:text-sm text-muted-foreground">الأرباح</div>
</div>
```

## كيفية عمل النظام

### 1. جلب البيانات
```typescript
// في fetchAllBookingsForStats()
const data = await BrowserDatabaseService.getBookingsWithDetails(undefined, user.id);
setAllBookings(data || []);
```

### 2. حساب المقاعد المحجوزة
```typescript
// مجموع جميع المقاعد المحجوزة
allBookings.reduce((total: number, booking: any) => {
  return total + (booking.seatsBooked || 0);
}, 0)
```

### 3. مثال على الحساب
```typescript
// إذا كان لديك الحجوزات التالية:
const bookings = [
  { id: 1, seatsBooked: 2, status: 'completed' },
  { id: 2, seatsBooked: 1, status: 'confirmed' },
  { id: 3, seatsBooked: 3, status: 'completed' },
  { id: 4, seatsBooked: 1, status: 'pending' }
];

// مجموع المقاعد المحجوزة = 2 + 1 + 3 + 1 = 7 مقاعد
```

## النتيجة المتوقعة

### الإحصائيات المعروضة الآن:
1. 🟢 **مركبات نشطة**: عدد المركبات النشطة
2. 🟢 **رحلات مكتملة**: عدد الرحلات المكتملة (status === 'completed')
3. 🔵 **مقاعد محجوزة**: مجموع جميع المقاعد المحجوزة (جديد)
4. 🟠 **حجوزات مكتملة**: عدد الحجوزات المكتملة (status === 'completed')
5. 🟡 **الأرباح**: مجموع الأرباح من الحجوزات المكتملة

## كيفية التحقق من الإصلاح

### 1. افتح لوحة السائق
- اذهب إلى: http://localhost:5173/dashboard
- تأكد من أنك مسجل دخول كسائق

### 2. لاحظ الإحصائيات الجديدة
- يجب أن ترى 5 إحصائيات الآن
- يجب أن ترى "مقاعد محجوزة" كإحصائية جديدة

### 3. اختبر إكمال رحلة
- اذهب إلى تبويب "الحجوزات"
- اكمل أي رحلة
- ارجع إلى "نظرة عامة"
- تحقق من تحديث جميع الإحصائيات

### 4. تحقق من الحسابات
- قارن "مقاعد محجوزة" مع عدد المقاعد الفعلي في الحجوزات
- تأكد من أن "رحلات مكتملة" تتحدث عند إكمال الرحلة

## ملاحظات مهمة

### 1. تحديث البيانات
```typescript
// الإحصائيات تتحدث عند:
- إكمال رحلة
- تأكيد حجز
- إلغاء حجز
- إرسال تقييم
- نجاح حجز جديد
```

### 2. الأداء
```typescript
// استخدام reduce للحساب الفعال
allBookings.reduce((total: number, booking: any) => {
  return total + (booking.seatsBooked || 0);
}, 0)
```

### 3. معالجة القيم الفارغة
```typescript
// استخدام || 0 لتجنب الأخطاء
(booking.seatsBooked || 0)
```

## الخطوات التالية

1. **تحقق من ظهور "مقاعد محجوزة"**
2. **اختبر إكمال رحلة**
3. **تحقق من تحديث جميع الإحصائيات**
4. **تأكد من صحة الحسابات**
5. **اختبر النظام مع بيانات مختلفة**

إذا كانت المشكلة لا تزال موجودة، أخبرني بما تراه!
