import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../../config/database'
import { env } from '../../config/env'

const anthropic = new Anthropic({ apiKey: env.anthropic.apiKey })

interface EvaluateDto {
  questionText: string
  userAnswer: string
  category?: string
}

export interface AIEvaluationResult {
  score: number
  feedback: string
  idealAnswer: string
  mistakes: string[]
  resources: Array<{ title: string; url: string; type: string }>
  keyPoints: string[]
}

interface MockInterviewDto {
  track: 'FRONTEND' | 'BACKEND' | 'FULLSTACK'
  count?: number
}

export class AIService {
  private buildPrompt(dto: EvaluateDto): string {
    return `You are a senior software engineer conducting a technical interview.
Evaluate the following answer and respond ONLY with a valid JSON object.

Question: ${dto.questionText}
${dto.category ? `Category: ${dto.category}` : ''}
Candidate's Answer: ${dto.userAnswer}

Respond with this exact JSON structure (no markdown, no explanation outside JSON):
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentences explaining what was good and what was missing>",
  "idealAnswer": "<comprehensive ideal answer in 3-5 sentences>",
  "mistakes": ["<mistake 1>", "<mistake 2>"],
  "resources": [
    {"title": "<resource title>", "url": "<url>", "type": "article|video|docs"}
  ],
  "keyPoints": ["<key concept 1>", "<key concept 2>", "<key concept 3>"]
}`
  }

  private async callClaude(prompt: string, retries = 2): Promise<AIEvaluationResult> {
    let lastError: unknown
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-5',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        })

        const content = response.content[0]
        if (content.type !== 'text') throw new Error('AI javob qaytarmadi')

        const cleaned = content.text.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(cleaned)
        return {
          score: Math.min(10, Math.max(1, Number(parsed.score) || 1)),
          feedback: parsed.feedback || '',
          idealAnswer: parsed.idealAnswer || '',
          mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
          resources: Array.isArray(parsed.resources) ? parsed.resources : [],
          keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
        }
      } catch (err) {
        lastError = err
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
        }
      }
    }
    throw lastError
  }

  // Used internally by quiz submission — no DB save
  async evaluateAnswerInternal(dto: EvaluateDto): Promise<AIEvaluationResult> {
    return this.callClaude(this.buildPrompt(dto))
  }

  async evaluateAnswer(userId: string, dto: EvaluateDto) {
    const result = await this.callClaude(this.buildPrompt(dto))

    const session = await prisma.aISession.create({
      data: {
        userId,
        questionText: dto.questionText,
        userAnswer: dto.userAnswer,
        aiScore: result.score,
        aiFeedback: result.feedback,
        idealAnswer: result.idealAnswer,
        resources: result.resources,
      },
    })

    return { sessionId: session.id, ...result }
  }

  async getMockInterviewQuestions(dto: MockInterviewDto) {
    const count = dto.count || 5
    let categoryFilter: any = {}

    if (dto.track === 'FRONTEND') {
      categoryFilter = { category: { group: 'FRONTEND' } }
    } else if (dto.track === 'BACKEND') {
      categoryFilter = { category: { group: 'BACKEND' } }
    }

    const questions = await prisma.question.findMany({
      where: {
        isActive: true,
        type: 'OPEN_ENDED',
        ...categoryFilter,
      },
      include: { category: { select: { name: true, slug: true } } },
      take: count * 3, // Get more to shuffle
    })

    // Shuffle and take needed count
    return [...questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map((q) => ({
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        category: q.category,
      }))
  }

  async getSessions(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const [sessions, total] = await Promise.all([
      prisma.aISession.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          questionText: true,
          aiScore: true,
          createdAt: true,
        },
      }),
      prisma.aISession.count({ where: { userId } }),
    ])
    return { sessions, total, page, limit }
  }

  async getSession(id: string, userId: string) {
    const session = await prisma.aISession.findFirst({ where: { id, userId } })
    if (!session) throw new Error('Session topilmadi')
    return session
  }
}

export const aiService = new AIService()
