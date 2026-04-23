export type LoginCredentials = {
	email: string
	password: string
}

export type RegistrationCredentials = {
	email: string
	password: string
	firstName: string
	lastName: string
	username: string
	dob: string
}

export type MeResponse = {
	message: string
	status: number
	user: User
}

export type User = {
	id: number
	createdAt: string
	dob: string
	email: string
	firstName: string
	lastName: string
	updatedAt: string
	username: string
}

export type LoginFormValues = LoginCredentials
export type RegistrationFormValues = RegistrationCredentials
