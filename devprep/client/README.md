# DevPrep AI — Frontend

## Ishga tushirish

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## Build

```bash
npm run build
```

## Vercel deploy

vercel.json allaqachon mavjud. Vercel dashboard'da:
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `client`

## Sahifalar

| Route | Sahifa |
|-------|--------|
| /login | Login |
| /register | Ro'yxatdan o'tish |
| /dashboard | Dashboard (charts, stats) |
| /questions | Question Bank |
| /quizzes | Quiz ro'yxati |
| /quizzes/:id/session | Quiz sessiya + timer |
| /quizzes/results/:id | Quiz natija |
| /ai-interview | AI Interview |
| /roadmap | Roadmap |
| /leaderboard | Liderlar |
| /achievements | Badgelar |
| /profile | Profil |
| /admin/* | Admin panel |
