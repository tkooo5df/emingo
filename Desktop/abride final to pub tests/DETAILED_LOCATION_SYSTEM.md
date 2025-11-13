# نظام المواقع التفصيلية للحجز (Detailed Location System)

## 🎯 نظرة عامة

تم تطوير نظام جديد لإضافة نقاط تفصيلية للانطلاق والوصول في جميع نماذج الحجز، بحيث:
- يتم تخزين **الولاية** في `pickup_location` و `destination_location`
- يتم تخزين **النقطة المحددة** في `pickup_point` و `destination_point`
- تظهر المعلومات الكاملة للسائق والمدير: **الولاية + النقطة المحددة**

---

## 📊 التحديثات على قاعدة البيانات

### 1. Migration الجديد

**الملف**: `supabase/migrations/20260211000000_add_detailed_locations_to_bookings.sql`

تم إضافة حقلين جديدين:
```sql
ALTER TABLE bookings ADD COLUMN pickup_point text;
ALTER TABLE bookings ADD COLUMN destination_point text;
```

**الوصف**:
- `pickup_point`: النقطة المحددة للانطلاق (مثل: محطة الحافلات، ساحة الاستقلال)
- `destination_point`: النقطة المحددة للوصول

**Indexes للأداء**:
```sql
CREATE INDEX idx_bookings_pickup_point ON bookings(pickup_point);
CREATE INDEX idx_bookings_destination_point ON bookings(destination_point);
```

---

## 🔧 التحديثات على الكود

### 2. browserServices.ts

**الملف**: `src/integrations/database/browserServices.ts`

#### تحديث `toBookingInsert`:
```typescript
const toBookingInsert = (data: any): TablesInsert<'bookings'> => {
  return {
    pickup_location: data.pickupLocation,
    destination_location: data.destinationLocation,
    pickup_point: data.pickupPoint ?? null,          // جديد ✨
    destination_point: data.destinationPoint ?? null, // جديد ✨
    // ... باقي الحقول
  };
};
```

#### تحديث `mapBooking`:
```typescript
const mapBooking = (row: BookingRow | null) => {
  return {
    // ... الحقول الموجودة
    pickupPoint: row.pickup_point ?? undefined,          // جديد ✨
    destinationPoint: row.destination_point ?? undefined, // جديد ✨
  };
};
```

---

### 3. BookingConfirmation.tsx

**الملف**: `src/pages/BookingConfirmation.tsx`

#### State Management:
```typescript
const [pickupPoint, setPickupPoint] = useState("");
const [destinationPoint, setDestinationPoint] = useState("");
```

#### UI - حقول الإدخال:
```tsx
<div className="space-y-4">
  <div>
    <Label>النقطة المحددة للانطلاق (اختياري)</Label>
    <Input 
      value={pickupPoint} 
      onChange={(e) => setPickupPoint(e.target.value)} 
      placeholder="مثال: محطة الحافلات، ساحة الاستقلال، إلخ" 
    />
  </div>
  <div>
    <Label>النقطة المحددة للوصول (اختياري)</Label>
    <Input 
      value={destinationPoint} 
      onChange={(e) => setDestinationPoint(e.target.value)} 
      placeholder="مثال: محطة الحافلات، ساحة الاستقلال، إلخ" 
    />
  </div>
</div>
```

#### إرسال البيانات:
```typescript
await BrowserDatabaseService.createBooking({
  pickupLocation: pickup,
  destinationLocation: destination,
  pickupPoint: pickupPoint || undefined,     // جديد ✨
  destinationPoint: destinationPoint || undefined, // جديد ✨
  // ... باقي الحقول
});
```

---

### 4. BookingForm.tsx

**الملف**: `src/components/booking/BookingForm.tsx`

#### State Management:
```typescript
const [formData, setFormData] = useState({
  // ... الحقول الموجودة
  pickupPoint: "",
  destinationPoint: ""
});
```

