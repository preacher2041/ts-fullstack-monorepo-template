import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	DATABASE_URL: z.url(),
	SESSION_SECRET: z.string().min(32),
	CORS_ORIGIN: z.url().optional(),
	API_PORT: z.coerce.number().int().positive().optional(),
	NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
	COOKIE_DOMAIN: z.string().optional(),
})

export const env = envSchema.parse(process.env)
