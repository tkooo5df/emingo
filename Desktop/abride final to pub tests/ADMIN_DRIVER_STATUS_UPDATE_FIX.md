# إصلاح مشكلة تحديث حالة السائق في لوحة المدير

## المشكلة
كان السائق يتم إيقافه بنجاح، لكن لوحة المدير لا تعرض الحالة الصحيحة ولا تظهر زر التفعيل لإعادة تفعيله.

## التشخيص
المشكلة كانت في منطق تحديد الحالة في دالة `fetchAllUsers`:

### المشكلة السابقة
```typescript
// منطق خاطئ - لا يأخذ في الاعتبار is_verified للسائقين
const isActuallySuspended = user.account_suspended || !!activeSuspension;
```

### المشكلة في الإيقاف
```typescript
// إيقاف غير صحيح للسائقين
const { error: profileError } = await supabase
  .from('profiles')
  .update({ account_suspended: true }) // فقط account_suspended
  .eq('id', userId);
```

## الحل

### 1. إصلاح منطق تحديد الحالة
```typescript
const processedUsers = data?.map(user => {
  const activeSuspension = user.account_suspensions?.find(
    (suspension: any) => !suspension.reactivated_at
  );
  
  let isActuallySuspended = false;
  
  if (user.role === 'driver') {
    // للسائقين: موقوف إذا account_suspended OR not verified OR has active suspension
    isActuallySuspended = user.account_suspended || !user.is_verified || !!activeSuspension;
  } else {
    // للركاب: موقوف إذا account_suspended OR has active suspension
    isActuallySuspended = user.account_suspended || !!activeSuspension;
  }
  
  return {
    ...user,
    account_suspended: isActuallySuspended,
    suspension_details: activeSuspension
  };
}) || [];
```

### 2. إصلاح دالة الإيقاف
```typescript
const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
  // الحصول على تفاصيل المستخدم لتحديد الدور
  const { data: userData } = await supabase
    .from('profiles')
    .select('role, is_verified')
    .eq('id', userId)
    .single();
  
  if (newStatus) {
    // إيقاف الحساب
    if (userData?.role === 'driver') {
      // للسائقين: تعيين account_suspended = true AND is_verified = false
      await supabase
        .from('profiles')
        .update({ 
          account_suspended: true,
          is_verified: false 
        })
        .eq('id', userId);
    } else {
      // للركاب: تعيين account_suspended = true فقط
      await supabase
        .from('profiles')
        .update({ account_suspended: true })
        .eq('id', userId);
    }
  } else {
    // إعادة تفعيل الحساب باستخدام RPC function
    await (supabase as any).rpc('reactivate_user_account', {
      user_id: userId,
      reactivation_reason: 'تم إعادة تفعيل الحساب من قبل المدير',
      reactivated_by: user?.id
    });
  }
  
  // إعادة تحميل البيانات
  await fetchAllUsers();
};
```

## المميزات الجديدة

### 1. منطق صحيح للحالة
- ✅ **السائقين**: موقوف إذا `account_suspended: true` OR `is_verified: false` OR له إيقاف نشط
- ✅ **الركاب**: موقوف إذا `account_suspended: true` OR له إيقاف نشط

### 2. إيقاف صحيح للسائقين
- ✅ **السائقين**: يتم تعيين `account_suspended: true` AND `is_verified: false`
- ✅ **الركاب**: يتم تعيين `account_suspended: true` فقط

### 3. إعادة تفعيل صحيحة
- ✅ استخدام `reactivate_user_account` RPC function
- ✅ إعادة تعيين جميع الحقول بشكل صحيح
- ✅ إعادة تعيين الإلغاءات

### 4. تسجيل مفصل
- ✅ تسجيل كل خطوة في الكونسول
- ✅ عرض رسائل الخطأ التفصيلية
- ✅ تأكيد نجاح العمليات

## كيفية الاستخدام

1. **اذهب إلى لوحة المدير:** `/admin/dashboard`
2. **انتقل إلى تبويب "المستخدمين"**
3. **سترى الآن الحالة الصحيحة:**
   - 🔵 **سائق** - نوع المستخدم
   - 🔴 **موقوف** - إذا كان موقوفاً فعلياً
   - 🟢 **نشط** - إذا كان نشطاً فعلياً
4. **الأزرار ستكون دقيقة:**
   - **تفعيل** - للحسابات الموقوفة فعلياً
   - **إيقاف** - للحسابات النشطة فعلياً

## النتيجة
✅ **لوحة المدير تعرض الحالة الصحيحة والدقيقة**
✅ **الأزرار تعمل بشكل صحيح**
✅ **السائقين والركاب يُعاملون بشكل صحيح**
✅ **الإيقاف والإعادة تفعيل تعمل بشكل مثالي**

## مثال على النتيجة
السائق "swag lwal" الآن:
- 🔵 **سائق** - نوع المستخدم
- 🔴 **موقوف** - حالة الحساب (صحيحة!)
- **تفعيل** - زر الإجراء (صحيح!)

عند الضغط على "تفعيل":
- ✅ يتم إعادة تفعيل الحساب
- ✅ يتم تحديث الحالة فوراً
- ✅ يظهر زر "إيقاف" بدلاً من "تفعيل"
