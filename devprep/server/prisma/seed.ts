/// <reference types="node" />
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed boshlandi...')

  // ─── CATEGORIES ───────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'html' },       update: {}, create: { name: 'HTML',        slug: 'html',       group: 'FRONTEND', icon: 'html5'      } }),
    prisma.category.upsert({ where: { slug: 'css' },        update: {}, create: { name: 'CSS',         slug: 'css',        group: 'FRONTEND', icon: 'css3'       } }),
    prisma.category.upsert({ where: { slug: 'javascript' }, update: {}, create: { name: 'JavaScript',  slug: 'javascript', group: 'FRONTEND', icon: 'javascript' } }),
    prisma.category.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript',  slug: 'typescript', group: 'FRONTEND', icon: 'typescript' } }),
    prisma.category.upsert({ where: { slug: 'react' },      update: {}, create: { name: 'React',       slug: 'react',      group: 'FRONTEND', icon: 'react'      } }),
    prisma.category.upsert({ where: { slug: 'nextjs' },     update: {}, create: { name: 'Next.js',     slug: 'nextjs',     group: 'FRONTEND', icon: 'nextjs'     } }),
    prisma.category.upsert({ where: { slug: 'nodejs' },     update: {}, create: { name: 'Node.js',     slug: 'nodejs',     group: 'BACKEND',  icon: 'nodejs'     } }),
    prisma.category.upsert({ where: { slug: 'express' },    update: {}, create: { name: 'Express.js',  slug: 'express',    group: 'BACKEND',  icon: 'express'    } }),
    prisma.category.upsert({ where: { slug: 'databases' },  update: {}, create: { name: 'Databases',   slug: 'databases',  group: 'BACKEND',  icon: 'database'   } }),
    prisma.category.upsert({ where: { slug: 'git' },        update: {}, create: { name: 'Git & GitHub',slug: 'git',        group: 'GENERAL',  icon: 'git'        } }),
    prisma.category.upsert({ where: { slug: 'oop' },        update: {}, create: { name: 'OOP',         slug: 'oop',        group: 'GENERAL',  icon: 'oop'        } }),
  ])

  console.log(`✅ ${categories.length} kategoriya yaratildi`)

  const cat = Object.fromEntries(categories.map((c) => [c.slug, c]))

  // ─── QUESTIONS ────────────────────────────────────────────────────────────
  const questionDefs = [
    // ── JavaScript ─────────────────────────────────────────────────────────
    {
      id: 'q-js-001',
      categoryId: cat['javascript'].id,
      title: "JavaScript'da `===` va `==` operatorlari orasidagi farq nima?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: '=== faqat qiymatni, == esa qiymat va turni solishtiradi', isCorrect: false },
        { id: 'b', text: '=== qiymat va turni, == esa faqat qiymatni solishtiradi', isCorrect: true },
        { id: 'c', text: 'Ikkalasi ham bir xil ishlaydi', isCorrect: false },
        { id: 'd', text: '== faqat raqamlar uchun ishlatiladi', isCorrect: false },
      ],
      explanation: '=== (strict equality) ham qiymatni, ham tur (type)ni solishtiradi. == esa type coercion qiladi.',
      tags: ['operators', 'comparison', 'basics'],
    },
    {
      id: 'q-js-002',
      categoryId: cat['javascript'].id,
      title: "JavaScript'da `var`, `let`, va `const` orasidagi asosiy farqlar nima?",
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "var - function scope, hoisting bo'ladi. let - block scope, reassign mumkin. const - block scope, reassign mumkin emas.",
      tags: ['variables', 'scope', 'es6'],
    },
    {
      id: 'q-js-003',
      categoryId: cat['javascript'].id,
      title: "Closure nima va qanday qo'llaniladi?",
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "Closure - funktsiya o'z tashqi scope'idagi o'zgaruvchilarga kirish imkoniyatini saqlab qolishi. Data encapsulation, factory functions, event handlers'da keng qo'llaniladi.",
      tags: ['closure', 'scope', 'functions'],
    },
    {
      id: 'q-js-004',
      categoryId: cat['javascript'].id,
      title: 'Promise va async/await qanday ishlaydi?',
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "Promise - asinxron operatsiyaning kelajakdagi qiymatini ifodalaydi. async/await - Promise ustida syntax sugar, kodni sinxron ko'rinishda yozish imkonini beradi.",
      tags: ['async', 'promise', 'es6'],
    },
    {
      id: 'q-js-005',
      categoryId: cat['javascript'].id,
      title: "JavaScript'da hoisting qanday ishlaydi?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: [
        { id: 'a', text: "Faqat o'zgaruvchilar yuqoriga ko'tariladi", isCorrect: false },
        { id: 'b', text: "var va function declarationlar yuqoriga ko'tariladi, lekin let/const ko'tarilmaydi", isCorrect: true },
        { id: 'c', text: "Hamma narsa yuqoriga ko'tariladi", isCorrect: false },
        { id: 'd', text: "Hoisting faqat class'larga tegishli", isCorrect: false },
      ],
      explanation: "var va function declaration'lar hoisting bo'ladi. let va const temporal dead zone (TDZ) ga ega.",
      tags: ['hoisting', 'var', 'let', 'const'],
    },
    {
      id: 'q-js-006',
      categoryId: cat['javascript'].id,
      title: 'Event delegation nima va nima uchun foydali?',
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "Event delegation - hodisalarni har bir elementga emas, ularning umumiy parent elementiga biriktirish. Bu xotira tejash va dinamik elementlar bilan ishlashda foydali.",
      tags: ['events', 'dom', 'performance'],
    },
    {
      id: 'q-js-007',
      categoryId: cat['javascript'].id,
      title: '`typeof null` qanday qiymat qaytaradi?',
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: '"null"', isCorrect: false },
        { id: 'b', text: '"undefined"', isCorrect: false },
        { id: 'c', text: '"object"', isCorrect: true },
        { id: 'd', text: '"number"', isCorrect: false },
      ],
      explanation: 'Bu JavaScript da tarixiy xato. typeof null === "object" - bu spesifikatsiyaning bir qismi.',
      tags: ['typeof', 'null', 'quirks'],
    },
    {
      id: 'q-js-008',
      categoryId: cat['javascript'].id,
      title: "Array'da elementlarni filtrlash uchun qaysi metod ishlatiladi?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: 'map()', isCorrect: false },
        { id: 'b', text: 'filter()', isCorrect: true },
        { id: 'c', text: 'find()', isCorrect: false },
        { id: 'd', text: 'reduce()', isCorrect: false },
      ],
      explanation: 'filter() - shartga mos elementlardan yangi array qaytaradi. find() - birinchi mos elementni qaytaradi.',
      tags: ['array', 'methods', 'basics'],
    },

    // ── React ──────────────────────────────────────────────────────────────
    {
      id: 'q-react-001',
      categoryId: cat['react'].id,
      title: "React'da `useState` hook qanday ishlaydi?",
      type: 'OPEN_ENDED' as const,
      difficulty: 'EASY' as const,
      correctAnswer: 'useState - functional component da state saqlash uchun ishlatiladi. [state, setState] qaytaradi. setState chaqirilganda component qayta render qilinadi.',
      tags: ['hooks', 'useState', 'state'],
    },
    {
      id: 'q-react-002',
      categoryId: cat['react'].id,
      title: "React'da virtual DOM nima va nima uchun kerak?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: [
        { id: 'a', text: "Real DOM ning to'liq nusxasi, har safar yangilanadi", isCorrect: false },
        { id: 'b', text: "Real DOM ning yengil JavaScript obyekt ko'rinishi, diffing uchun ishlatiladi", isCorrect: true },
        { id: 'c', text: 'Server side rendering uchun maxsus DOM', isCorrect: false },
        { id: 'd', text: 'CSS animatsiyalar uchun DOM', isCorrect: false },
      ],
      explanation: 'Virtual DOM - xotiradagi yengil DOM tasviri. React diffing orqali minimal real DOM operatsiyalarini bajaradi.',
      tags: ['virtual-dom', 'rendering', 'performance'],
    },
    {
      id: 'q-react-003',
      categoryId: cat['react'].id,
      title: '`useEffect` hook qanday ishlaydi va dependency array nima?',
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "useEffect - side effect'lar uchun ishlatiladi (API call, subscription). Dependency array berilmasa har render'da, bo'sh [] berilsa faqat mount'da, qiymatlar berilsa ular o'zgarganda ishlaydi.",
      tags: ['hooks', 'useEffect', 'lifecycle'],
    },
    {
      id: 'q-react-004',
      categoryId: cat['react'].id,
      title: 'Props drilling muammosi nima va qanday hal qilinadi?',
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: [
        { id: 'a', text: "Props'larni bevosita DOM ga uzatish muammosi", isCorrect: false },
        { id: 'b', text: "Props'larni ko'p darajali child componentlarga uzatish muammosi; Context API yoki Redux bilan hal qilinadi", isCorrect: true },
        { id: 'c', text: "Props type xatosi", isCorrect: false },
        { id: 'd', text: "Componentlar orasida state uzatish imkonsizligi", isCorrect: false },
      ],
      explanation: "Props drilling - props'larni ko'p oraliq komponentlar orqali uzatish. Context API, Redux, Zustand kabi state manager'lar bilan hal qilinadi.",
      tags: ['props', 'context', 'state-management'],
    },
    {
      id: 'q-react-005',
      categoryId: cat['react'].id,
      title: '`useMemo` va `useCallback` orasidagi farq nima?',
      type: 'OPEN_ENDED' as const,
      difficulty: 'HARD' as const,
      correctAnswer: "useMemo - qimmat hisob-kitob natijasini memoize qiladi (qiymat qaytaradi). useCallback - funktsiyani memoize qiladi (funksiya qaytaradi). Ikkalasi ham dependency o'zgarganda qayta hisoblanadi.",
      tags: ['hooks', 'performance', 'memoization'],
    },
    {
      id: 'q-react-006',
      categoryId: cat['react'].id,
      title: "React'da `key` prop nima uchun kerak?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: 'CSS styling uchun', isCorrect: false },
        { id: 'b', text: "React'ga list elementlarini farqlashga yordam beradi, reconciliation samaradorligini oshiradi", isCorrect: true },
        { id: 'c', text: 'Event handling uchun', isCorrect: false },
        { id: 'd', text: 'TypeScript type checking uchun', isCorrect: false },
      ],
      explanation: "key prop React'ga qaysi elementlar o'zgarganini, qo'shilganini yoki o'chirilganini aniqlashga yordam beradi.",
      tags: ['key', 'list', 'reconciliation'],
    },

    // ── TypeScript ─────────────────────────────────────────────────────────
    {
      id: 'q-ts-001',
      categoryId: cat['typescript'].id,
      title: '`any` va `unknown` type orasidagi farq nima?',
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: [
        { id: 'a', text: "Ikkalasi ham bir xil, faqat yozilish farqi bor", isCorrect: false },
        { id: 'b', text: "any - type checking'ni o'chiradi; unknown - xavfsizroq, ishlatishdan oldin type check talab qiladi", isCorrect: true },
        { id: 'c', text: "unknown faqat API responslar uchun", isCorrect: false },
        { id: 'd', text: "any TypeScript 5 da deprecated", isCorrect: false },
      ],
      explanation: "unknown - any'ning xavfsiz muqobili. unknown tipidagi qiymatni ishlatishdan oldin type narrowing qilish shart.",
      tags: ['types', 'any', 'unknown', 'safety'],
    },
    {
      id: 'q-ts-002',
      categoryId: cat['typescript'].id,
      title: '`interface` va `type` orasidagi farqlar nima?',
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "interface - faqat object shakli uchun, extends bilan kengaytirish mumkin, declaration merging qo'llab-quvvatlaydi. type - union, intersection, primitiv va har qanday type uchun. Ko'p hollarda almashtirib ishlatish mumkin.",
      tags: ['interface', 'type', 'typescript-basics'],
    },
    {
      id: 'q-ts-003',
      categoryId: cat['typescript'].id,
      title: 'Generic types nima va qachon ishlatiladi?',
      type: 'OPEN_ENDED' as const,
      difficulty: 'HARD' as const,
      correctAnswer: "Generic - type parametr sifatida boshqa type qabul qiluvchi komponent/funktsiya. Masalan: Array<T>, Promise<T>. Kodni qayta ishlatiladigan va type-safe qiladi.",
      tags: ['generics', 'reusability', 'advanced'],
    },
    {
      id: 'q-ts-004',
      categoryId: cat['typescript'].id,
      title: "TypeScript'da `readonly` modifier nima qiladi?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: "Runtime da o'zgartirishni bloklaydi", isCorrect: false },
        { id: 'b', text: "Compile time da qayta belgilashni bloklaydi", isCorrect: true },
        { id: 'c', text: "Faqat class property'lari uchun ishlaydi", isCorrect: false },
        { id: 'd', text: "Object'ni freeze qiladi", isCorrect: false },
      ],
      explanation: 'readonly - TypeScript compile time tekshiruvi. Runtime da hech narsa o\'zgarmaydi. Object.freeze() runtime bloklash uchun ishlatiladi.',
      tags: ['readonly', 'modifiers', 'typescript-basics'],
    },

    // ── HTML ───────────────────────────────────────────────────────────────
    {
      id: 'q-html-001',
      categoryId: cat['html'].id,
      title: "Semantik HTML elementlariga misol keltiring va nima uchun muhimligini tushuntiring.",
      type: 'OPEN_ENDED' as const,
      difficulty: 'EASY' as const,
      correctAnswer: "Semantik elementlar: header, nav, main, article, section, aside, footer. Muhimligi: SEO, accessibility (screen reader), kod o'qilishi yaxshilanadi.",
      tags: ['semantic', 'accessibility', 'seo'],
    },
    {
      id: 'q-html-002',
      categoryId: cat['html'].id,
      title: "HTML'da qaysi `<meta>` tag sahifaning kodlashini belgilaydi?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: '<meta name="charset" content="UTF-8">', isCorrect: false },
        { id: 'b', text: '<meta charset="UTF-8">', isCorrect: true },
        { id: 'c', text: '<meta encoding="UTF-8">', isCorrect: false },
        { id: 'd', text: '<meta http-equiv="charset" content="UTF-8">', isCorrect: false },
      ],
      explanation: '<meta charset="UTF-8"> — standart kodlash belgilash usuli.',
      tags: ['meta', 'charset', 'html-basics'],
    },
    {
      id: 'q-html-003',
      categoryId: cat['html'].id,
      title: "`data-*` atributlari nima uchun ishlatiladi?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: [
        { id: 'a', text: "CSS styling uchun maxsus atributlar", isCorrect: false },
        { id: 'b', text: "HTML elementlariga maxsus ma'lumot saqlash uchun, JavaScript orqali o'qiladi", isCorrect: true },
        { id: 'c', text: "Server'ga ma'lumot yuborish uchun", isCorrect: false },
        { id: 'd', text: "Faqat form elementlari uchun", isCorrect: false },
      ],
      explanation: "data-* atributlari orqali elementlarga ixtiyoriy ma'lumot biriktiriladi. element.dataset.* orqali o'qiladi.",
      tags: ['data-attributes', 'dom', 'html5'],
    },
    {
      id: 'q-html-004',
      categoryId: cat['html'].id,
      title: 'Accessibility uchun `alt` atributi nima qiladi?',
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: "Rasmning alternativ versiyasini ko'rsatadi", isCorrect: false },
        { id: 'b', text: "Rasm yuklanmasa ko'rinadigan matn; screen reader'lar o'qiydi", isCorrect: true },
        { id: 'c', text: "Rasm ustiga olib borganda tooltip ko'rsatadi", isCorrect: false },
        { id: 'd', text: "SEO uchun kalit so'z", isCorrect: false },
      ],
      explanation: "alt matni accessibility va SEO uchun muhim. Screen reader'lar ushbu matnni o'qiydi.",
      tags: ['accessibility', 'images', 'alt'],
    },

    // ── CSS ────────────────────────────────────────────────────────────────
    {
      id: 'q-css-001',
      categoryId: cat['css'].id,
      title: "CSS Flexbox'da elementlarni markazlashtirish uchun qanday property ishlatiladi?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: 'align-items: center + justify-items: center', isCorrect: false },
        { id: 'b', text: 'justify-content: center + align-items: center', isCorrect: true },
        { id: 'c', text: 'text-align: center + vertical-align: middle', isCorrect: false },
        { id: 'd', text: 'flex-align: center', isCorrect: false },
      ],
      explanation: 'justify-content - main axis bo\'yicha, align-items - cross axis bo\'yicha tekislaydi.',
      tags: ['flexbox', 'centering', 'layout'],
    },
    {
      id: 'q-css-002',
      categoryId: cat['css'].id,
      title: 'CSS specificity qanday hisoblanadi?',
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "Specificity: inline style (1,0,0,0) > ID selector (0,1,0,0) > class/pseudo-class/attribute (0,0,1,0) > element/pseudo-element (0,0,0,1). !important hamma narsani ustib yozadi.",
      tags: ['specificity', 'selectors', 'cascade'],
    },
    {
      id: 'q-css-003',
      categoryId: cat['css'].id,
      title: "CSS box model nima?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: 'content + padding + border + outline', isCorrect: false },
        { id: 'b', text: 'content + padding + border + margin', isCorrect: true },
        { id: 'c', text: 'width + height + color + font', isCorrect: false },
        { id: 'd', text: 'display + position + float + clear', isCorrect: false },
      ],
      explanation: 'CSS box model: content area, padding, border, va margin\'dan iborat.',
      tags: ['box-model', 'layout', 'basics'],
    },
    {
      id: 'q-css-004',
      categoryId: cat['css'].id,
      title: 'CSS Grid va Flexbox orasidagi farq nima, qachon qaysinisini tanlaymiz?',
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "Flexbox - 1D layout (row yoki column). Grid - 2D layout (row va column birga). Navigatsiya/alignment uchun Flexbox, murakkab sahifa layouti uchun Grid yaxshiroq.",
      tags: ['grid', 'flexbox', 'layout', 'comparison'],
    },

    // ── Node.js ────────────────────────────────────────────────────────────
    {
      id: 'q-node-001',
      categoryId: cat['nodejs'].id,
      title: "Node.js'da Event Loop qanday ishlaydi?",
      type: 'OPEN_ENDED' as const,
      difficulty: 'HARD' as const,
      correctAnswer: "Event Loop - Node.js'ning async operatsiyalarni boshqarish mexanizmi. Call stack, callback queue, microtask queue'lardan iborat. Call stack bo'sh bo'lganda callback queue'dan vazifalarni bajaradi.",
      tags: ['event-loop', 'async', 'nodejs-core'],
    },
    {
      id: 'q-node-002',
      categoryId: cat['nodejs'].id,
      title: 'REST API va GraphQL orasidagi asosiy farqlar nima?',
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "REST - resurslarga asoslangan, multiple endpoints. GraphQL - bitta endpoint, client kerakli fieldlarni tanlaydi. GraphQL over/under fetching muammosini hal qiladi.",
      tags: ['rest', 'graphql', 'api'],
    },
    {
      id: 'q-node-003',
      categoryId: cat['nodejs'].id,
      title: "Node.js'da `require()` va ES6 `import` orasidagi farq nima?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: [
        { id: 'a', text: "Ikkalasi ham bir xil ishlaydi, faqat syntax farqi bor", isCorrect: false },
        { id: 'b', text: "require() - CommonJS, sinxron yuklaydi; import - ES Module, statik tahlil va tree shaking qo'llab-quvvatlaydi", isCorrect: true },
        { id: 'c', text: "import faqat frontend da ishlaydi", isCorrect: false },
        { id: 'd', text: "require() ES6 da deprecated", isCorrect: false },
      ],
      explanation: "CommonJS (require) va ESM (import) - ikki modul tizimi. ESM static import bo'lgani uchun bundler optimizatsiyalari yaxshiroq.",
      tags: ['modules', 'require', 'import', 'commonjs'],
    },
    {
      id: 'q-node-004',
      categoryId: cat['nodejs'].id,
      title: "`package.json` da `dependencies` va `devDependencies` farqi nima?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: "Ikkalasi ham production da o'rnatiladi", isCorrect: false },
        { id: 'b', text: "dependencies - production da kerak; devDependencies - faqat development da kerak", isCorrect: true },
        { id: 'c', text: "devDependencies - tezroq o'rnatiladi", isCorrect: false },
        { id: 'd', text: "Farq yo'q, faqat tartib uchun", isCorrect: false },
      ],
      explanation: "npm install --production faqat dependencies o'rnatadi. devDependencies - test, build tool'lar uchun.",
      tags: ['npm', 'package-json', 'dependencies'],
    },
    {
      id: 'q-node-005',
      categoryId: cat['nodejs'].id,
      title: "Node.js stream'lar nima va nima uchun foydali?",
      type: 'OPEN_ENDED' as const,
      difficulty: 'HARD' as const,
      correctAnswer: "Stream'lar - ma'lumotlarni qismlarga bo'lib qayta ishlash imkonini beradi. Katta fayllar yoki network ma'lumotlarini butun xotiraga yuklamay ishlashga imkon beradi. Readable, Writable, Duplex, Transform turlari bor.",
      tags: ['streams', 'performance', 'nodejs-core'],
    },

    // ── Express.js ─────────────────────────────────────────────────────────
    {
      id: 'q-express-001',
      categoryId: cat['express'].id,
      title: "Express.js'da middleware nima?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: "Ma'lumotlar bazasi bilan ishlaydigan qatlam", isCorrect: false },
        { id: 'b', text: "Request va response orasida ishlaydigan funktsiya; req, res, next parametrlarini qabul qiladi", isCorrect: true },
        { id: 'c', text: "Faqat autentifikatsiya uchun ishlatiladigan tizim", isCorrect: false },
        { id: 'd', text: "Static fayllarni serve qiladigan modul", isCorrect: false },
      ],
      explanation: "Middleware - request/response tsiklida ishlaydigan funktsiya. Logging, auth, validation kabi vazifalar uchun ishlatiladi.",
      tags: ['middleware', 'express-basics', 'request-response'],
    },
    {
      id: 'q-express-002',
      categoryId: cat['express'].id,
      title: "Express'da error handling middleware qanday ko'rinishda bo'ladi?",
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "Error middleware 4 ta parametr oladi: (err, req, res, next). Express'ga bu error middleware ekanligini 4 ta parametr bildiradi. Boshqa middleware'lardan keyin ro'yxatdan o'tkaziladi.",
      tags: ['error-handling', 'middleware', 'express-advanced'],
    },
    {
      id: 'q-express-003',
      categoryId: cat['express'].id,
      title: "Express'da `router.param()` nima qiladi?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: [
        { id: 'a', text: "URL parametrlarini majburiy qiladi", isCorrect: false },
        { id: 'b', text: "Muayyan route parametri mavjud bo'lganda avtomatik callback ishga tushiradi", isCorrect: true },
        { id: 'c', text: "Query parametrlarni parse qiladi", isCorrect: false },
        { id: 'd', text: "Request body ni tekshiradi", isCorrect: false },
      ],
      explanation: "router.param('id', callback) - :id parametri bo'lgan barcha routelarda avval callback ishlaydi. Masalan, ID bo'yicha user olish.",
      tags: ['router', 'params', 'middleware'],
    },
    {
      id: 'q-express-004',
      categoryId: cat['express'].id,
      title: "CORS nima va Express'da qanday yoqiladi?",
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "CORS (Cross-Origin Resource Sharing) - boshqa domendan API'ga so'rov yuborishga ruxsat beruvchi mexanizm. Express'da `cors` paketi o'rnatib, `app.use(cors())` orqali yoqiladi.",
      tags: ['cors', 'security', 'http-headers'],
    },

    // ── Databases ──────────────────────────────────────────────────────────
    {
      id: 'q-db-001',
      categoryId: cat['databases'].id,
      title: 'SQL va NoSQL ma\'lumotlar bazalari orasidagi asosiy farqlar nima?',
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "SQL - jadvallar, qat'iy schema, ACID, relations. NoSQL - moslashuvchan schema, horizontal scaling, JSON/document. SQL - murakkab so'rovlar uchun; NoSQL - katta hajm va tez o'zgaruvchan ma'lumotlar uchun.",
      tags: ['sql', 'nosql', 'database-comparison'],
    },
    {
      id: 'q-db-002',
      categoryId: cat['databases'].id,
      title: 'Primary key va Foreign key orasidagi farq nima?',
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: "Ikkalasi ham jadvalda qatorlarni noyob belgilaydi", isCorrect: false },
        { id: 'b', text: "Primary key - jadvalda noyob ID; Foreign key - boshqa jadvalning Primary key'ga reference", isCorrect: true },
        { id: 'c', text: "Foreign key - tashqi API'dan kelgan ma'lumotlar", isCorrect: false },
        { id: 'd', text: "Primary key NULL bo'lishi mumkin", isCorrect: false },
      ],
      explanation: "Primary key - qatorni noyob identifikatsiya qiladi, NULL bo'lishi mumkin emas. Foreign key - boshqa jadval bilan aloqa o'rnatadi.",
      tags: ['primary-key', 'foreign-key', 'relations'],
    },
    {
      id: 'q-db-003',
      categoryId: cat['databases'].id,
      title: "Ma'lumotlar bazasida INDEX nima va qachon foydali?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: [
        { id: 'a', text: "Jadvaldagi barcha ma'lumotlarning nusxasi", isCorrect: false },
        { id: 'b', text: "Tezroq qidirish uchun alohida ma'lumot tuzilmasi; ko'p read, kam write bo'lganda foydali", isCorrect: true },
        { id: 'c', text: "Faqat PRIMARY KEY ustunlar uchun avtomatik yaratiladi", isCorrect: false },
        { id: 'd', text: "Ma'lumotlarni himoya qiluvchi tizim", isCorrect: false },
      ],
      explanation: "INDEX - qidiruvni tezlashtiradi, lekin write operatsiyalarni sekinlashtiradi va qo'shimcha joy talab qiladi. Ko'p o'qiladigan ustunlarga qo'yiladi.",
      tags: ['index', 'performance', 'query-optimization'],
    },
    {
      id: 'q-db-004',
      categoryId: cat['databases'].id,
      title: "SQL'da INNER JOIN va LEFT JOIN orasidagi farq nima?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: [
        { id: 'a', text: "INNER JOIN - faqat chap jadval, LEFT JOIN - ikkalasi ham", isCorrect: false },
        { id: 'b', text: "INNER JOIN - ikkalasida ham mavjud qatorlar; LEFT JOIN - chap jadvalning barchasi + o'ng jadvaldan mos keladiganlari", isCorrect: true },
        { id: 'c', text: "LEFT JOIN deprecated, INNER JOIN ishlatish kerak", isCorrect: false },
        { id: 'd', text: "Ikkalasi ham bir xil natija beradi", isCorrect: false },
      ],
      explanation: "INNER JOIN - intersection. LEFT JOIN - chap jadval asosiy, o'ngda mos yo'q bo'lsa NULL qaytaradi.",
      tags: ['join', 'sql', 'queries'],
    },

    // ── Git ────────────────────────────────────────────────────────────────
    {
      id: 'q-git-001',
      categoryId: cat['git'].id,
      title: '`git merge` va `git rebase` orasidagi farq nima?',
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: [
        { id: 'a', text: "Ikkalasi ham bir xil natija beradi", isCorrect: false },
        { id: 'b', text: "merge - yangi merge commit yaratadi; rebase - commitlarni boshqa branchning ustiga qayta yozadi, tarixni tozalaydi", isCorrect: true },
        { id: 'c', text: "rebase faqat main branch uchun", isCorrect: false },
        { id: 'd', text: "merge - tezroq, rebase - sekinroq", isCorrect: false },
      ],
      explanation: "merge - tarixni saqlab qo'shadi. rebase - tartibliroq commit tarix, lekin public branchlarda xavfli.",
      tags: ['git-merge', 'git-rebase', 'branching'],
    },
    {
      id: 'q-git-002',
      categoryId: cat['git'].id,
      title: '`git pull` va `git fetch` orasidagi farq nima?',
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: "git pull - faqat yuklab oladi; git fetch - yuklab oladi va merge qiladi", isCorrect: false },
        { id: 'b', text: "git fetch - remote o'zgarishlarni yuklab oladi (merge qilmaydi); git pull - fetch + merge", isCorrect: true },
        { id: 'c', text: "Ikkalasi ham bir xil", isCorrect: false },
        { id: 'd', text: "git pull - local o'zgarishlarni saqlaydi", isCorrect: false },
      ],
      explanation: "git fetch - remote'dan yangilanishlarni oladi, local kodni o'zgartirmaydi. git pull = git fetch + git merge.",
      tags: ['git-pull', 'git-fetch', 'remote'],
    },
    {
      id: 'q-git-003',
      categoryId: cat['git'].id,
      title: 'Git workflow (branch strategiyasi) qanday ko\'rinishda bo\'ladi?',
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "Keng tarqalgan strategiyalar: Git Flow (main, develop, feature, release, hotfix branchlari), GitHub Flow (main + feature branchlar, PR orqali merge), Trunk-Based Development (kichik, tez-tez merge).",
      tags: ['git-flow', 'branching-strategy', 'workflow'],
    },

    // ── OOP ────────────────────────────────────────────────────────────────
    {
      id: 'q-oop-001',
      categoryId: cat['oop'].id,
      title: "OOP'ning 4 asosiy tamoyili qaysilar?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: "Abstraction, Encapsulation, Inheritance, Polymorphism", isCorrect: true },
        { id: 'b', text: "Function, Class, Object, Method", isCorrect: false },
        { id: 'c', text: "SOLID, DRY, KISS, YAGNI", isCorrect: false },
        { id: 'd', text: "Interface, Abstract, Override, Overload", isCorrect: false },
      ],
      explanation: "OOP 4 tamoyili: Abstraction (murakkablikni yashirish), Encapsulation (ma'lumotni kapsullash), Inheritance (meros), Polymorphism (ko'p shakllilik).",
      tags: ['oop-principles', 'basics', 'interview'],
    },
    {
      id: 'q-oop-002',
      categoryId: cat['oop'].id,
      title: "Inheritance (meros) va Composition orasidagi farq nima va qachon qaysinisini ishlatish kerak?",
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "Inheritance - IS-A munosabati (Dog is an Animal). Composition - HAS-A munosabati (Car has an Engine). 'Favor composition over inheritance' - composition moslashuvchanroq, tight coupling kamaytiradi.",
      tags: ['inheritance', 'composition', 'design-patterns'],
    },
    {
      id: 'q-oop-003',
      categoryId: cat['oop'].id,
      title: "SOLID tamoyillaridan 'S' (Single Responsibility) nima degani?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: [
        { id: 'a', text: "Har bir funktsiya faqat bitta parametr olishi kerak", isCorrect: false },
        { id: 'b', text: "Har bir class faqat bitta sabab uchun o'zgarishi kerak / bitta mas'uliyatga ega bo'lishi kerak", isCorrect: true },
        { id: 'c', text: "Bitta faylda faqat bitta class bo'lishi kerak", isCorrect: false },
        { id: 'd', text: "Singleton pattern", isCorrect: false },
      ],
      explanation: "SRP - class'ning o'zgarish sababi bitta bo'lishi kerak. Bu kodni maintainable va testable qiladi.",
      tags: ['solid', 'srp', 'design-principles'],
    },
    {
      id: 'q-oop-004',
      categoryId: cat['oop'].id,
      title: "JavaScript'da `class` va prototip asosidagi meros orasidagi munosabat nima?",
      type: 'OPEN_ENDED' as const,
      difficulty: 'HARD' as const,
      correctAnswer: "JavaScript'da class - prototip asosidagi merosning sintaktik shakari (syntax sugar). class ichidagi metodlar aslida prototype'ga qo'shiladi. __proto__ zanjiri orqali meros amalga oshiriladi.",
      tags: ['prototype', 'class', 'inheritance', 'javascript'],
    },

    // ── Next.js ────────────────────────────────────────────────────────────
    {
      id: 'q-next-001',
      categoryId: cat['nextjs'].id,
      title: "Next.js'da SSR va SSG orasidagi farq nima?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'MEDIUM' as const,
      options: [
        { id: 'a', text: "SSR - client side render, SSG - server side render", isCorrect: false },
        { id: 'b', text: "SSR - har so'rovda server renderlar; SSG - build vaqtida HTML yaratiladi, CDN'da saqlanadi", isCorrect: true },
        { id: 'c', text: "Ikkalasi ham bir xil, faqat yozilishi farqli", isCorrect: false },
        { id: 'd', text: "SSG faqat blog saytlar uchun", isCorrect: false },
      ],
      explanation: "SSR - dynamic, real-time ma'lumotlar uchun. SSG - static, SEO muhim bo'lganda. ISR - ikkalasini birlashtiradi.",
      tags: ['ssr', 'ssg', 'rendering', 'nextjs-core'],
    },
    {
      id: 'q-next-002',
      categoryId: cat['nextjs'].id,
      title: "Next.js App Router va Pages Router orasidagi asosiy farqlar nima?",
      type: 'OPEN_ENDED' as const,
      difficulty: 'MEDIUM' as const,
      correctAnswer: "App Router (Next.js 13+): Server Components default, layout.tsx, loading.tsx, error.tsx, nested layouts, React Server Components to'liq qo'llab-quvvatlaydi. Pages Router: _app.tsx, getServerSideProps/getStaticProps, client components default.",
      tags: ['app-router', 'pages-router', 'nextjs-13'],
    },
    {
      id: 'q-next-003',
      categoryId: cat['nextjs'].id,
      title: "Next.js'da API route qanday yaratiladi?",
      type: 'SINGLE_CHOICE' as const,
      difficulty: 'EASY' as const,
      options: [
        { id: 'a', text: "pages/api/server.js faylida", isCorrect: false },
        { id: 'b', text: "pages/api/*.js yoki app/api/*/route.ts faylida", isCorrect: true },
        { id: 'c', text: "server/ papkasida alohida faylda", isCorrect: false },
        { id: 'd', text: "next.config.js da routes array'ida", isCorrect: false },
      ],
      explanation: "Pages Router: pages/api/[name].js. App Router: app/api/[name]/route.ts (GET, POST, PUT, DELETE export qilinadi).",
      tags: ['api-routes', 'nextjs-core', 'backend'],
    },
  ]

  let questionCount = 0
  for (const q of questionDefs) {
    const { id, ...data } = q
    await prisma.question.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    })
    questionCount++
  }

  console.log(`✅ ${questionCount} savol yaratildi`)

  // ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────
  await Promise.all([
    prisma.achievement.upsert({
      where: { slug: 'first-test' },
      update: {},
      create: { slug: 'first-test', title: 'Birinchi qadam', description: 'Birinchi testni yakunlading', icon: '🎯', conditionType: 'QUIZ_COUNT', conditionValue: 1 },
    }),
    prisma.achievement.upsert({
      where: { slug: '5-tests' },
      update: {},
      create: { slug: '5-tests', title: 'Mashq qilyapman', description: '5 ta testni yakunlading', icon: '📚', conditionType: 'QUIZ_COUNT', conditionValue: 5 },
    }),
    prisma.achievement.upsert({
      where: { slug: '10-tests' },
      update: {},
      create: { slug: '10-tests', title: "Izchil o'quvchi", description: '10 ta testni yakunlading', icon: '🔥', conditionType: 'QUIZ_COUNT', conditionValue: 10 },
    }),
    prisma.achievement.upsert({
      where: { slug: '25-tests' },
      update: {},
      create: { slug: '25-tests', title: 'Tajribali', description: '25 ta testni yakunlading', icon: '🏆', conditionType: 'QUIZ_COUNT', conditionValue: 25 },
    }),
    prisma.achievement.upsert({
      where: { slug: '50-tests' },
      update: {},
      create: { slug: '50-tests', title: 'Pro darajasi', description: '50 ta testni yakunlading', icon: '💎', conditionType: 'QUIZ_COUNT', conditionValue: 50 },
    }),
    prisma.achievement.upsert({
      where: { slug: 'perfect-score' },
      update: {},
      create: { slug: 'perfect-score', title: 'Mukammal natija', description: '100% ball yig\'dingiz', icon: '⭐', conditionType: 'SCORE', conditionValue: 100 },
    }),
    prisma.achievement.upsert({
      where: { slug: 'streak-3' },
      update: {},
      create: { slug: 'streak-3', title: 'Doimiy', description: '3 kun ketma-ket kirdingiz', icon: '🔆', conditionType: 'STREAK', conditionValue: 3 },
    }),
    prisma.achievement.upsert({
      where: { slug: 'streak-7' },
      update: {},
      create: { slug: 'streak-7', title: 'Haftalik chempion', description: '7 kun ketma-ket kirdingiz', icon: '🌟', conditionType: 'STREAK', conditionValue: 7 },
    }),
  ])

  console.log('✅ Achievementlar yaratildi')

  // ─── ROADMAP NODES ────────────────────────────────────────────────────────
  const frontendNodes = [
    { title: 'HTML Asoslari',       orderIndex: 1, isMilestone: false, description: 'HTML elementlari, semantik HTML, formlar' },
    { title: 'CSS Asoslari',        orderIndex: 2, isMilestone: false, description: 'Selectors, box model, flexbox, grid' },
    { title: 'JavaScript Asoslari', orderIndex: 3, isMilestone: true,  description: 'Variables, functions, arrays, objects, DOM' },
    { title: 'ES6+ Xususiyatlar',   orderIndex: 4, isMilestone: false, description: 'Arrow functions, destructuring, promises, async/await' },
    { title: 'React Asoslari',      orderIndex: 5, isMilestone: true,  description: 'Components, props, state, hooks' },
    { title: 'React Advanced',      orderIndex: 6, isMilestone: false, description: 'Context, Redux, React Query, Router' },
    { title: 'TypeScript',          orderIndex: 7, isMilestone: false, description: 'Types, interfaces, generics' },
    { title: 'Next.js',             orderIndex: 8, isMilestone: true,  description: 'SSR, SSG, App Router, API Routes' },
  ]

  const backendNodes = [
    { title: 'Node.js Asoslari',    orderIndex: 1, isMilestone: false, description: 'Modules, fs, path, http' },
    { title: 'Express.js',          orderIndex: 2, isMilestone: true,  description: 'Routes, middleware, error handling' },
    { title: 'REST API Dizayn',     orderIndex: 3, isMilestone: false, description: 'HTTP methods, status codes, CRUD' },
    { title: "Ma'lumotlar Bazasi",  orderIndex: 4, isMilestone: true,  description: 'PostgreSQL, MongoDB asoslari' },
    { title: 'ORM / ODM',           orderIndex: 5, isMilestone: false, description: 'Prisma, Mongoose' },
    { title: 'Authentication',      orderIndex: 6, isMilestone: true,  description: 'JWT, OAuth, bcrypt' },
    { title: 'API Security',        orderIndex: 7, isMilestone: false, description: 'CORS, rate limiting, helmet' },
    { title: 'Deployment',          orderIndex: 8, isMilestone: true,  description: 'Docker, CI/CD, cloud platforms' },
  ]

  const fullstackNodes = [
    { title: 'HTML/CSS/JS Asoslari',    orderIndex: 1, isMilestone: true,  description: 'Web texnologiyalarining poydevori' },
    { title: 'Frontend Framework',      orderIndex: 2, isMilestone: false, description: 'React yoki Vue bilan ishlash' },
    { title: 'Backend API',             orderIndex: 3, isMilestone: true,  description: 'Node.js + Express yoki boshqa backend' },
    { title: "Ma'lumotlar Bazasi",      orderIndex: 4, isMilestone: false, description: 'SQL va NoSQL asoslari' },
    { title: 'Authentication & Auth',   orderIndex: 5, isMilestone: true,  description: 'JWT, session, OAuth integration' },
    { title: "To'liq loyiha yaratish",  orderIndex: 6, isMilestone: true,  description: "Frontend + Backend + DB ni birlashtirish va deploy qilish" },
  ]

  for (const node of frontendNodes) {
    await prisma.roadmapNode.upsert({
      where: { id: `frontend-${node.orderIndex}` },
      update: node,
      create: { id: `frontend-${node.orderIndex}`, track: 'FRONTEND', ...node },
    })
  }
  for (const node of backendNodes) {
    await prisma.roadmapNode.upsert({
      where: { id: `backend-${node.orderIndex}` },
      update: node,
      create: { id: `backend-${node.orderIndex}`, track: 'BACKEND', ...node },
    })
  }
  for (const node of fullstackNodes) {
    await prisma.roadmapNode.upsert({
      where: { id: `fullstack-${node.orderIndex}` },
      update: node,
      create: { id: `fullstack-${node.orderIndex}`, track: 'FULLSTACK', ...node },
    })
  }

  console.log('✅ Roadmap nodelari yaratildi (Frontend, Backend, Fullstack)')

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

  // ─── QUIZZES ──────────────────────────────────────────────────────────────
  // Quiz 1: Frontend Easy
  await prisma.quiz.upsert({
    where: { id: 'quiz-frontend-easy' },
    update: {},
    create: {
      id: 'quiz-frontend-easy',
      title: "JavaScript Boshlang'ich Test",
      description: 'HTML, CSS va JavaScript asosiy tushunchalarini tekshiring',
      type: 'FRONTEND',
      difficulty: 'EASY',
      timeLimit: 600,
      questionCount: 8,
      questions: {
        create: [
          { questionId: 'q-js-001', orderIndex: 0 },
          { questionId: 'q-js-007', orderIndex: 1 },
          { questionId: 'q-js-008', orderIndex: 2 },
          { questionId: 'q-html-001', orderIndex: 3 },
          { questionId: 'q-html-002', orderIndex: 4 },
          { questionId: 'q-html-004', orderIndex: 5 },
          { questionId: 'q-css-001', orderIndex: 6 },
          { questionId: 'q-css-003', orderIndex: 7 },
        ],
      },
    },
  })

  // Quiz 2: Frontend Medium
  await prisma.quiz.upsert({
    where: { id: 'quiz-frontend-medium' },
    update: {},
    create: {
      id: 'quiz-frontend-medium',
      title: 'Frontend Developer Test',
      description: "JavaScript, React va CSS bo'yicha o'rta daraja",
      type: 'FRONTEND',
      difficulty: 'MEDIUM',
      timeLimit: 900,
      questionCount: 10,
      questions: {
        create: [
          { questionId: 'q-js-002', orderIndex: 0 },
          { questionId: 'q-js-003', orderIndex: 1 },
          { questionId: 'q-js-004', orderIndex: 2 },
          { questionId: 'q-js-005', orderIndex: 3 },
          { questionId: 'q-react-002', orderIndex: 4 },
          { questionId: 'q-react-003', orderIndex: 5 },
          { questionId: 'q-react-004', orderIndex: 6 },
          { questionId: 'q-css-002', orderIndex: 7 },
          { questionId: 'q-css-004', orderIndex: 8 },
          { questionId: 'q-ts-001', orderIndex: 9 },
        ],
      },
    },
  })

  // Quiz 3: Backend Medium
  await prisma.quiz.upsert({
    where: { id: 'quiz-backend-medium' },
    update: {},
    create: {
      id: 'quiz-backend-medium',
      title: 'Backend Developer Test',
      description: "Node.js, Express va Database bo'yicha o'rta daraja",
      type: 'BACKEND',
      difficulty: 'MEDIUM',
      timeLimit: 900,
      questionCount: 10,
      questions: {
        create: [
          { questionId: 'q-node-002', orderIndex: 0 },
          { questionId: 'q-node-003', orderIndex: 1 },
          { questionId: 'q-node-004', orderIndex: 2 },
          { questionId: 'q-express-001', orderIndex: 3 },
          { questionId: 'q-express-002', orderIndex: 4 },
          { questionId: 'q-express-004', orderIndex: 5 },
          { questionId: 'q-db-001', orderIndex: 6 },
          { questionId: 'q-db-002', orderIndex: 7 },
          { questionId: 'q-db-003', orderIndex: 8 },
          { questionId: 'q-db-004', orderIndex: 9 },
        ],
      },
    },
  })

  // Quiz 4: Full-Stack Mixed
  await prisma.quiz.upsert({
    where: { id: 'quiz-fullstack-mixed' },
    update: {},
    create: {
      id: 'quiz-fullstack-mixed',
      title: 'Full-Stack Developer Test',
      description: "Frontend, Backend va umumiy bilimlarni sinash",
      type: 'FULLSTACK',
      difficulty: 'MIXED',
      timeLimit: 1200,
      questionCount: 12,
      questions: {
        create: [
          { questionId: 'q-js-001', orderIndex: 0 },
          { questionId: 'q-js-006', orderIndex: 1 },
          { questionId: 'q-react-001', orderIndex: 2 },
          { questionId: 'q-react-005', orderIndex: 3 },
          { questionId: 'q-ts-002', orderIndex: 4 },
          { questionId: 'q-node-001', orderIndex: 5 },
          { questionId: 'q-express-003', orderIndex: 6 },
          { questionId: 'q-db-004', orderIndex: 7 },
          { questionId: 'q-oop-001', orderIndex: 8 },
          { questionId: 'q-oop-002', orderIndex: 9 },
          { questionId: 'q-git-001', orderIndex: 10 },
          { questionId: 'q-next-001', orderIndex: 11 },
        ],
      },
    },
  })

  console.log('✅ 4 ta quiz yaratildi')
  console.log('\n🎉 Seed muvaffaqiyatli yakunlandi!')
  console.log('   Admin: admin@devprep.ai / Admin123!')
}

main()
  .catch((e) => {
    console.error('❌ Seed xatosi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