#### UI - في قسم ملخص الرحلة:
```tsx
<div className="space-y-3 bg-secondary/10 p-3 rounded-lg text-sm">
  <div>
    <Label>نقطة الانطلاق (اختياري)</Label>
    <Input
      value={formData.pickupPoint}
      onChange={(e) => handleInputChange("pickupPoint", e.target.value)}
      placeholder="مثال: محطة الحافلات، ساحة الاستقلال"
    />
  </div>
  <div>
    <Label>نقطة الوصول (اختياري)</Label>
    <Input
      value={formData.destinationPoint}
      onChange={(e) => handleInputChange("destinationPoint", e.target.value)}
      placeholder="مثال: محطة الحافلات، ساحة الاستقلال"
    />
  </div>
</div>
```

---

### 5. BookingWizard.tsx

**الملف**: `src/components/booking/BookingWizard.tsx`

#### State Management:
```typescript
const [bookingData, setBookingData] = useState({
  // ... الحقول الموجودة
  pickupPoint: "",
  destinationPoint: ""
});
```

#### UI - في Step 1:
```tsx
<div className="space-y-2">
  <Label>من (الولاية)</Label>
  <Select value={bookingData.from} onValueChange={...}>
    {/* اختيار الولاية */}
  </Select>
  
  <Label className="text-xs text-muted-foreground">النقطة المحددة (اختياري)</Label>
  <Input
    value={bookingData.pickupPoint}
    onChange={(e) => setBookingData(prev => ({ ...prev, pickupPoint: e.target.value }))}
    placeholder="مثال: محطة الحافلات، ساحة الاستقلال"
  />
</div>
```

---

### 6. BookingsTable.tsx (للمدير)

**الملف**: `src/components/admin/BookingsTable.tsx`

#### عرض في الجدول:
```tsx
<TableCell>
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-gray-400" />
      <span className="font-medium">{booking.pickupLocation}</span>
    </div>
    {booking.pickupPoint && (
      <span className="text-xs text-muted-foreground mr-6">
        📍 {booking.pickupPoint}
      </span>
    )}
  </div>
</TableCell>
```

#### عرض في Dialog التفاصيل:
```tsx
<div className="bg-secondary/10 p-3 rounded-lg">
  <p className="font-semibold">{selectedBooking.pickupLocation}</p>
  {selectedBooking.pickupPoint && (
    <p className="text-sm text-muted-foreground mt-1">
      📍 النقطة المحددة: {selectedBooking.pickupPoint}
    </p>
  )}
</div>
```

---

### 7. RecentBookingsTable.tsx

**الملف**: `src/components/admin/RecentBookingsTable.tsx`

```tsx
<div className="flex items-center gap-2">
  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
  <div className="flex flex-col">
    <span className="truncate font-medium">
      {booking.pickupLocation} → {booking.destinationLocation}
    </span>
    {(booking.pickupPoint || booking.destinationPoint) && (
      <span className="text-xs text-muted-foreground">
        {booking.pickupPoint && `من: ${booking.pickupPoint}`}
        {booking.pickupPoint && booking.destinationPoint && ' | '}
        {booking.destinationPoint && `إلى: ${booking.destinationPoint}`}
      </span>
    )}
  </div>
</div>
```

---

## 📋 أمثلة على الاستخدام

### مثال 1: حجز من تيارت إلى تيزي وزو
```
الولاية من: تيارت
النقطة المحددة: محطة الحافلات الرئيسية

الولاية إلى: تيزي وزو
النقطة المحددة: ساحة الشهداء
```

**ما يظهر للمدير/السائق**:
```
من: تيارت
📍 محطة الحافلات الرئيسية

إلى: تيزي وزو
📍 ساحة الشهداء
```

### مثال 2: حجز بدون نقاط محددة
```
الولاية من: الجزائر
النقطة المحددة: (فارغ)

الولاية إلى: وهران
النقطة المحددة: (فارغ)
```

**ما يظهر للمدير/السائق**:
```
من: الجزائر
إلى: وهران
```
*(فقط الولايات تظهر، بدون نقاط إضافية)*

---

## ✨ الميزات

### 1. اختيارية الحقول
- جميع حقول النقاط التفصيلية **اختيارية**
- لا تؤثر على الحجز إذا لم يتم ملؤها
- يمكن للمستخدم ملء واحدة فقط أو كلاهما

### 2. تصميم UI واضح
- **الولاية**: في Select dropdown مع قائمة جميع الولايات
- **النقطة المحددة**: في Input field نصي تحت الولاية
- **Placeholders مفيدة**: "مثال: محطة الحافلات، ساحة الاستقلال"
- **Visual indicators**: استخدام 📍 emoji للنقاط المحددة

