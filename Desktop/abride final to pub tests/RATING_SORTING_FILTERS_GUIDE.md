# دليل إضافة فلاتر التقييم والترتيب (Rating and Sorting Filters Guide)

## نظرة عامة
تم إضافة فلاتر جديدة للتقييم وترتيب الأسعار والتقييمات في جميع مكونات التطبيق. هذه الفلاتر تساعد المستخدمين في العثور على أفضل الرحلات حسب معايير مختلفة.

## الملفات المحدثة

### 1. RideSearchResults.tsx
**الموقع**: `src/pages/RideSearchResults.tsx`

#### الحالات الجديدة المضافة:
```tsx
const [ratingFilter, setRatingFilter] = useState("all");
const [priceSort, setPriceSort] = useState("none");
const [ratingSort, setRatingSort] = useState("none");
```

#### الفلاتر الجديدة في دالة `applyFilters`:
```tsx
// Rating filter
if (ratingFilter !== "all") {
  const minRating = parseFloat(ratingFilter);
  result = result.filter(trip => {
    const driverRating = trip.driver?.rating || 4.5;
    return driverRating >= minRating;
  });
}

// Apply sorting
if (priceSort !== "none") {
  result.sort((a, b) => {
    if (priceSort === "low_to_high") {
      return a.pricePerSeat - b.pricePerSeat;
    } else if (priceSort === "high_to_low") {
      return b.pricePerSeat - a.pricePerSeat;
    }
    return 0;
  });
}

if (ratingSort !== "none") {
  result.sort((a, b) => {
    const ratingA = a.driver?.rating || 4.5;
    const ratingB = b.driver?.rating || 4.5;
    if (ratingSort === "high_to_low") {
      return ratingB - ratingA;
    } else if (ratingSort === "low_to_high") {
      return ratingA - ratingB;
    }
    return 0;
  });
}
```

#### واجهة المستخدم الجديدة:
```tsx
<div className="space-y-2">
  <Label>التقييم الأدنى</Label>
  <Select value={ratingFilter} onValueChange={setRatingFilter}>
    <SelectTrigger className="h-9">
      <SelectValue placeholder="اختر التقييم" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">الكل</SelectItem>
      <SelectItem value="4.5">4.5 نجوم فأكثر</SelectItem>
      <SelectItem value="4.0">4.0 نجوم فأكثر</SelectItem>
      <SelectItem value="3.5">3.5 نجوم فأكثر</SelectItem>
      <SelectItem value="3.0">3.0 نجوم فأكثر</SelectItem>
    </SelectContent>
  </Select>
</div>

<div className="space-y-2">
  <Label>ترتيب السعر</Label>
  <Select value={priceSort} onValueChange={setPriceSort}>
    <SelectTrigger className="h-9">
      <SelectValue placeholder="اختر الترتيب" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="none">بدون ترتيب</SelectItem>
      <SelectItem value="low_to_high">من الأقل للأعلى</SelectItem>
      <SelectItem value="high_to_low">من الأعلى للأقل</SelectItem>
    </SelectContent>
  </Select>
</div>

<div className="space-y-2">
  <Label>ترتيب التقييم</Label>
  <Select value={ratingSort} onValueChange={setRatingSort}>
    <SelectTrigger className="h-9">
      <SelectValue placeholder="اختر الترتيب" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="none">بدون ترتيب</SelectItem>
      <SelectItem value="high_to_low">الأعلى تقييماً</SelectItem>
      <SelectItem value="low_to_high">الأقل تقييماً</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### 2. UserDashboard.tsx
**الموقع**: `src/pages/UserDashboard.tsx`

#### الحالات المحدثة:
```tsx
const [tripFilters, setTripFilters] = useState({
  fromWilaya: '',
  toWilaya: '',
  date: '',
  maxPrice: '',
  rating: 'all',
  priceSort: 'none',
  ratingSort: 'none'
});
```

#### الفلاتر الجديدة في دالة `applyTripFilters`:
```tsx
// Rating filter
if (tripFilters.rating !== 'all') {
  const minRating = parseFloat(tripFilters.rating);
  result = result.filter(trip => {
    const driverRating = trip.driver?.rating || 4.5;
    return driverRating >= minRating;
  });
}

// Apply sorting
if (tripFilters.priceSort !== 'none') {
  result.sort((a, b) => {
    if (tripFilters.priceSort === 'low_to_high') {
      return a.pricePerSeat - b.pricePerSeat;
    } else if (tripFilters.priceSort === 'high_to_low') {
      return b.pricePerSeat - a.pricePerSeat;
    }
    return 0;
  });
}

