import { Router } from 'express';
import userController from '../controllers/user_controller.js';
import userValidator from '../validators/user_validator.js';
import authMiddleware from '../middleware/auth_middleware.js';
import roleMiddleware from '../middleware/role_middleware.js';
import errorMiddleware from '../middleware/error_middleware.js';
import User from '../models/User.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список пользователей (только для админов)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество пользователей на странице
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *         description: Роль для фильтрации
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав администратора
 */
router.get(
  '/',
  authMiddleware.authenticate,
  roleMiddleware.restrictToAdmin,
  userController.getAllUsers
);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Получить профиль пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 */
router.get(
  '/:userId',
  authMiddleware.authenticate,
  userController.getUserById
);

/**
 * @swagger
 * /api/users/me/update:
 *   put:
 *     summary: Обновить профиль пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Новое имя
 *               specialization:
 *                 type: string
 *                 example: Новая специализация
 *               experienceYears:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Обновленные данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Неверные данные для обновления
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для обновления этого пользователя
 *       404:
 *         description: Пользователь не найден
 */
router.put(
  '/me/update',
  authMiddleware.authenticate,
  userValidator.updateProfile,
  errorMiddleware.validate,
  userController.updateUser
);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Удалить пользователя (только админ или владелец аккаунта)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       204:
 *         description: Пользователь удален
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав для удаления этого пользователя
 *       404:
 *         description: Пользователь не найден
 */
router.delete(
  '/:userId',
  authMiddleware.authenticate,
  roleMiddleware.checkOwnership(User, 'userId'),
  userController.deleteUser
);

/**
 * @swagger
 * /api/users/me/change-password:
 *   post:
 *     summary: Изменить пароль пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Текущий пароль
 *               newPassword:
 *                 type: string
 *                 description: Новый пароль
 *     responses:
 *       200:
 *         description: Пароль успешно изменен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Пароль успешно изменен
 *       400:
 *         description: Неверные данные для изменения пароля
 *       401:
 *         description: Не авторизован или текущий пароль неверен
 *       404:
 *         description: Пользователь не найден
 */
router.post(
  '/me/change-password',
  authMiddleware.authenticate,
  userValidator.changePassword,
  errorMiddleware.validate,
  userController.changePassword
);

/**
 * @swagger
 * /api/users/me/solved-tasks:
 *   get:
 *     summary: Получить список решенных задач пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество задач на странице
 *     responses:
 *       200:
 *         description: Список решенных задач
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   task:
 *                     $ref: '#/components/schemas/Task'
 *                   solvedAt:
 *                     type: string
 *                     format: date-time
 *                   isCorrect:
 *                     type: boolean
 */
router.get(
  '/me/solved-tasks',
  authMiddleware.authenticate,
  userController.getSolvedTasks
);

/**
 * @swagger
 * /api/users/me/stats:
 *   get:
 *     summary: Получить статистику решенных задач пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Статистика пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAttempts:
 *                   type: number
 *                 correctAttempts:
 *                   type: number
 *                 successRate:
 *                   type: number
 */
router.get(
  '/me/stats',
  authMiddleware.authenticate,
  userController.getStats
);

/**
 * @swagger
 * /api/users/me/solved-tasks/{taskId}:
 *   delete:
 *     summary: Удалить задачу из истории решенных
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задачи
 *     responses:
 *       200:
 *         description: Задача удалена из истории
 *       404:
 *         description: Задача не найдена в истории
 */
router.delete(
  '/me/solved-tasks/:taskId',
  authMiddleware.authenticate,
  userController.removeSolvedTask
);

export default router;