# إضافة إحصائيات السائق في ملف الشخصي (PROFILE)

## المطلوب
إضافة إحصائيات إضافية في ملف الشخصي للسائق:
1. **إجمالي الرحلات** - العدد الحقيقي لجميع الرحلات
2. **مقاعد محجوزة** - مجموع جميع المقاعد المحجوزة في جميع الرحلات

## التحديثات المطبقة

### 1. تحديث واجهة البيانات
```typescript
interface DriverProfileData {
  id: string;
  fullName: string;
  phoneNumber: string;
  profilePhoto?: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber: string;
  completedTrips: number;
  totalTrips: number;        // ← جديد
  totalBookedSeats: number; // ← جديد
  averageRating: number;
  reviews: Review[];
  status: 'active' | 'pending' | 'suspended';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  documents: DriverDocument[];
}
```

### 2. إضافة متغيرات الحالة
```typescript
const [allTrips, setAllTrips] = useState<any[]>([]);
const [allBookings, setAllBookings] = useState<any[]>([]);
```

### 3. جلب البيانات الإضافية
```typescript
// Get additional data for drivers
let totalTrips = 0;
let totalBookedSeats = 0;

if (profile.role === 'driver') {
  try {
    // Get all trips for this driver
    const tripsData = await BrowserDatabaseService.getTripsWithDetails(user.id);
    setAllTrips(tripsData || []);
    totalTrips = tripsData?.length || 0;
    
    // Get all bookings for this driver
    const bookingsData = await BrowserDatabaseService.getBookingsWithDetails(undefined, user.id);
    setAllBookings(bookingsData || []);
    
    // Calculate total booked seats
    totalBookedSeats = bookingsData?.reduce((total: number, booking: any) => {
      return total + (booking.seatsBooked || 0);
    }, 0) || 0;
  } catch (error) {
    console.error('Error fetching driver statistics:', error);
  }
}
```

### 4. تحديث إنشاء البيانات
```typescript
const driverData: DriverProfileData = {
  id: profile.id,
  fullName: profile.fullName,
  phoneNumber: profile.phoneNumber,
  profilePhoto: profile.profilePhoto,
  vehicleType: firstVehicle ? `${firstVehicle.make} ${firstVehicle.model}` : 'غير محدد',
  vehicleNumber: firstVehicle ? firstVehicle.licensePlate : 'غير محدد',
  licenseNumber: 'DL-123456789',
  completedTrips: stats.completedTrips,
  totalTrips: totalTrips,           // ← جديد
  totalBookedSeats: totalBookedSeats, // ← جديد
  averageRating: driverAverageRating,
  reviews: driverReviews,
  status: profile.isVerified ? 'active' : 'pending',
  isVerified: profile.isVerified,
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
  documents: documents.map(doc => ({
    id: doc.id,
    type: doc.type,
    name: doc.name,
    uploadedAt: doc.uploadedAt,
    status: doc.status,
    url: doc.url
  }))
};
```

### 5. تحديث الواجهة
```typescript
{/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* الرحلات المكتملة */}
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Route className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">الرحلات المكتملة</p>
          <p className="text-xl font-bold">{profileData.completedTrips}</p>
        </div>
      </div>
    </CardContent>
  </Card>
  
  {/* إجمالي الرحلات - للسائق فقط */}
  {isDriver && (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-full">
            <Car className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">إجمالي الرحلات</p>
            <p className="text-xl font-bold">{(profileData as DriverProfileData).totalTrips}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )}
  
  {/* مقاعد محجوزة - للسائق فقط */}
  {isDriver && (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-full">
            <User className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">مقاعد محجوزة</p>
            <p className="text-xl font-bold">{(profileData as DriverProfileData).totalBookedSeats}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )}
  
  {/* التقييم */}
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-500/10 rounded-full">
          <Star className="h-5 w-5 text-yellow-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">التقييم</p>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">{profileData.averageRating.toFixed(1)}</span>
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  
  {/* تاريخ الانضمام */}
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-500/10 rounded-full">
          <Calendar className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">تاريخ الانضمام</p>
          <p className="text-xl font-bold">
            {profileData.createdAt && profileData.createdAt !== 'غير منضم' 
              ? new Date(profileData.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit'
                })
              : 'غير محدد'}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

## كيفية عمل النظام

### 1. جلب البيانات
```typescript
// جلب جميع الرحلات للسائق
const tripsData = await BrowserDatabaseService.getTripsWithDetails(user.id);
totalTrips = tripsData?.length || 0;

