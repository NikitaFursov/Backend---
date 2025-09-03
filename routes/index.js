import { Router } from 'express';
import authRoutes from './auth_routes.js';
import taskRoutes from './task_routes.js';
import userRoutes from './user_routes.js';
import categoryRoutes from './category_routes.js';
import errorMiddleware from '../middleware/error_middleware.js';

const router = Router();

// Основные маршруты
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);

// Обработка 404
router.use(/(.*)/, (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Подключение middleware для обработки ошибок
router.use(errorMiddleware.globalErrorHandler, errorMiddleware.catchAsync, errorMiddleware.notFound);

export default router;