const SENSITIVE_KEYS = [
	'password',
	'secret',
	'token',
	'cookie',
	'authorization',
	'key',
	'email',
]

function isSensitiveKey(key: string): boolean {
	const normalized = key.toLowerCase()
	return SENSITIVE_KEYS.some((sensitive) => normalized.includes(sensitive))
}

function sanitizeString(str: string): string {
	let sanitized = str

	// Mask PostgreSQL/database connection strings: postgresql://user:password@host:port/db
	const dbRegex = /(postgresql?:\/\/)([^:]+):([^@]+)(@[^/]+\/[^?\s]+)/gi
	sanitized = sanitized.replace(dbRegex, '$1$2:[REDACTED]$4')

	// Redact keys in query strings or logs, e.g. "password=123" or "password: 123"
	for (const key of SENSITIVE_KEYS) {
		const regex = new RegExp(`("${key}"\\s*:\\s*")[^"]+(")`, 'gi')
		sanitized = sanitized.replace(regex, `$1[REDACTED]$2`)

		const eqRegex = new RegExp(`(${key}=)[^&\\s]+`, 'gi')
		sanitized = sanitized.replace(eqRegex, `$1[REDACTED]`)
	}

	return sanitized
}

export function sanitizeError(
	value: unknown,
	visited = new WeakSet<object>()
): unknown {
	if (value === null || value === undefined) {
		return value
	}

	if (typeof value === 'object') {
		if (visited.has(value as object)) {
			return '[CIRCULAR]'
		}
		visited.add(value as object)
	}

	if (value instanceof Error) {
		const sanitizedError = new Error(sanitizeString(value.message))
		sanitizedError.name = value.name
		if (value.stack) {
			sanitizedError.stack = sanitizeString(value.stack)
		}

		// Copy custom properties
		const keys = Object.getOwnPropertyNames(value)
		for (const key of keys) {
			if (key !== 'message' && key !== 'stack' && key !== 'name') {
				const propValue = (value as unknown as Record<string, unknown>)[
					key
				]
				if (isSensitiveKey(key)) {
					;(sanitizedError as unknown as Record<string, unknown>)[
						key
					] = '[REDACTED]'
				} else {
					;(sanitizedError as unknown as Record<string, unknown>)[
						key
					] = sanitizeError(propValue, visited)
				}
			}
		}
		return sanitizedError
	}

	if (Array.isArray(value)) {
		return value.map((item) => sanitizeError(item, visited))
	}

	if (typeof value === 'object') {
		const result: Record<string, unknown> = {}
		for (const [key, val] of Object.entries(
			value as Record<string, unknown>
		)) {
			if (isSensitiveKey(key)) {
				result[key] = '[REDACTED]'
			} else {
				result[key] = sanitizeError(val, visited)
			}
		}
		return result
	}

	if (typeof value === 'string') {
		return sanitizeString(value)
	}

	return value
}
