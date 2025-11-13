# قوالب HTML للإشعارات على الإيميل

## القالب الرئيسي

يتم استخدام قالب HTML واحد ديناميكي لجميع الإشعارات في `notificationService.ts` في دالة `createEmailTemplate`.

## البنية الكاملة للقالب

```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <!-- العنوان مع لون الأولوية -->
    <div style="border-left: 4px solid ${priorityColor}; padding-left: 20px; margin-bottom: 20px;">
      <h1 style="color: ${priorityColor}; margin: 0; font-size: 24px;">${data.title}</h1>
    </div>
    
    <!-- رسالة الإشعار -->
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 16px; color: #4b5563; line-height: 1.8;">${data.message}</p>
    </div>

    <!-- تفاصيل الدفعة (اختياري - يظهر فقط عند وجود totalAmount في metadata) -->
    ${paymentDetails}

    <!-- زر الإجراء (اختياري - يظهر فقط عند وجود actionUrl) -->
    ${actionButton}

    <!-- التذييل -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
      <p style="margin: 0;">هذا إشعار تلقائي من منصة abride</p>
      <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} abride</p>
    </div>
  </div>
</body>
</html>
```

## الأجزاء الديناميكية

### 1. ألوان الأولوية (Priority Colors)

```javascript
const priorityColors = {
  low: '#6b7280',      // رمادي
  medium: '#3b82f6',   // أزرق
  high: '#f59e0b',     // برتقالي
  urgent: '#ef4444',   // أحمر فاتح
  critical: '#dc2626', // أحمر داكن
};
```

يتم استخدام `priorityColor` في:
- الحد الأيسر للعنوان (`border-left: 4px solid ${priorityColor}`)
- لون العنوان (`color: ${priorityColor}`)
- لون زر الإجراء (`background-color: ${priorityColor}`)

### 2. تفاصيل الدفعة (Payment Details)

يظهر فقط عند وجود `data.metadata.totalAmount`:

```html
<div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 15px; margin: 15px 0;">
  <h3 style="margin: 0 0 10px 0; color: #166534; font-size: 18px;">💰 تفاصيل الدفعة</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 5px 0; color: #4b5563;">المبلغ الإجمالي:</td>
      <td style="padding: 5px 0; font-weight: bold; font-size: 18px; color: #166534;">${totalAmount.toFixed(2)} دج</td>
    </tr>
    <tr>
      <td style="padding: 5px 0; color: #4b5563;">طريقة الدفع:</td>
      <td style="padding: 5px 0; color: #6b7280;">${paymentMethod}</td>
    </tr>
  </table>
</div>
```

### 3. زر الإجراء (Action Button)

يظهر فقط عند وجود `data.actionUrl`:

```html
<a href="${data.actionUrl}" style="display: inline-block; padding: 12px 24px; background-color: ${priorityColor}; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">عرض التفاصيل</a>
```

## المتغيرات المستخدمة

- `${data.title}` - عنوان الإشعار
- `${data.message}` - رسالة الإشعار
- `${priorityColor}` - لون الأولوية (يتم تحديده من `data.priority`)
- `${totalAmount.toFixed(2)}` - المبلغ الإجمالي (يظهر فقط عند وجود `data.metadata.totalAmount`)
- `${paymentMethod}` - طريقة الدفع (يظهر فقط عند وجود `data.metadata.totalAmount`)
- `${data.actionUrl}` - رابط الإجراء (يظهر فقط عند وجوده)
- `${new Date().getFullYear()}` - السنة الحالية

## مثال على إشعار كامل

### إشعار عادي (بدون دفعة)
```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>✅ تم تأكيد حجزك</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="border-left: 4px solid #3b82f6; padding-left: 20px; margin-bottom: 20px;">
      <h1 style="color: #3b82f6; margin: 0; font-size: 24px;">✅ تم تأكيد حجزك</h1>
    </div>
    
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 16px; color: #4b5563; line-height: 1.8;">تم تأكيد حجزك بنجاح. يمكنك الآن التواصل مع السائق.</p>
    </div>

    <a href="https://abride.online/dashboard?tab=bookings" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">عرض التفاصيل</a>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
      <p style="margin: 0;">هذا إشعار تلقائي من منصة abride</p>
      <p style="margin: 5px 0 0 0;">© 2025 abride</p>
    </div>
  </div>
</body>
</html>
```

### إشعار مع تفاصيل الدفعة
```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>✅ تم إكمال رحلتك وتم استلام دفعتك</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="border-left: 4px solid #f59e0b; padding-left: 20px; margin-bottom: 20px;">
      <h1 style="color: #f59e0b; margin: 0; font-size: 24px;">✅ تم إكمال رحلتك وتم استلام دفعتك</h1>
    </div>
    
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 16px; color: #4b5563; line-height: 1.8;">عزيزي السائق، تم إكمال رحلتك وتم استلام دفعتك. يمكنك تقييم كيف كانت رحلتك على المنصة.</p>
    </div>

    <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 15px; margin: 15px 0;">
      <h3 style="margin: 0 0 10px 0; color: #166534; font-size: 18px;">💰 تفاصيل الدفعة</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 0; color: #4b5563;">المبلغ الإجمالي:</td>
          <td style="padding: 5px 0; font-weight: bold; font-size: 18px; color: #166534;">1500.00 دج</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #4b5563;">طريقة الدفع:</td>
          <td style="padding: 5px 0; color: #6b7280;">نقداً</td>
        </tr>
      </table>
    </div>

    <a href="https://abride.online/dashboard?tab=trips" style="display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">عرض التفاصيل</a>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
      <p style="margin: 0;">هذا إشعار تلقائي من منصة abride</p>
      <p style="margin: 5px 0 0 0;">© 2025 abride</p>
    </div>
  </div>
</body>
</html>
```

## ملاحظات مهمة

1. **القالب موحد**: يتم استخدام نفس القالب لجميع الإشعارات، مع تغيير المحتوى فقط
2. **RTL Support**: القالب يدعم اللغة العربية مع `dir="rtl"`
3. **Responsive**: القالب متجاوب مع الشاشات المختلفة
4. **Inline Styles**: جميع الأنماط inline لضمان التوافق مع برامج الإيميل
5. **ألوان الأولوية**: تتغير حسب نوع الإشعار (low, medium, high, urgent, critical)
6. **أجزاء اختيارية**: 
   - تفاصيل الدفعة تظهر فقط عند وجود `data.metadata.totalAmount`
   - زر الإجراء يظهر فقط عند وجود `data.actionUrl`

## الموقع في الكود

القالب موجود في:
- **الملف**: `src/integrations/database/notificationService.ts`
- **الدالة**: `createEmailTemplate` (السطر 2670)
- **يتم استدعاؤه من**: `sendEmailNotification` (السطر 2542)

