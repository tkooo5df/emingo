# 🔑 Resend API - الاستخدام في الكود

## 📋 معلومات API Key

**API Key:**
```
re_RqXhGuKv_H8UTTvUr6GjooHqMTHtUhVfF
```

## 📍 مكان تخزين API Key

**⚠️ مهم:** API Key لا يجب أن يكون في الكود مباشرة! يجب تخزينه في **Supabase Secrets**.

### إضافة API Key إلى Supabase Secrets:

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj/settings/functions)
2. اختر **Settings** → **Edge Functions** → **Secrets**
3. انقر **Add a new secret**
4. املأ:
   ```
   Name: RESEND_API_KEY
   Value: re_RqXhGuKv_H8UTTvUr6GjooHqMTHtUhVfF
   ```
5. انقر **Save**

## 💻 استخدام Resend API في الكود

### 1. في Edge Function (`supabase/functions/send-email/index.ts`):

```typescript
// جلب API Key من Environment Variables (Supabase Secrets)
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

if (RESEND_API_KEY) {
  console.log('📧 Using Resend API');
  
  // إرسال البريد عبر Resend API
  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'أبريد <noreply@abride.online>',
      to: [to],
      subject: subject,
      html: html || text,
      text: text || (html ? html.replace(/<[^>]*>/g, '') : ''),
    }),
  });

  if (resendResponse.ok) {
    const result = await resendResponse.json();
    console.log('✅ Email sent via Resend successfully');
    return result;
  }
}
```

### 2. تفاصيل API Call:

**Endpoint:**
```
POST https://api.resend.com/emails
```

**Headers:**
```json
{
  "Authorization": "Bearer re_RqXhGuKv_H8UTTvUr6GjooHqMTHtUhVfF",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "from": "أبريد <noreply@abride.online>",
  "to": ["user@example.com"],
  "subject": "Subject here",
  "html": "<h1>HTML content</h1>",
  "text": "Plain text content"
}
```

### 3. Response:

**Success (200):**
```json
{
  "id": "email-id",
  "from": "أبريد <noreply@abride.online>",
  "to": ["user@example.com"],
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Error (401/403):**
```json
{
  "message": "Invalid API key"
}
```

**Error (422):**
```json
{
  "message": "Validation error",
  "errors": [...]
}
```

## 🔧 التكوين الكامل

### في Supabase Dashboard:

1. **Edge Functions → Secrets:**
   - `RESEND_API_KEY` = `re_RqXhGuKv_H8UTTvUr6GjooHqMTHtUhVfF`

2. **Resend Dashboard:**
   - Domain: `abride.online`
   - From Email: `noreply@abride.online`
   - API Key: `re_RqXhGuKv_H8UTTvUr6GjooHqMTHtUhVfF`

### في الكود:

**File: `supabase/functions/send-email/index.ts`**

```typescript
// جلب API Key من Environment
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

// استخدام API Key
const resendResponse = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'أبريد <noreply@abride.online>',
    to: [to],
    subject: subject,
    html: html || text,
  }),
});
```

## 📝 ملاحظات مهمة

1. **لا تضف API Key في الكود مباشرة** - استخدم Supabase Secrets
2. **API Key حساس** - لا تشاركه علناً
3. **تحقق من Domain** - تأكد من أن `abride.online` مفعّل في Resend
4. **Rate Limits** - Resend له حدود على عدد الرسائل (100 يومياً في الخطة المجانية)

## 🔗 روابط مفيدة

- [Resend API Documentation](https://resend.com/docs/api-reference/emails/send-email)
- [Resend Dashboard](https://resend.com/dashboard)
- [Supabase Secrets](https://supabase.com/dashboard/project/kobsavfggcnfemdzsnpj/settings/functions)

## ✅ Checklist

- [ ] API Key موجود في Supabase Secrets
- [ ] Domain `abride.online` مفعّل في Resend
- [ ] Edge Function منشور ومُحدّث
- [ ] تم اختبار إرسال البريد
- [ ] البريد يصل بنجاح

