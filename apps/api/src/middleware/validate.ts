import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'

export const validate =
	(schema: z.ZodTypeAny) =>
	(req: Request, _res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body)
		if (!result.success) {
			return next(createError.BadRequest(result.error.message))
		}
		req.body = result.data
		next()
	}