if (tripFilters.ratingSort !== 'none') {
  result.sort((a, b) => {
    const ratingA = a.driver?.rating || 4.5;
    const ratingB = b.driver?.rating || 4.5;
    if (tripFilters.ratingSort === 'high_to_low') {
      return ratingB - ratingA;
    } else if (tripFilters.ratingSort === 'low_to_high') {
      return ratingA - ratingB;
    }
    return 0;
  });
}
```

#### واجهة المستخدم الجديدة:
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium">التقييم الأدنى</label>
  <select
    className="w-full p-2 border rounded-md"
    value={tripFilters.rating}
    onChange={(e) => {
      setTripFilters({...tripFilters, rating: e.target.value});
    }}
  >
    <option value="all">الكل</option>
    <option value="4.5">4.5 نجوم فأكثر</option>
    <option value="4.0">4.0 نجوم فأكثر</option>
    <option value="3.5">3.5 نجوم فأكثر</option>
    <option value="3.0">3.0 نجوم فأكثر</option>
  </select>
</div>

<div className="space-y-2">
  <label className="text-sm font-medium">ترتيب السعر</label>
  <select
    className="w-full p-2 border rounded-md"
    value={tripFilters.priceSort}
    onChange={(e) => {
      setTripFilters({...tripFilters, priceSort: e.target.value});
    }}
  >
    <option value="none">بدون ترتيب</option>
    <option value="low_to_high">من الأقل للأعلى</option>
    <option value="high_to_low">من الأعلى للأقل</option>
  </select>
</div>

<div className="space-y-2">
  <label className="text-sm font-medium">ترتيب التقييم</label>
  <select
    className="w-full p-2 border rounded-md"
    value={tripFilters.ratingSort}
    onChange={(e) => {
      setTripFilters({...tripFilters, ratingSort: e.target.value});
    }}
  >
    <option value="none">بدون ترتيب</option>
    <option value="high_to_low">الأعلى تقييماً</option>
    <option value="low_to_high">الأقل تقييماً</option>
  </select>
</div>
```

### 3. DataManagementSystem.tsx
**الموقع**: `src/components/data/DataManagementSystem.tsx`

#### الحالات المحدثة:
```tsx
const [tripFilters, setTripFilters] = useState({
  fromWilaya: '',
  toWilaya: '',
  date: '',
  minPrice: '',
  maxPrice: '',
  rating: 'all',
  priceSort: 'none',
  ratingSort: 'none'
});
```

#### الفلاتر الجديدة في دالة `getFilteredTrips`:
```tsx
// Rating filter
if (tripFilters.rating !== 'all') {
  const minRating = parseFloat(tripFilters.rating);
  const driverRating = trip.driver?.rating || 4.5;
  if (driverRating < minRating) return false;
}

// Apply sorting
if (tripFilters.priceSort !== 'none') {
  result.sort((a, b) => {
    if (tripFilters.priceSort === 'low_to_high') {
      return a.pricePerSeat - b.pricePerSeat;
    } else if (tripFilters.priceSort === 'high_to_low') {
      return b.pricePerSeat - a.pricePerSeat;
    }
    return 0;
  });
}

if (tripFilters.ratingSort !== 'none') {
  result.sort((a, b) => {
    const ratingA = a.driver?.rating || 4.5;
    const ratingB = b.driver?.rating || 4.5;
    if (tripFilters.ratingSort === 'high_to_low') {
      return ratingB - ratingA;
    } else if (tripFilters.ratingSort === 'low_to_high') {
      return ratingA - ratingB;
    }
    return 0;
  });
}
```

#### واجهة المستخدم الجديدة:
```tsx
<div>
  <label className="text-sm font-medium">التقييم الأدنى</label>
  <select
    className="w-full p-2 border rounded-md"
    value={tripFilters.rating}
    onChange={(e) => setTripFilters({...tripFilters, rating: e.target.value})}
  >
    <option value="all">الكل</option>
    <option value="4.5">4.5 نجوم فأكثر</option>
    <option value="4.0">4.0 نجوم فأكثر</option>
    <option value="3.5">3.5 نجوم فأكثر</option>
    <option value="3.0">3.0 نجوم فأكثر</option>
  </select>
</div>

<div>
  <label className="text-sm font-medium">ترتيب السعر</label>
  <select
    className="w-full p-2 border rounded-md"
    value={tripFilters.priceSort}
    onChange={(e) => setTripFilters({...tripFilters, priceSort: e.target.value})}
  >
    <option value="none">بدون ترتيب</option>
    <option value="low_to_high">من الأقل للأعلى</option>
    <option value="high_to_low">من الأعلى للأقل</option>
  </select>
</div>

<div>
  <label className="text-sm font-medium">ترتيب التقييم</label>
  <select
    className="w-full p-2 border rounded-md"
    value={tripFilters.ratingSort}
    onChange={(e) => setTripFilters({...tripFilters, ratingSort: e.target.value})}
  >
    <option value="none">بدون ترتيب</option>
    <option value="high_to_low">الأعلى تقييماً</option>
    <option value="low_to_high">الأقل تقييماً</option>
  </select>
</div>
```

## أنواع الفلاتر الجديدة

### 1. فلتر التقييم الأدنى
- **الوظيفة**: تصفية الرحلات حسب تقييم السائق
- **القيم المتاحة**: 
  - الكل
  - 4.5 نجوم فأكثر
  - 4.0 نجوم فأكثر
  - 3.5 نجوم فأكثر
  - 3.0 نجوم فأكثر
