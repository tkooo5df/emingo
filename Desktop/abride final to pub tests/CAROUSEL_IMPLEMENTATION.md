# ✅ تطبيق الكاروسيل (Carousel) في الواجهة

## 🎯 ما تم إنجازه

تم تطبيق مكون Carousel من shadcn/ui بنجاح في قسم غرداية!

---

## 📦 المكونات المُضافة

### 1. المكتبة الأساسية
```bash
npm install embla-carousel-react
```
✅ تم تثبيت embla-carousel-react

### 2. مكون Carousel
**الموقع:** `src/components/ui/carousel.tsx`

**المكونات:**
- ✅ `Carousel` - الحاوية الرئيسية
- ✅ `CarouselContent` - المحتوى القابل للتمرير
- ✅ `CarouselItem` - العنصر الفردي
- ✅ `CarouselPrevious` - زر السابق
- ✅ `CarouselNext` - زر التالي

---

## 🎨 كيفية الاستخدام

### مثال بسيط:

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

<Carousel>
  <CarouselContent className="-ml-4">
    {items.map((item, index) => (
      <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
        <div>
          {/* محتوى العنصر */}
        </div>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

---

## 🏗️ التطبيق في GhardaiaSection

### قبل:
```tsx
{/* Horizontal Scrolling Banner */}
<div className="flex gap-6 overflow-x-auto">
  {ksour.map((ksar, index) => (
    <div className="flex-shrink-0">
      <Card>...</Card>
    </div>
  ))}
</div>
```

### بعد:
```tsx
{/* Carousel */}
<Carousel
  opts={{
    align: "start",
    loop: true,
  }}
  className="w-full max-w-6xl mx-auto"
>
  <CarouselContent className="-ml-2 md:-ml-4">
    {ksour.map((ksar, index) => (
      <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
        <Card>...</Card>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious className="hidden md:flex" />
  <CarouselNext className="hidden md:flex" />
</Carousel>
```

---

## 📐 Spacing (المسافات)

### المبدأ:

```tsx
<CarouselContent className="-ml-4">  {/* مسافة سالبة */}
  <CarouselItem className="pl-4">    {/* padding يساوي القيمة المطلقة */}
    ...
  </CarouselItem>
</CarouselContent>
```

**لماذا؟**
- `-ml-4` على `CarouselContent` لتعويض المسافة
- `pl-4` على `CarouselItem` لإنشاء المسافة الفعلية
- أسهل من استخدام `gap` أو `grid`

### في التطبيق:

```tsx
className="-ml-2 md:-ml-4"    // على CarouselContent
className="pl-2 md:pl-4"      // على CarouselItem
```

**النتيجة:**
- مسافة 8px (2 × 4px) على الموبايل
- مسافة 16px (4 × 4px) على الشاشات الكبيرة

---

## 📱 Responsive Behavior

### Basis (الحجم):

```tsx
className="basis-full md:basis-1/2 lg:basis-1/3"
```

**التفصيل:**
- `basis-full` - عنصر واحد في الموبايل (100%)
- `md:basis-1/2` - عنصران في التابلت (50%)
- `lg:basis-1/3` - ثلاثة عناصر في الديسكتوب (33.33%)

### الأزرار:

```tsx
<CarouselPrevious className="hidden md:flex" />
<CarouselNext className="hidden md:flex" />
```

**لماذا؟**
- مخفية في الموبايل (swipe/touch)
- تظهر في الشاشات الكبيرة

---

## ⚙️ Options (الخيارات)

### في GhardaiaSection:

```tsx
opts={{
  align: "start",  // البداية من اليسار
  loop: true,      // تكرار لا نهائي
}}
```

### خيارات إضافية متاحة:

```tsx
opts={{
  align: "start" | "center" | "end",
  loop: true | false,
  dragFree: true | false,
  slidesToScroll: 1,
  skipSnaps: false,
}}
```

---

## 🎯 المميزات

### ✅ تم تحسين تجربة المستخدم:

1. **للموبايل:**
   - تمرير سلس بالإصبع (swipe)
   - عنصر واحد في الشاشة
   - تجربة طبيعية

2. **للديسكتوب:**
   - أزرار تنقل واضحة
   - 3 عناصر في الشاشة
   - تمرير بالماوس والسهم

3. **عام:**
   - Loop لا نهائي
   - animations سلسة
   - responsive كامل

---

## 📂 الملفات

### الملفات المُنشأة:
```
src/
├── components/
│   ├── ui/
│   │   └── carousel.tsx                 ✅ المكون الأساسي
│   ├── examples/
│   │   └── CarouselExample.tsx         ✅ مثال بسيط
│   └── home/
│       └── GhardaiaSection.tsx          ✅ محدّث
```

---

## 🔧 Customization

### تخصيص الأزرار:

```tsx
<CarouselPrevious 
  className="left-4 bg-primary/10 hover:bg-primary"
/>
<CarouselNext 
  className="right-4 bg-primary/10 hover:bg-primary"
/>
```

### تخصيص المسافات:

```tsx
<CarouselContent className="-ml-6">      {/* مسافة أكبر */}
  <CarouselItem className="pl-6">
    ...
  </CarouselItem>
</CarouselContent>
```

### تخصيص الحجم:

```tsx
<CarouselItem className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
  {/* 4 عناصر في الشاشات الكبيرة جداً */}
</CarouselItem>
```

---

## 🧪 اختبار الكاروسيل

### للتحقق من أنه يعمل:

1. **في الموبايل:**
   - افتح الصفحة الرئيسية
   - مرّر إلى قسم غرداية
   - اسحب بإصبعك ← أو →
   - ✅ يجب أن يتحرك بسلاسة

2. **في الديسكتوب:**
   - افتح الصفحة الرئيسية
   - مرّر إلى قسم غرداية
   - اضغط الأزرار ← أو →
   - ✅ يجب أن ترى 3 قصور في الشاشة

3. **Loop:**
   - استمر في الضغط على →
   - ✅ يجب أن يعود للبداية تلقائياً

---

## 📝 مثال كامل (CarouselExample)

**الموقع:** `src/components/examples/CarouselExample.tsx`

```tsx
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselSpacing() {
  return (
    <Carousel className="w-full max-w-sm">
      <CarouselContent className="-ml-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-2xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```

---

## ✅ الخلاصة

### ما تم:
- ✅ تثبيت embla-carousel-react
- ✅ إنشاء مكون Carousel
- ✅ تطبيق Carousel في GhardaiaSection
- ✅ إضافة spacing صحيح
- ✅ جعله responsive
- ✅ إضافة أزرار التنقل

### النتيجة:
- 🎯 تجربة مستخدم أفضل
- 📱 responsive كامل
- ⚡ أداء ممتاز
- 🎨 تصميم جميل

---

**✅ الكاروسيل جاهز للاستخدام!** 🎉

**يمكنك الآن استخدام Carousel في أي مكان في التطبيق!** 🚀

