# 🚀 DevPrep AI

> IT kurslarini bitirganlar uchun professional interview tayyorgarlik platformasi

![Stack](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=nodedotjs)
![Stack](https://img.shields.io/badge/PostgreSQL-Neon-4169e1?style=flat-square&logo=postgresql)
![Stack](https://img.shields.io/badge/AI-Claude-7c3aed?style=flat-square)

---

## 🗂️ Loyiha tuzilmasi

```
devprep/
├── client/          → React + TypeScript + Tailwind (Vercel)
├── server/          → Node.js + Express + Prisma (Render)
└── docs/            → Qo'shimcha hujjatlar
```

---

## ⚡ Tezkor ishga tushirish

### 1. Repositoriyani clone qiling
```bash
git clone https://github.com/yourusername/devprep-ai.git
cd devprep-ai
```

### 2. Backend sozlash
```bash
cd server
npm install
cp .env.example .env
# .env faylini o'zingiznikiga moslab to'ldiring
```

### 3. Database sozlash (Neon)
1. [neon.tech](https://neon.tech) da bepul hisob oching
2. Yangi project yarating: `devprep`
3. Connection string ni `.env` ga qo'ying

```bash
npx prisma db push      # Schema yuklash
npm run db:seed         # Boshlang'ich ma'lumotlar
```

### 4. Frontend sozlash
```bash
cd ../client
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api/v1
```

### 5. Ishga tushirish
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

**App:** http://localhost:5173
**API:** http://localhost:5000/api/v1
**Admin:** admin@devprep.ai / Admin123!

---

## 🌐 Deploy

### Vercel (Frontend)
```bash
cd client
npm i -g vercel
vercel --prod
```
Environment: `VITE_API_URL=https://your-api.onrender.com/api/v1`

### Render (Backend)
1. GitHub ga push qiling
2. Render.com → New Web Service
3. Root Directory: `server`
4. Environment variables qo'shing
5. `render.yaml` avtomatik konfiguratsiya qiladi

---

## 🏗️ Arxitektura

```
┌─────────────────┐     HTTPS      ┌──────────────────┐
│   React Client  │ ─────────────► │  Express Server  │
│   (Vercel)      │                │   (Render)       │
└─────────────────┘                └────────┬─────────┘
                                            │ Prisma ORM
                                   ┌────────▼─────────┐
                                   │  Neon PostgreSQL  │
                                   └──────────────────┘
                                            │
                                   ┌────────▼─────────┐
                                   │  Anthropic API   │
                                   │  (Claude AI)     │
                                   └──────────────────┘
```

---

## 📋 Xususiyatlar

| Modul | Xususiyat |
|-------|-----------|
| 🔐 Auth | Register, Login, JWT, Email verify, Reset password |
| 📊 Dashboard | Stats, Charts (Recharts), Readiness score, Streak |
| 📚 Question Bank | 3 kategoriya, Filter, Search, Bookmark |
| 📝 Quiz | Timer, MCQ, Submit, Result, Leaderboard |
| 🤖 AI Interview | Claude API, Score 1-10, Feedback, Ideal answer |
| 🗺️ Roadmap | Frontend/Backend/Fullstack, Progress tracking |
| 🏅 Achievements | Badge system, Notifications |
| 👑 Admin Panel | Questions/Quizzes/Users CRUD, Analytics |

---

## 🔧 Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS, React Router 6, React Query, Zustand, Recharts, Lucide Icons

**Backend:** Node.js 20, Express.js, Prisma ORM, JWT + bcrypt, Nodemailer, Zod, Anthropic SDK

**Database:** PostgreSQL (Neon serverless)

**Deploy:** Vercel + Render + Neon
