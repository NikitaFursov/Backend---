import { Router } from 'express';
import Task from '../models/Task.js'
import taskController from '../controllers/task_controller.js';
import taskValidator from '../validators/task_validator.js';
import authMiddleware from "../middleware/auth_middleware.js";
import errorMiddleware from "../middleware/error_middleware.js";
import roleMiddleware from '../middleware/role_middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Управление задачами
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Получить список задач
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: ID категории для фильтрации
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Уровень сложности для фильтрации
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Количество задач на странице
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *     responses:
 *       200:
 *         description: Список задач
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', authMiddleware.authenticate, taskController.getTasks);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   get:
 *     summary: Получить задачу по ID
 *     tags: [Tasks]
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
 *         description: Данные задачи
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Задача не найдена
 */
router.get('/:taskId', authMiddleware.authenticate, taskController.getTaskById);

/**
 * @swagger
 * /api/tasks/{taskId}/solve:
 *   post:
 *     summary: Отправить решение медицинской задачи
 *     description: |
 *       Позволяет врачу отправить решение задачи и получить автоматическую проверку.
 *       Результат сохраняется в статистике пользователя.
 *       
 *       ### Типы задач:
 *       - **Single Choice** - выбор одного правильного ответа
 *       - **Multiple Choice** - выбор нескольких правильных ответов
 *       - **Text Answer** - текстовый ответ (проверяется автоматически по ключевым словам)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 507f1f77bcf86cd799439012
 *         description: ID медицинской задачи
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answer
 *             properties:
 *               answer:
 *                 oneOf:
 *                   - type: string
 *                     description: Ответ для задач типа Single Choice или Text Answer
 *                     example: "МРТ и рентгенография"
 *                   - type: array
 *                     items:
 *                       type: string
 *                     description: Массив ответов для Multiple Choice
 *                     example: ["МРТ", "Рентгенография"]
 *     responses:
 *       200:
 *         description: Результат проверки решения
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isCorrect:
 *                   type: boolean
 *                   description: Правильность решения
 *                 solutionId:
 *                   type: string
 *                   format: uuid
 *                   description: ID сохраненного решения
 *                 explanation:
 *                   type: string
 *                   description: Развернутое объяснение решения (только для неправильных ответов)
 *                   example: "МРТ показывает мягкие ткани, а рентген - костные структуры"
 *                 correctAnswer:
 *                   type: string
 *                   description: Правильный ответ (только для неправильных решений)
 *       400:
 *         description: Неверный формат ответа или ID задачи
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Задача не найдена
 */
router.post(
  '/:taskId/solve',
  authMiddleware.authenticate,
  taskValidator.submitSolution, // Добавляем валидацию
  errorMiddleware.validate,
  taskController.submitSolution
);

/**
 * @swagger
 * /api/tasks/create:
 *   post:
 *     summary: Создать новую задачу (только для админов)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - correctAnswer
 *               - options
 *               - difficulty
 *               - categories
 *             properties:
 *               title:
 *                 type: string
 *                 format: title
 *                 example: Диагностика травмы колена
 *               description:
 *                 type: string
 *                 format: description
 *                 example: Опишите методику диагностики травмы колена
 *               correctAnswer:
 *                 type: string
 *                 format: correctAnswer
 *                 example: МРТ и рентгенография
 *               options:
 *                 type: array
 *                 format: correctAnswer
 *                 example: [
 *                   "УЗИ",
 *                   "МРТ и рентгенография",
 *                   "Пальпация",
 *                   "Анализ крови"
 *                 ]
 *               explanation:
 *                 type: string
 *                 format: explanation
 *                 example: МРТ показывает мягкие ткани, а рентген - костные структуры
 *               difficulty:
 *                 type: string
 *                 format: difficulty
 *                 example: medium
 *               category:
 *                 type: array
 *                 format: category
 *                 example: 688320c04e9eabde27add848
 * 
 *     responses:
 *       201:
 *         description: Созданная задача
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Неверные данные задачи
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав администратора
 */
router.post(
  '/create',
  authMiddleware.authenticate,
  roleMiddleware.restrictToAdmin,
  taskValidator.createTask,
  errorMiddleware.validate,
  taskController.createTask
);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   patch:
 *     summary: Обновить задачу (только для админов)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID задачи
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Обновленная задача
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Неверные данные задачи
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав администратора
 *       404:
 *         description: Задача не найдена
 */
router.patch(
  '/:taskId',
  authMiddleware.authenticate,
  roleMiddleware.checkOwnership(Task, 'taskId'),
  taskValidator.updateTask,
  errorMiddleware.validate,
  taskController.updateTask
);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Удалить задачу (только для админов)
 *     tags: [Tasks]
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
 *       204:
 *         description: Задача удалена
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Нет прав администратора
 *       404:
 *         description: Задача не найдена
 */
router.delete(
  '/:taskId',
  authMiddleware.authenticate,
  roleMiddleware.restrictTo(['admin']),
  taskController.deleteTask
);

export default router;