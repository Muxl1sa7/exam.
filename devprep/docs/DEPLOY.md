# 🚀 DevPrep AI — Deploy Qo'llanma

## Kerakli servislar (barchasi bepul)

| Servis | Maqsad | Link |
|--------|--------|------|
| GitHub | Kod saqlash | github.com |
| Neon | PostgreSQL | neon.tech |
| Render | Backend hosting | render.com |
| Vercel | Frontend hosting | vercel.com |
| Gmail | Email yuborish | mail.google.com |
| Anthropic | Claude AI | console.anthropic.com |

---

## QADAM 1: Neon PostgreSQL

1. [neon.tech](https://neon.tech) ga kiring → "Create Project"
2. Project name: `devprep`
3. Region: `US East` yoki `EU Central`
4. **Connection string** ni nusxa oling:
   ```
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Bu `DATABASE_URL` va `DIRECT_URL` uchun ishlatiladi

---

## QADAM 2: Anthropic API Key

1. [console.anthropic.com](https://console.anthropic.com) ga kiring
2. API Keys → "Create Key"
3. Nusxa oling: `sk-ant-api03-...`

---

## QADAM 3: Gmail App Password

1. Google account → Security → 2-Step Verification (yoqing)
2. Security → App passwords → "Mail" → "Other device: DevPrep"
3. 16 belgili parolni nusxa oling

---

## QADAM 4: GitHub

```bash
cd devprep
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/devprep-ai.git
git push -u origin main
```

---

## QADAM 5: Render (Backend)

1. [render.com](https://render.com) → "New Web Service"
2. GitHub repo → `devprep-ai`
3. Sozlamalar:
   - **Name:** `devprep-api`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm start`
4. Environment Variables qo'shing:

```env
DATABASE_URL        = postgresql://...neon.tech/neondb?sslmode=require
DIRECT_URL          = postgresql://...neon.tech/neondb?sslmode=require
JWT_SECRET          = (64 ta random belgi)
JWT_REFRESH_SECRET  = (64 ta random belgi)
SMTP_USER           = yourgmail@gmail.com
SMTP_PASS           = (Gmail app password)
ANTHROPIC_API_KEY   = sk-ant-api03-...
CLIENT_URL          = https://devprep.vercel.app
NODE_ENV            = production
```

5. "Create Web Service" → Deploy tugaydi
6. URL ni nusxa oling: `https://devprep-api.onrender.com`

---

## QADAM 6: Vercel (Frontend)

### Usul A — CLI orqali:
```bash
cd client
npm i -g vercel
vercel login
vercel --prod
```

### Usul B — Dashboard:
1. [vercel.com](https://vercel.com) → "Add New Project"
2. GitHub repo import → `devprep-ai`
3. Sozlamalar:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Environment Variables:
   ```
   VITE_API_URL = https://devprep-api.onrender.com/api/v1
   ```
5. "Deploy" → URL oling: `https://devprep.vercel.app`

---

## QADAM 7: Database Seed

Render deploy bo'lgandan keyin:

```bash
# Local dan seed yuborish
cd server
DATABASE_URL="postgresql://...neon.tech/..." npm run db:seed
```

Yoki Render shell orqali:
1. Render → Service → "Shell"
2. `npm run db:seed`

**Admin login:** `admin@devprep.ai` / `Admin123!`

---

## QADAM 8: CORS yangilash

`server/src/app.ts` da `CLIENT_URL` to'g'ri o'rnatilganini tekshiring:
```
CLIENT_URL = https://devprep.vercel.app
```

---

## ✅ Tekshirish ro'yxati

- [ ] Neon DB ishlayapti
- [ ] Render backend `https://devprep-api.onrender.com/health` → `{"status":"ok"}`
- [ ] Vercel frontend ochiladi
- [ ] Register qilish ishlaydi
- [ ] Email verification keladi
- [ ] Login ishlaydi
- [ ] Quiz ishlaydi
- [ ] AI Interview ishlaydi

---

## 🔧 Muammo va yechimlar

| Muammo | Yechim |
|--------|--------|
| CORS error | `CLIENT_URL` env var to'g'ri o'rnatilganmi? |
| DB connection | `DATABASE_URL` `?sslmode=require` bilan tugayapti? |
| Email kelmaydi | Gmail App Password to'g'rimi? Spam tekshiring |
| AI ishlamaydi | `ANTHROPIC_API_KEY` to'g'rimi? Balans bormi? |
| Render cold start | Bepul tier 50s uxlaydi. Har safar uyg'onadi |

---

## 💰 Narxlar

| Servis | Bepul limit | Pro |
|--------|-------------|-----|
| Neon | 0.5GB, 1 project | $19/oy |
| Render | 750h/oy, uxlaydi | $7/oy |
| Vercel | Unlimited hobby | $20/oy |
| Anthropic | $5 kredit | Pay-as-you-go |
