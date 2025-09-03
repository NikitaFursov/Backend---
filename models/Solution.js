import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Пользователь обязателен']
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Задача обязательна']
  },
  userAnswer: {
    type: String,
    required: [true, 'Ответ пользователя обязателен']
  },
  isCorrect: {
    type: Boolean,
    required: [true, 'Статус проверки обязателен']
  },
  solvedAt: {
    type: Date,
    default: Date.now
  }
});

// Индекс для предотвращения дублирования решений
solutionSchema.index({ user: 1, task: 1 }, { unique: true });

export default mongoose.model('Solution', solutionSchema);