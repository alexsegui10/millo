import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', err);

    // Prisma errors
    if (err.code === 'P2002') {
        return res.status(409).json({
            ok: false,
            error: {
                message: 'A record with this unique field already exists',
                code: 'DUPLICATE_ENTRY',
                details: err.meta,
            },
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            ok: false,
            error: {
                message: 'Record not found',
                code: 'NOT_FOUND',
            },
        });
    }

    // Zod validation errors
    if (err.name === 'ZodError') {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: err.errors,
            },
        });
    }

    // Default error
    res.status(err.status || 500).json({
        ok: false,
        error: {
            message: err.message || 'Internal server error',
            code: err.code || 'INTERNAL_ERROR',
        },
    });
};
