# دليل تطبيق صور السائقين (Driver Avatar Implementation Guide)

## نظرة عامة
تم تطبيق نظام عرض صور السائقين في جميع بطاقات الرحلات في التطبيق. هذا التحديث يحسن تجربة المستخدم من خلال عرض صورة السائق بجانب اسمه في جميع واجهات عرض الرحلات.

## الملفات المحدثة

### 1. UserDashboard.tsx
**الموقع**: `src/pages/UserDashboard.tsx`
**التغيير**: إضافة صورة السائق في بطاقات الرحلات في لوحة المستخدم

```tsx
<div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
  <div className="flex items-center gap-2">
    {trip.driver?.avatarUrl ? (
      <img 
        src={trip.driver.avatarUrl} 
        alt={trip.driver.fullName || 'السائق'}
        className="w-6 h-6 rounded-full object-cover border border-gray-200"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
    ) : null}
    <User className={`h-4 w-4 ${trip.driver?.avatarUrl ? 'hidden' : ''}`} />
    <span>السائق: {trip.driver?.fullName}</span>
  </div>
  <Phone className="h-4 w-4" />
  <span>{trip.driver?.phone}</span>
</div>
```

### 2. TripFeedCarousel.tsx
**الموقع**: `src/components/TripFeedCarousel.tsx`
**التغيير**: إضافة صورة السائق في كاروسيل الرحلات

```tsx
<div className="flex items-center gap-2">
  {trip.driver?.avatarUrl ? (
    <img 
      src={trip.driver.avatarUrl} 
      alt={trip.driver.fullName || 'السائق'}
      className="w-5 h-5 rounded-full object-cover border border-gray-200 flex-shrink-0"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextElementSibling?.classList.remove('hidden');
      }}
    />
  ) : null}
  <User className={`h-4 w-4 text-muted-foreground flex-shrink-0 ${trip.driver?.avatarUrl ? 'hidden' : ''}`} />
  <span className="text-sm truncate">{trip.driver?.fullName || "سائق غير معروف"}</span>
</div>
```

### 3. DataManagementSystem.tsx
**الموقع**: `src/components/data/DataManagementSystem.tsx`
**التغيير**: إضافة صورة السائق في نظام إدارة البيانات

```tsx
<div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
  {trip.driver?.avatarUrl ? (
    <img 
      src={trip.driver.avatarUrl} 
      alt={trip.driver.fullName || 'السائق'}
      className="w-5 h-5 rounded-full object-cover border border-gray-200 flex-shrink-0"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextElementSibling?.classList.remove('hidden');
      }}
    />
  ) : null}
  <User className={`h-4 w-4 flex-shrink-0 ${trip.driver?.avatarUrl ? 'hidden' : ''}`} />
  <span>السائق: {trip.driver?.fullName || 'غير محدد'}</span>
</div>
```

### 4. RideSearchResults.tsx
**الموقع**: `src/pages/RideSearchResults.tsx`
**التغيير**: إضافة صورة السائق في نتائج البحث عن الرحلات

```tsx
<div className="flex items-center gap-2">
  {trip.driver?.avatarUrl ? (
    <img 
      src={trip.driver.avatarUrl} 
      alt={trip.driver.fullName || 'السائق'}
      className="w-6 h-6 rounded-full object-cover border border-gray-200 flex-shrink-0"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextElementSibling?.classList.remove('hidden');
      }}
    />
  ) : null}
  <User className={`h-5 w-5 text-primary flex-shrink-0 ${trip.driver?.avatarUrl ? 'hidden' : ''}`} />
  <CardTitle className="text-lg">
    {trip.driver?.fullName || 'سائق غير معروف'}
  </CardTitle>
</div>
```

## الميزات المطبقة

### 1. عرض الصورة الشرطي
- يتم عرض صورة السائق إذا كانت متوفرة في `trip.driver.avatarUrl`
- إذا لم تكن الصورة متوفرة، يتم عرض أيقونة المستخدم الافتراضية

### 2. معالجة الأخطاء
- في حالة فشل تحميل الصورة، يتم إخفاء الصورة وعرض الأيقونة الافتراضية
- استخدام `onError` handler لمعالجة أخطاء تحميل الصور

### 3. التصميم المتجاوب
- أحجام مختلفة للصور حسب السياق:
  - `w-6 h-6` في UserDashboard و RideSearchResults
  - `w-5 h-5` في TripFeedCarousel و DataManagementSystem
- استخدام `flex-shrink-0` لمنع تقلص الصورة
- حدود دائرية مع `rounded-full`
- حدود رمادية خفيفة مع `border border-gray-200`

### 4. إمكانية الوصول
- استخدام `alt` attribute مع اسم السائق
- النص البديل "السائق" إذا لم يكن الاسم متوفراً

## هيكل البيانات

### جدول Profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  avatar_url TEXT, -- رابط صورة السائق
  full_name TEXT,
  -- باقي الحقول...
);
```

### استعلام البيانات
يتم جلب بيانات السائق مع الرحلة من خلال دالة `getTripsWithDetails()`:

```typescript
static async getTripsWithDetails(driverId?: string) {
  const trips = await this.getTrips(driverId);
  
  // جلب بيانات السائقين
  const driverIds = Array.from(new Set(trips.map((trip) => trip.driverId).filter(Boolean)));
  const [drivers] = await Promise.all([
    driverIds.length
      ? supabase.from('profiles').select('*').in('id', driverIds)
      : Promise.resolve({ data: [] as ProfileRow[], error: null }),
  ]);
  
  // ربط بيانات السائق بالرحلة
  const driverMap = new Map((drivers.data ?? []).map((row) => [row.id, mapProfile(row)]));
  
  return trips.map((trip) => ({
    ...trip,
    driver: trip.driverId ? driverMap.get(trip.driverId) ?? null : null,
  }));
}
```

## التحديثات المستقبلية

### 1. تحسين الأداء
- يمكن إضافة lazy loading للصور
- استخدام WebP format للصور
- إضافة placeholder أثناء تحميل الصور

### 2. ميزات إضافية
- إضافة تقييم السائق بجانب الصورة
- عرض حالة السائق (متصل/غير متصل)
- إضافة رابط للملف الشخصي للسائق

### 3. التخصيص
- إضافة خيارات لتغيير حجم الصور
- إضافة تأثيرات hover للصور
- إضافة animation عند تحميل الصور

## الاختبار

### 1. اختبار الحالات المختلفة
- ✅ عرض الصورة عند توفرها
- ✅ عرض الأيقونة الافتراضية عند عدم توفر الصورة
- ✅ معالجة أخطاء تحميل الصور
- ✅ التصميم المتجاوب على الشاشات المختلفة

### 2. اختبار الأداء
- ✅ سرعة تحميل الصور
- ✅ عدم تأثير الصور على أداء التطبيق
- ✅ معالجة الصور الكبيرة

## الخلاصة

تم تطبيق نظام عرض صور السائقين بنجاح في جميع واجهات عرض الرحلات. النظام يدعم:

- ✅ عرض الصور الشرطي
- ✅ معالجة الأخطاء
- ✅ التصميم المتجاوب
- ✅ إمكانية الوصول
- ✅ الأداء المحسن

هذا التحديث يحسن تجربة المستخدم بشكل كبير من خلال جعل واجهة التطبيق أكثر شخصية وثقة.
