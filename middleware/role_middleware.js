import ApiError from '../utils/ApiError.js';

export default {
  // Проверка, что пользователь - администратор
  restrictToAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return next(new ApiError(403, 'Доступ запрещен: требуются права администратора'));
    }
    next();
  },

  // Проверка конкретной роли
  restrictTo: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new ApiError(403, `Доступ запрещен: требуются роли ${roles.join(', ')}`));
      }
      next();
    };
  },

  // Проверка владения ресурсом
  checkOwnership: (model, paramName = 'id') => {
    return async (req, res, next) => {
      try {
        const resource = await model.findById(req.params[paramName]);
        if (!resource) {
          return next(new ApiError(404, 'Ресурс не найден'));
        }

        // Проверяем, является ли пользователь владельцем (сравниваем _id) или админом
        const isOwner = resource._id.equals(req.user._id) || 
                       (resource.user && resource.user.equals(req.user._id));
        if (!isOwner && req.user.role !== 'admin') {
          return next(new ApiError(403, 'Доступ запрещен: вы не владелец этого ресурса'));
        }

        next();
      } catch (err) {
        next(err);
      }
    };
  }
};