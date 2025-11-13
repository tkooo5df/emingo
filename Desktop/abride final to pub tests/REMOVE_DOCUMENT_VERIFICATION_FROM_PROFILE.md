# إزالة قسم "مستندات التحقق" من ملف الشخصي للسائق

## المطلوب
إزالة قسم "مستندات التحقق" من ملف الشخصي للسائق لأنه لا علاقة له بالبروفايل.

## التحديثات المطبقة

### 1. حذف قسم "مستندات التحقق"
```typescript
// تم حذف هذا القسم بالكامل
{/* Document Verification */}
<Card>
  <CardHeader>
    <CardTitle>مستندات التحقق</CardTitle>
    <CardDescription>قم برفع المستندات المطلوبة للمصادقة على حسابك</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      {profileData.documents.length > 0 ? (
        profileData.documents.map((document) => (
          <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{document.name}</p>
                <p className="text-sm text-muted-foreground">
                  تم الرفع: {new Date(document.uploadedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={
                  document.status === 'approved' ? 'default' : 
                  document.status === 'rejected' ? 'destructive' : 'secondary'
                }
              >
                {document.status === 'approved' ? 'موافق عليه' : 
                 document.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
              </Badge>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDocumentUpload(document.type)}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">لا توجد مستندات مرفوعة</p>
          <Button 
            className="mt-2" 
            onClick={() => handleDocumentUpload('license')}
          >
            <Upload className="h-4 w-4 mr-2" />
            رفع مستند
          </Button>
        </div>
      )}
    </div>
  </CardContent>
</Card>
```

### 2. حذف دالة `handleDocumentUpload`
```typescript
// تم حذف هذه الدالة بالكامل
const handleDocumentUpload = async (documentType: string) => {
  // In a real implementation, this would open a file upload dialog
  // and handle the file upload to the server
  try {
    // Create a mock file for demonstration
    const mockFile = new File([], `document-${documentType}.pdf`, { type: 'application/pdf' });
    
    // Upload the document
    const result = await ProfileApi.uploadDocument(user!.id, documentType, mockFile);
    
    toast({
      title: 'نجاح',
      description: 'تم رفع المستند بنجاح وقيد المراجعة'
    });
    
    // Reload profile data to show the new document
    // In a real implementation, you would update the state directly
  } catch (error) {
    toast({
      title: 'خطأ',
      description: 'حدث خطأ أثناء رفع المستند',
      variant: 'destructive'
    });
  }
};
```

### 3. حذف جلب بيانات المستندات
```typescript
// تم حذف هذا السطر
const documents = profile.role === 'driver' ? await ProfileApi.getUserDocuments(user.id) : [];
```

### 4. تبسيط إنشاء `DriverProfileData`
```typescript
// قبل التحديث
documents: documents.map(doc => ({
  id: doc.id,
  type: doc.type,
  name: doc.name,
  uploadedAt: doc.uploadedAt,
  status: doc.status,
  url: doc.url
}))

// بعد التحديث
documents: []
```

## النتيجة النهائية

### أقسام ملف الشخصي للسائق الآن:
1. **معلومات الشخصية**: الاسم، الهاتف، الصورة، حالة التحقق
2. **الإحصائيات**: إجمالي الرحلات، مقاعد محجوزة، التقييم، تاريخ الانضمام
3. **معلومات المركبة**: نوع المركبة، رقم المركبة، المركبات النشطة
4. **الرحلات الأخيرة**: آخر الرحلات التي قام بها السائق
5. **التقييمات والتعليقات**: تقييمات المستخدمين

### ما تم حذفه:
- ❌ **مستندات التحقق**: قسم كامل للمستندات والتحقق
- ❌ **دالة رفع المستندات**: `handleDocumentUpload`
- ❌ **جلب بيانات المستندات**: `ProfileApi.getUserDocuments`

## كيفية التحقق من الإصلاح

### 1. افتح ملف الشخصي للسائق
- اذهب إلى: http://localhost:5173/profile
- تأكد من أنك مسجل دخول كسائق

### 2. لاحظ الأقسام المعروضة
- يجب أن ترى 5 أقسام فقط
- يجب ألا ترى قسم "مستندات التحقق"

### 3. تحقق من التصميم
- يجب أن يكون التصميم نظيفاً ومنظماً
- يجب ألا توجد أزرار أو عناصر متعلقة بالمستندات

### 4. اختبر الوظائف الأخرى
- تأكد من عمل الإحصائيات
- تأكد من عرض معلومات المركبة
- تأكد من عرض الرحلات الأخيرة
- تأكد من عرض التقييمات

## ملاحظات مهمة

### 1. البيانات المحفوظة
```typescript
// واجهة DriverProfileData لا تزال تحتوي على documents
// لكن يتم تعيينها كمصفوفة فارغة
documents: []
```

### 2. الأداء
```typescript
// تحسن الأداء لأن:
// - لا يتم جلب بيانات المستندات
// - لا يتم عرض واجهة المستندات
// - لا توجد دوال غير مستخدمة
```

### 3. التوافق
```typescript
// التغيير متوافق مع جميع المتصفحات
// لا يؤثر على الوظائف الأخرى
// لا يؤثر على قاعدة البيانات
```

## الخطوات التالية

1. **تحقق من حذف قسم "مستندات التحقق"**
2. **تأكد من ظهور 5 أقسام فقط**
3. **تحقق من عمل جميع الوظائف الأخرى**
4. **تأكد من عدم وجود أخطاء في الكونسول**
5. **اختبر التصميم على شاشات مختلفة**

إذا كانت المشكلة لا تزال موجودة، أخبرني بما تراه!
