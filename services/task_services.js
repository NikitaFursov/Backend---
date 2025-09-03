import Task from '../models/Task.js';
import Solution from '../models/Solution.js';
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

class TaskService {
  // Создание новой задачи (для админов)
  async createTask(taskData, userId) {

    // Проверяем, существует ли уже идентичная задача
    const existingTask = await Task.findOne({
      title: taskData.title,
      description: taskData.description,
      correctAnswers: taskData.correctAnswers,
      difficulty: taskData.difficulty,
      category: taskData.category
    });

    if (existingTask) {
      throw new ApiError(400, 'Задача с такими параметрами уже существует');
    }
    
    try {
      const newTask = await Task.create({
        ...taskData,
        author: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return newTask;
    } catch (err) {
      throw new ApiError(400, 'Ошибка при создании задачи');
    }
  }

  async getTasks(category, difficulty, limit = 10, page = 1) {
    const skip = (page - 1) * limit;
    const query = {};
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    
    return Task.find(query)
      .skip(skip)
      .limit(limit)
      .populate('category', 'name description'); // Добавляем populate для категории
  }

  // Проверка решения задачи
  async checkSolution(userId, taskId, userAnswer) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw ApiError.NotFound('Задача не найдена');
    }

    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(task.correctAnswers);
    const solution = await Solution.create({
      user: userId,
      task: taskId,
      userAnswer,
      isCorrect,
    });

    return { isCorrect, solutionId: solution._id };
  }

  // Получение конкретной задачи по ID
  async getTaskById(taskId) {
    const task = await Task.findById(taskId);
    if (!task) throw new ApiError(404, 'Задача не найдена');
    return task;
  }

  // Обновление задачи
  async updateTask(userId, taskId, updateData) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw ApiError.NotFound('Задача не найдена');
    }
    if (task.author.toString() !== userId) {
      throw ApiError.Forbidden('Вы не можете редактировать эту задачу');
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updateData },
      { new: true }
    );
    return updatedTask;
}

  // Удаление задачи
  async deleteTask(taskId) {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      throw ApiError.NotFound('Задача не найдена');
    }
    // Дополнительно: удаляем все связанные решения
    //await Solution.deleteMany({ task: taskId });
    return { message: 'Задача удалена' };
  }

  // Отправка решения задачи (альтернативная версия с детальной проверкой)
  // В методе submitSolution добавим обновление статистики пользователя:
  async submitSolution(userId, taskId, userAnswer) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw ApiError.NotFound('Задача не найдена');
    }

    // Проверяем, есть ли уже решение этой задачи у пользователя
    const existingSolution = await Solution.findOne({ user: userId, task: taskId });
    
    if (existingSolution) {
      // Если решение уже существует, обновляем его
      existingSolution.userAnswer = userAnswer;
      existingSolution.isCorrect = userAnswer === task.correctAnswer;
      existingSolution.submittedAt = new Date();
      await existingSolution.save();
      
      // Обновляем статистику пользователя
      await this.updateUserStatistics(userId, taskId, existingSolution.isCorrect);
      
      return {
        isCorrect: existingSolution.isCorrect,
        solutionId: existingSolution._id,
        correctAnswer: existingSolution.isCorrect ? undefined : task.correctAnswer
      };
    }

    // Если решения нет, создаем новое
    const isCorrect = userAnswer === task.correctAnswer;
    const solution = await Solution.create({
      user: userId,
      task: taskId,
      userAnswer,
      isCorrect,
      submittedAt: new Date(),
    });

    // Обновляем статистику пользователя
    await this.updateUserStatistics(userId, taskId, isCorrect);

    return {
      isCorrect,
      solutionId: solution._id,
      correctAnswer: isCorrect ? undefined : task.correctAnswer
    };
  }

  async updateUserStatistics(userId, taskId, isCorrect) {
    const updateQuery = {
      $inc: { 
        'statistics.totalAttempts': 1,
        ...(isCorrect && { 'statistics.correctAttempts': 1 })
      },
      $addToSet: {
        'statistics.solvedTasks': {
          task: taskId,
          solvedAt: new Date(),
          isCorrect
        }
      }
    };

    await User.findByIdAndUpdate(userId, updateQuery);
  }

}

export default new TaskService();