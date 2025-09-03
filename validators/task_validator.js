import { body, param } from 'express-validator';
import { Task, Category } from '../models/index.js';

const createTask = [
  body('title')
    .notEmpty().withMessage('Название задачи обязательно')
    .isLength({ max: 100 }).withMessage('Название не должно превышать 100 символов')
    .custom(async (title, { req }) => {
      if (req.body.category) {
        const existingTask = await Task.findOne({ 
          title: title,
          category: req.body.category
        });
        if (existingTask) {
          return Promise.reject('Задача с таким названием уже существует в указанной категории');
        }
      }
      return true;
    }),
  
  body('description')
    .notEmpty().withMessage('Описание задачи обязательно')
    .isLength({ max: 5000 }).withMessage('Описание не должно превышать 5000 символов'),
  
  body('difficulty')
    .notEmpty().withMessage('Сложность обязательна')
    .isIn(['easy', 'medium', 'hard']).withMessage('Недопустимый уровень сложности'),
  
  body('category')
    .notEmpty().withMessage('Категория обязательна')
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        return Promise.reject('Указанная категория не существует');
      }
    }),
  
  body('correctAnswer')
    .notEmpty().withMessage('Правильный ответ обязателен')
    .isLength({ max: 500 }).withMessage('Ответ не должен превышать 500 символов'),
  
  body('options')
    .isArray({ min: 2, max: 6 }).withMessage('Должно быть от 2 до 6 вариантов ответа')
    .custom((options, { req }) => {
      if (!options.includes(req.body.correctAnswer)) {
        throw new Error('Варианты ответа должны включать правильный ответ');
      }
      if (options.some(opt => opt.length > 200)) {
        throw new Error('Варианты ответа не должны превышать 200 символов');
      }
      return true;
    }),
  
  body('explanation')
    .notEmpty().withMessage('Объяснение решения обязательно')
    .isLength({ max: 2000 }).withMessage('Объяснение не должно превышать 2000 символов')
];

const updateTask = [
  param('id')
    .isMongoId().withMessage('Некорректный ID задачи'),
  
  body('title')
    .optional()
    .isLength({ max: 100 }).withMessage('Название не должно превышать 100 символов'),
  
  body('description')
    .optional()
    .isLength({ max: 5000 }).withMessage('Описание не должно превышать 5000 символов'),
  
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard']).withMessage('Недопустимый уровень сложности'),
  
  body('category')
    .optional()
    .isMongoId().withMessage('Некорректный ID категории')
    .custom(async (categoryId) => {
      if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
          throw new Error('Указанная категория не существует');
        }
      }
      return true;
    }),
  
  body('correctAnswer')
    .optional()
    .isLength({ max: 500 }).withMessage('Ответ не должен превышать 500 символов'),
  
  body('options')
    .optional()
    .isArray({ min: 2, max: 6 }).withMessage('Должно быть от 2 до 6 вариантов ответа')
    .custom((options, { req }) => {
      if (options && req.body.correctAnswer && !options.includes(req.body.correctAnswer)) {
        throw new Error('Варианты ответа должны включать правильный ответ');
      }
      if (options && options.some(opt => opt.length > 200)) {
        throw new Error('Варианты ответа не должны превышать 200 символов');
      }
      return true;
    }),
  
  body('explanation')
    .optional()
    .isLength({ max: 2000 }).withMessage('Объяснение не должно превышать 2000 символов')
];

const submitSolution = [
  param('taskId')
    .isMongoId().withMessage('Некорректный ID задачи'),
  
  body('answer') // Проверяем поле answer
    .notEmpty().withMessage('Ответ обязателен')
    .isString().withMessage('Ответ должен быть строкой')
    .isLength({ max: 500 }).withMessage('Ответ не должен превышать 500 символов')
];
export default { createTask, updateTask, submitSolution };