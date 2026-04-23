import {z} from 'zod';

export const loginSchema = z.object({
	email: z.email({
		pattern: z.regexes.html5Email,
		error: 'Email address must be a valid email',
	}),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export type LoginCredentials = z.infer<typeof loginSchema>