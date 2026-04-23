import {z} from 'zod';

export const createUserSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.email({
		pattern: z.regexes.html5Email,
		error: 'Email address must be a valid email',
	}),
	dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
	username: z.string().min(1, 'Username name is required'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
	firstName: z.string().min(1, 'First name is required').optional(),
	lastName: z.string().min(1, 'Last name is required').optional(),
	email: z.email({
		pattern: z.regexes.html5Email,
		error: 'Email address must be a valid email',
	}).optional(),
	dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
	username: z.string().min(1, 'Username name is required').optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const updateUserPasswordSchema = z.object({
	currentPassword: z.string().min(8, 'Current password must be at least 8 characters long'),
	newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
})

export type UpdateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>

export type UserResponse = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	dob: string;
	username: string;
	createdAt: string;
	updatedAt: string;
}

export type MeResponse = {
	status: number;
	message: string;
	user: UserResponse;
}