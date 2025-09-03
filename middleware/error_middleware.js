import ApiError from '../utils/ApiError.js';
import log from '../utils/logger.js';
import { validationResult } from 'express-validator';

export default {
  // Обработчик для несуществующих роутов
  notFound: (req, res, next) => {
    next(ApiError.notFound(`Ресурс не найден: ${req.originalUrl}`));
  },

  // Глобальный обработчик ошибок
  globalErrorHandler: (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    log.logger.error(`${err.statusCode} - ${err.message}`);

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  },

  // Обработчик для асинхронных функций (обертка для избежания try/catch)
  catchAsync: (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      logger.error(err.stack);
      next(err);
    });
  },

  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      throw ApiError.badRequest(errorMessages.join(', '));
    }
    next();
  }
};