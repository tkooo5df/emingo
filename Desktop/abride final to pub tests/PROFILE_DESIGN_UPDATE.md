# تحديث تصميم البروفيلات

## 🎯 الهدف
تطبيق قالب جديد من v0 على صفحات البروفيلات.

## 📋 الخطوات

### 1. افتح v0 Dashboard
```
https://v0.dev/app/VAsfwgQjlHE
```

### 2. انسخ الكود
1. افتح الرابط أعلاه في المتصفح
2. ابحث عن "Copy Code" أو "Export"
3. انسخ الكود الكامل

### 3. استبدل الكود

#### في الملف: `src/components/profile/Profile.tsx`

1. احذف المحتوى القديم
2. الصق الكود الجديد من v0
3. عدّل العناصر التالية:

```tsx
// استبدل البيانات:
- الاسم: {profileData.fullName}
- الوصف: {profileData.bio}
- الصورة: {profileData.profilePhoto}
- الإحصائيات: {profileData.stats}
- الأزرار: تحديث، إعدادات، إلخ
```

### 4. تأكد من التوافق
- استخدم نفس البيانات من `DriverProfileData` و `PassengerProfileData`
- احتفظ بنفس الـ `props` والـ `interfaces`
- تأكد من أن الـ `onUpdate`, `onDelete`, إلخ تعمل

### 5. أضف Component الجديد

إذا كان القالب يحتوي على components جديدة:

```bash
# في Terminal
npx shadcn-ui@latest add [component-name]

# مثال:
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add card
```

## 📝 ملاحظات مهمة

### البيانات المستخدمة في البروفيلات:

#### للطرف الصورة (Driver):
```typescript
interface DriverProfileData {
  id: string;
  fullName: string;
  phoneNumber: string;
  profilePhoto: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  totalTrips: number;
  completedTrips: number;
  totalBookedSeats: number;
  completedBookingsCount: number;
  totalVehicles: number;
  activeVehicles: number;
  totalEarnings: number;
  averageRating: number;
  reviews: Review[];
  status: 'active' | 'pending';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  documents: any[];
}
```

#### للركاب (Passenger):
```typescript
interface PassengerProfileData {
  id: string;
  fullName: string;
  phoneNumber: string;
  profilePhoto: string;
  totalTrips: number;
  totalBookings: number;
  cancellations: number;
  averageRating: number;
  ratingsCount: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}
```

## 🔗 روابط مفيدة

- v0 Dashboard: https://v0.dev/app/VAsfwgQjlHE
- shadcn/ui Documentation: https://ui.shadcn.com/
- v0 Docs: https://v0.dev/docs

## ⚠️ تنبيهات

1. **لا تحذف الوظائف الموجودة**: 
   - `loadProfileData()`
   - `handleUpdateProfile()`
   - `handleDelete()`
   - إلخ

2. **احتفظ بالـ Types**:
   - `DriverProfileData`
   - `PassengerProfileData`
   - `Review`
   - إلخ

3. **تأكد من البيانات**:
   - تأكد من أن `profileData` موجود
   - تأكد من أن `isLoading` تعمل
   - تأكد من معالجة الأخطاء

## 📦 الأكواد الجاهزة

بعد نسخ الكود من v0، ستحتاج إلى تعديل:

### 1. استيراد البيانات
```tsx
// في أعلى الملف
import { useState, useEffect } from "react";
import { useDatabase } from "@/hooks/useDatabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Data types
interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  passenger_name?: string;
  driver_name?: string;
  passenger_avatar_url?: string;
  driver_avatar_url?: string;
}
```

### 2. استبدال المحتوى
```tsx
// من:
<div className="text-2xl font-bold">John Doe</div>

// إلى:
<div className="text-2xl font-bold">{profileData?.fullName || 'Loading...'}</div>
```

### 3. تحديث الصورة
```tsx
// من:
<img src="/placeholder-avatar.jpg" />

// إلى:
<Avatar>
  <AvatarImage src={profileData?.profilePhoto || '/placeholder.svg'} />
  <AvatarFallback>
    {profileData?.fullName?.charAt(0) || 'U'}
  </AvatarFallback>
</Avatar>
```

---

**تم إنشاء هذا الملف كدليل لتحديث البروفيلات**


