# تحديث عرض المركبات في ملف السائق

## التحديث المطلوب
تم تحديث ملف السائق لإظهار المركبات النشطة فقط وإزالة جميع المركبات مع حالة كل مركبة.

## التغييرات المطبقة

### ملف Profile.tsx
- **قبل التحديث**: كان يعرض جميع المركبات مع حالة كل مركبة (نشط/غير نشط)
- **بعد التحديث**: يعرض المركبات النشطة فقط مع حالة "نشط" فقط

### التغييرات التقنية
1. **فلترة المركبات**: تم استخدام `vehicles.filter(vehicle => vehicle.is_active)` لعرض المركبات النشطة فقط
2. **تحديث العنوان**: تم تغيير العنوان من "جميع المركبات" إلى "المركبات النشطة"
3. **إزالة الحالات المتعددة**: تم إزالة عرض حالة "غير نشط" وتم عرض حالة "نشط" فقط
4. **تحديث العداد**: تم تحديث العداد ليعرض عدد المركبات النشطة فقط

### الكود الجديد
```tsx
{vehicles.filter(vehicle => vehicle.is_active).length > 0 && (
  <div className="mt-4">
    <h4 className="font-medium mb-2">المركبات النشطة ({vehicles.filter(vehicle => vehicle.is_active).length})</h4>
    <div className="space-y-2">
      {vehicles.filter(vehicle => vehicle.is_active).map((vehicle) => (
        <div key={vehicle.id} className="flex items-center justify-between p-2 border rounded">
          <div>
            <p className="font-medium">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
            <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
          </div>
          <Badge variant="default">
            نشط
          </Badge>
        </div>
      ))}
    </div>
  </div>
)}
```

## النتيجة
- ✅ يتم عرض المركبات النشطة فقط
- ✅ تم إزالة عرض المركبات غير النشطة
- ✅ تم إزالة حالة "غير نشط" من العرض
- ✅ تم تحديث العنوان والعداد ليعكس المركبات النشطة فقط

## الملفات المحدثة
- `abridasv3/src/components/profile/Profile.tsx`

## تاريخ التحديث
تم التحديث في: 2025-01-07
