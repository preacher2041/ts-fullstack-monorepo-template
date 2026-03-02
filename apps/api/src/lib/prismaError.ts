import createError from 'http-errors';
import { Prisma } from '@prisma/client';

export const mapPrismaError = (err: unknown) => {
	if (err instanceof Prisma.PrismaClientValidationError) {
		return createError(400, 'Invalid request data');
	}

	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		switch (err.code) {
			case 'P2002':
				return createError(409, 'A record with that value already exists');
			case 'P2025':
				return createError(404, 'Record not found');
			default:
				return createError(500, 'Database error');
		}
	}

	return null;
};