### 3. عرض تدرجي للمعلومات
```
في الجدول (Compact):
  تيارت → تيزي وزو
  من: محطة الحافلات | إلى: ساحة الشهداء

في التفاصيل (Expanded):
  من
  ─────────────
  تيارت
  📍 النقطة المحددة: محطة الحافلات الرئيسية
  
  إلى
  ─────────────
  تيزي وزو
  📍 النقطة المحددة: ساحة الشهداء
```

---

## 🔐 الأمان والخصوصية

- الحقول الجديدة تستخدم نفس RLS policies الموجودة لجدول `bookings`
- يمكن للراكب والسائق والمدير فقط رؤية التفاصيل
- البيانات مخزنة بشكل آمن في Supabase

---

## 🚀 التطبيق (Deployment)

### الخطوات المطلوبة:

1. **تطبيق Migration**:
```bash
# في Supabase SQL Editor
-- نسخ محتويات supabase/migrations/20260211000000_add_detailed_locations_to_bookings.sql
-- ثم تشغيلها
```

2. **إعادة توليد Types** (إذا لزم الأمر):
```bash
npm run supabase:types
```

3. **Deploy التطبيق**:
```bash
npm run build
flyctl deploy
```

---

## 📊 التأثير على الأداء

- **Indexes جديدة**: تم إضافة indexes على `pickup_point` و `destination_point` للبحث السريع
- **حجم البيانات**: زيادة بسيطة (~200 bytes لكل حجز)
- **سرعة التحميل**: لا تأثير ملحوظ (الحقول اختيارية)

---

## 🧪 الاختبار

### سيناريوهات الاختبار:

1. ✅ **حجز مع نقاط محددة كاملة**
   - ملء جميع الحقول
   - التحقق من ظهور البيانات الكاملة للمدير

2. ✅ **حجز بدون نقاط محددة**
   - ترك حقول النقاط فارغة
   - التحقق من عمل الحجز بشكل طبيعي

3. ✅ **حجز مع نقطة واحدة فقط**
   - ملء نقطة الانطلاق فقط
   - التحقق من ظهورها بشكل صحيح

4. ✅ **عرض للمدير**
   - التحقق من ظهور البيانات في BookingsTable
   - التحقق من التفاصيل في Dialog

5. ✅ **عرض للسائق**
   - التحقق من ظهور البيانات في RecentBookingsTable

---

## 📝 الملاحظات

1. **التوافقية مع البيانات القديمة**: جميع الحجوزات القديمة ستعمل بشكل طبيعي (النقاط ستكون `null`)
2. **UI/UX**: التصميم يدعم RTL للغة العربية بشكل كامل
3. **التوسع المستقبلي**: يمكن إضافة خريطة لاختيار النقاط بصرياً لاحقاً
4. **البحث**: يمكن للمدير البحث عن الحجوزات بواسطة النقاط المحددة

---

## 🔗 الملفات المعدلة

### Database
- `supabase/migrations/20260211000000_add_detailed_locations_to_bookings.sql`

### Services
- `src/integrations/database/browserServices.ts`

### Forms
- `src/pages/BookingConfirmation.tsx`
- `src/components/booking/BookingForm.tsx`
- `src/components/booking/BookingWizard.tsx`

### Admin Views
- `src/components/admin/BookingsTable.tsx`
- `src/components/admin/RecentBookingsTable.tsx`

### Documentation
- `DETAILED_LOCATION_SYSTEM.md` (هذا الملف)

---

## 🎉 الخلاصة

تم تطوير نظام متكامل لإضافة نقاط تفصيلية للمواقع في جميع نماذج الحجز، مع:
- ✅ دعم كامل في قاعدة البيانات
- ✅ UI سهل الاستخدام في جميع النماذج
- ✅ عرض واضح للسائق والمدير
- ✅ توافقية مع البيانات القديمة
- ✅ أداء محسّن مع indexes
- ✅ توثيق شامل

**النتيجة**: الآن عند الحجز، يمكن للراكب تحديد:
1. الولاية (إلزامي)
2. النقطة المحددة بالضبط (اختياري)

ويظهر للسائق والمدير: **الولاية + النقطة المحددة** بشكل واضح ومنظم! 🎯

