# إصلاح خطأ تنسيق وقت الاستلام (Pickup Time Format Fix)

## 🎯 المشكلة

عند محاولة حجز رحلة، كان النظام يرسل `pickup_time` بصيغة ISO timestamp كاملة:
```
"pickup_time": "2025-10-25T09:20:35.069Z"
```

لكن قاعدة البيانات تتوقع حقل `pickup_time` بصيغة `time` فقط (HH:MM:SS)، مما أدى إلى خطأ:
```
Error: invalid input syntax for type time: "2025-10-25T09:20:35.069Z"
Code: 22007
```

## ✅ الحل المطبق

تم تعديل دالة `toBookingInsert` في `browserServices.ts` لتحويل `pickup_time` من ISO string إلى صيغة time:

### قبل:
```typescript
const toBookingInsert = (data: any): TablesInsert<'bookings'> => ({
  // ...
  pickup_time: data.pickupTime ?? null,
  // ...
});
```

### بعد:
```typescript
const toBookingInsert = (data: any): TablesInsert<'bookings'> => {
  // Convert pickup_time from ISO string to time format (HH:MM:SS)
  let formattedPickupTime = data.pickupTime;
  if (formattedPickupTime && typeof formattedPickupTime === 'string') {
    // If it's an ISO string, extract just the time part
    if (formattedPickupTime.includes('T')) {
      const date = new Date(formattedPickupTime);
      formattedPickupTime = date.toTimeString().split(' ')[0]; // Gets "HH:MM:SS"
    }
  }

  return {
    // ...
    pickup_time: formattedPickupTime ?? null,
    // ...
  };
};
```

## 🔍 آلية التحويل

1. **التحقق**: إذا كان `pickupTime` string ويحتوي على حرف 'T' (ISO format)
2. **التحويل**: تحويل ISO string إلى Date object
3. **الاستخراج**: استخراج الوقت فقط بصيغة "HH:MM:SS" باستخدام `toTimeString()`
4. **الإرسال**: إرسال الوقت المنسق إلى قاعدة البيانات

## 📝 مثال على التحويل

**قبل**:
```json
{
  "pickup_time": "2025-10-25T09:20:35.069Z"
}
```

**بعد**:
```json
{
  "pickup_time": "09:20:35"
}
```

## 🧪 Logging للتحقق

تم إضافة logging إضافي لتتبع التحويل:
```typescript
console.log('🕐 Pickup time formatted:', payload.pickup_time);
```

## ✨ النتيجة

الآن يمكن للمستخدمين حجز الرحلات بنجاح دون أخطاء في تنسيق الوقت.

## 📋 ملاحظات

- التحويل يحدث تلقائياً في طبقة Data Access Layer
- لا حاجة لتعديل مكونات UI أو forms
- التحويل يتوافق مع schema قاعدة البيانات الحالية
- يمكن استخدام هذا الحل لجميع حقول الوقت المماثلة في المستقبل

## 🔗 الملفات المعدلة

- `src/integrations/database/browserServices.ts`: تحديث دالة `toBookingInsert`

