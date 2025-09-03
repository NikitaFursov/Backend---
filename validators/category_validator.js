import { body, param } from 'express-validator';

const createCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Название категории обязательно')
    .isLength({ max: 50 }).withMessage('Название не должно превышать 50 символов'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Описание категории обязательно')
    .isLength({ max: 500 }).withMessage('Описание не должно превышать 500 символов'),
  
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Название иконки не должно превышать 100 символов')
];

const updateCategory = [
  param('categoryId')
    .isMongoId().withMessage('Некорректный ID категории'),
  
  body()
    .custom(value => {
      const allowedFields = ['name', 'description', 'icon'];
      const invalidFields = Object.keys(value).filter(field => !allowedFields.includes(field));
      
      if (invalidFields.length > 0) {
        throw new Error(`Нельзя обновлять поля: ${invalidFields.join(', ')}. Разрешены только: name, description, icon`);
      }
      return true;
    }),
  
  body('name')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Название не должно превышать 50 символов'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Описание не должно превышать 500 символов'),
  
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Название иконки не должно превышать 100 символов')
];

export default { createCategory, updateCategory };