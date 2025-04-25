import express from 'express';
import { router as authRoutes } from './authRoutes';
import { router as categoryRoutes } from './categoryRoutes';
import { authMiddleware } from './../middleware/authMiddleware';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/category', authMiddleware, categoryRoutes);

export { router };