import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Название задачи обязательно'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Описание задачи обязательно']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Категория обязательна']
  },
  difficulty: {
    type: String,
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Сложность должна быть easy, medium или hard'
    },
    required: [true, 'Сложность обязательна']
  },
  correctAnswer: {
    type: String,
    required: [true, 'Правильный ответ обязателен']
  },
  options: {
    type: [String],
    required: [true, 'Варианты ответов обязательны'],
    validate: {
      validator: function(arr) {
        return arr.length >= 2 && arr.includes(this.correctAnswer);
      },
      message: 'Должно быть минимум 2 варианта, включая правильный'
    }
  },
  explanation: {
    type: String,
    required: [true, 'Объяснение решения обязательно']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Автор обязателен']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('Task', taskSchema);