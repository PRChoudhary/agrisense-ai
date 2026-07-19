import { jest } from '@jest/globals'
import request from 'supertest'

jest.unstable_mockModule('../../src/services/news.service.js', () => ({
  getNews: jest.fn().mockResolvedValue({
    articles: [{ id: 1, title: 'Test News' }],
    total: 1
  }),
  fetchAndSaveNews: jest.fn(),
  getNewsById: jest.fn()
}))

const { default: app } = await import('../../src/server.js')
const prisma = (await import('../../src/config/database.js')).default

describe('GET /api/v1/news', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should return paginated news', async () => {
    const res = await request(app).get('/api/v1/news')
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toBeInstanceOf(Array)
  })
})

