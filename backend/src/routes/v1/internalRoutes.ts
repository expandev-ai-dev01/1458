/**
 * @summary
 * Internal API routes configuration for V1
 * Authenticated endpoints for application features
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';

const router = Router();

/**
 * @remarks Task management routes
 */
router.post('/task', taskController.createHandler);
router.get('/task', taskController.listHandler);
router.get('/task/:id', taskController.getHandler);

export default router;
