import { z } from 'zod'

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d).+$/,
        'Password must contain at least one letter and one number'
      ),
    phone: z.string().optional(),
    state: z.string().optional(),
  }),
})

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
})

export const googleAuthSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
})

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().optional(),
    state: z.string().optional(),
    preferredLang: z.enum(['EN', 'HI']).optional(),
    preferences: z.any().optional(),
  }),
})
