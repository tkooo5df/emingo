# ✅ إضافة التحرك التلقائي للكاروسيل

## 🎯 الميزة الجديدة

الكاروسيل الآن يتحرك **تلقائياً بشكل سلس** (Smooth Autoplay)! ✨

---

## 🚀 ما تم إضافته؟

### 1. **Autoplay Plugin**
```tsx
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const plugin = useRef(
  Autoplay({ 
    delay: 3000,              // كل 3 ثوانٍ
    stopOnInteraction: true   // يتوقف عند التفاعل
  })
);
```

### 2. **دمج Plugin مع Carousel**
```tsx
<Carousel
  plugins={[plugin.current]}  // ← الـ Plugin هنا
  opts={{
    align: "start",
    loop: true,
    dragFree: true,
    direction: "rtl",
  }}
>
```

### 3. **نصيحة محدثة**
```tsx
<div className="text-center mt-4">
  <p className="text-xs text-muted-foreground">
    ✨ التصفح تلقائي - اسحب للتحكم اليدوي
  </p>
</div>
```

---

## ⚙️ الإعدادات

### Delay (التأخير):
```tsx
delay: 3000  // 3 ثوانٍ بين كل انتقال
```
- يمكنك تغييرها لأي قيمة (بالميلي ثانية)
- `2000` = ثانيتان
- `4000` = 4 ثوانٍ
- `5000` = 5 ثوانٍ

### Stop on Interaction:
```tsx
stopOnInteraction: true
```
- **`true`**: يتوقف عند السحب/النقر (موصى به)
- **`false`**: يستمر حتى لو تفاعل المستخدم

---

## 🎨 كيف يعمل؟

### التصفح التلقائي:
```
[البطاقة 1] → (3 ثوانٍ) → [البطاقة 2] → (3 ثوانٍ) → [البطاقة 3]
     ↑                                                           ↓
     └───────────────────── (Loop) ────────────────────────────┘
```

### عند تفاعل المستخدم:
1. المستخدم **يسحب** الكاروسيل
2. Autoplay **يتوقف** تلقائياً
3. المستخدم يتحكم يدوياً

---

## 📦 الحزمة المُثبتة

```bash
npm install embla-carousel-autoplay
```

**النسخة المُثبتة:** أحدث نسخة متوافقة مع `embla-carousel-react`

---

## 💻 الكود الكامل

```tsx
// src/components/home/GhardaiaSection.tsx

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const GhardaiaSection = () => {
  // ✨ Autoplay Plugin
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const ksour = [
    {
      name: "قصر العطف",
      image: "https://pbs.twimg.com/media/FLVq5xuXsAYapXq.jpg",
      description: "من أجمل قصور وادي مزاب التاريخية"
    },
    {
      name: "قصر غرداية",
      image: "https://mzabmedia.com/wp-content/uploads/aghlane-taachirf.jpg",
      description: "قلب وادي مزاب النابض"
    },
    {
      name: "قصر القرارة",
      image: "https://tamajida.org/frontend/images/default.jpg",
      description: "من معالم التراث المزابي الأصيل"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-secondary/10 to-background" dir="rtl">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            نقل من جميع قصور ولاية غرداية إلى جميع الولايات
          </h2>
        </motion.div>

        {/* Carousel مع Autoplay ✨ */}
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
            direction: "rtl",
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {ksour.map((ksar, index) => (
              <CarouselItem 
                key={index} 
                className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-[380px]">
                  {/* محتوى البطاقة */}
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* نصيحة */}
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            ✨ التصفح تلقائي - اسحب للتحكم اليدوي
          </p>
        </div>
      </div>
    </section>
  );
};

export default GhardaiaSection;
```

---

## 🎯 المميزات

### 1. **حركة سلسة (Smooth)**
- انتقال ناعم بين البطاقات
- لا توجد قفزات مفاجئة
- تجربة مستخدم ممتازة

### 2. **Loop لا نهائي**
- يعود للبداية تلقائياً
- دورة مستمرة
- لا يتوقف أبداً