// جلب جميع الحجوزات للسائق
const bookingsData = await BrowserDatabaseService.getBookingsWithDetails(undefined, user.id);

// حساب مجموع المقاعد المحجوزة
totalBookedSeats = bookingsData?.reduce((total: number, booking: any) => {
  return total + (booking.seatsBooked || 0);
}, 0) || 0;
```

### 2. عرض الإحصائيات
```typescript
// للسائق: 4 إحصائيات
- الرحلات المكتملة
- إجمالي الرحلات
- مقاعد محجوزة
- التقييم
- تاريخ الانضمام

// للراكب: 3 إحصائيات
- الرحلات المكتملة
- التقييم
- تاريخ الانضمام
```

## النتيجة المتوقعة

### للسائق:
1. 🔵 **الرحلات المكتملة**: عدد الرحلات المكتملة (`status === 'completed'`)
2. 🟢 **إجمالي الرحلات**: عدد جميع الرحلات (مجدولة، مكتملة، ملغية)
3. 🔵 **مقاعد محجوزة**: مجموع جميع المقاعد المحجوزة في جميع الحجوزات
4. 🟡 **التقييم**: متوسط التقييمات
5. 🟣 **تاريخ الانضمام**: تاريخ إنشاء الحساب

### للراكب:
1. 🔵 **الرحلات المكتملة**: عدد الرحلات المكتملة
2. 🟡 **التقييم**: متوسط التقييمات
3. 🟣 **تاريخ الانضمام**: تاريخ إنشاء الحساب

## كيفية التحقق من الإصلاح

### 1. افتح ملف الشخصي
- اذهب إلى: http://localhost:5173/profile
- تأكد من أنك مسجل دخول كسائق

### 2. لاحظ الإحصائيات الجديدة
- يجب أن ترى 5 إحصائيات للسائق
- يجب أن ترى "إجمالي الرحلات" و "مقاعد محجوزة"

### 3. اختبر مع راكب
- سجل دخول كراكب
- اذهب إلى ملف الشخصي
- يجب أن ترى 3 إحصائيات فقط

### 4. تحقق من الحسابات
- قارن "إجمالي الرحلات" مع عدد الرحلات الفعلي
- قارن "مقاعد محجوزة" مع مجموع المقاعد في الحجوزات

## ملاحظات مهمة

### 1. الأداء
```typescript
// جلب البيانات بشكل متوازي
const [tripsData, bookingsData] = await Promise.all([
  BrowserDatabaseService.getTripsWithDetails(user.id),
  BrowserDatabaseService.getBookingsWithDetails(undefined, user.id)
]);
```

### 2. معالجة الأخطاء
```typescript
try {
  // جلب البيانات
} catch (error) {
  console.error('Error fetching driver statistics:', error);
  // لا يفشل تحميل الملف الشخصي إذا فشل جلب الإحصائيات
}
```

### 3. التصميم المتجاوب
```typescript
// شبكة متجاوبة للإحصائيات
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

## الخطوات التالية

1. **تحقق من ظهور الإحصائيات الجديدة للسائق**
2. **تأكد من عدم ظهورها للراكب**
3. **تحقق من صحة الحسابات**
4. **اختبر التصميم المتجاوب**
5. **تأكد من عمل النظام مع بيانات مختلفة**

إذا كانت المشكلة لا تزال موجودة، أخبرني بما تراه!
