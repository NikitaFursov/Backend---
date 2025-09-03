import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

async function authenticate(req, res, next) {
    try {
        // 1. Получение токена из заголовка или куки
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.jwt;
        if (!token) {
            throw new ApiError(401, 'Не авторизован: токен отсутствует');
        }
        // 2. Верификация токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 3. Поиск пользователя в БД
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new ApiError(401, 'Пользователь не найден');
        } 
        // 4. Добавление пользователя в запрос
        req.user = user;
        next();
    } catch (err) {
        // Передаем оригинальную ошибку, если это ApiError, или создаем новую
        next(err instanceof ApiError ? err : new ApiError(401, 'Не авторизован: неверный токен'));
    }
}

async function checkEmailVerified(req, res, next) {
    try {
        if (!req.user?.isEmailVerified) {
            throw new ApiError(403, 'Доступ запрещен: email не подтвержден');
        }
        next();
    } catch (err) {
        next(err);
    }
}

export default { authenticate, checkEmailVerified };