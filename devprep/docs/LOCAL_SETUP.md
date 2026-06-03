# 💻 Lokal Muhitda Ishga Tushirish

## Kerakli dasturlar

```bash
node --version    # v18+ bo'lishi kerak (v20 tavsiya)
npm --version     # v9+
git --version
```

Node.js yo'q bo'lsa: [nodejs.org](https://nodejs.org) → LTS versiyani yuklab oling

---

## 1. Loyihani yuklab olish

```bash
git clone https://github.com/USERNAME/devprep-ai.git
cd devprep-ai
```

---

## 2. Backend sozlash

```bash
cd server
npm install
```

`.env` fayl yaratish:
```bash
cp .env.example .env
```

`.env` ni oching va to'ldiring:

```env
# Database — Neon yoki lokal PostgreSQL
DATABASE_URL="postgresql://user:pass@host/devprep?sslmode=require"
DIRECT_URL="postgresql://user:pass@host/devprep?sslmode=require"

# JWT — random 64 ta belgi
JWT_SECRET="abc123...64chars"
JWT_REFRESH_SECRET="xyz789...64chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Email — Gmail
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="youremail@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="DevPrep AI <noreply@devprep.ai>"

# AI
ANTHROPIC_API_KEY="sk-ant-api03-..."

# App
PORT=5000
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"
```

**Lokal PostgreSQL ishlatmoqchi bo'lsangiz:**
```bash
# PostgreSQL o'rnatilgan bo'lsa
createdb devprep
DATABASE_URL="postgresql://localhost/devprep"
```

---

## 3. Database migratsiya + seed

```bash
# Schema yaratish
npx prisma db push

# Boshlang'ich ma'lumotlar (kategoriyalar, savollar, admin)
npm run db:seed

# Prisma Studio (opsional — ma'lumotlarni ko'rish)
npm run db:studio
```

---

## 4. Backend ishga tushirish

```bash
npm run dev
```

```
🚀 DevPrep AI Server ishga tushdi!
   Port:     5000
   Mode:     development
   API:      http://localhost:5000/api/v1
   Health:   http://localhost:5000/health
```

---

## 5. Frontend sozlash

Yangi terminal oching:

```bash
cd client
npm install
```

`.env` fayl:
```bash
cp .env.example .env
```

`.env` ichida:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 6. Frontend ishga tushirish

```bash
npm run dev
```

```
  VITE v5.x.x  ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 7. Test qilish

| URL | Nima |
|-----|------|
| http://localhost:5173 | Frontend app |
| http://localhost:5000/health | Backend health |
| http://localhost:5000/api/v1/auth/me | API test |
| http://localhost:5555 | Prisma Studio |

**Test hisobi:**
- Email: `admin@devprep.ai`
- Parol: `Admin123!`

---

## Foydali buyruqlar

```bash
# Prisma
npx prisma db push          # Schema yangilash
npx prisma migrate dev       # Migration yaratish
npx prisma studio            # DB GUI
npx prisma generate          # Client qayta generate

# Backend
npm run dev                  # Dev server (hot reload)
npm run build                # TypeScript build
npm start                    # Production

# Frontend
npm run dev                  # Dev server
npm run build                # Production build
npm run preview              # Build preview
```

---

## Muammo hal qilish

**"Cannot connect to database"**
```bash
# Connection string to'g'riligini tekshiring
npx prisma db pull
```

**"Module not found"**
```bash
npm install
npx prisma generate
```

**Email kelmaydi (development'da)**
- `.env` da `NODE_ENV=development` bo'lsa email yuboriladi lekin console'ga ham log bo'ladi
- Spam papkasini tekshiring

**Port band**
```bash
# 5000 portni bo'shatish
kill $(lsof -t -i:5000)
```
