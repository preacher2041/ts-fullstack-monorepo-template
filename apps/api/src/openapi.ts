import './extend-zod'
import { z } from 'zod'
import {
	extendZodWithOpenApi,
	OpenAPIRegistry,
	OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi'
import {
	loginSchema,
	createUserSchema,
	updateUserSchema,
	updateUserPasswordSchema,
	UserSchema,
} from '@template/schemas'

// Extend Zod capabilities with OpenAPI attributes
extendZodWithOpenApi(z)

export const registry = new OpenAPIRegistry()

// 1. Register Reusable Schemas (Components)
const LoginCredentials = registry.register('LoginCredentials', loginSchema)
const CreateUserInput = registry.register('CreateUserInput', createUserSchema)
const UpdateUserInput = registry.register('UpdateUserInput', updateUserSchema)
const UpdateUserPasswordInput = registry.register(
	'UpdateUserPasswordInput',
	updateUserPasswordSchema
)
const User = registry.register('User', UserSchema)

const ErrorResponse = registry.register(
	'ErrorResponse',
	z.object({
		status: z.number(),
		message: z.string(),
	})
)

// 2. Define API Paths & Operations

// POST /auth/login
registry.registerPath({
	method: 'post',
	path: '/auth/login',
	operationId: 'login',
	summary: 'Authenticate user',
	description: 'Log in with email and password to establish a session.',
	tags: ['Authentication'],
	request: {
		body: {
			content: {
				'application/json': { schema: LoginCredentials },
			},
		},
	},
	responses: {
		200: {
			description: 'Login successful',
			content: {
				'application/json': {
					schema: z.object({
						status: z.literal(200),
						message: z.string(),
						userId: z.string().uuid(),
					}),
				},
			},
		},
		401: {
			description: 'Invalid credentials',
			content: { 'application/json': { schema: ErrorResponse } },
		},
		404: {
			description: 'User not found',
			content: { 'application/json': { schema: ErrorResponse } },
		},
	},
})

// POST /auth/logout
registry.registerPath({
	method: 'post',
	path: '/auth/logout',
	operationId: 'logout',
	summary: 'Logout user',
	description: 'Destroy the current user session and clear cookies.',
	tags: ['Authentication'],
	responses: {
		200: {
			description: 'Logout successful',
			content: {
				'application/json': {
					schema: z.object({
						status: z.literal(200),
						message: z.string(),
					}),
				},
			},
		},
		500: {
			description: 'Internal server error during session cleanup',
			content: { 'application/json': { schema: ErrorResponse } },
		},
	},
})

// GET /auth/session
registry.registerPath({
	method: 'get',
	path: '/auth/session',
	operationId: 'getCurrentSession',
	summary: 'Get session status',
	description:
		'Check if the request is authenticated and return basic details.',
	tags: ['Authentication'],
	responses: {
		200: {
			description: 'Session status retrieved',
			content: {
				'application/json': {
					schema: z.object({
						authenticated: z.boolean(),
					}),
				},
			},
		},
	},
})

// POST /users/
registry.registerPath({
	method: 'post',
	path: '/users',
	operationId: 'registerUser',
	summary: 'Create user account',
	description: 'Register a new user account with email and username.',
	tags: ['Users'],
	request: {
		body: {
			content: {
				'application/json': { schema: CreateUserInput },
			},
		},
	},
	responses: {
		200: {
			description: 'User created successfully',
			content: {
				'application/json': {
					schema: z.object({
						status: z.literal(200),
						message: z.string(),
						data: User,
					}),
				},
			},
		},
		400: {
			description: 'Validation failed',
			content: { 'application/json': { schema: ErrorResponse } },
		},
		409: {
			description: 'User already exists',
			content: { 'application/json': { schema: ErrorResponse } },
		},
	},
})

// GET /users/me
registry.registerPath({
	method: 'get',
	path: '/users/me',
	operationId: 'getCurrentUser',
	summary: 'Get current user profile',
	description:
		'Fetch detailed profile information of the currently logged-in user.',
	tags: ['Users'],
	responses: {
		200: {
			description: 'User profile retrieved successfully',
			content: {
				'application/json': {
					schema: z.object({
						status: z.literal(200),
						message: z.string(),
						user: User,
					}),
				},
			},
		},
		401: {
			description: 'Unauthorized',
			content: { 'application/json': { schema: ErrorResponse } },
		},
	},
})

// PUT /users/{id}
registry.registerPath({
	method: 'put',
	path: '/users/{id}',
	operationId: 'updateUser',
	summary: 'Update user profile',
	description:
		'Update the user profile information such as username and email.',
	tags: ['Users'],
	request: {
		params: z.object({
			id: z.string().uuid(),
		}),
		body: {
			content: {
				'application/json': { schema: UpdateUserInput },
			},
		},
	},
	responses: {
		200: {
			description: 'User updated successfully',
			content: {
				'application/json': {
					schema: z.object({
						status: z.literal(200),
						message: z.string(),
						data: User,
					}),
				},
			},
		},
		400: {
			description: 'Validation failed',
			content: { 'application/json': { schema: ErrorResponse } },
		},
		401: {
			description: 'Unauthorized',
			content: { 'application/json': { schema: ErrorResponse } },
		},
		403: {
			description: 'Forbidden - can only update own profile',
			content: { 'application/json': { schema: ErrorResponse } },
		},
	},
})

// PATCH /users/{id}/password
registry.registerPath({
	method: 'patch',
	path: '/users/{id}/password',
	operationId: 'updateUserPassword',
	summary: 'Update user password',
	description: 'Change the current password to a new one.',
	tags: ['Users'],
	request: {
		params: z.object({
			id: z.string().uuid(),
		}),
		body: {
			content: {
				'application/json': { schema: UpdateUserPasswordInput },
			},
		},
	},
	responses: {
		200: {
			description: 'User updated successfully',
			content: {
				'application/json': {
					schema: z.object({
						status: z.literal(200),
						message: z.string(),
					}),
				},
			},
		},
		400: {
			description: 'Validation failed',
			content: { 'application/json': { schema: ErrorResponse } },
		},
		401: {
			description: 'Incorrect current password',
			content: { 'application/json': { schema: ErrorResponse } },
		},
		403: {
			description: 'Forbidden - can only update own password',
			content: { 'application/json': { schema: ErrorResponse } },
		},
	},
})

// DELETE /users/{id}
registry.registerPath({
	method: 'delete',
	path: '/users/{id}',
	operationId: 'deleteUser',
	summary: 'Delete user account',
	description: 'Permanently delete the user account from the database.',
	tags: ['Users'],
	request: {
		params: z.object({
			id: z.string().uuid(),
		}),
	},
	responses: {
		200: {
			description: 'User deleted successfully',
			content: {
				'application/json': {
					schema: z.object({
						status: z.literal(200),
						message: z.string(),
					}),
				},
			},
		},
		401: {
			description: 'Unauthorized',
			content: { 'application/json': { schema: ErrorResponse } },
		},
		403: {
			description: 'Forbidden - can only delete own profile',
			content: { 'application/json': { schema: ErrorResponse } },
		},
	},
})

// 3. Compile Spec
const generator = new OpenApiGeneratorV3(registry.definitions)

export const openApiSpec: Record<string, any> = generator.generateDocument({
	openapi: '3.0.0',
	info: {
		title: 'Fullstack Monorepo Template API',
		version: '1.0.0',
		description:
			'Interactive API documentation for our Express backend REST endpoints.',
	},
	servers: [
		{
			url: '/api/v1',
			description: 'Base API Endpoint',
		},
	],
})
