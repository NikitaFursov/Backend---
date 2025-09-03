import { Router } from 'express';
import categoryController from '../controllers/category_controller.js';
import authMiddleware from '../middleware/auth_middleware.js';
import roleMiddleware from '../middleware/role_middleware.js';
import categoryValidator from '../validators/category_validator.js';
import errorMiddleware from '../middleware/error_middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Управление категориями задач
 */

/**
 * @swagger
 * /api/categories/create:
 *   post:
 *     summary: Создать новую категорию (только для админов)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Травматология
 *               description:
 *                 type: string
 *                 example: Диагностика и лечение травм
 *               icon:
 *                 type: string
 *                 example: trauma-icon.svg
 *     responses:
 *       201:
 *         description: Созданная категория
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Неверные данные категории
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав администратора
 */
router.post(
  '/create',
  authMiddleware.authenticate,
  roleMiddleware.restrictToAdmin,
  categoryValidator.createCategory,
  errorMiddleware.validate,
  categoryController.createCategory
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Получить список всех категорий
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', authMiddleware.authenticate, categoryController.getCategories);

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   get:
 *     summary: Получить категорию по ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID категории
 *     responses:
 *       200:
 *         description: Данные категории
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Категория не найдена
 */
router.get('/:categoryId', authMiddleware.authenticate, categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   patch:
 *     summary: Обновить категорию (только для админов)
 *     description: |
 *       Разрешено обновлять только поля: name, description, icon.
 *       Остальные поля будут проигнорированы.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID категории
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Обновленное название
 *               description:
 *                 type: string
 *                 example: Обновленное описание
 *               icon:
 *                 type: string
 *                 example: updated-icon.svg
 *     responses:
 *       200:
 *         description: Обновленная категория
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Неверные данные категории или попытка обновить запрещенные поля
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав администратора
 *       404:
 *         description: Категория не найдена
 */
router.patch(
  '/:categoryId',
  authMiddleware.authenticate,
  roleMiddleware.restrictToAdmin,
  categoryValidator.updateCategory,
  errorMiddleware.validate,
  categoryController.updateCategory
);

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   delete:
 *     summary: Удалить категорию (только для админов)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID категории
 *     responses:
 *       204:
 *         description: Категория удалена
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав администратора
 *       404:
 *         description: Категория не найдена
 */
router.delete(
  '/:categoryId',
  authMiddleware.authenticate,
  roleMiddleware.restrictToAdmin,
  categoryController.deleteCategory
);

export default router;