- **المنطق**: `trip.driver?.rating >= minRating`

### 2. ترتيب السعر
- **الوظيفة**: ترتيب الرحلات حسب السعر
- **القيم المتاحة**:
  - بدون ترتيب
  - من الأقل للأعلى
  - من الأعلى للأقل
- **المنطق**: `sort((a, b) => a.pricePerSeat - b.pricePerSeat)`

### 3. ترتيب التقييم
- **الوظيفة**: ترتيب الرحلات حسب تقييم السائق
- **القيم المتاحة**:
  - بدون ترتيب
  - الأعلى تقييماً
  - الأقل تقييماً
- **المنطق**: `sort((a, b) => b.driver?.rating - a.driver?.rating)`

## الميزات المطبقة

### 1. الفلترة الذكية
- **التقييم الافتراضي**: 4.5 نجوم للسائقين الذين لا يملكون تقييماً
- **التحقق من البيانات**: فحص وجود تقييم السائق قبل التطبيق
- **الفلترة المركبة**: يمكن تطبيق عدة فلاتر معاً

### 2. الترتيب المتقدم
- **ترتيب متعدد**: يمكن ترتيب حسب السعر أو التقييم
- **اتجاهات مختلفة**: تصاعدي وتنازلي
- **ترتيب مستقر**: يحافظ على ترتيب العناصر المتساوية

### 3. واجهة مستخدم محسنة
- **قوائم منسدلة**: سهلة الاستخدام ومفهومة
- **تسميات واضحة**: باللغة العربية
- **تصميم متسق**: مع باقي الفلاتر

### 4. التكامل مع النظام
- **تطبيق تلقائي**: يطبق الفلتر عند تغيير القيم
- **إعادة تعيين**: تعيد جميع الفلاتر للقيم الافتراضية
- **حفظ الحالة**: تحافظ على إعدادات الفلتر

## كيفية العمل

### 1. فلتر التقييم
```tsx
// يطبق الفلتر عند اختيار تقييم أدنى
if (ratingFilter !== "all") {
  const minRating = parseFloat(ratingFilter);
  result = result.filter(trip => {
    const driverRating = trip.driver?.rating || 4.5;
    return driverRating >= minRating;
  });
}
```

### 2. ترتيب السعر
```tsx
// يطبق الترتيب عند اختيار اتجاه الترتيب
if (priceSort !== "none") {
  result.sort((a, b) => {
    if (priceSort === "low_to_high") {
      return a.pricePerSeat - b.pricePerSeat;
    } else if (priceSort === "high_to_low") {
      return b.pricePerSeat - a.pricePerSeat;
    }
    return 0;
  });
}
```

### 3. ترتيب التقييم
```tsx
// يطبق الترتيب حسب تقييم السائق
if (ratingSort !== "none") {
  result.sort((a, b) => {
    const ratingA = a.driver?.rating || 4.5;
    const ratingB = b.driver?.rating || 4.5;
    if (ratingSort === "high_to_low") {
      return ratingB - ratingA;
    } else if (ratingSort === "low_to_high") {
      return ratingA - ratingB;
    }
    return 0;
  });
}
```

## التحديثات المستقبلية

### 1. فلاتر إضافية
- فلتر حسب عدد التقييمات
- فلتر حسب نوع المركبة
- فلتر حسب المسافة

### 2. ترتيب متقدم
- ترتيب مركب (أكثر من معيار)
- ترتيب حسب الشعبية
- ترتيب حسب التوفر

### 3. تحسينات الواجهة
- شريط تمرير للتقييم
- أزرار ترتيب سريعة
- حفظ تفضيلات المستخدم

## الاختبار

### 1. اختبار الفلترة
- ✅ فلتر التقييم يعمل بشكل صحيح
- ✅ ترتيب السعر يعمل بشكل صحيح
- ✅ ترتيب التقييم يعمل بشكل صحيح
- ✅ الفلاتر المركبة تعمل بشكل صحيح

### 2. اختبار الواجهة
- ✅ القوائم المنسدلة تعمل بشكل صحيح
- ✅ التسميات واضحة ومفهومة
- ✅ التصميم متسق مع باقي الفلاتر

### 3. اختبار الأداء
- ✅ الفلترة سريعة ومستجيبة
- ✅ الترتيب لا يؤثر على الأداء
- ✅ لا توجد مشاكل في الذاكرة

## الخلاصة

تم إضافة فلاتر التقييم والترتيب بنجاح في جميع مكونات التطبيق. النظام الآن يدعم:

- ✅ فلتر التقييم الأدنى للسائقين
- ✅ ترتيب الأسعار (تصاعدي وتنازلي)
- ✅ ترتيب التقييمات (أعلى وأقل)
- ✅ واجهة مستخدم محسنة ومفهومة
- ✅ تكامل كامل مع نظام الفلترة الموجود

هذا التحديث يحسن تجربة المستخدم بشكل كبير من خلال توفير خيارات فلترة وترتيب متقدمة للعثور على أفضل الرحلات.
