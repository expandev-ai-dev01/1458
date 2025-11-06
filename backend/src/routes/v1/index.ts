/**
 * @summary
 * V1 API router configuration
 *
 * @module routes/v1
 */

import { Router } from 'express';
import externalRoutes from './externalRoutes';
import internalRoutes from './internalRoutes';

const router = Router();

/**
 * @remarks External (public) routes - /api/v1/external/...
 */
router.use('/external', externalRoutes);

/**
 * @remarks Internal (authenticated) routes - /api/v1/internal/...
 */
router.use('/internal', internalRoutes);

export default router;
