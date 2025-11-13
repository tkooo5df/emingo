# 🧪 اختبار تدفق إرسال البريد الإلكتروني

## الخطوات للاختبار:

### 1. افتح Console في المتصفح (F12)
   - تأكد من أن Console مفتوح ومرئي
   - امسح Console (Clear console)

### 2. أنشئ رحلة كسائق
   - سجل دخول كسائق
   - أنشئ رحلة جديدة
   - تأكد من أن الرحلة ظاهرة

### 3. احجز كراكب
   - سجل دخول كراكب (في نافذة متصفح أخرى أو حساب آخر)
   - ابحث عن الرحلة التي أنشأتها
   - احجز مقعد

### 4. أكد الحجز كسائق
   - ارجع إلى حساب السائق
   - اذهب إلى Dashboard
   - ابحث عن الحجز المعلق (pending)
   - اضغط على زر "قبول" أو "تأكيد"

### 5. راقب Console

يجب أن ترى هذه الرسائل بالترتيب:

#### ✅ الخطوة 1: handleConfirmBooking
```
🚗 USER DASHBOARD - handleConfirmBooking called: {bookingId: "...", driverId: "...", status: "confirmed"}
🚗 USER DASHBOARD - Calling trackStatusChange...
```

#### ✅ الخطوة 2: trackStatusChange
```
🚨 BOOKING TRACKING SERVICE - Starting status change: {bookingId: "...", newStatus: "confirmed", actor: "driver", ...}
🚨 BOOKING TRACKING SERVICE - Calling updateBooking...
✅ BOOKING TRACKING SERVICE - updateBooking completed
📧 Booking status updated, waiting before sending notifications...
```

#### ✅ الخطوة 3: sendStatusChangeNotifications
```
🔔 sendStatusChangeNotifications - Starting: {bookingId: "...", newStatus: "confirmed", actor: "driver", ...}
🔍 getBookingById - Trying Supabase first for booking: [ID]
✅ getBookingById - Found booking in Supabase
✅ sendStatusChangeNotifications - Booking found: {id: "...", passengerId: "...", driverId: "...", status: "confirmed"}
📧 sendStatusChangeNotifications - CONFIRMED status detected
📧 sendStatusChangeNotifications - Actor is driver, calling notifyBookingConfirmed...
📧 sendStatusChangeNotifications - Parameters: {bookingId: "...", actorId: "...", ...}
📧 sendStatusChangeNotifications - About to call NotificationService.notifyBookingConfirmed...
```

#### ✅ الخطوة 4: notifyBookingConfirmed
```
📧 notifyBookingConfirmed - Passenger found with email: {passengerId: "...", passengerName: "...", passengerEmail: "..."}
📧 notifyBookingConfirmed - Attempt 1/3 to send email to passenger...
📧 Email details: {to: "...", subject: "🚗 تم قبول حجزك!", passengerId: "..."}
📧 sendEmailNotification called for: {userId: "...", type: "booking_confirmed", ...}
📧 User email found: [email]
📧 Attempting to send email to: [email]
📧 Edge Function URL: https://kobsavfggcnfemdzsnpj.supabase.co/functions/v1/send-email
📧 Edge Function response status: 200 OK
✅ Email notification sent successfully to: [email]
✅ Email provider: resend
✅ notifyBookingConfirmed - Email sent successfully to passenger: [email]
```

#### ✅ الخطوة 5: النتيجة النهائية
```
✅ sendStatusChangeNotifications - notifyBookingConfirmed completed
✅ sendStatusChangeNotifications - Notifications sent successfully: [number]
✅ USER DASHBOARD - trackStatusChange completed: true
✅ USER DASHBOARD - Data refreshed after booking confirmation
```

## ❌ إذا لم تر هذه الرسائل:

### المشكلة 1: لا تظهر أي رسائل من handleConfirmBooking
**السبب:** الزر لا يستدعي handleConfirmBooking
**الحل:** 
- تحقق من أن الزر يستدعي `handleConfirmBooking(booking.id)`
- تحقق من أن `booking.id` موجود وصحيح

### المشكلة 2: تظهر رسائل handleConfirmBooking لكن لا تظهر trackStatusChange
**السبب:** خطأ في trackStatusChange أو في updateBooking
**الحل:**
- تحقق من رسائل الخطأ في Console
- تحقق من أن الحجز موجود في قاعدة البيانات

### المشكلة 3: تظهر trackStatusChange لكن لا تظهر sendStatusChangeNotifications
**السبب:** خطأ في sendStatusChangeNotifications أو في getBookingById
**الحل:**
- تحقق من رسائل الخطأ في Console
- تحقق من أن الحجز موجود بعد التحديث

### المشكلة 4: تظهر sendStatusChangeNotifications لكن لا تظهر notifyBookingConfirmed
**السبب:** خطأ في notifyBookingConfirmed أو في getBookingById
**الحل:**
- تحقق من رسائل الخطأ في Console
- تحقق من أن `booking.passengerId` موجود

### المشكلة 5: تظهر notifyBookingConfirmed لكن البريد لا يُرسل
**السبب:** خطأ في sendEmailNotification أو في Edge Function
**الحل:**
- تحقق من رسائل الخطأ في Console
- تحقق من Edge Function Logs في Supabase Dashboard
- تأكد من أن RESEND_API_KEY موجود

## 📋 Checklist:

- [ ] Console مفتوح ومرئي
- [ ] تم مسح Console قبل الاختبار
- [ ] تم إنشاء رحلة كسائق
- [ ] تم الحجز كراكب
- [ ] تم الضغط على زر "قبول" أو "تأكيد" كسائق
- [ ] تظهر رسائل `🚗 USER DASHBOARD - handleConfirmBooking called`
- [ ] تظهر رسائل `🚨 BOOKING TRACKING SERVICE - Starting status change`
- [ ] تظهر رسائل `📧 sendStatusChangeNotifications - Starting`
- [ ] تظهر رسائل `📧 notifyBookingConfirmed - Attempt 1/3`
- [ ] تظهر رسائل `✅ Email notification sent successfully`
- [ ] البريد يصل للراكب

## 🎯 النتيجة المتوقعة:

بعد اتباع جميع الخطوات:
1. ✅ Console يظهر جميع الرسائل المذكورة أعلاه
2. ✅ Edge Function Logs تظهر `✅ Email sent via Resend successfully`
3. ✅ البريد يصل للراكب على بريده الإلكتروني
4. ✅ الراكب يستلم إشعار داخل التطبيق أيضاً

## 📞 إذا استمرت المشكلة:

1. **احفظ Console logs:**
   - اضغط بزر الماوس الأيمن على Console
   - اختر "Save as..." أو "Copy"
   - احفظ اللوقات

2. **احفظ Edge Function logs:**
   - افتح Supabase Dashboard
   - اذهب إلى Functions → send-email → Logs
   - احفظ اللوقات

3. **شارك المعلومات:**
   - أول رسالة خطأ تظهر
   - آخر رسالة قبل الفشل
   - أي رسائل تحتوي على `❌`

## 💡 نصائح:

- ✅ استخدم Console Filter للبحث عن كلمات معينة (مثل "notifyBookingConfirmed" أو "Email")
- ✅ استخدم Console Clear قبل كل اختبار جديد
- ✅ تأكد من أنك تستخدم الحسابات الصحيحة (سائق وراكب)
- ✅ تأكد من أن الحجز في حالة "pending" قبل التأكيد