### 3. **توقف ذكي**
- يتوقف عند السحب
- المستخدم يتحكم
- استئناف تلقائي (اختياري)

### 4. **RTL Support**
- يعمل من اليمين لليسار
- متوافق مع العربية
- اتجاه صحيح

---

## 🎨 التخصيص

### تغيير السرعة:

```tsx
// أسرع (ثانيتان)
Autoplay({ delay: 2000, stopOnInteraction: true })

// أبطأ (5 ثوانٍ)
Autoplay({ delay: 5000, stopOnInteraction: true })

// سريع جداً (ثانية)
Autoplay({ delay: 1000, stopOnInteraction: true })
```

### عدم التوقف عند التفاعل:

```tsx
Autoplay({ 
  delay: 3000, 
  stopOnInteraction: false  // ← يستمر حتى مع التفاعل
})
```

### إيقاف Loop:

```tsx
Autoplay({ 
  delay: 3000, 
  stopOnInteraction: true,
  stopOnLastSnap: true  // ← يتوقف في النهاية
})
```

---

## 🧪 كيف تختبر؟

### 1. شغّل المشروع:
```bash
npm run dev
```

### 2. افتح الصفحة الرئيسية

### 3. شاهد:
- ✅ الكاروسيل يتحرك تلقائياً كل 3 ثوانٍ
- ✅ حركة سلسة وناعمة
- ✅ Loop لا نهائي

### 4. جرّب التفاعل:
- اسحب البطاقة بالماوس أو الإصبع
- لاحظ: Autoplay يتوقف فوراً
- أنت الآن تتحكم يدوياً

---

## 📊 قبل وبعد

### قبل ❌:
```
- الكاروسيل ثابت
- يحتاج سحب يدوي
- لا يتحرك تلقائياً
```

### بعد ✅:
```
- يتحرك تلقائياً كل 3 ثوانٍ ✨
- سلس وجميل
- يتوقف عند التفاعل
- تجربة مستخدم أفضل
```

---

## 🔧 استكشاف الأخطاء

### المشكلة: Autoplay لا يعمل

**الحل 1:** تأكد من التثبيت
```bash
npm install embla-carousel-autoplay
```

**الحل 2:** تأكد من import
```tsx
import Autoplay from "embla-carousel-autoplay";
```

**الحل 3:** تأكد من useRef
```tsx
const plugin = useRef(
  Autoplay({ delay: 3000, stopOnInteraction: true })
);
```

**الحل 4:** تأكد من plugins
```tsx
<Carousel plugins={[plugin.current]}>
```

### المشكلة: يتحرك سريع جداً/بطيء

**الحل:** عدّل delay
```tsx
Autoplay({ delay: 4000 })  // 4 ثوانٍ بدلاً من 3
```

### المشكلة: لا يتوقف عند السحب

**الحل:** تأكد من stopOnInteraction
```tsx
stopOnInteraction: true  // ← يجب أن يكون true
```

---

## 📖 المراجع

- [Embla Carousel Autoplay Plugin](https://www.embla-carousel.com/plugins/autoplay/)
- [Embla Carousel React](https://www.embla-carousel.com/get-started/react/)

---

## ✅ الخلاصة

### ما تم إضافته:
- ✅ **Autoplay Plugin** لتحريك الكاروسيل تلقائياً
- ✅ **Smooth transitions** انتقالات سلسة
- ✅ **Stop on interaction** التوقف عند التفاعل
- ✅ **Loop infinite** دورة لا نهائية
- ✅ **RTL support** دعم العربية

### الملفات المُحدثة:
```
✅ src/components/home/GhardaiaSection.tsx
✅ package.json (embla-carousel-autoplay)
```

### النتيجة:
**الكاروسيل الآن يتحرك تلقائياً بشكل سلس كل 3 ثوانٍ!** ✨

---

**🎉 الميزة جاهزة! شغّل المشروع وشاهد الكاروسيل يتحرك تلقائياً!** 🚀✨

