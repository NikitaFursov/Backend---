import mongoose from 'mongoose';
import validator from  'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Некорректный email']
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: [8, 'Пароль должен быть не менее 8 символов'],
    select: true
  },
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true
  },
  role: {
    type: String,
    ref: 'Role',
    default: 'user'
  },
  specialization: {
    type: String,
    required: [true, 'Специализация обязательна'],
    trim: true
  },
  experienceYears: {
    type: Number,
    min: [0, 'Опыт не может быть отрицательным']
  },
  statistics: {
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    solvedTasks: [{
      task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
      solvedAt: { type: Date, default: Date.now },
      isCorrect: Boolean
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);