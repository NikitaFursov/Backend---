import taskService from '../services/task_services.js';

export default {
  async createTask(req, res, next) {
    try {
      // Дополнительная проверка пользователя
      if (!req.user || !req.user.id) {
        throw new ApiError(401, 'Пользователь не аутентифицирован');
      }
      
      const task = await taskService.createTask(req.body, req.user.id);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  },

  async getTasks(req, res, next) {
    try {
      const { category, difficulty, limit, page } = req.query;
      const tasks = await taskService.getTasks(category, difficulty, limit, page);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  },

  async getTaskById(req, res, next) {
    try {
      const task = await taskService.getTaskById(req.params.taskId);
      res.json(task);
    } catch (err) {
      next(err);
    }
  },

  async updateTask(req, res, next) {
    try {
      const updatedTask = await taskService.updateTask(
        req.params.taskId, // Добавлен ID задачи
        req.body,
        req.user.id
      );
      res.json(updatedTask);
    } catch (err) {
      next(err);
    }
  },

  async deleteTask(req, res, next) {
    try {
      await taskService.deleteTask(req.params.taskId, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async submitSolution(req, res, next) {
    try {
      const taskId = req.params.taskId;
      const userAnswer = req.body.answer; // Извлекаем строку из поля answer
      const result = await taskService.submitSolution(req.user.id, taskId, userAnswer);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

};