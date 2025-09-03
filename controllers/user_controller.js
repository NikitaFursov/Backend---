import userService from '../services/user_services.js';

export default {
  // Получение списка всех пользователей (с пагинацией)
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, role } = req.query;
      const users = await userService.getAllUsers({ 
        page: parseInt(page), 
        limit: parseInt(limit),
        role
      });
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  // Получение данных конкретного пользователя
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.user.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  // Обновление пользователя (админ/пользователь)
  async updateUser(req, res, next) {
    try {

      if (req.user.role !== 'admin') {
        delete req.body._id;
        delete req.body.id;
        delete req.body.role;
      }

      const updatedUser = await userService.updateUser(req.user.id, req.body);
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  },

  async deleteUser(req, res, next) {
    try {
        await userService.deleteUser(req.params.userId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
  },

    async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await userService.changePassword(req.user.id, currentPassword, newPassword);
      res.json({ message: 'Пароль успешно изменен' });
    } catch (err) {
      next(err);
    }
  },
  
  async getSolvedTasks(req, res, next) {
    try {
      const { limit = 10, page = 1 } = req.query;
      const tasks = await userService.getUserSolvedTasks(
        req.user.id, 
        { limit: parseInt(limit), page: parseInt(page) }
      );
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  },

  async getStats(req, res, next) {
    try {
      const stats = await userService.getUserStats(req.user.id);
      res.json(stats);
    } catch (err) {
      next(err);
    }
  },

  async removeSolvedTask(req, res, next) {
    try {
      const result = await userService.removeSolvedTask(
        req.user.id, 
        req.params.taskId
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

};