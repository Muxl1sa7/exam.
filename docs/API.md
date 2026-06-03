# 📡 API Hujjatlar

Base URL: `https://devprep-api.onrender.com/api/v1`
Local URL: `http://localhost:5000/api/v1`

## Autentifikatsiya

Barcha himoyalangan endpointlar uchun header:
```
Authorization: Bearer <accessToken>
```

---

## 🔐 Auth

### POST /auth/register
```json
// Request
{
  "email": "user@example.com",
  "password": "Password1",
  "fullName": "Sardor Rahimov",
  "track": "FRONTEND"
}

// Response 201
{
  "success": true,
  "message": "Ro'yxatdan o'tdingiz! Email manzilingizni tasdiqlang.",
  "data": { "user": {...} }
}
```

### POST /auth/login
```json
// Request
{ "email": "user@example.com", "password": "Password1" }

// Response 200
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci...",
    "user": { "id": "uuid", "email": "...", "fullName": "...", "role": "USER" }
  }
}
```

### POST /auth/refresh
```
// Cookie: refreshToken=xxx  (avtomatik yuboriladi)
// Response: { "data": { "accessToken": "..." } }
```

### GET /auth/verify-email?token=xxx
```json
// Response 200
{ "success": true, "message": "Email muvaffaqiyatli tasdiqlandi" }
```

### POST /auth/forgot-password
```json
{ "email": "user@example.com" }
```

### POST /auth/reset-password
```json
{ "token": "resettoken", "password": "NewPassword1" }
```

### GET /auth/me  🔒
```json
// Response
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "Sardor",
    "role": "USER",
    "track": "FRONTEND",
    "streakCount": 5,
    "_count": { "quizResults": 12, "bookmarks": 8, "aiSessions": 3 }
  }
}
```

---

## 📚 Questions

### GET /questions  🔒
Query params: `page`, `limit`, `categoryId`, `difficulty`, `type`, `search`

```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "title": "JavaScript'da closure nima?",
      "type": "OPEN_ENDED",
      "difficulty": "MEDIUM",
      "category": { "name": "JavaScript", "group": "FRONTEND" },
      "isBookmarked": false,
      "tags": ["closure", "scope"]
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
}
```

### GET /questions/categories  🔒
```json
{
  "data": [
    { "id": "uuid", "name": "JavaScript", "slug": "javascript", "group": "FRONTEND", "questionCount": 25 }
  ]
}
```

### POST /questions/:id/bookmark  🔒
```json
{ "data": { "bookmarked": true } }
```

---

## 📝 Quizzes

### GET /quizzes  🔒
Query: `type` (FRONTEND|BACKEND|FULLSTACK), `difficulty`

### POST /quizzes/:id/start  🔒
```json
// Response — correctAnswer yo'q (xavfsizlik)
{
  "data": {
    "id": "uuid",
    "title": "JavaScript Boshlang'ich",
    "timeLimit": 600,
    "questions": [
      {
        "id": "uuid",
        "title": "=== va == farqi?",
        "type": "SINGLE_CHOICE",
        "options": [
          { "id": "a", "text": "Birinchi variant" },
          { "id": "b", "text": "Ikkinchi variant" }
        ]
      }
    ]
  }
}
```

### POST /quizzes/:id/submit  🔒
```json
// Request
{
  "answers": [
    { "questionId": "uuid", "selectedOptionId": "b" },
    { "questionId": "uuid2", "textAnswer": "Ochiq savol javobi" }
  ],
  "timeSpent": 245
}

// Response
{
  "data": {
    "id": "result-uuid",
    "score": 4,
    "total": 5,
    "percentage": 80,
    "detailedAnswers": [
      {
        "questionId": "uuid",
        "isCorrect": true,
        "correctOptionId": "b",
        "explanation": "..."
      }
    ]
  }
}
```

### GET /quizzes/leaderboard  🔒
```json
{
  "data": [
    {
      "rank": 1,
      "user": { "fullName": "Sardor", "track": "FRONTEND" },
      "avgScore": 92,
      "totalQuizzes": 24,
      "bestScore": 100
    }
  ]
}
```

---

## 🤖 AI

### POST /ai/evaluate  🔒
```json
// Request
{
  "questionText": "JavaScript'da closure nima?",
  "userAnswer": "Closure bu...",
  "category": "JavaScript"
}

// Response
{
  "data": {
    "sessionId": "uuid",
    "score": 7,
    "feedback": "Javob asosan to'g'ri, lekin...",
    "idealAnswer": "Closure — bu funktsiya o'z...",
    "mistakes": ["Practical misollar keltirmadingiz"],
    "keyPoints": ["Lexical scope", "Data encapsulation", "Factory functions"],
    "resources": [
      { "title": "MDN: Closures", "url": "https://developer.mozilla.org/...", "type": "docs" }
    ]
  }
}
```

### POST /ai/mock-interview/start  🔒
```json
// Request
{ "track": "FRONTEND", "count": 5 }

// Response
{ "data": [{ "id": "uuid", "title": "...", "difficulty": "MEDIUM", "category": {...} }] }
```

---

## 📊 Dashboard

### GET /dashboard/stats  🔒
```json
{
  "data": {
    "totalTests": 15,
    "avgScore": 74,
    "readinessScore": 68,
    "streakCount": 3,
    "aiSessionsCount": 7,
    "bookmarkCount": 12,
    "achievementsCount": 3,
    "roadmapCompleted": 8,
    "weeklyActivity": [
      { "date": "2024-01-01", "day": "Du", "score": 80, "tests": 2 }
    ],
    "track": "FRONTEND"
  }
}
```

### GET /dashboard/roadmap/:track  🔒
Track: `frontend` | `backend` | `fullstack`

```json
{
  "data": [
    {
      "id": "frontend-1",
      "title": "HTML Asoslari",
      "orderIndex": 1,
      "isMilestone": false,
      "isCompleted": true,
      "completedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

## 👑 Admin (ADMIN role kerak)

### GET /admin/analytics
```json
{
  "data": {
    "totalUsers": 150,
    "totalQuestions": 320,
    "totalQuizzes": 18,
    "totalResults": 890,
    "avgScore": 71
  }
}
```

### POST /admin/questions
```json
{
  "categoryId": "uuid",
  "title": "Savol matni",
  "type": "SINGLE_CHOICE",
  "difficulty": "MEDIUM",
  "options": [
    { "id": "a", "text": "Variant A", "isCorrect": false },
    { "id": "b", "text": "Variant B", "isCorrect": true }
  ],
  "explanation": "Tushuntirish...",
  "tags": ["js", "async"]
}
```

### POST /admin/quizzes
```json
{
  "title": "Quiz nomi",
  "type": "FRONTEND",
  "difficulty": "EASY",
  "timeLimit": 600,
  "questionIds": ["uuid1", "uuid2", "uuid3"]
}
```

---

## Response Format

**Muvaffaqiyatli:**
```json
{ "success": true, "message": "...", "data": {...} }
```

**Xato:**
```json
{ "success": false, "message": "Xato xabari", "errors": null }
```

**Paginated:**
```json
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
}
```

## HTTP Status Codes

| Kod | Ma'no |
|-----|-------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation) |
| 401 | Unauthorized (token yo'q/muddati o'tgan) |
| 403 | Forbidden (ruxsat yo'q) |
| 404 | Not Found |
| 409 | Conflict (email band) |
| 429 | Too Many Requests |
| 500 | Server Error |
