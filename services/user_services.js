import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import Solution from '../models/Solution.js';
import ApiError from '../utils/ApiError.js';

class UserService {
  // Получение профиля пользователя
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw ApiError.NotFound('Пользователь не найден');
    }
    return user;
  }

  // Обновление профиля (специализация, имя и т.д.)
  async updateUser(userId, updateData) {
    
    const restrictedFields = ['_id', 'password', 'email', 'createdAt'];
    restrictedFields.forEach(field => delete updateData[field]);

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw ApiError.notFound('Пользователь не найден');
    }
    return user;
  }

  // Получение списка всех пользователей (с пагинацией)
  async getAllUsers({ limit = 10, page = 1, role }) {
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    return users;
  }

  // Удаление пользователя (админская функция)
  async deleteUser(userId) {
    // Начинаем транзакцию для безопасного удаления
    const session = await User.startSession();
    session.startTransaction();
    
    try {
      const user = await User.findByIdAndDelete(userId).session(session);
      if (!user) {
        throw ApiError.NotFound('Пользователь не найден');
      }

      // Удаляем все связанные данные пользователя
      await Promise.all([
        Solution.deleteMany({ user: userId }).session(session),
        // Здесь можно добавить удаление других связанных данных
        // Например: Comment.deleteMany({ author: userId })
      ]);

      await session.commitTransaction();
      return { message: 'Пользователь и все связанные данные успешно удалены' };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  //Изменение пароля
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw ApiError.notFound('Пользователь не найден');
    }

    // Проверяем текущий пароль
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw ApiError.badRequest('Текущий пароль неверен');
    }

    if (currentPassword === newPassword) {
      if (currentPassword === newPassword) {
      throw ApiError.badRequest('Новый пароль сповпадает с текущим');
    }
    }

    // Хешируем новый пароль
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    return { message: 'Пароль успешно изменен' };
  }

  async getUserSolvedTasks(userId, { limit = 10, page = 1 }) {
    const user = await User.findById(userId)
      .select('statistics.solvedTasks')
      .populate('statistics.solvedTasks.task', 'title difficulty category')
      .limit(limit)
      .skip((page - 1) * limit);
    
    if (!user) {
      throw ApiError.NotFound('Пользователь не найден');
    }

    return user.statistics.solvedTasks;
  }

  async getUserStats(userId) {
    const user = await User.findById(userId)
      .select('statistics.totalAttempts statistics.correctAttempts statistics.solvedTasks');
    
    if (!user) {
      throw ApiError.NotFound('Пользователь не найден');
    }

    // Пересчитываем правильные решения из истории решенных задач
    const correctSolutions = user.statistics.solvedTasks.filter(task => task.isCorrect).length;
    
    return {
      totalAttempts: user.statistics.totalAttempts,
      correctAttempts: correctSolutions, // Используем актуальное количество правильных решений
      successRate: user.statistics.totalAttempts > 0 
        ? (correctSolutions / user.statistics.totalAttempts * 100).toFixed(2)
        : 0
    };
  }

  async removeSolvedTask(userId, taskId) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { 'statistics.solvedTasks': { task: taskId } },
        $inc: { 
          'statistics.totalAttempts': -1,
          'statistics.correctAttempts': -1 
        }
      },
      { new: true }
    );

    if (!user) {
      throw ApiError.NotFound('Пользователь не найден');
    }

    return { message: 'Решение задачи удалено из истории' };
  }

}

export default new UserService();