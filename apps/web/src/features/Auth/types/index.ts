export type {
	LoginCredentials,
	CreateUserInput as RegistrationCredentials,
	MeResponse,
	UserResponse as User,
} from '@template/schemas'

import type { LoginCredentials, CreateUserInput } from '@template/schemas'

export type LoginFormValues = LoginCredentials
export type RegistrationFormValues = CreateUserInput
