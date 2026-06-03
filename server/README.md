# DevPrep AI — Backend Server

## 🚀 Ishga tushirish

### 1. O'rnatish
```bash
cd server
npm install
```

### 2. Environment sozlash
```bash
cp .env.example .env
# .env faylini to'ldiring
```

### 3. Database migratsiya
```bash
npx prisma db push        # Development
npx prisma migrate dev    # Production migration yaratish
```

### 4. Seed (boshlang'ich ma'lumotlar)
```bash
npm run db:seed
```
**Admin hisob:** `admin@devprep.ai` / `Admin123!`

### 5. Serverni ishga tushirish
```bash
npm run dev    # Development
npm run build && npm start  # Production
```

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Ro'yxatdan o'tish |
| POST | /auth/login | Kirish |
| POST | /auth/logout | Chiqish |
| POST | /auth/refresh | Token yangilash |
| GET | /auth/verify-email?token= | Email tasdiqlash |
| POST | /auth/forgot-password | Parol tiklash so'rovi |
| POST | /auth/reset-password | Parolni yangilash |
| GET | /auth/me | Profil olish |
| PUT | /auth/profile | Profilni yangilash |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /questions | Savollar ro'yxati |
| GET | /questions/categories | Kategoriyalar |
| GET | /questions/bookmarks | Saqlangan savollar |
| GET | /questions/:id | Bitta savol |
| POST | /questions/:id/bookmark | Saqlash/o'chirish |

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /quizzes | Quizlar ro'yxati |
| POST | /quizzes/:id/start | Quizni boshlash |
| POST | /quizzes/:id/submit | Javoblarni yuborish |
| GET | /quizzes/results/my | Mening natijalarim |
| GET | /quizzes/leaderboard | Liderlar jadvali |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /ai/evaluate | Javobni baholash |
| POST | /ai/mock-interview/start | Mock interview savollar |
| GET | /ai/sessions | AI sessiyalar tarixi |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard/stats | Dashboard statistika |
| GET | /dashboard/roadmap/:track | Roadmap noder |
| POST | /dashboard/roadmap/:nodeId/complete | Node tugatish |
| GET | /dashboard/notifications | Bildirishnomalar |
| GET | /dashboard/achievements | Badgelar |

---

## 🏗️ Papka tuzilmasi

```
server/
├── src/
│   ├── config/          # DB, Email, Env config
│   ├── middleware/      # Auth, Admin, Validate
│   ├── modules/
│   │   ├── auth/        # Register/Login/JWT
│   │   ├── questions/   # Question Bank
│   │   ├── quizzes/     # Quiz System
│   │   ├── ai/          # AI Evaluation
│   │   ├── dashboard/   # Stats/Roadmap
│   │   └── admin/       # Admin Panel
│   ├── utils/           # JWT, Password, Response
│   ├── types/           # TypeScript types
│   ├── app.ts           # Express app
│   └── server.ts        # Entry point
├── prisma/
│   ├── schema.prisma    # DB schema
│   └── seed.ts          # Seed data
├── .env.example
├── render.yaml
└── package.json
```

## 🔧 Texnologiyalar
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Email:** Nodemailer
- **AI:** Anthropic Claude API
- **Validation:** Zod
- **Deploy:** Render
