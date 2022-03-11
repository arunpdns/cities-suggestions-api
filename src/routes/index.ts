import { Router } from 'express';
import citiesRoute from './cities';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/cities', citiesRoute);

// Export the base-router
export default router;
