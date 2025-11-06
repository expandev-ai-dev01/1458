/**
 * @summary
 * Zod validation utilities and reusable schemas
 *
 * @module utils/zodValidation
 */

import { z } from 'zod';

/**
 * @remarks Common validation schemas
 */
export const zString = z.string().min(1);
export const zNullableString = z.string().nullable();
export const zName = z.string().min(1).max(200);
export const zDescription = z.string().min(1).max(500);
export const zNullableDescription = z.string().max(500).nullable();
export const zBit = z.number().int().min(0).max(1);
export const zFK = z.number().int().positive();
export const zNullableFK = z.number().int().positive().nullable();
export const zDateString = z.string().datetime();
export const zNullableDateString = z.string().datetime().nullable();
