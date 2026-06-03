import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed boshlandi...')

  // ─── CATEGORIES ───────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'html' }, update: {}, create: { name: 'HTML', slug: 'html', group: 'FRONTEND', icon: 'html5' } }),
    prisma.category.upsert({ where: { slug: 'css' }, update: {}, create: { name: 'CSS', slug: 'css', group: 'FRONTEND', icon: 'css3' } }),
    prisma.category.upsert({ where: { slug: 'javascript' }, update: {}, create: { name: 'JavaScript', slug: 'javascript', group: 'FRONTEND', icon: 'javascript' } }),
    prisma.category.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript', slug: 'typescript', group: 'FRONTEND', icon: 'typescript' } }),
    prisma.category.upsert({ where: { slug: 'react' }, update: {}, create: { name: 'React', slug: 'react', group: 'FRONTEND', icon: 'react' } }),
    prisma.category.upsert({ where: { slug: 'nextjs' }, update: {}, create: { name: 'Next.js', slug: 'nextjs', group: 'FRONTEND', icon: 'nextjs' } }),
    prisma.category.upsert({ where: { slug: 'nodejs' }, update: {}, create: { name: 'Node.js', slug: 'nodejs', group: 'BACKEND', icon: 'nodejs' } }),
    prisma.category.upsert({ where: { slug: 'express' }, update: {}, create: { name: 'Express.js', slug: 'express', group: 'BACKEND', icon: 'express' } }),
    prisma.category.upsert({ where: { slug: 'databases' }, update: {}, create: { name: 'Databases', slug: 'databases', group: 'BACKEND', icon: 'database' } }),
    prisma.category.upsert({ where: { slug: 'git' }, update: {}, create: { name: 'Git & GitHub', slug: 'git', group: 'GENERAL', icon: 'git' } }),
    prisma.category.upsert({ where: { slug: 'oop' }, update: {}, create: { name: 'OOP', slug: 'oop', group: 'GENERAL', icon: 'oop' } }),
  ])

  console.log(`✅ ${categories.length} kategoriya yaratildi`)

  const jsCategory = categories.find((c) => c.slug === 'javascript')!
  const reactCategory = categories.find((c) => c.slug === 'react')!
  const nodeCategory = categories.find((c) => c.slug === 'nodejs')!

  // ─── QUESTIONS ────────────────────────────────────────────────────────────
  const questions = await Promise.all([
    // JS MCQ
    prisma.question.create({
      data: {
        categoryId: jsCategory.id,
        title: "JavaScript'da `===` va `==` operatorlari orasidagi farq nima?",
        type: 'SINGLE_CHOICE',
        difficulty: 'EASY',
        options: [
          { id: 'a', text: '=== faqat qiymatni, == esa qiymat va turni solishtirradi', isCorrect: false },
          { id: 'b', text: '=== qiymat va turni, == esa faqat qiymatni solishtirradi', isCorrect: true },
          { id: 'c', text: 'Ikkalasi ham bir xil ishlaydi', isCorrect: false },
          { id: 'd', text: '== faqat raqamlar uchun ishlatiladi', isCorrect: false },
        ],
        explanation: '=== (strict equality) ham qiymatni, ham tur (type)ni solishtiradi. == esa type coercion qiladi.',
        tags: ['operators', 'comparison', 'basics'],
      },
    }),
    prisma.question.create({
      data: {
        categoryId: jsCategory.id,
        title: "JavaScript'da `var`, `let`, va `const` orasidagi asosiy farqlar nima?",
        type: 'OPEN_ENDED',
        difficulty: 'MEDIUM',
        correctAnswer: "var - function scope, hoisting bo'ladi. let - block scope, reassign mumkin. const - block scope, reassign mumkin emas (lekin object/array ichini o'zgartirish mumkin).",
        explanation: 'ES6 da let va const qo\'shildi. var dan ko\'proq let/const ishlatish tavsiya qilinadi.',
        tags: ['variables', 'scope', 'es6'],
      },
    }),
    prisma.question.create({
      data: {
        categoryId: jsCategory.id,
        title: "Closure nima va qanday qo'llaniladi?",
        type: 'OPEN_ENDED',
        difficulty: 'MEDIUM',
        correctAnswer: "Closure - bu funktsiya o'z tashqi scope'idagi o'zgaruvchilarga kirish imkoniyatini saqlab qolishi. Data encapsulation, factory functions, event handlers'da keng qo'llaniladi.",
        tags: ['closure', 'scope', 'functions'],
      },
    }),
    prisma.question.create({
      data: {
        categoryId: jsCategory.id,
        title: "Promise va async/await qanday ishlaydi?",
        type: 'OPEN_ENDED',
        difficulty: 'MEDIUM',
        correctAnswer: "Promise - asinxron operatsiyaning kelajakdagi qiymatini ifodalaydi. async/await - Promise ustida syntax sugar, kodni sinxron ko'rinishda yozish imkonini beradi.",
        tags: ['async', 'promise', 'es6'],
      },
    }),

    // React
    prisma.question.create({
      data: {
        categoryId: reactCategory.id,
        title: "React'da `useState` hook qanday ishlaydi?",
        type: 'OPEN_ENDED',
        difficulty: 'EASY',
        correctAnswer: 'useState - functional component da state saqlash uchun ishlatiladi. Array destructuring orqali [state, setState] qaytaradi. setState chaqirilganda component qayta render qilinadi.',
        tags: ['hooks', 'useState', 'state'],
      },
    }),
    prisma.question.create({
      data: {
        categoryId: reactCategory.id,
        title: "React'da virtual DOM nima va nima uchun kerak?",
        type: 'SINGLE_CHOICE',
        difficulty: 'MEDIUM',
        options: [
          { id: 'a', text: 'Real DOM ning to\'liq nusxasi, har safar yangilanadi', isCorrect: false },
          { id: 'b', text: 'Real DOM ning yengil JavaScript obyekt ko\'rinishi, diffing uchun ishlatiladi', isCorrect: true },
          { id: 'c', text: 'Server side rendering uchun maxsus DOM', isCorrect: false },
          { id: 'd', text: 'CSS animatsiyalar uchun DOM', isCorrect: false },
        ],
        explanation: 'Virtual DOM - xotiradagi yengil DOM tasviri. React changes ni diffing orqali aniqlaydi va minimal real DOM operatsiyalarini bajaradi.',
        tags: ['virtual-dom', 'rendering', 'performance'],
      },
    }),

    // Node.js
    prisma.question.create({
      data: {
        categoryId: nodeCategory.id,
        title: "Node.js'da Event Loop qanday ishlaydi?",
        type: 'OPEN_ENDED',
        difficulty: 'HARD',
        correctAnswer: "Event Loop - Node.js'ning async operatsiyalarni boshqarish mexanizmi. Call stack, callback queue, microtask queue'lardan iborat. Call stack bo'sh bo'lganda callback queue'dan vazifalarni bajaradi.",
        tags: ['event-loop', 'async', 'nodejs-core'],
      },
    }),
    prisma.question.create({
      data: {
        categoryId: nodeCategory.id,
        title: "REST API va GraphQL orasidagi asosiy farqlar nima?",
        type: 'OPEN_ENDED',
        difficulty: 'MEDIUM',
        correctAnswer: 'REST - resurslarga asoslangan, multiple endpoints. GraphQL - bitta endpoint, client o\'zi kerakli fieldlarni tanlaydi. GraphQL over/under fetching muammosini hal qiladi.',
        tags: ['rest', 'graphql', 'api'],
      },
    }),
  ])

  console.log(`✅ ${questions.length} savol yaratildi`)

  // ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────
  await Promise.all([
    prisma.achievement.upsert({
      where: { slug: 'first-test' },
      update: {},
      create: { slug: 'first-test', title: 'Birinchi qadam', description: 'Birinchi testni yakunlading', icon: '🎯', conditionType: 'QUIZ_COUNT', conditionValue: 1 },
    }),
    prisma.achievement.upsert({
      where: { slug: '10-tests' },
      update: {},
      create: { slug: '10-tests', title: 'Izchil o\'quvchi', description: '10 ta testni yakunlading', icon: '🔥', conditionType: 'QUIZ_COUNT', conditionValue: 10 },
    }),
    prisma.achievement.upsert({
      where: { slug: '50-tests' },
      update: {},
      create: { slug: '50-tests', title: 'Pro darajasi', description: '50 ta testni yakunlading', icon: '💎', conditionType: 'QUIZ_COUNT', conditionValue: 50 },
    }),
    prisma.achievement.upsert({
      where: { slug: 'perfect-score' },
      update: {},
      create: { slug: 'perfect-score', title: 'Mukammal natija', description: '100% ball to\'pladingiz', icon: '⭐', conditionType: 'SCORE', conditionValue: 100 },
    }),
  ])

  console.log('✅ Achievementlar yaratildi')

  // ─── ROADMAP NODES ────────────────────────────────────────────────────────
  const frontendNodes = [
    { title: 'HTML Asoslari', orderIndex: 1, isMilestone: false, description: 'HTML elementlari, semantik HTML, formlar' },
    { title: 'CSS Asoslari', orderIndex: 2, isMilestone: false, description: 'Selectors, box model, flexbox, grid' },
    { title: 'JavaScript Asoslari', orderIndex: 3, isMilestone: true, description: 'Variables, functions, arrays, objects, DOM' },
    { title: 'ES6+ Xususiyatlar', orderIndex: 4, isMilestone: false, description: 'Arrow functions, destructuring, promises, async/await' },
    { title: 'React Asoslari', orderIndex: 5, isMilestone: true, description: 'Components, props, state, hooks' },
    { title: 'React Advanced', orderIndex: 6, isMilestone: false, description: 'Context, Redux, React Query, Router' },
    { title: 'TypeScript', orderIndex: 7, isMilestone: false, description: 'Types, interfaces, generics' },
    { title: 'Next.js', orderIndex: 8, isMilestone: true, description: 'SSR, SSG, App Router, API Routes' },
  ]

  for (const node of frontendNodes) {
    await prisma.roadmapNode.upsert({
      where: { id: `frontend-${node.orderIndex}` },
      update: {},
      create: { id: `frontend-${node.orderIndex}`, track: 'FRONTEND', ...node },
    })
  }

  const backendNodes = [
    { title: 'Node.js Asoslari', orderIndex: 1, isMilestone: false, description: 'Modules, fs, path, http' },
    { title: 'Express.js', orderIndex: 2, isMilestone: true, description: 'Routes, middleware, error handling' },
    { title: 'REST API Dizayn', orderIndex: 3, isMilestone: false, description: 'HTTP methods, status codes, CRUD' },
    { title: 'Ma\'lumotlar Bazasi', orderIndex: 4, isMilestone: true, description: 'PostgreSQL, MongoDB asoslari' },
    { title: 'ORM / ODM', orderIndex: 5, isMilestone: false, description: 'Prisma, Mongoose' },
    { title: 'Authentication', orderIndex: 6, isMilestone: true, description: 'JWT, OAuth, bcrypt' },
    { title: 'API Security', orderIndex: 7, isMilestone: false, description: 'CORS, rate limiting, helmet' },
    { title: 'Deployment', orderIndex: 8, isMilestone: true, description: 'Docker, CI/CD, cloud platforms' },
  ]

  for (const node of backendNodes) {
    await prisma.roadmapNode.upsert({
      where: { id: `backend-${node.orderIndex}` },
      update: {},
      create: { id: `backend-${node.orderIndex}`, track: 'BACKEND', ...node },
    })
  }

  console.log('✅ Roadmap nodelari yaratildi')

  // ─── ADMIN USER ───────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin123!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@devprep.ai' },
    update: {},
    create: {
      email: 'admin@devprep.ai',
      passwordHash: adminPassword,
      fullName: 'DevPrep Admin',
      role: 'ADMIN',
      isVerified: true,
    },
  })

  console.log('✅ Admin yaratildi: admin@devprep.ai / Admin123!')

  // ─── SAMPLE QUIZ ──────────────────────────────────────────────────────────
  const mcqQuestions = await prisma.question.findMany({
    where: { type: { in: ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'] }, isActive: true },
    take: 5,
  })

  if (mcqQuestions.length > 0) {
    await prisma.quiz.upsert({
      where: { id: 'sample-js-quiz' },
      update: {},
      create: {
        id: 'sample-js-quiz',
        title: 'JavaScript Boshlang\'ich Test',
        description: 'JavaScript asosiy tushunchalarni tekshirish',
        type: 'FRONTEND',
        difficulty: 'EASY',
        timeLimit: 600,
        questionCount: mcqQuestions.length,
        questions: {
          create: mcqQuestions.map((q, idx) => ({ questionId: q.id, orderIndex: idx })),
        },
      },
    })
    console.log('✅ Sample quiz yaratildi')
  }

  console.log('\n🎉 Seed muvaffaqiyatli yakunlandi!')
}

main()
  .catch((e) => {
    console.error('❌ Seed xatosi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
