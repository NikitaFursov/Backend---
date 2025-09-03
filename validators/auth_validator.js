import { body } from 'express-validator';
import User from '../models/User.js';

const register = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email обязателен')
    .isEmail().withMessage('Некорректный формат email')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('Пользователь с таким email уже существует');
      }
    }),
  
  body('password')
    .notEmpty().withMessage('Пароль обязателен')
    .isLength({ min: 8 }).withMessage('Пароль должен быть не менее 8 символов')
    .matches(/[A-Z]/).withMessage('Пароль должен содержать хотя бы одну заглавную букву')
    .matches(/[0-9]/).withMessage('Пароль должен содержать хотя бы одну цифру'),
  
  body('name')
    .trim()
    .notEmpty().withMessage('Имя обязательно')
    .isLength({ max: 50 }).withMessage('Имя не должно превышать 50 символов'),
  
  body('specialization')
    .trim()
    .notEmpty().withMessage('Специализация обязательна')
    .isLength({ max: 100 }).withMessage('Специализация не должна превышать 100 символов')
];

const login = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email обязателен')
    .isEmail().withMessage('Некорректный формат email'),
  
  body('password')
    .notEmpty().withMessage('Пароль обязателен')
];

export default { register, login };