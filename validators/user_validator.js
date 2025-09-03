import { body, param } from 'express-validator';

const updateProfile = [
    body('name')
        .optional()
        .isLength({ min: 2, max: 32 }).withMessage('Имя должно быть от 2 до 32 символов')
        .trim(),
    
    body('specialization')
        .optional()
        .isLength({ max: 100 }).withMessage('Специализация не должна превышать 100 символов')
        .trim(),
    
    body('experience')
        .optional()
        .isInt({ min: 0, max: 70 }).withMessage('Опыт должен быть числом от 0 до 70 лет'),
    
];

const getUser = [
    param('id')
        .isMongoId().withMessage('Неверный ID пользователя')
];

const changePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Текущий пароль обязателен'),
  
  body('newPassword')
    .notEmpty().withMessage('Новый пароль обязателен')
    .isLength({ min: 8 }).withMessage('Пароль должен быть не менее 8 символов')
    .matches(/[A-Z]/).withMessage('Пароль должен содержать хотя бы одну заглавную букву')
    .matches(/[0-9]/).withMessage('Пароль должен содержать хотя бы одну цифру')
    .not().equals(body('currentPassword')).withMessage('Новый пароль должен отличаться от текущего')
];

export default { 
  updateProfile, 
  getUser,
  changePassword
};