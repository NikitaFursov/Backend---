class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static unauthorized(message = 'Не авторизован') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Доступ запрещен') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Ресурс не найден') {
    return new ApiError(404, message);
  }

  static internal(message = 'Внутренняя ошибка сервера') {
    return new ApiError(500, message);
  }

  static conflict(message = 'Конфликт данных') {
    return new ApiError(409, message);
  }
}

export default ApiError;