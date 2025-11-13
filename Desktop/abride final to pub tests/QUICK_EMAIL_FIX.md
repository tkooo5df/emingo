# ⚡ حل سريع: البريد الإلكتروني لا يصل للراكب

## المشكلة
البريد الإلكتروني لا يصل للراكب عند تأكيد السائق للحجز.

## الحل السريع (5 دقائق)

### الخطوة 1: نشر Edge Function

```bash
# تأكد من تثبيت Supabase CLI
npm install -g supabase

# سجل الدخول
supabase login

# اربط المشروع
supabase link --project-ref kobsavfggcnfemdzsnpj

# انشر Edge Function
supabase functions deploy send-email
```

### الخطوة 2: إعداد Secrets

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj)
2. **Settings** → **Edge Functions** → **Secrets**
3. أضف Secret:

**للحصول على Resend API Key (مجاني):**
1. سجّل في [Resend.com](https://resend.com)
2. أنشئ API Key
3. أضفه في Supabase:

```
Name: RESEND_API_KEY
Value: re_xxxxxxxxxxxxx
```

### الخطوة 3: التحقق

1. افتح Console في المتصفح
2. أكد حجز كسائق
3. يجب أن ترى:
   ```
   📧 Edge Function response status: 200 OK
   ✅ Email notification sent successfully
   ```

## إذا لم يعمل

### تحقق من:
1. ✅ Edge Function منشور: Supabase Dashboard → Edge Functions → send-email
2. ✅ Secret موجود: Settings → Edge Functions → Secrets → RESEND_API_KEY
3. ✅ البريد الإلكتروني موجود: تحقق من أن الراكب لديه email في profiles
4. ✅ Console لا تظهر أخطاء: افتح Developer Tools → Console

### الأخطاء الشائعة:

**404 Not Found:**
- Edge Function غير منشور → انشره باستخدام `supabase functions deploy send-email`

**401 Unauthorized:**
- API Key غير صحيح → تحقق من RESEND_API_KEY في Secrets

**500 Internal Server Error:**
- راجع سجلات Edge Function: Supabase Dashboard → Edge Functions → send-email → Logs

## للتفاصيل الكاملة

راجع: **`DEPLOY_EMAIL_FUNCTION.md`**

