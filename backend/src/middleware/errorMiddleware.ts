/**
 * @summary
 * Global error handling middleware
 *
 * @module middleware/errorMiddleware
 */

import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * @summary
 * Express error handling middleware
 *
 * @function errorMiddleware
 * @module middleware
 *
 * @param {AppError} error - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next function
 */
export function errorMiddleware(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const code = error.code || 'INTERNAL_ERROR';

  console.error('Error:', {
    statusCode,
    code,
    message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: error.details || undefined,
    },
    timestamp: new Date().toISOString(),
  });
}
