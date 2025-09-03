import { Router } from 'express';
import authController from "../controllers/auth_controller.js";
import authValidator from "../validators/auth_validator.js";
import errorMiddleware from "../middleware/error_middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Аутентификация пользователей
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового врача
 *     description: |
 *       Создает новую учетную запись врача в системе.
 *       После регистрации требуется подтверждение email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - specialization
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: doctor@example.com
 *                 description: Рабочий email врача
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: Str0ngPassw0rd!
 *                 description: Пароль должен содержать минимум 8 символов, включая цифры и заглавные буквы
 *               name:
 *                 type: string
 *                 example: Иван Иванов
 *                 description: Полное имя врача
 *               specialization:
 *                 type: string
 *                 example: Кардиология
 *                 description: Медицинская специализация
 *               experienceYears:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 70
 *                 example: 5
 *                 description: Опыт работы в годах
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Регистрация успешна. Пожалуйста, проверьте email для подтверждения.
 *                 verificationToken:
 *                   type: string
 *                   description: Токен для верификации email
 *       400:
 *         description: Ошибка валидации или пользователь уже существует
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Внутренняя ошибка сервера
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: doctor@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Str0ngPassw0rd!
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - token
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhasfasfafafafafsasfshsdhdhjdtfjjf...
 *       401:
 *         description: Неверные учетные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post('/register', authValidator.register, errorMiddleware.validate, authController.register);
router.post('/login', authValidator.login, errorMiddleware.validate, authController.login);

export default router;