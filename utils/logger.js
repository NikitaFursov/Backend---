import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import winston from 'winston';
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, errors } = format;
import DailyRotateFile from 'winston-daily-rotate-file';

// Получаем __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Директория для логов
const logDir = path.join(__dirname, '../../logs');

// Создаем директорию, если её нет
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Кастомный формат для логов
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Базовые настройки для ротации файлов
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d', // Храним логи 30 дней
  zippedArchive: true, // Архивируем старые логи
  maxSize: '20m' // Ротация при достижении 20MB
});

// Логгер для запросов (HTTP)
const httpLogger = winston.createLogger({
  level: 'http',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat)
    }),
    fileRotateTransport
  ]
});

// Основной логгер приложения
const appLogger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // Добавляет stack trace для ошибок
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat)
    }),
    fileRotateTransport,
    new transports.File({
      level: 'error',
      filename: path.join(logDir, 'error.log')
    })
  ]
});

// Методы логирования
const logger = {
  info: (message, meta) => {
    appLogger.info(message, meta);
  },
  error: (message, meta) => {
    appLogger.error(message, meta);
  },
  warn: (message, meta) => {
    appLogger.warn(message, meta);
  },
  debug: (message, meta) => {
    appLogger.debug(message, meta);
  },
  http: (message, meta) => {
    httpLogger.http(message, meta);
  }
};

// Middleware для логирования запросов Express
const requestLoggerMiddleware = (req, res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    headers: req.headers,
    body: req.body
  });
  next();
};

// Middleware для логирования ошибок
const errorLoggerMiddleware = (err, req, res, next) => {
  logger.error(err.stack || err.message, {
    url: req.originalUrl,
    method: req.method,
    body: req.body
  });
  next(err);
};

export default {
  logger,
  requestLoggerMiddleware,
  errorLoggerMiddleware
};